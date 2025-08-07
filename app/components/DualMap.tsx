"use client";

import React, { useRef, CSSProperties } from "react";
import MapView from "./MapView";
import { LoadScript } from "@react-google-maps/api";
import useWindowSize from "../hooks/useWindowSize";

interface LatLngLiteral {
  lat: number;
  lng: number;
}

interface DualMapProps {
  isSplitView: boolean;
  overlayOpacity: number;
  mapState1: {
    center: LatLngLiteral;
    zoom: number;
    markerPosition: LatLngLiteral | null;
  };
  mapState2: {
    center: LatLngLiteral;
    zoom: number;
    markerPosition: LatLngLiteral | null;
  };
  onMapLoad1: (map: google.maps.Map) => void;
  onCenterChanged1: (center: LatLngLiteral) => void;
  onZoomChanged1: (zoom: number) => void;
  onMapLoad2: (map: google.maps.Map) => void;
  onCenterChanged2: (center: LatLngLiteral) => void;
  onZoomChanged2: (zoom: number) => void;
}

const DualMap: React.FC<DualMapProps> = ({
  isSplitView,
  overlayOpacity,
  mapState1,
  mapState2,
  onMapLoad1,
  onCenterChanged1,
  onZoomChanged1,
  onMapLoad2,
  onCenterChanged2,
  onZoomChanged2,
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { width, height } = useWindowSize();
  const isPortrait = width && height ? height > width : false;

  const splitViewStyle: CSSProperties = isPortrait
    ? { display: "flex", flexDirection: "column", height: "720px" }
    : { display: "flex", height: "720px" };

  const mapContainerStyle: CSSProperties = isPortrait
    ? { height: "50%", width: "100%" }
    : { width: "50%", height: "100%" };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      {isSplitView ? (
        <div style={splitViewStyle}>
          <div style={mapContainerStyle}>
            <MapView
              center={mapState1.center}
              zoom={mapState1.zoom}
              markerPosition={mapState1.markerPosition}
              onMapLoad={onMapLoad1}
              onCenterChanged={onCenterChanged1}
              onZoomChanged={onZoomChanged1}
            />
          </div>
          <div style={mapContainerStyle}>
            <MapView
              center={mapState2.center}
              zoom={mapState2.zoom}
              markerPosition={mapState2.markerPosition}
              onMapLoad={onMapLoad2}
              onCenterChanged={onCenterChanged2}
              onZoomChanged={onZoomChanged2}
            />
          </div>
        </div>
      ) : (
        <div style={{ position: "relative", height: "720px" }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <MapView
              center={mapState2.center}
              zoom={mapState2.zoom}
              markerPosition={mapState2.markerPosition}
              onMapLoad={onMapLoad2}
              onCenterChanged={onCenterChanged2}
              onZoomChanged={onZoomChanged2}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              opacity: overlayOpacity,
            }}
          >
            <MapView
              center={mapState1.center}
              zoom={mapState1.zoom}
              markerPosition={mapState1.markerPosition}
              onMapLoad={onMapLoad1}
              onCenterChanged={onCenterChanged1}
              onZoomChanged={onZoomChanged1}
            />
          </div>
        </div>
      )}
    </LoadScript>
  );
};

export default DualMap;
