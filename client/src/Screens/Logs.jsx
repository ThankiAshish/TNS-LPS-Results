import React from "react";
import { useLocation } from "react-router-dom";

import Collapse from "../Components/Collapse";
import Navbar from "../Components/Navbar";

import success from "../Assets/success.png";
import error from "../Assets/error.png";

const Logs = () => {
  const location = useLocation();
  const data = location.state;

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
            success={data.filesConverted}
            error={data.filesNotConverted}
          />
          <Collapse
            title="Emails Sent"
            success={data.mailsSent}
            error={data.mailsNotSent}
          />
          <Collapse
            title="Total Rows Scanned"
            success={data.totalRows}
            error={data.scannedRows}
          />
        </div>
      </div>
    </>
  );
};

export default Logs;
