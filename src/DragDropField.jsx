import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import Dropbox from "./Dropbox";
// import App from "./App";
// import Form from "react-bootstrap/Form";

const fileTypes = ["MP4"];

// export const DemoContext = createContext(null);
// /* <DemoContext.Provider value={{result: result, file: file}}>
//   <App />
// </DemoContext.Provider> */

const DragDrop = (props) => {
  const [file, setFile] = useState(null);
  const [url, setURL] = useState(null);
  const [threshold, setThreshold] = useState(0.5);
  const [result, setResult] = useState(null);

  const handleRange = event => {
    setThreshold(event.target.value);
  }

  const handleChange = (file) => {
    setFile(file);
    let f = URL.createObjectURL(file);
    setURL(f);

    let payload = new FormData();
    payload.append("video", file);
    payload.append("threshold", threshold);
    payload.append("model", props.currModel);

    const headers = {
      "Content-Type": "multipart/form-data",
    };
    axios.post("http://localhost:3000/api/vc", payload, {headers: headers})
    .then(res => {
      setResult(res.data.fileInfo);
      console.log(result);
      // return res.data.fileInfo;
    })
    .catch(err => console.log(err.response.data));

  };
  return (
    <div className='grid-container'>
      <div className="grid-item" style={{ textAlign: "center"}}>
        {!file && <><div>
          <label style={{fontWeight: "bold"}}>Threshold : {threshold}</label><br />
          <input  type={"range"} name={"threshold"} min={"0.00"} max={"1.00"} step={"0.01"} value={threshold} onChange={handleRange }/>
        </div>
        <FileUploader dropMessageStyle={{borderRadius: 10, backgroundColor: "skyblue", color: "black", opacity: 0.85}} classes={"drop-area"} children={<Dropbox/>} label="" handleChange={handleChange} name="video" types={fileTypes}/></>}
        {file && <video width={300} height={350} controls>
            <source src={url} type={file.type} />
            </video>}
        <br />
        {file && <button style={{width: "100px", borderRadius: 20}} onClick={() => {setFile(null); setResult(null);}}>Clear file</button>}
        <br />
        
      </div>
      <div>
        <div style={{textAlign: "center", width: 300}}><h5>Detection status:</h5></div>
        <div className="statusbox">
          {!file && !result && (<div key={5} className='grid-item'>
              No video uploaded.
          </div>)}
          {file && !result && (<div key={5} className='grid-item'>
              Processing video file...
          </div>)}

          {file && result && <div key={4} className='grid-item'>
              {"Response: "+result.split("===")[1]}
              <br/>
              {`Model Confidence @${threshold} threshold: `+result.split("===")[0]}
          </div>}
        </div>

      </div>
    </div>
  );
}

export default DragDrop;