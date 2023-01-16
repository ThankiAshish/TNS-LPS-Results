import React, { useState } from "react";

const Collapse = () => {
  const [selected, setSelected] = useState(null);
  const toggle = () => {
    setSelected(!selected);
  };
  return (
    <div className="accordion">
      <div className="item">
        <div className="title" onClick={() => toggle()}>
          <h2>Hello</h2>
          <span>{selected ? "-" : "+"}</span>
        </div>
        <div className={selected ? "content show" : "content"}>Hello</div>
      </div>
    </div>
  );
};

export default Collapse;
