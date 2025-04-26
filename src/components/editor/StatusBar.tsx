import React from "react";

interface StatusBarProps {
  charCount: number;
}

const StatusBar: React.FC<StatusBarProps> = ({ charCount }) => {
  return (
    <div className="status-bar">
      <span>{charCount} characters</span>
    </div>
  );
};

export default StatusBar;
