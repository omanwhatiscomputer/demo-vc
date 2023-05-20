import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./index.css";


// const router = createBrowserRouter([
//     {
//         path: "/",
//         element: <App />,
//         children: [
//             { index: true, element: <LandingPage /> },
//             { path: "video_file", element: <VideoFile /> },
//             { path: "video_stream", element: <VideoStream /> },
//         ],
//     },
// ]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
