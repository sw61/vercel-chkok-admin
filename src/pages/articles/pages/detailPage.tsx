import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { useState, useRef, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import MarkdownDetailSkeleton from '@/pages/articles/components/detail/markdownDetailSkeleton';
import { ChevronLeft } from 'lucide-react';
import { Editor } from '@toast-ui/react-editor';
import TurndownService from 'turndown';
import { useSuspenseQuery } from '@tanstack/react-query';
import ArticleContent from '../components/detail/detailContent';
import SearchMapModal from '../components/searchMapModal';
import DetailForm from '../components/detail/detailForm';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import { CustomBadge } from '@/hooks/useBadge';
import { toast } from 'sonner';
import { getArticleDetail } from '@/services/articles/detail/detailApi';
import { useEditArticleMutation } from '@/services/articles/detail/detailMutation';

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const editorRef = useRef<Editor | null>(null);
  const { imageHandler } = useAddImage();
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  // 체험콕 아티클 상세 정보 조회
  const { data: articleData } = useSuspenseQuery({
    queryKey: ['articleDetail', articleId],
    queryFn: () => getArticleDetail(articleId!),
  });
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });
  // <span> <br> 태그를 그대로 유지
  turndownService.keep(['span']);
  turndownService.addRule('brTag', {
    filter: 'br',
    replacement: function () {
      return '<br>';
    },
  });
  // 초기 폼 데이터 설정
  const [formData, setFormData] = useState({
    title: articleData.title,
    content: turndownService.turndown(articleData.content),
    campaignId: articleData.campaignId,
    contactPhone: articleData.visitInfo?.contactPhone || '',
    homepage: articleData.visitInfo?.homepage || '',
    businessAddress: articleData.visitInfo?.businessAddress || '',
    businessDetailAddress: articleData.visitInfo?.businessDetailAddress || '',
    lat: articleData.visitInfo?.lat ?? undefined,
    lng: articleData.visitInfo?.lng ?? undefined,
  });

  const { mutate: editMutation } = useEditArticleMutation();

  // 아티클 수정 핸들러
  const handleEdit = () => {
    if (!editorRef.current) {
      return;
    }
    // 서버에 보낼 마크다운 내용
    const markdownContent = editorRef.current.getInstance().getMarkdown() || '';

    if (!formData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!markdownContent) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    if (!formData.contactPhone.trim()) {
      toast.error('연락처를 입력해주세요.');
      return;
    }
    const payload = {
      title: formData.title,
      content: markdownContent,
      campaignId: formData.campaignId,
      visitInfo: {
        contactPhone: formData.contactPhone || null,
        homepage: formData.homepage || null,
        businessAddress: formData.businessAddress || null,
        businessDetailAddress: formData.businessDetailAddress || null,
        lat: formData.lat ?? null,
        lng: formData.lng ?? null,
      },
    };

    editMutation({ id: articleData.id, payload });
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

  return (
    <div className="min-w-[800px] px-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => window.history.back()}
          className="cursor-pointer"
        />
      </div>
      <Card className="w-full px-6 py-4">
        <div className="flex items-center justify-between px-6">
          <CardTitle className="flex gap-4">
            <div className="ck-title">체험콕 아티클</div>
            <div>
              <CustomBadge variant={articleData.active} />
            </div>
          </CardTitle>
          <DetailForm
            articleId={articleId!}
            articleData={articleData}
            formData={formData}
            handleEdit={handleEdit}
            handleChange={handleChange}
            handleOpenModal={handleOpenModal}
            handleChangeCampaignId={handleChangeCampaignId}
          />
        </div>
        <Suspense fallback={<MarkdownDetailSkeleton />}>
          <ArticleContent
            articleData={articleData}
            formData={formData}
            handleChange={handleChange}
          />
          <CardContent>
            <TuiEditor
              content={formData.content}
              editorRef={editorRef}
              imageHandler={imageHandler}
            />
          </CardContent>
        </Suspense>
      </Card>
      {/* 지도 모달 */}
      {showMapModal && (
        <SearchMapModal
          handleMapSelect={handleMapSelect}
          handleCloseModal={handleCloseModal}
        />
      )}
    </div>
  );
}
