// src/pages/kakaoMap/kakaoSearch.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useKakaoLoader from '@/hooks/useKakaoLoader';
import { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';

// 인터페이스 정의
interface Position {
  lat: number;
  lng: number;
}

interface AddressInfo {
  roadAddr: string; // 도로명 주소
}

interface Marker {
  position: Position;
  content: string;
  addressInfo?: AddressInfo; // 주소 정보 (도로명 주소만)
}

interface Place {
  place_name: string;
  x: string;
  y: string;
}

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

interface GeocoderService {
  coord2Address: (
    lng: number,
    lat: number,
    callback: (result: any[], status: string) => void
  ) => void;
}

interface KakaoMapsServices {
  Places: new () => PlacesService;
  Geocoder: new () => GeocoderService;
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

declare global {
  interface Window {
    kakao?: KakaoMaps;
  }
}

interface KakaoSearchProps {
  onSelect: (data: { roadAddr: string; lat: number; lng: number }) => void;
  onClose: () => void;
}

const KakaoSearch: React.FC<KakaoSearchProps> = ({ onSelect, onClose }) => {
  const [loading, error] = useKakaoLoader(); // useKakaoLoader 훅 사용
  const [info, setInfo] = useState<Marker | null>(null);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [map, setMap] = useState<KakaoMap | null>(null);
  const [keyword, setKeyword] = useState<string>('');

  const [searchInput, setSearchInput] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

  // 검색 처리
  const handleSearch = () => {
    if (!searchInput.trim()) {
      return;
    }
    setKeyword(searchInput);
  };

  // 장소 클릭 처리
  const handlePlaceClick = (marker: Marker) => {
    setInfo(marker);
    setSelectedMarker(marker);
    if (map) {
      map.setCenter(
        new window.kakao!.maps.LatLng(marker.position.lat, marker.position.lng)
      );
    }
  };

  // 선택 완료 처리
  const handleSelectionComplete = () => {
    if (selectedMarker && selectedMarker.addressInfo) {
      onSelect({
        roadAddr: selectedMarker.addressInfo.roadAddr,
        lat: selectedMarker.position.lat,
        lng: selectedMarker.position.lng,
      });
    }
    onClose();
  };

  // 도로명 주소 가져오기 함수
  const fetchAddressInfo = (
    lat: number,
    lng: number,
    callback: (addressInfo: AddressInfo) => void
  ) => {
    if (!window.kakao || loading) return;

    const geocoder = new window.kakao!.maps.services.Geocoder();

    geocoder.coord2Address(lng, lat, (addressResult, addressStatus) => {
      let roadAddr = '';
      if (
        addressStatus === window.kakao!.maps.services.Status.OK &&
        addressResult[0].road_address
      ) {
        roadAddr = addressResult[0].road_address.address_name;
      }
      callback({ roadAddr });
    });
  };

  // 키워드 검색 및 도로명 주소 추가
  useEffect(() => {
    if (!map || !keyword || loading || !window.kakao) {
      return;
    }

    setIsSearching(true);

    const ps: PlacesService = new window.kakao!.maps.services.Places();

    ps.keywordSearch(
      keyword,
      (data: Place[], status: string, _pagination: any) => {
        setIsSearching(false);
        if (status === window.kakao!.maps.services.Status.OK) {
          const bounds = new window.kakao!.maps.LatLngBounds();
          const newMarkers: Marker[] = [];

          data.forEach((place) => {
            const lat = parseFloat(place.y);
            const lng = parseFloat(place.x);

            fetchAddressInfo(lat, lng, (addressInfo) => {
              newMarkers.push({
                position: { lat, lng },
                content: place.place_name,
                addressInfo,
              });

              if (newMarkers.length === data.length) {
                setMarkers(newMarkers);
                newMarkers.forEach((marker) => {
                  bounds.extend(
                    new window.kakao!.maps.LatLng(
                      marker.position.lat,
                      marker.position.lng
                    )
                  );
                });
                if (map) {
                  map.setBounds(bounds);
                }
              }
            });
          });
        } else {
          setMarkers([]);
        }
      }
    );
  }, [map, keyword, loading]);

  if (loading) {
    return (
      <div className="text-yellow-500 text-sm">
        Kakao Maps SDK를 로드하는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm">
        지도 로드 오류: {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex gap-2">
        <Input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="검색할 장소를 입력하세요"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={handleSearch} disabled={loading}>
          검색
        </Button>
      </div>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      {isSearching && <div className="text-gray-500 text-sm">검색 중...</div>}

      <Map
        center={{
          lat: 37.566826,
          lng: 126.9786567,
        }}
        style={{
          width: '100%',
          height: '250px',
        }}
        level={3}
        onCreate={setMap}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => handlePlaceClick(marker)}
          />
        ))}
      </Map>

      {markers.length > 0 && !isSearching && (
        <div className="max-h-52 overflow-y-auto border rounded-md p-2">
          <div className="pb-2 border-b">검색 결과 ({markers.length}개)</div>
          <div className="flex flex-col">
            {markers.map((marker, index) => (
              <div
                key={index}
                className="cursor-pointer hover:text-blue-500 py-2 border-b"
                onClick={() => handlePlaceClick(marker)}
              >
                <div>{marker.content}</div>
                {marker.addressInfo && marker.addressInfo.roadAddr && (
                  <div className="text-sm text-gray-600">
                    {marker.addressInfo.roadAddr}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button onClick={onClose} variant="outline">
          취소
        </Button>
        <Button onClick={handleSelectionComplete} disabled={!selectedMarker}>
          선택 완료
        </Button>
      </div>
    </div>
  );
};

export default KakaoSearch;
