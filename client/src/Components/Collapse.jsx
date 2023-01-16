import React, { useState } from "react";

const Collapse = ({ title, content, array }) => {
  const [selected, setSelected] = useState(null);
  const toggle = () => {
    setSelected(!selected);
  };
  return (
    <div className="accordion">
      <div className="item">
        <div className="title" onClick={() => toggle()}>
          <h2>{title}</h2>
          <span>{selected ? "-" : "+"}</span>
        </div>
        <div className={selected ? "content show" : "content"}>
          {array ? (
            <>
              {array.map((item, index) => (
                <p id={index}>{item}</p>
              ))}
            </>
          ) : null}
          {content ? (
            <>
              <p>{content}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Collapse;
