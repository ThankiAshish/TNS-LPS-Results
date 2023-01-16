import React from "react";
import Logo from "../Assets/logo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <nav>
          <img src={Logo} alt="Northstar Logo" className="logo" />
          <h1>URL to PDF Converter</h1>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
