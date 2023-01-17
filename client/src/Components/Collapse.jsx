import React, { useState } from "react";

import bar from "../Assets/bar.svg";

const Collapse = ({ title, success, error }) => {
  const [selected, setSelected] = useState(null);
  const toggle = () => {
    setSelected(!selected);
  };
  return (
    <div className="status" onClick={() => toggle()}>
      <div className="title">
        <p>{title}:&nbsp;</p>
        <div className="data">
          {Array.isArray(success) ? (
            <p className="success-count">{success.length}</p>
          ) : (
            <p className="success-count">{success}</p>
          )}
          <img src={bar} alt="bar" />
          {Array.isArray(error) ? (
            <p className="error-count">{error.length}</p>
          ) : (
            <p className="error-count">{error}</p>
          )}
        </div>
      </div>
      <div className={selected ? "content show" : "content"}>
        <div className="success-files-container">
          {Array.isArray(success)
            ? success.map((item, index) => (
                <p className="success-file" id={index}>
                  *&nbsp;{item}
                </p>
              ))
            : null}
        </div>
        <div className="error-files-container">
          {Array.isArray(error)
            ? error.map((item, index) => (
                <p className="error-file" id={index}>
                  *&nbsp;{item}
                </p>
              ))
            : null}
        </div>
      </div>
    </div>
  );
};

export default Collapse;
