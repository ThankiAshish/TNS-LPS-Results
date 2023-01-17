import React, { useState } from "react";

import bar from "../Assets/bar.svg";

const Collapse = ({ title, success, error }) => {
  const [selected, setSelected] = useState(null);
  const toggle = () => {
    setSelected(!selected);
  };
  return (
    <div className="status">
      <p className="title">{title}:&nbsp;</p>
      <div className="content">
        <p className="success-count">{success}</p>
        <img src={bar} alt="bar" />
        <p className="error-count">{error}</p>
      </div>
    </div>
  );
};

export default Collapse;
