import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import CreateForm from '../components/create/createForm';
import SearchMapModal from '../components/searchMapModal';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import type { Editor } from '@toast-ui/react-editor';
import { useCreateArticleMutation } from '@/services/articles/createApi';
import { toast } from 'sonner';

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
  const { imageHandler } = useAddImage(); // Editor 이미지 추가 기능
  const editorRef = useRef<Editor | null>(null);
  const { mutate: createMutation } = useCreateArticleMutation();

  // 아티클 생성 핸들러
  const handleCreate = () => {
    if (!editorRef.current) {
      return;
    }
    // 마크다운 컨텐츠
    const markdownContent = editorRef.current.getInstance().getMarkdown() || '';
    // 유효성 검사
    if (!formData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!markdownContent) {
      toast.error('내용을 입력해주세요.');
      return false;
    }
    if (!formData.contactPhone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return;
    }
    const payload = {
      title: formData.title,
      content: markdownContent,
      campaignId: formData.campaignId,
      active: formData.active,
      visitInfo: {
        contactPhone: formData.contactPhone || null,
        homepage: formData.homepage || null,
        businessAddress: formData.businessAddress || null,
        businessDetailAddress: formData.businessDetailAddress || null,
        lat: formData.lat ?? null,
        lng: formData.lng ?? null,
      },
    };
    createMutation(payload, {
      onSuccess: () => {
        resetForm();
      },
    });
  };
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
  // 생성 후 폼 초기화
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
    // 에디터 내용 초기화
    if (editorRef.current) {
      editorRef.current.getInstance().setMarkdown('');
    }
  };
  useEffect(() => {
    resetForm();
  }, []);
  return (
    <div className="px-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => window.history.back()}
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
            handleCreate={handleCreate}
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
