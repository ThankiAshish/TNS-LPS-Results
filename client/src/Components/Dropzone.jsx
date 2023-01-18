import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import csvIcon from "../Assets/csv_icon.png";
//Reset fetch req
const Dropzone = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [fileStatus, setFileStatus] = useState("No File Chosen!");
  const [file, setFile] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [isConverted, setIsConverted] = useState(false);
  const [conversionInProcess, setConversionInProcess] = useState(false);
  const [sendMail, setSendMail] = useState(false);
  const [filesConverted, setFilesConverted] = useState([1, 2, 4]);
  const [filesNotConverted, setFilesNotConverted] = useState([3, 5]);
  const [mailsSent, setMailsSent] = useState([]);
  const [mailsNotSent, setMailsNotSent] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [scannedRows, setScannedRows] = useState(0);

  const reset = () => {
    window.location.reload();
  };

  const checkHandler = () => {
    setSendMail(!sendMail);
  };

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

      await fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(`${data.message}`);
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

  const handleRequest = async (e) => {
    e.preventDefault();
    setConversionInProcess(true);
    let id = toast.info("Converting.....", {
      autoClose: false,
      isLoading: true,
    });
    if (isUploaded) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ flag: sendMail }),
      };

      await fetch("/convert", options)
        .then((res) => res.json())
        .then((data) => {
          setIsConverted(true);
          setFilesConverted(data.filesOk);
          setFilesNotConverted(data.filesNotOk);
          setTotalRows(data.totalRows);
          setScannedRows(data.scannedRows);
          setMailsNotSent(data.mailsNotOk);
          setMailsSent(data.mailsOk);
          toast.update(id, {
            render: data.message,
            type: "success",
            isLoading: false,
            autoClose: true,
          });
        })
        .catch((err) => {
          setIsUploaded(true);
          setConversionInProcess(false);
          toast.update(id, {
            render: err.message,
            type: "error",
            isLoading: false,
            autoClose: true,
          });
          console.log(err.message);
        });
    } else {
      toast.error("Upload a File First!");
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    let id = toast.info("Your Downloading Will Start in a Moment!", {
      autoClose: false,
      isLoading: true,
    });
    fetch("/download", {
      method: "GET",
    })
      .then((res) => {
        setIsConverted(true);
        const handle = window.open("http://localhost:5000/download");
        if (!handle) {
          toast.update(id, {
            render:
              "Failed to Download, Your Browser is Blocking the Request to Download",
            type: "error",
            isLoading: false,
            autoClose: true,
          });
        } else {
          toast.update(id, {
            render: "Download Started!",
            type: "success",
            isLoading: false,
            autoClose: true,
          });
        }
      })
      .catch((err) => {
        setIsConverted(true);
        toast.update(id, {
          render: "Something Went Wrong!",
          type: "error",
          isLoading: false,
          autoClose: true,
        });
      });
  };

  return (
    <>
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
          <div className="email-container">
            <input
              type="checkbox"
              name="sendEmail"
              id="sendEmail"
              className="email-checkbox"
              checked={sendMail}
              onChange={() => checkHandler()}
            />
            <label htmlFor="sendEmail" className="email-checkbox-label">
              Send Files to Email?
            </label>
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
            {isUploaded && !conversionInProcess ? (
              <button
                type="button"
                className="btn"
                onClick={(e) => handleRequest(e)}>
                Start Process
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
          <div className="display-logs-container">
            {true ? (
              <>
                <Link
                  className="logs-btn"
                  to="/logs"
                  state={{
                    filesConverted: filesConverted,
                    filesNotConverted: filesNotConverted,
                    mailsSent: mailsSent,
                    mailsNotSent: mailsNotSent,
                    totalRows: totalRows,
                    scannedRows: scannedRows,
                  }}>
                  See Logs
                </Link>
              </>
            ) : null}
            <button className="btn btn-danger" onClick={() => reset()}>
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dropzone;
