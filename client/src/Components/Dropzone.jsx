import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import csvIcon from "../Assets/csv_icon.png";

const Dropzone = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [fileStatus, setFileStatus] = useState("No File Chosen!");
  const [file, setFile] = useState({});

  const handleSelection = (e) => {
    e.preventDefault();
    setFile(e.target.files[0]);
    setFileStatus(file.name);
    setIsSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    });

    console.log(response);
  };

  const handleRequest = (e) => {
    e.preventDefault();
    const response = fetch("http://localhost:5000/convert", {
      method: "GET",
    });

    console.log(response);
  };

  return (
    <div className="dropzone">
      <ToastContainer />
      <div className="dropbox">
        <p className="title">Upload .CSV File Here</p>
        <div className="upload-file-container">
          <label htmlFor="upload-file" className="btn btn-large">
            Choose File
          </label>
          <input
            type="file"
            name="upload-file"
            id="upload-file"
            accept=".csv"
            hidden
            onChange={(e) => handleSelection(e)}
          />
        </div>
        <div className="file-status-container">
          {isSelected ? (
            <img src={csvIcon} alt="csv icon" className="csv-icon" />
          ) : null}
          <p id="file-status">
            {fileStatus !== "No File Chosen!" ? file.name : fileStatus}
          </p>
        </div>
        <button
          type="button"
          className="btn btn-black"
          onClick={(e) => handleSubmit(e)}>
          Upload
        </button>
        <button type="button" onClick={(e) => handleRequest(e)}>
          Convert
        </button>
      </div>
    </div>
  );
};

export default Dropzone;
