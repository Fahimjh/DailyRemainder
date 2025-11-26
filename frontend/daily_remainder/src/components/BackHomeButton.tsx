import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackHomeButton.css";

const BackHomeButton: React.FC = () => {
  const nav = useNavigate();
  return (
    <div className="back-home-wrap">
      <button
        className="back-home-btn"
        onClick={() => nav("/")}
        aria-label="Back to Home"
      >
        Back to Home
      </button>
    </div>
  );
};

export default BackHomeButton;
