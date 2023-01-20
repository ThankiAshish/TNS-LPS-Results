import React from "react";

import Collapse from "../Components/Collapse";
import Navbar from "../Components/Navbar";

import success from "../Assets/success.png";
import error from "../Assets/error.png";

import { ContextState } from "../Context/ContextProvider.jsx";

const Logs = () => {
  const {
    filesConverted,
    filesNotConverted,
    mailsSent,
    mailsNotSent,
    totalRows,
    scannedRows,
  } = ContextState();
  return (
    <>
      <Navbar />
      <div className="logs-container">
        <h1 className="header">Logs</h1>
        <div className="status-icons-container">
          <div className="status-icons">
            <img src={success} alt="success-icon" />
            <img src={error} alt="error-icon" />
          </div>
        </div>
        <div className="status-container">
          <Collapse
            title="Files Converted"
            success={filesConverted}
            error={filesNotConverted}
          />
          <Collapse
            title="Emails Sent"
            success={mailsSent}
            error={mailsNotSent}
          />
          <Collapse
            title="Total Rows Scanned"
            success={scannedRows}
            error={totalRows - scannedRows}
          />
        </div>
      </div>
    </>
  );
};

export default Logs;
