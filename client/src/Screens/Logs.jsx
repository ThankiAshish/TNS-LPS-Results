import React from "react";

import bar from "../Assets/bar.svg"

const Logs = ({props}) => {
    return (
    <div className="logs-container">
        <div className="status-container">
            <div className="status">
                <p>Files Converted:&nbsp;</p>
                <p className="success-count">{props.filesConverted.length}</p>
                <img src={bar} alt="bar" />
                <p className="error-count">{props.filesNotConverted.length}</p>
            </div>
            <div className="status">
                <p>Rows Processed:&nbsp;</p>
                <p className="success-count">{props.totalRows}</p>
                <img src={bar} alt="bar" />
                <p className="error-count">{props.scannedRows}</p>
            </div>
            <div className="status">
                <p>Emails Sent:&nbsp;</p>
                <p className="success-count">{props.mailsSent.length}</p>
                <img src={bar} alt="bar" />
                <p className="error-count">{props.mailsNotSent.length}</p>
            </div>
        </div>
  </div>)
}

export default Logs;