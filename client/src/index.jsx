import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";

import Home from "./Screens/Home";
import Logs from "./Screens/Logs";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route path="/logs" element={<Logs />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
