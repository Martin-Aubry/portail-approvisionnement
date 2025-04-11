// Spinner.jsx
import React from "react";

const Spinner = ({ message = "Chargement..." }) => {
  return (
    <div className="text-center my-4">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{message}</span>
      </div>
      <p className="mt-2">{message}</p>
    </div>
  );
};

export default Spinner;
