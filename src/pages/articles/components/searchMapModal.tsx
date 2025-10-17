import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import KakaoSearch from '@/components/kakaoMap/kakaoSearch';

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
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseModal();
        }
      }}
    >
      <DialogContent className="max-h-[90vh] min-w-[600px] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>위치 검색</DialogTitle>
        </DialogHeader>
        <KakaoSearch onSelect={handleMapSelect} onClose={handleCloseModal} />
      </DialogContent>
    </Dialog>
  );
}
