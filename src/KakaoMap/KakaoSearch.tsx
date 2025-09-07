import useKakaoLoader from '@/hooks/useKakaoLoader';
import React, { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

// Define interfaces for component data
interface Position {
  lat: number;
  lng: number;
}

interface Marker {
  position: Position;
  content: string;
}

interface Place {
  place_name: string;
  x: string;
  y: string;
}

// Kakao Maps types
interface KakaoMap {
  setBounds: (bounds: any) => void;
  setCenter: (latLng: any) => void;
}

interface PlacesService {
  keywordSearch: (
    keyword: string,
    callback: (data: Place[], status: string, pagination: any) => void
  ) => void;
}

interface KakaoMapsServices {
  Places: new () => PlacesService;
  LatLng: new (lat: number, lng: number) => any;
  LatLngBounds: new () => any;
}

interface KakaoMaps {
  maps: {
    services: KakaoMapsServices;
    Status: {
      OK: string;
    };
  };
}

// Extend window interface for Kakao Maps
declare global {
  interface Window {
    kakao?: KakaoMaps;
  }
}

const MapComponent: React.FC = () => {
  const [info, setInfo] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSdkLoaded, setIsSdkLoaded] = useState<boolean>(false);
  useKakaoLoader();

  // Check if Kakao Maps SDK is loaded
  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsSdkLoaded(true);
    } else {
      // Optionally, listen for SDK load if loaded dynamically
      const checkSdk = setInterval(() => {
        if (window.kakao && window.kakao.maps) {
          setIsSdkLoaded(true);
          clearInterval(checkSdk);
        }
      }, 100);

      return () => clearInterval(checkSdk);
    }
  }, []);

  // Handle search on button click
  const handleSearch = () => {
    if (!searchInput.trim()) {
      setError('검색어를 입력해주세요.');
      return;
    }
    setKeyword(searchInput);
    setError(null);
  };

  // Handle clicking a place in the list
  const handlePlaceClick = (marker: Marker) => {
    if (map) {
      setInfo(marker);
      map.setCenter(
        new window.kakao!.maps.LatLng(marker.position.lat, marker.position.lng)
      );
    }
  };

  // Search for places when keyword or map changes
  useEffect(() => {
    if (!map || !keyword || !isSdkLoaded || !window.kakao) {
      return;
    }

    setIsLoading(true);
    setError(null);

    const ps: PlacesService = new kakao.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data: Place[], status: string, _pagination: any) => {
        setIsLoading(false);
        if (status === kakao.maps.services.Status.OK) {
          const bounds = new window.kakao!.maps.LatLngBounds();
          const newMarkers: Marker[] = [];

          for (let i = 0; i < data.length; i++) {
            newMarkers.push({
              position: {
                lat: parseFloat(data[i].y),
                lng: parseFloat(data[i].x),
              },
              content: data[i].place_name,
            });
            bounds.extend(
              new window.kakao!.maps.LatLng(
                parseFloat(data[i].y),
                parseFloat(data[i].x)
              )
            );
          }

          setMarkers(newMarkers);
          map.setBounds(bounds);
        } else {
          setMarkers([]);
          setError('검색 결과를 찾을 수 없습니다.');
        }
      }
    );
  }, [map, keyword, isSdkLoaded]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="검색할 장소를 입력하세요"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={!isSdkLoaded}
        >
          검색
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 text-sm">{error}</div>}

      {/* Loading Indicator */}
      {isLoading && <div className="text-gray-500 text-sm">검색 중...</div>}

      {/* SDK Not Loaded Warning */}
      {!isSdkLoaded && (
        <div className="text-yellow-500 text-sm">
          Kakao Maps SDK를 로드하는 중입니다...
        </div>
      )}

      {/* Map */}
      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: '100%',
          height: '350px',
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: '#000' }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
      </Map>
      {/* Search Results List */}
      {markers.length > 0 && !isLoading && (
        <div className="max-h-40 overflow-y-auto border rounded-md p-2">
          <ul className="list-disc pl-5">
            {markers.map((marker, index) => (
              <li
                key={index}
                className="cursor-pointer hover:text-blue-500"
                onClick={() => handlePlaceClick(marker)}
              >
                {marker.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
