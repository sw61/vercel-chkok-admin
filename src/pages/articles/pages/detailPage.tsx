import { Card, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MarkdownDetailSkeleton from '@/pages/articles/components/detail/markdownDetailSkeleton';
import { ChevronLeft } from 'lucide-react';
import { Editor } from '@toast-ui/react-editor';
import TurndownService from 'turndown';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getPostDetail } from '@/services/articles/detailApi';
import ArticleForm from '../components/detail/detailForm';
import ArticleContent from '../components/detail/detailContent';
import SearchMapModal from '../components/searchMapModal';

export default function ArticleDetailPage() {
  const { articleId } = useParams<{ articleId: string }>();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    campaignId: undefined as number | undefined,
    contactPhone: '',
    homepage: '',
    businessAddress: '',
    businessDetailAddress: '',
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const editorRef = useRef<Editor | null>(null);
  const navigate = useNavigate();

  // 체험콕 아티클 상세 정보 조회
  const { data: articleData } = useSuspenseQuery({
    queryKey: ['articleDetail', articleId],
    queryFn: () => getPostDetail(articleId!),
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

  useEffect(() => {
    if (articleData) {
      const serverMarkdownContent = turndownService.turndown(
        articleData.content
      );
      setFormData({
        title: articleData.title,
        content: serverMarkdownContent,
        campaignId: articleData.campaignId,
        contactPhone: articleData.visitInfo?.contactPhone || '',
        homepage: articleData.visitInfo?.homepage || '',
        businessAddress: articleData.visitInfo?.businessAddress || '',
        businessDetailAddress:
          articleData.visitInfo?.businessDetailAddress || '',
        lat: articleData.visitInfo?.lat ?? undefined,
        lng: articleData.visitInfo?.lng ?? undefined,
      });
    }
  }, [articleData]);
  useEffect(() => {
    if (editorRef.current && formData.content) {
      editorRef.current.getInstance().setMarkdown(formData.content);
    }
  }, [formData.content]);

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

  return (
    <div className="min-w-[800px] p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => navigate('/articles')}
          className="cursor-pointer"
        />
      </div>
      <Card className="w-full px-6 py-4">
        <div className="flex items-center justify-between px-6">
          <CardTitle className="ck-title">체험콕 아티클</CardTitle>
          <ArticleForm
            articleId={articleId!}
            articleData={articleData}
            formData={formData}
            handleChange={handleChange}
            handleOpenModal={handleOpenModal}
          />
        </div>
        <Suspense fallback={<MarkdownDetailSkeleton />}>
          <ArticleContent
            articleData={articleData}
            formData={formData}
            handleChange={handleChange}
          />
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
