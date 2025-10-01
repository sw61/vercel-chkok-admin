import KakaoSearch from '@/pages/kakaoMap/kakaoSearch';
interface SearchMapModalProps {
  handleMapSelect: (data: {
    roadAddr: string;
    lat: number;
    lng: number;
  }) => void;
  handleCloseModal: () => void;
}
export default function SearchMapModal({
  handleMapSelect,
  handleCloseModal,
}: SearchMapModalProps) {
  return (
    <div className="absolute inset-0 z-10 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg border max-w-2xl min-w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">위치 검색</h2>
        <KakaoSearch onSelect={handleMapSelect} onClose={handleCloseModal} />
      </div>
    </div>
  );
}
