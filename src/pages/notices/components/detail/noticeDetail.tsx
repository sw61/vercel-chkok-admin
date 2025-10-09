import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInterceptor from '@/lib/axiosInterceptors';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alertDialog';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import { Editor } from '@toast-ui/react-editor';
import MarkdownDetailSkeleton from '@/pages/articles/components/detail/markdownDetailSkeleton';
import { toast } from 'sonner';

interface NoticeData {
  id: number;
  title: string;
  content: string;
  viewCount: number;
  authorId: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export default function NoticeDetail() {
  const { markdownId } = useParams<{ markdownId: string }>();
  const navigate = useNavigate();
  const [noticeData, setNoticeData] = useState<NoticeData | null>(null);
  const [editData, setEditData] = useState<{ title: string; content: string }>({
    title: '',
    content: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const editorRef = useRef<Editor | null>(null);
  const { imageHandler } = useAddImage();

  // 공지사항 상세 정보
  const getNoticeDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(`/api/admin/notices/${id}`);
      const data = response.data.data;
      setNoticeData(data);
      setEditData({ title: data.title, content: data.content });
      console.log(data);
    } catch (error) {
      console.error('공지사항 조회 오류:', error);
      toast.error('공지사항을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 수정
  const editMarkdown = async (id: number) => {
    if (!editData.title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!editorRef.current?.getInstance().getMarkdown()) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    try {
      const markdown = editorRef.current.getInstance().getMarkdown();
      const response = await axiosInterceptor.put(`/api/admin/notices/${id}`, {
        title: editData.title,
        content: markdown,
      });
      toast.success('공지사항이 수정되었습니다.');
      await getNoticeDetail(markdownId!);
      console.log(response);
    } catch (error) {
      console.error('공지사항 수정 오류:', error);
      toast.error('공지사항 수정에 실패했습니다.');
    }
  };

  // 공지사항 삭제
  const deleteMarkdown = async (id: number) => {
    try {
      await axiosInterceptor.delete(`/api/admin/notices/${id}`);
      toast.success('공지사항이 삭제되었습니다.');
      navigate('/notices');
    } catch (error) {
      console.error('공지사항 삭제 오류:', error);
      toast.error('공지사항 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (markdownId) {
      getNoticeDetail(markdownId);
    }
  }, [markdownId]);

  useEffect(() => {
    if (editorRef.current && editData.content) {
      editorRef.current.getInstance().setMarkdown(editData.content);
    }
  }, [editData.content]);

  if (isLoading) {
    return <MarkdownDetailSkeleton />;
  }
  if (!noticeData) {
    return <div>데이터 없음</div>;
  }

  return (
    <div className="w-full p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => navigate('/notices')}
          className="cursor-pointer"
        />
      </div>
      <Card className="min-w-[800px] px-6 py-4">
        <div className="flex items-center justify-between px-6">
          <CardTitle className="ck-title">공지사항</CardTitle>
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-4 py-2" variant="outline">
                  삭제
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[350px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    공지사항을 삭제하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    이 작업은 되돌릴 수 없습니다
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMarkdown(noticeData.id)}
                  >
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="px-4 py-2" variant="outline">
                  수정
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="w-[350px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    공지사항을 수정하시겠습니까?
                  </AlertDialogTitle>
                  <AlertDialogDescription></AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => editMarkdown(noticeData.id)}
                  >
                    확인
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardContent className="ck-body-2 flex gap-6">
          <p>작성자: {noticeData?.authorName}</p>
          <p>생성일: {noticeData?.createdAt.split('T')[0]}</p>
          <p>수정일: {noticeData?.updatedAt.split('T')[0]}</p>
          <p>조회수: {noticeData?.viewCount}</p>
        </CardContent>

        <CardContent>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              제목
            </label>
            <Input
              value={editData.title}
              onChange={(e) =>
                setEditData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="제목을 입력하세요"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              내용
            </label>
            <div
              className="toastui-editor-contents"
              style={{ whiteSpace: 'pre-line' }}
            >
              <TuiEditor
                content={editData.content}
                editorRef={editorRef}
                imageHandler={imageHandler}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
