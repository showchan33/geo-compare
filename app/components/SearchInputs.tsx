"use client";

import React, { CSSProperties } from "react"; // CSSProperties をインポート
import useMediaQuery from "../hooks/useMediaQuery";

interface SearchInputsProps {
  address1: string;
  onAddressChange1: (address: string) => void;
  onSearch1: () => void;
  address2: string;
  onAddressChange2: (address: string) => void;
  onSearch2: () => void;
}

const SearchInputs: React.FC<SearchInputsProps> = ({
  address1,
  onAddressChange1,
  onSearch1,
  address2,
  onAddressChange2,
  onSearch2,
}) => {

  const isMobile = useMediaQuery("(max-width: 768px)"); // スマートフォンとタブレットの一般的なブレークポイント

  const mobileDivStyle: CSSProperties = { // 型を明示的に指定
    marginBottom: "8px",
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
  };

  const desktopDivStyle: CSSProperties = { // 型を明示的に指定
    marginBottom: "8px"
  };

  const mobileInputStyle: CSSProperties = { // 型を明示的に指定
    width: "100%",
    padding: "12px",
    fontSize: "16px",
    boxSizing: "border-box",
    marginBottom: "8px",
  };

  const desktopInputStyle: CSSProperties = { // 型を明示的に指定
    width: "300px",
    padding: "4px",
    display: "inline-block"
  };

  const mobileButtonStyle: CSSProperties = { // 型を明示的に指定
    padding: "12px",
    fontSize: "16px",
    width: "100%",
  };

  const desktopButtonStyle: CSSProperties = { // 型を明示的に指定
    marginLeft: "8px",
    marginTop: "4px",
    display: "inline-block",
  };

  return (
    <div style={{ margin: "1em 0" }}>
      <div style={isMobile ? mobileDivStyle : desktopDivStyle}>
        <input
          type="text"
          value={address1}
          onChange={(e) => onAddressChange1(e.target.value)}
          placeholder="住所を入力（例：東京タワー）"
          style={isMobile ? mobileInputStyle : desktopInputStyle}
        />
        <button
          onClick={onSearch1}
          style={isMobile ? mobileButtonStyle : desktopButtonStyle}
        >
          検索
        </button>
      </div>
      <div style={isMobile ? mobileDivStyle : desktopDivStyle}>
        <input
          type="text"
          value={address2}
          onChange={(e) => onAddressChange2(e.target.value)}
          placeholder="２地点目の住所を入力（例：大阪駅）"
          style={isMobile ? mobileInputStyle : desktopInputStyle}
        />
        <button
          onClick={onSearch2}
          style={isMobile ? mobileButtonStyle : desktopButtonStyle}
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default SearchInputs;
