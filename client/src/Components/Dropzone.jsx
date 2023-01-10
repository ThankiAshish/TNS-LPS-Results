import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

import csvIcon from "../Assets/csv_icon.png";

const Dropzone = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [fileStatus, setFileStatus] = useState("No File Chosen!");
  const [file, setFile] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [isConverted, setIsConverted] = useState(false);

  const handleSelection = (e) => {
    e.preventDefault();
    if (e.target.files[0].name.includes(".csv")) {
      setFile(e.target.files[0]);
      setFileStatus(file.name);
      setIsSelected(true);
    } else {
      toast.error("Only .CSV File Supported!");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          toast.success(`${file.name} Uploaded Successfully!`);
          setIsUploaded(true);
        })
        .catch((err) => {
          toast.error("Something Went Wrong!");
          setIsUploaded(false);
        });
    } else {
      toast.error("No File Selected!");
    }
  };

  const handleRequest = (e) => {
    e.preventDefault();
    if (isUploaded) {
      fetch("/convert")
        .then((res) => {
          setIsConverted(true);
          toast.success("Converted to PDFs!");
        })
        .catch((err) => {
          toast.error("Something Went Wrong!");
        });
    } else {
      toast.error("Upload a File First!");
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();

    fetch("/download", {
      method: "GET",
    })
      .then((res) => {
        setIsConverted(true);
        const handle = window.open("http://localhost:5000/download");
        if(!handle) {
          toast.error("Failed to Download, Your Browser is Blocking the Request to Download");
        }
      })
      .catch((err) => {
        setIsConverted(true);
        toast.error(err.body.message);
      });
  };

  return (
    <div className="dropzone">
      <ToastContainer theme="light" />
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
        <div className="buttons-container">
          {isSelected ? (
            <button
              type="button"
              className="btn btn-black"
              onClick={(e) => handleUpload(e)}>
              Upload
            </button>
          ) : null}
          {isUploaded && !isConverted ? (
            <button
              type="button"
              className="btn"
              onClick={(e) => handleRequest(e)}>
              Convert
            </button>
          ) : null}
          {isConverted ? (
            <button
              type="button"
              className="btn"
              onClick={(e) => handleDownload(e)}>
              Download
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dropzone;
