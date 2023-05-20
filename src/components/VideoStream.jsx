import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Button from 'react-bootstrap/Button';
import { v4 as uuidv4 } from 'uuid';
import Form from "react-bootstrap/Form";
import axios from "axios";

const VideoStream = (props) => {

    const [threshold, setThreshold] = useState(0.5);
    const [nsamples, setNsamples] = useState(14);
    const [inferenceMode, setInferenceMode] = useState(false);
    const [samplingInterval, setSamplingInterval] = useState(100);
    const [bufferLock, setBufferLock] = useState(false);
    const [q, setQ] = useState([]);
    const [cacheModel, setCacheModel] = useState(true);
    const [result, setResult] = useState(null);

    
    const videoConstraints = {
        width: 480,
        height: 480,
        facingMode: "user"
    };
    const webcamRef = useRef(null);
    const abortRef = React.useRef(false);
    
    // console.log(props.mutex.isLocked());
    // props.mutex.acquire();
    // console.log(props.mutex.isLocked())


    
    
    useEffect(() => {
        //Runs on the first render
        //And any time any dependency value changes
        const capture = async() => {
            let aux_q = [...q];
            // console.log(imageSrc)
            // console.log("len:", q);
            
            while(inferenceMode){
                await new Promise(r => setTimeout(r, samplingInterval));
                console.log(Date.now());
                const imageSrc = webcamRef.current.getScreenshot();

                const b64toBlob = (base64) => 
                    fetch(base64).then(res => res.blob());
                const blob = await b64toBlob(imageSrc);
                
                
                const file = new File([blob], "not-counted.jpg");
                // console.log(file);
                // console.log(blob);

                if(aux_q.length < nsamples){
                    
                    aux_q.push(file);
                    
                    // console.log(aux_q)
                    // console.log("length:", aux_q.length, q.length);
                    // console.log("final", q);
                }else{
                    await setQ(aux_q);
                    aux_q=[];
                }
                // console.log(blob);
                if(abortRef.current) {
                    await setQ(aux_q);
                    break;
                };
            }
        };
        capture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inferenceMode,]);

    useEffect(() => {
        const sendRequest = async() =>{
            if(q.length === nsamples) setBufferLock(true);
            await new Promise(r => setTimeout(r, 100));
            if(await bufferLock && await q.length === nsamples && !props.mutex.isLocked()){
                props.mutex.acquire();
                let payload = new FormData();
                let aux_q = [...await q];
                const REQ_ID = uuidv4();
                aux_q.map((data)=>payload.append("images", data, `${REQ_ID}-${aux_q.indexOf(data)}.jpg`));
                payload.append("model", props.currModel);
                payload.append("threshold", threshold);
                payload.append("nsamples", nsamples);

                console.log(payload);

                const headers = {
                    "Content-Type": "multipart/form-data",
                    "Bypass-Tunnel-Reminder": 1,
                    "Access-Control-Allow-Origin": "true",
                    "Request-ID": REQ_ID,
                    "Last-Capture-Sync": new Date().toLocaleString(),
                };


                let url;
                if(cacheModel){
                    // url = "http://localhost:3002/api/vc/video_stream_cached";
                    url = "https://drrai-vc-demo.loca.lt/api/vc/video_stream_cached";
                }else{
                    // url = "http://localhost:3002/api/vc/video_stream";
                    url = "https://drrai-vc-demo.loca.lt/api/vc/video_stream";
                }

                const config = { headers: headers, timeout: 90000 };

                await axios.post(url, payload, config)
                .then(res => {
                    console.log(res);
                    setResult(res.data);
                    props.mutex.release();
                    setQ([]);
                    setBufferLock(false);
                    aux_q = [];
                    return res;
                })
                .catch(err => console.log(err));
            }
        }
        
        sendRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, bufferLock]);

    const handleInferenceMode = event => {
        setInferenceMode(!inferenceMode);
    }

    const handleThresholdRange = event => {
        setThreshold(event.target.value);
    }

    const handleNSamplesRange = event => {
        setNsamples(event.target.value);
    }

    const handleSamplingIntervalRange = event => {
        setSamplingInterval(event.target.value);
    }
    const handleCachedModel = event => {
        setCacheModel(!cacheModel);
    }

    return ( 
    <div className="grid-containerV">
        <Webcam
            className="camera-viewport grid-itemV"
            ref={webcamRef}
            audio={false}
            height={480}
            screenshotFormat="image/jpeg"
            width={480}
            videoConstraints={videoConstraints}
        />
        <div className="grid-itemV">
            <div>
                <legend>Parameters:</legend>
                <div>
                    <label style={{fontWeight: "bold"}}>Threshold : {threshold}</label><br />
                    <input disabled={inferenceMode ? true : false} type={"range"} name={"threshold"} min={"0.01"} max={"1.00"} step={"0.01"} value={threshold} onChange={handleThresholdRange }/>
                </div>

                <div>
                    <label style={{fontWeight: "bold"}}>Number of Frames : {nsamples} frames</label><br />
                    <input disabled={inferenceMode ? true : false} type={"range"} name={"nsamples"} min={"8"} max={"32"} step={"1"} value={nsamples} onChange={handleNSamplesRange }/>
                </div>

                <div>
                    <label style={{fontWeight: "bold"}}>Sampling Interval : {samplingInterval} ms</label><br />
                    <input disabled={inferenceMode ? true : false} type={"range"} name={"samplingInterval"} min={"10"} max={"250"} step={"5"} value={samplingInterval} onChange={handleSamplingIntervalRange }/>
                </div>
            </div>

            <Form.Select
                className="selectV"
                disabled={inferenceMode ? true : false}
                onChange={(event) => props.handleSelectChange(event)}
                style={{
                    width: "30%",
                    // margin: "0 auto",
                    marginBottom: 10,
                    marginTop: 10,
                    backgroundColor: "skyblue",
                }}
                size="sm"
                aria-label="Default select example"
            >
                {props.modelList ? (
                    props.modelList.map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))
                ) : (
                    <option>fetching model list...</option>
                )}
            </Form.Select>
            <Form.Check 
                checked={cacheModel}
                type="switch"
                id="switch"
                label="Cache model"
                onChange={(event)=> {handleCachedModel(event)}}
                disabled={inferenceMode ? true : false}
            />

            <Button  disabled={inferenceMode ? true : false} variant="primary" onClick={(event)=> {handleInferenceMode(event); abortRef.current = false; }}>"Detect"</Button>
            <Button disabled={inferenceMode ? false : true} variant="danger" onClick={(event)=> {handleInferenceMode(event); abortRef.current = true; }}>"Terminate"</Button>
        </div>
        {result && (<div> Result: ({result.fileInfo.split("===")[0]}) {result.fileInfo.split("===")[1]}  & Last frame captured: {result.lastCaptured}</div>)}
    </div>
    );
}

export default VideoStream;