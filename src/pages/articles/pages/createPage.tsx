import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import CreateForm from '../components/create/createForm';
import SearchMapModal from '../components/searchMapModal';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import type { Editor } from '@toast-ui/react-editor';

export default function ArticleCreatePage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    active: false,
    campaignId: '',
    contactPhone: '',
    homepage: '',
    businessAddress: '',
    businessDetailAddress: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const { imageHandler } = useAddImage(); // Editor 이미지 추가 기능
  const editorRef = useRef<Editor | null>(null);
  // 폼 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  // 캠페인 ID 폼 필드 변경 핸들러
  const handleChangeCampaignId = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      campaignId: value,
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
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      active: false,
      campaignId: '',
      contactPhone: '',
      homepage: '',
      businessAddress: '',
      businessDetailAddress: '',
      lat: undefined,
      lng: undefined,
    });
    // 에디터 내용 초기화 (필요시)
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown('');
    }
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
            handleChangeCampaignId={handleChangeCampaignId}
            resetForm={resetForm}
          />
          {/* Toast Ui Editor */}
          <div className="w-full">
            <TuiEditor editorRef={editorRef} imageHandler={imageHandler} />
          </div>

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
