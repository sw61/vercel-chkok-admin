import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import CreateForm from '../components/create/createForm';
import SearchMapModal from '../components/searchMapModal';

export default function ArticleCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: false,
    campaignId: undefined as number | undefined,
    contactPhone: '',
    homepage: '',
    businessAddress: '',
    businessDetailAddress: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const navigate = useNavigate();

  // 폼 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // 카카오맵 위치 검색에서 선택된 데이터 처리
  const handleMapSelect = (data: {
    roadAddr: string;
    lat: number;
    lng: number;
  }) => {
    setFormData((prev) => ({
      ...prev,
      businessAddress: data.roadAddr,
      lat: data.lat,
      lng: data.lng,
    }));
    setShowMapModal(false);
  };
  // 카카오맵 모달 열기 핸들러
  const handleOpenModal = () => {
    setShowMapModal(true);
  };
  // 카카오맵 모달 닫기 핸들러
  const handleCloseModal = () => {
    setShowMapModal(false);
  };
  // 아티클 활성화/비활성화 변경 핸들러
  const handleActiveChange = (checked: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      active: checked,
    }));
  };
  return (
    <div className="p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => navigate('/articles')}
          className="cursor-pointer"
        />
      </div>
      <Card>
        <div className="flex flex-col items-center px-6">
          {/* 아티클 생성 폼 */}
          <CreateForm
            formData={formData}
            handleChange={handleChange}
            handleOpenModal={handleOpenModal}
            handleActiveChange={handleActiveChange}
          />
          {/* 카카오맵 모달 */}
          {showMapModal && (
            <SearchMapModal
              handleMapSelect={handleMapSelect}
              handleCloseModal={handleCloseModal}
            />
          )}
        </div>
      </Card>
    </div>
  );
}
