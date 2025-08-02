'use client';

import React, { useRef, useState } from 'react';
import { LoadScript } from '@react-google-maps/api';
import MapView from '../src/components/MapView';

// 型定義
type LatLngLiteral = google.maps.LatLngLiteral;
type MapRefType = google.maps.Map | null;

const defaultCenter: LatLngLiteral = {
  lat: 35.681236, // 東京駅
  lng: 139.767125,
};

const osakaStation: LatLngLiteral = {
  lat: 34.702485, // 大阪駅
  lng: 135.495951,
};

// 型定義
interface MapState {
  center: LatLngLiteral;
  zoom: number;
  address: string;
  markerPosition: LatLngLiteral | null;
}

const Page: React.FC = () => {
  const [isSplitView, setIsSplitView] = useState(false);
  const [overlayOpacity, setOverlayOpacity] = useState(1); // 1でマップ1が100%、0でマップ2が100%

  const map1Ref = useRef<MapRefType>(null);
  const map2Ref = useRef<MapRefType>(null);

  const [mapState1, setMapState1] = useState<MapState>({
    center: defaultCenter,
    zoom: 15,
    address: '',
    markerPosition: defaultCenter,
  });

  const [mapState2, setMapState2] = useState<MapState>({
    center: osakaStation,
    zoom: 15,
    address: '',
    markerPosition: osakaStation,
  });

  const setCenter = (
    newCenter: LatLngLiteral,
    setMapState: React.Dispatch<React.SetStateAction<MapState>>,
  ) => {
    setMapState(prev => ({ ...prev, center: newCenter }));
  };

  const setAddress = (
    newAddress: string,
    setMapState: React.Dispatch<React.SetStateAction<MapState>>,
  ) => {
    setMapState(prev => ({ ...prev, address: newAddress }));
  };

  const setMarkerPosition = (
    newMarkerPosition: LatLngLiteral | null,
    setMapState: React.Dispatch<React.SetStateAction<MapState>>,
  ) => {
    setMapState(prev => ({ ...prev, markerPosition: newMarkerPosition }));
  };

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const handleSearch = (
    mapState: MapState,
    setMapState: React.Dispatch<React.SetStateAction<MapState>>,
  ) => {
    if (!window.google) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: mapState.address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        const newCenter: LatLngLiteral = {
          lat: location.lat(),
          lng: location.lng(),
        };
        setCenter(newCenter, setMapState);
        setMarkerPosition(newCenter, setMapState);
      } else {
        alert('住所の取得に失敗しました: ' + status);
      }
    });
  };

  const toggleSplitView = () => {
    setIsSplitView(!isSplitView);
  };

  const handleCenterChanged = (mapNumber: number, center: LatLngLiteral) => {

    const panUpdater = (
      prev: MapState,
      delta: LatLngLiteral,
    ) => {
      const newCenter = {
        lat: prev.center.lat + delta.lat,
        lng: prev.center.lng + delta.lng,
      }
      return { ...prev, center: newCenter };
    };

    if (mapNumber === 1) {
      const oldCenter1 = mapState1.center;
      const delta = {
        lat: center.lat - oldCenter1.lat,
        lng: center.lng - oldCenter1.lng,
      };

      setMapState1(prev => ({ ...prev, center: center }));
      if (Math.abs(delta.lat) > 0.0 || Math.abs(delta.lng) > 0.0){
        // 遅延実行で競合回避
        setTimeout(() => {
          setMapState2(prev => panUpdater(prev, delta));
        }, 0);
      }
    } else {
      const oldCenter2 = mapState2.center;
      const delta = {
        lat: center.lat - oldCenter2.lat,
        lng: center.lng - oldCenter2.lng,
      };

      setMapState2(prev => ({ ...prev, center: center }));
      if (Math.abs(delta.lat) > 0.0 || Math.abs(delta.lng) > 0.0){
        // 遅延実行で競合回避
        setTimeout(() => {
          setMapState1(prev => panUpdater(prev, delta));
        }, 0);
      }
    }
  };

  const handleZoomChanged = (mapNumber: number, zoom: number) => {
    if (mapNumber === 1) {
      setMapState1(prev => ({ ...prev, zoom: zoom }));
      setTimeout(() => {
        setMapState2(prev => ({ ...prev, zoom: zoom }));
      }, 0);
    } else {
      setMapState2(prev => ({ ...prev, zoom: zoom }));
      setTimeout(() => {
        setMapState1(prev => ({ ...prev, zoom: zoom }));
      }, 0);
    }
  };

  const zoomMaps = (zoomIncrement: number) => {
    setMapState1(prev => ({ ...prev, zoom: prev.zoom + zoomIncrement }));
    setMapState2(prev => ({ ...prev, zoom: prev.zoom + zoomIncrement }));
  };

  const panMaps = (dx: number, dy: number) => {
    const basePanAmount = 0.01;
    const referenceZoom = 15;

    const panUpdater = (prev: MapState) => {
      const scaleFactor = Math.pow(2, prev.zoom - referenceZoom);
      const panAmount = basePanAmount / scaleFactor;
      const newCenter = {
        lat: prev.center.lat + dy * panAmount,
        lng: prev.center.lng + dx * panAmount,
      };
      return { ...prev, center: newCenter };
    };

    setMapState1(prev => panUpdater(prev));
    setMapState2(prev => panUpdater(prev));
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={apiKey}>
        <div style={{ margin: '1em 0' }}>
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={mapState1.address}
              onChange={(e) => setAddress(e.target.value, setMapState1)}
              placeholder="住所を入力（例：東京タワー）"
              style={{ width: '300px', padding: '4px', display: 'inline-block' }}
            />
            <button onClick={() => handleSearch(mapState1, setMapState1)} style={{ marginLeft: '8px', marginTop: '4px', display: 'inline-block' }}>
              検索
            </button>
          </div>
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={mapState2.address}
              onChange={(e) => setAddress(e.target.value, setMapState2)}
              placeholder="２地点目の住所を入力（例：大阪駅）"
              style={{ width: '300px', padding: '4px', display: 'inline-block' }}
            />
            <button onClick={() => handleSearch(mapState2, setMapState2)} style={{ marginLeft: '8px', marginTop: '4px', display: 'inline-block' }}>
              検索
            </button>
          </div>
        </div>
        <button onClick={toggleSplitView}>
          {isSplitView ? '重畳ビュー' : '左右分割ビュー'}
        </button>
        {!isSplitView && (
          <div style={{ margin: '1em 0' }}>
            <span>マップ2</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
              style={{ margin: '0 8px' }}
            />
            <span>マップ1</span>
          </div>
        )}
        <div style={{ margin: '1em 0' }}>
          <button onClick={() => panMaps(0, 1)}>↑</button>
          <button onClick={() => panMaps(0, -1)}>↓</button>
          <button onClick={() => panMaps(-1, 0)}>←</button>
          <button onClick={() => panMaps(1, 0)}>→</button>
          <button onClick={() => zoomMaps(1)}>+</button>
          <button onClick={() => zoomMaps(-1)}>-</button>
        </div>
        {isSplitView ? (
          <div style={{ display: 'flex' }}>
            <div style={{ width: '50%' }}>
              <MapView
                center={mapState1.center}
                zoom={mapState1.zoom}
                markerPosition={mapState1.markerPosition}
                onMapLoad={(map) => { map1Ref.current = map; }}
                onCenterChanged={(center) => handleCenterChanged(1, center)}
                onZoomChanged={(zoom) => handleZoomChanged(1, zoom)}
              />
            </div>
            <div style={{ width: '50%' }}>
              <MapView
                center={mapState2.center}
                zoom={mapState2.zoom}
                markerPosition={mapState2.markerPosition}
                onMapLoad={(map) => { map2Ref.current = map; }}
                onCenterChanged={(center) => handleCenterChanged(2, center)}
                onZoomChanged={(zoom) => handleZoomChanged(2, zoom)}
              />
            </div>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
              <MapView
                center={mapState2.center}
                zoom={mapState2.zoom}
                markerPosition={mapState2.markerPosition}
                onMapLoad={(map) => { map2Ref.current = map; }}
                onCenterChanged={(center) => handleCenterChanged(2, center)}
                onZoomChanged={(zoom) => handleZoomChanged(2, zoom)}
              />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', opacity: overlayOpacity }}>
              <MapView
                center={mapState1.center}
                zoom={mapState1.zoom}
                markerPosition={mapState1.markerPosition}
                onMapLoad={(map) => { map1Ref.current = map; }}
                onCenterChanged={(center) => handleCenterChanged(1, center)}
                onZoomChanged={(zoom) => handleZoomChanged(1, zoom)}
              />
            </div>
          </div>
        )}
      </LoadScript>
    </div>
  );
};

export default Page;
