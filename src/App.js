import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

import DragDrop from "./DragDropField";
import axios from "axios";

const App = () => {
    // const {file, result} = useContext(DemoContext);
    const [modelList, setList] = useState(null);
    const [currModel, setModel] = useState(null);

    useEffect(() => {
        const url = "http://vcdemo.loca.lt/api/vc";
        // const url = "http://localhost:3000/api/vc";
        axios.get(url).then((res) => {
            setList(res.data.response);
            setModel(res.data.response[0]);
            console.log("first");
        });
    }, []);

    const handleSelectChange = (event) => {
        setModel(event.target.value);
    };

    return (
        <div className="App">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">VC-Demo</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>

            <DragDrop currModel={currModel} />

            <div
                style={{
                    alignItems: "center",
                    width: "100%",
                    textAlign: "center",
                }}
            >
                <Form.Select
                    className="select"
                    onChange={(event) => handleSelectChange(event)}
                    style={{
                        width: "40%",
                        margin: "0 auto",
                        backgroundColor: "skyblue",
                    }}
                    size="sm"
                    aria-label="Default select example"
                >
                    {modelList ? (
                        modelList.map((item) => (
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
};

export default App;
