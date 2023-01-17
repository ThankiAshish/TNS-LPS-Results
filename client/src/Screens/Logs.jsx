import React from "react";
import { useLocation } from "react-router-dom";

import Collapse from "../Components/Collapse";
import Navbar from "../Components/Navbar";

const Logs = () => {
  const location = useLocation();
  const data = location.state;

  return (
    <>
      <Navbar />
      <div className="logs-container">
        <h1 className="header">Logs</h1>
        <div className="status-container">
          <Collapse
            title="Files Converted"
            success={data.filesConverted.length}
            error={data.filesNotConverted.length}
          />
          <Collapse
            title="Emails Sent"
            success={data.mailsSent.length}
            error={data.mailsNotSent.length}
          />
          <Collapse
            title="Total Rows"
            success={data.totalRows}
            error={data.scannedRows}
          />
        </div>
      </div>
    </>
  );
};

export default Logs;
