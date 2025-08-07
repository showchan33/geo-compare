"use client";

import React from "react";
import useMediaQuery from "../hooks/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 768px)"); // スマートフォンとタブレットの一般的なブレークポイント

  if (isMobile) {
    return null; // スマートフォンなどの画面が小さい場合はパネルを表示しない
  }

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
