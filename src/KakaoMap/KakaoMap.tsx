import { Map, MapMarker } from 'react-kakao-maps-sdk';
import useKakaoLoader from '../hooks/useKakaoLoader';

interface KakaoMapProps {
  latitude: number;
  longitude: number;
  markerTitle?: string; // 마커 툴팁에 표시할 제목 (옵션)
  markerContent?: string; // 마커 오버레이에 표시할 내용 (옵션)
  zoomLevel?: number; // 지도 확대 레벨 (기본값 제공)
  hasCoordinates: boolean;
  className?: string; // Tailwind CSS 클래스 (옵션)
}

export default function KakaoMap({
  latitude,
  longitude,
  markerTitle = '위치',
  markerContent = '',
  zoomLevel = 3,
  hasCoordinates,
  className = 'w-[400px] h-[250px] rounded-lg overflow-hidden',
}: KakaoMapProps) {
  useKakaoLoader();

  if (hasCoordinates === false) {
    return (
      <div className="flex h-[250px] w-[400px] items-center justify-center rounded-lg bg-gray-100">
        <p className="text-gray-500">유효한 좌표가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <Map
        id="map"
        center={{ lat: latitude, lng: longitude }}
        style={{ width: '100%', height: '100%' }}
        level={zoomLevel}
      >
        <MapMarker
          position={{ lat: latitude, lng: longitude }}
          title={markerTitle}
        >
          {markerContent && (
            <div className="rounded-md bg-white p-2 text-black">
              {markerContent}
            </div>
          )}
        </MapMarker>
      </Map>
    </div>
  );
}
