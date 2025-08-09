"use client";

import { useState, useRef, CSSProperties } from "react";
import { useMapState, LatLngLiteral, MapState } from "./hooks/useMapState";
import DualMap from "./components/DualMap";
import SearchInputs from "./components/SearchInputs";
import MapControlPanel from "./components/MapControlPanel";
import useWindowSize from "./hooks/useWindowSize";
import useMediaQuery from "./hooks/useMediaQuery";
import styles from "./page.module.css";

type MapRefType = google.maps.Map | null;

const defaultCenter: LatLngLiteral = {
  lat: 35.681236, // 東京駅
  lng: 139.767125,
};

const osakaStation: LatLngLiteral = {
  lat: 34.702485, // 大阪駅
  lng: 135.495951,
};

const Page: React.FC = () => {
  const [isSplitView, setIsSplitView] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  const { width, height } = useWindowSize();
  const isPortrait = width && height ? height > width : false;

  const map1Ref = useRef<MapRefType>(null);
  const map2Ref = useRef<MapRefType>(null);

  const {
    mapState: mapState1,
    setCenter: setCenter1,
    setZoom: setZoom1,
    setAddress: setAddress1,
    setMarkerPosition: setMarkerPosition1,
  } = useMapState({
    center: defaultCenter,
    zoom: 15,
    address: "",
    markerPosition: defaultCenter,
  });

  const {
    mapState: mapState2,
    setCenter: setCenter2,
    setZoom: setZoom2,
    setAddress: setAddress2,
    setMarkerPosition: setMarkerPosition2,
  } = useMapState({
    center: osakaStation,
    zoom: 15,
    address: "",
    markerPosition: osakaStation,
  });

  const handleSearch = (
    mapState: MapState,
    setCenter: (newCenter: LatLngLiteral) => void,
    setMarkerPosition: (newMarkerPosition: LatLngLiteral | null) => void,
  ) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: mapState.address }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter: LatLngLiteral = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenter(newCenter);
        setMarkerPosition(newCenter);
      } else {
        alert("住所の取得に失敗しました: " + status);
      }
    });
  };

  const toggleSplitView = () => {
    setIsSplitView(!isSplitView);
  };

  const handleCenterChanged = (mapNumber: number, center: LatLngLiteral) => {
    const panUpdater = (prevCenter: LatLngLiteral, delta: LatLngLiteral) => {
      return {
        lat: prevCenter.lat + delta.lat,
        lng: prevCenter.lng + delta.lng,
      };
    };

    if (mapNumber === 1) {
      const oldCenter1 = mapState1.center;
      const delta = {
        lat: center.lat - oldCenter1.lat,
        lng: center.lng - oldCenter1.lng,
      };

      setCenter1({ lat: center.lat, lng: center.lng });
      if (Math.abs(delta.lat) > 0.0 || Math.abs(delta.lng) > 0.0) {
        // 遅延実行で競合回避
        setTimeout(() => {
          setCenter2(panUpdater(mapState2.center, delta));
        }, 0);
      }
    } else {
      const oldCenter2 = mapState2.center;
      const delta = {
        lat: center.lat - oldCenter2.lat,
        lng: center.lng - oldCenter2.lng,
      };

      setCenter2({ lat: center.lat, lng: center.lng });
      if (Math.abs(delta.lat) > 0.0 || Math.abs(delta.lng) > 0.0) {
        // 遅延実行で競合回避
        setTimeout(() => {
          setCenter1(panUpdater(mapState1.center, delta));
        }, 0);
      }
    }
  };

  const handleZoomChanged = (mapNumber: number, zoom: number) => {
    if (mapNumber === 1) {
      setZoom1(zoom);
      setTimeout(() => {
        setZoom2(zoom);
      }, 0);
    } else {
      setZoom2(zoom);
      setTimeout(() => {
        setZoom1(zoom);
      }, 0);
    }
  };

  const zoomMaps = (zoomIncrement: number) => {
    setZoom1(mapState1.zoom + zoomIncrement);
    setZoom2(mapState2.zoom + zoomIncrement);
  };

  const panMaps = (dx: number, dy: number) => {
    const basePanAmount = 0.01;
    const referenceZoom = 15;

    const panUpdater = (
      prevCenter: { lat: number; lng: number },
      currentZoom: number,
    ) => {
      const scaleFactor = Math.pow(2, currentZoom - referenceZoom);
      const panAmount = basePanAmount / scaleFactor;
      return {
        lat: prevCenter.lat + dy * panAmount,
        lng: prevCenter.lng + dx * panAmount,
      };
    };

    setCenter1(panUpdater(mapState1.center, mapState1.zoom));
    setCenter2(panUpdater(mapState2.center, mapState2.zoom));
  };

  const isMobile = useMediaQuery("(max-width: 768px)"); // スマートフォンとタブレットの一般的なブレークポイント

  const mapTextStyle: CSSProperties = {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "4px 8px",
    borderRadius: "12px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  };

  return (
    <div>
      <SearchInputs
        address1={mapState1.address}
        onAddressChange1={setAddress1}
        onSearch1={() =>
          handleSearch(mapState1, setCenter1, setMarkerPosition1)
        }
        address2={mapState2.address}
        onAddressChange2={setAddress2}
        onSearch2={() =>
          handleSearch(mapState2, setCenter2, setMarkerPosition2)
        }
      />

      <button
        onClick={toggleSplitView}
        style={
          isMobile
            ? {
                padding: "12px",
                fontSize: "16px",
                width: "100%",
                marginBottom: isSplitView ? "1em" : "0", // isSplitViewがtrueの時のみ余白を追加
              }
            : {
                marginLeft: "8px",
                marginTop: "4px",
                display: "inline-block",
                marginBottom: isSplitView ? "1em" : "0", // isSplitViewがtrueの時のみ余白を追加
              }
        }
      >
        {isSplitView
          ? "重畳ビュー"
          : isPortrait
            ? "上下分割ビュー"
            : "左右分割ビュー"}
      </button>

      {!isSplitView && (
        <div
          style={
            isMobile
              ? {
                  margin: "1em 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }
              : { margin: "1em 0" }
          }
        >
          <span
            style={{
              fontSize: isMobile ? "16px" : "14px",
              ...mapTextStyle,
            }}
          >
            {" "}
            マップ1
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={overlayOpacity}
            onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
            {...(isMobile
              ? { className: styles.rangeSlider, style: { flex: 1 } }
              : { style: { margin: "0 8px" } })}
          />
          <span
            style={{
              fontSize: isMobile ? "16px" : "14px",
              ...mapTextStyle,
            }}
          >
            マップ2
          </span>
        </div>
      )}

      <MapControlPanel
        onZoomIn={() => zoomMaps(1)}
        onZoomOut={() => zoomMaps(-1)}
        onPanUp={() => panMaps(0, 1)}
        onPanDown={() => panMaps(0, -1)}
        onPanLeft={() => panMaps(-1, 0)}
        onPanRight={() => panMaps(1, 0)}
      />

      <DualMap
        isSplitView={isSplitView}
        overlayOpacity={overlayOpacity}
        mapState1={mapState1}
        mapState2={mapState2}
        onMapLoad1={(map) => {
          map1Ref.current = map;
        }}
        onCenterChanged1={(center) => handleCenterChanged(1, center)}
        onZoomChanged1={(zoom) => handleZoomChanged(1, zoom)}
        onMapLoad2={(map) => {
          map2Ref.current = map;
        }}
        onCenterChanged2={(center) => handleCenterChanged(2, center)}
        onZoomChanged2={(zoom) => handleZoomChanged(2, zoom)}
      />
    </div>
  );
};

export default Page;
