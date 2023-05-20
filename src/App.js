import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect, useState } from "react";
import { Mutex } from "async-mutex";
import axios from "axios";

import VideoFile from "./components/VideoFile";
import VideoStream from "./components/VideoStream";
import LandingPage from "./components/LandingPage";

import { Outlet, Link, Routes, Route } from "react-router-dom";

const App = () => {
    const [modelList, setList] = useState(null);
    const [currModel, setModel] = useState(null);
    const mutex = new Mutex();

    useEffect(() => {
        const url = `https://drrai-vc-demo.loca.lt/api/vc/`;
        // const url = "http://localhost:3002/api/vc/";
        const config = {
            headers: {
                "Bypass-Tunnel-Reminder": 1,
                "Access-Control-Allow-Origin": "true",
            },
        };
        axios.get(url, config).then((res) => {
            setList(res.data.response);
            setModel(res.data.response[0]);
        });
    }, []);

    const handleSelectChange = (event) => {
        setModel(event.target.value);
    };

    return (
        <div className="App">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>
                        <Link to={"/"}>VC Demo</Link>
                    </Navbar.Brand>
                    <Nav className="me-auto" as="ul">
                        {/* <Nav.Link href="/video_file">VideoFile</Nav.Link>
                        <Nav.Link href="/video_stream">VideoStream</Nav.Link> */}

                        <Nav.Item as="li" className="nav-menu">
                            <Link to={"/video_file"}>VideoFile</Link>
                        </Nav.Item>
                        <Nav.Item as="li" className="nav-menu">
                            <Link to={"/video_stream"}>VideoStream</Link>
                        </Nav.Item>
                    </Nav>
                </Container>
            </Navbar>

            <Outlet />

            <Routes>
                <Route path="/">
                    <Route index element={<LandingPage />} />
                    <Route
                        path="video_file"
                        element={
                            <VideoFile
                                handleSelectChange={handleSelectChange}
                                currModel={currModel}
                                modelList={modelList}
                            />
                        }
                    />
                    <Route
                        path="video_stream"
                        element={
                            <VideoStream
                                currModel={currModel}
                                modelList={modelList}
                                handleSelectChange={handleSelectChange}
                                mutex={mutex}
                            />
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
};

export default App;
