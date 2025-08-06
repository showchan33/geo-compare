"use client";

import React from "react";

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
  return (
    <div style={{ margin: "1em 0" }}>
      <div style={{ marginBottom: "8px" }}>
        <input
          type="text"
          value={address1}
          onChange={(e) => onAddressChange1(e.target.value)}
          placeholder="住所を入力（例：東京タワー）"
          style={{ width: "300px", padding: "4px", display: "inline-block" }}
        />
        <button
          onClick={onSearch1}
          style={{
            marginLeft: "8px",
            marginTop: "4px",
            display: "inline-block",
          }}
        >
          検索
        </button>
      </div>
      <div style={{ marginBottom: "8px" }}>
        <input
          type="text"
          value={address2}
          onChange={(e) => onAddressChange2(e.target.value)}
          placeholder="２地点目の住所を入力（例：大阪駅）"
          style={{ width: "300px", padding: "4px", display: "inline-block" }}
        />
        <button
          onClick={onSearch2}
          style={{
            marginLeft: "8px",
            marginTop: "4px",
            display: "inline-block",
          }}
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default SearchInputs;
