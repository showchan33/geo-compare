"use client";

import { useState, useCallback } from "react";

// 型定義
export type LatLngLiteral = google.maps.LatLngLiteral;

export interface MapState {
  center: LatLngLiteral;
  zoom: number;
  address: string;
  markerPosition: LatLngLiteral | null;
}

interface UseMapStateResult {
  mapState: MapState;
  setCenter: (newCenter: LatLngLiteral) => void;
  setZoom: (newZoom: number) => void;
  setAddress: (newAddress: string) => void;
  setMarkerPosition: (newMarkerPosition: LatLngLiteral | null) => void;
}

export const useMapState = (initialState: MapState): UseMapStateResult => {
  const [mapState, setMapState] = useState<MapState>(initialState);

  const setCenter = useCallback((newCenter: LatLngLiteral) => {
    setMapState((prev) => ({ ...prev, center: newCenter }));
  }, []);

  const setZoom = useCallback((newZoom: number) => {
    setMapState((prev) => ({ ...prev, zoom: newZoom }));
  }, []);

  const setAddress = useCallback((newAddress: string) => {
    setMapState((prev) => ({ ...prev, address: newAddress }));
  }, []);

  const setMarkerPosition = useCallback(
    (newMarkerPosition: LatLngLiteral | null) => {
      setMapState((prev) => ({ ...prev, markerPosition: newMarkerPosition }));
    },
    [],
  );

  return { mapState, setCenter, setZoom, setAddress, setMarkerPosition };
};
