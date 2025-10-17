import { useState, useRef, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import { Editor } from '@toast-ui/react-editor';
import MarkdownDetailSkeleton from '@/pages/articles/components/detail/markdownDetailSkeleton';
import { toast } from 'sonner';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getNoticeDetail } from '@/services/notices/detail/detailApi';
import { useEditNoticeMutation } from '@/services/notices/detail/detailMutation';
import TurndownService from 'turndown';
import NoticeDetailContent from '../components/detail/detailContent';

export default function NoticeDetail() {
  const { noticeId } = useParams<{ noticeId: string }>();
  const { imageHandler } = useAddImage();
  const { mutate: editNoticeMutation } = useEditNoticeMutation();

  const editorRef = useRef<Editor | null>(null);

  const navigate = useNavigate();
  const { data: noticeData } = useSuspenseQuery({
    queryKey: ['noticeDetail', noticeId],
    queryFn: () => getNoticeDetail(noticeId!),
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
  const [editData, setEditData] = useState<{ title: string; content: string }>({
    title: noticeData.title,
    content: turndownService.turndown(noticeData.content),
  });

  // 공지사항 수정
  const handleEditNotice = async () => {
    if (!editData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!editorRef.current?.getInstance().getMarkdown()) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    const payload = { title: editData.title, content: editData.content };
    editNoticeMutation({ id: noticeData.id, payload });
  };
  // 폼 필드 변경 핸들러
  const handleChangeEditData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setEditData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  if (!noticeData) {
    return <div>데이터 없음</div>;
  }

  return (
    <Suspense fallback={<MarkdownDetailSkeleton />}>
      <div className="w-full p-6">
        <div className="mb-4">
          <ChevronLeft
            onClick={() => navigate('/notices')}
            className="cursor-pointer"
          />
        </div>
        <Card className="min-w-[800px] px-6 py-4">
          <NoticeDetailContent
            noticeId={noticeId!}
            noticeData={noticeData}
            editData={editData}
            handleEditNotice={handleEditNotice}
            handleChangeEditData={handleChangeEditData}
          />
          <CardContent>
            <TuiEditor
              content={editData.content}
              editorRef={editorRef}
              imageHandler={imageHandler}
            />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
