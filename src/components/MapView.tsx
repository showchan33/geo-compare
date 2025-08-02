import React, { useRef, useCallback } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

// 型定義
type LatLngLiteral = google.maps.LatLngLiteral;

const containerStyle = {
  width: '100%',
  height: '720px',
  border: '1px solid #ccc',
};

interface MapViewProps {
  center: LatLngLiteral;
  zoom: number;
  markerPosition: LatLngLiteral | null;
  onMapLoad: (map: google.maps.Map) => void;
  onCenterChanged: (center: LatLngLiteral) => void;
  onZoomChanged: (zoom: number) => void;
}

const MapView: React.FC<MapViewProps> = ({center, zoom, markerPosition, onMapLoad, onCenterChanged, onZoomChanged }) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    onMapLoad(map);
  }, [onMapLoad]);

  const handleIdle = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      if (newCenter) {
        onCenterChanged({ lat: newCenter.lat(), lng: newCenter.lng() });
      }
    }
  };

  const handleZoomChanged = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      if (newZoom) {
        onZoomChanged(newZoom);
      }
    }
  };

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={zoom}
      onLoad={handleLoad}
      onIdle={handleIdle}
      onZoomChanged={handleZoomChanged}
    >
      {markerPosition && <Marker position={markerPosition} />}
    </GoogleMap>
  );
};

export default MapView;
