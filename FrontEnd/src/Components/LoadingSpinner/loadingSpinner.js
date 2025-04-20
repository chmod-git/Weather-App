import React from "react";
import "./loading.css";

const LoadingSpinner = () => (
  <div>
    <img
      className="loadingIcon"
      src={require("../../images/loading_spinner.gif")}
    />
  </div>
);

export default LoadingSpinner;
