// SkeletonCard.jsx
import React from "react";
import "./SkeletonCard.css";

const SkeletonCard = () => {
  return (
    <div className="skeleton-card mb-3 p-3 rounded">
      <div className="skeleton-title mb-2"></div>
      <div className="skeleton-line mb-1"></div>
      <div className="skeleton-line w-75"></div>
    </div>
  );
};

export default SkeletonCard;
