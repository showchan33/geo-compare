"use client";

import React from "react";

interface MapControlPanelProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPanUp: () => void;
  onPanDown: () => void;
  onPanLeft: () => void;
  onPanRight: () => void;
}

const MapControlPanel: React.FC<MapControlPanelProps> = ({
  onZoomIn,
  onZoomOut,
  onPanUp,
  onPanDown,
  onPanLeft,
  onPanRight,
}) => {
  return (
    <div style={{ margin: "1em 0" }}>
      <button onClick={onPanUp}>↑</button>
      <button onClick={onPanDown}>↓</button>
      <button onClick={onPanLeft}>←</button>
      <button onClick={onPanRight}>→</button>
      <button onClick={onZoomIn}>+</button>
      <button onClick={onZoomOut}>-</button>
    </div>
  );
};

export default MapControlPanel;
