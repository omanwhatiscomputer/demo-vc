import Form from "react-bootstrap/Form";
import DragDrop from "./../DragDropField";

const VideoFile = (props) => {
    return ( 
    <div>
        <DragDrop currModel={props.currModel} />

        <div
            style={{
                alignItems: "center",
                width: "100%",
                textAlign: "center",
            }}
        >
            <Form.Select
                className="select"
                onChange={(event) => props.handleSelectChange(event)}
                style={{
                    width: "40%",
                    margin: "0 auto",
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
        </div>
    </div> 
    );
}

export default VideoFile;