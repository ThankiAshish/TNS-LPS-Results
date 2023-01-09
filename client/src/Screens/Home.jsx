import React from "react";

import Navbar from "../Components/Navbar";
import Dropzone from "../Components/Dropzone";

const Home = () => {
  return (
    <div>
      <div className="container">
        <Navbar />
        <Dropzone />
      </div>
    </div>
  );
};

export default Home;
