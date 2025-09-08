import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import axiosInterceptor from '@/lib/axios-interceptors';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import axios from 'axios';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import { Button } from '@/components/ui/button';
import TurndownService from 'turndown';
import MarkdownDetailSkeleton from '../Skeleton/MarkdownDetailSkeleton';
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
} from '@/components/ui/alert-dialog';

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
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [pendingImageData, setPendingImageData] = useState<{
    url: string;
    name: string;
  } | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorApi, setEditorApi] = useState<any>(null);

  // html -> Markdown 변환
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
  });
  // 공지사항 상세 정보
  const getNoticeDetail = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInterceptor.get(`/api/admin/notices/${id}`);
      const data = response.data.data;
      const markdownContent = turndownService.turndown(data.content);
      setNoticeData(data);
      setEditData({ title: data.title, content: markdownContent });
    } catch (error) {
      console.log(error);
      toast.error('마크다운 문서를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 마크다운 문서 수정
  const editMarkdown = async (id: number) => {
    try {
      const markdownComponent = (
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>
          {editData.content}
        </ReactMarkdown>
      );
      const html = renderToStaticMarkup(markdownComponent);
      const response = await axiosInterceptor.put(`/api/admin/notices/${id}`, {
        title: editData.title,
        content: html,
      });
      navigate('/notices');
      toast.success('문서가 수정되었습니다.');
      await getNoticeDetail(markdownId!);
    } catch (error) {
      console.log(error);
      toast.error('문서 수정에 실패했습니다.');
    }
  };

  // 마크다운 문서 삭제
  const deleteMarkdown = async (id: number) => {
    try {
      await axiosInterceptor.delete(`/api/admin/notices/${id}`);
      navigate('/notices');
      toast.success('문서가 삭제되었습니다.');
    } catch (error) {
      console.log(error);
      toast.error('문서 삭제에 실패했습니다.');
    }
  };

  // S3 이미지 업로드
  const uploadImageFile = async (file: File): Promise<string> => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    try {
      toast.info('이미지 업로드 중 입니다...');
      const response = await axiosInterceptor.post(
        '/api/images/kokpost/presigned-url',
        {
          fileExtension,
        }
      );
      const presignedUrl = response.data.data.presignedUrl.split('?')[0];
      const contentType = file.type || 'image/jpeg';
      await axios.put(presignedUrl, file, {
        headers: { 'Content-Type': contentType },
      });
      return presignedUrl;
    } catch (error) {
      toast.error('이미지 업로드에 실패했습니다.');
      throw error;
    }
  };

  // 이미지 삽입 모달
  const openImageModal = (url: string, name: string) => {
    setPendingImageData({ url, name });
    setShowImageModal(true);
  };

  // 이미지 삽입
  const insertImage = () => {
    if (!pendingImageData || !editorApi) return;
    const { url, name } = pendingImageData;
    const markdownImage = `![${name}](${url})`;
    editorApi.replaceSelection(markdownImage);
    setShowImageModal(false);
    toast.success('이미지가 삽입되었습니다.');
    setPendingImageData(null);
  };

  // 이미지 업로드 커맨드
  const imageUploadCommand: ICommand = {
    name: 'imageUpload',
    keyCommand: 'imageUpload',
    buttonProps: { 'aria-label': 'Add image (ctrl + k)' },
    icon: (
      <svg width="13" height="13" viewBox="0 0 20 20">
        <path
          fill="currentColor"
          d="M15 9c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4-7H1c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1h18c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm-1 13l-6-5-2 2-4-5-4 8V4h16v11z"
        />
      </svg>
    ),
    execute: async (state: TextState, api) => {
      setEditorApi(api);
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];
          const url = await uploadImageFile(file);
          openImageModal(url, file.name);
        }
      };
      input.click();
    },
  };

  useEffect(() => {
    if (markdownId) {
      getNoticeDetail(markdownId);
    }
  }, [markdownId]);

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
                  <AlertDialogTitle>문서를 삭제하시겠습니까?</AlertDialogTitle>
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
                  <AlertDialogTitle>문서를 수정하시겠습니까?</AlertDialogTitle>
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
        <CardContent className="ck-body-2 flex  gap-6">
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
            <MDEditor
              value={editData.content}
              onChange={(value) =>
                setEditData((prev) => ({ ...prev, content: value || '' }))
              }
              height={500}
              preview="live"
              commands={[
                commands.bold,
                commands.italic,
                commands.strikethrough,
                commands.hr,
                commands.heading,
                commands.divider,
                commands.link,
                commands.quote,
                commands.code,
                commands.codeBlock,
                commands.comment,
                commands.divider,
                imageUploadCommand,
                commands.divider,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
                commands.divider,
                commands.help,
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* 이미지 설정 모달 */}
      {showImageModal && (
        <div className="absolute inset-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm">
          <div className="w-96 rounded-lg border bg-white p-6">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                이미지 미리보기
              </label>
              <div className="rounded-lg border bg-gray-50 p-2">
                <img
                  src={pendingImageData?.url}
                  alt={pendingImageData?.name}
                  className="h-auto max-w-full"
                />
              </div>
            </div>
            <div className="mb-6 grid grid-cols-2 gap-4"></div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setPendingImageData(null);
                }}
                className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
              >
                취소
              </button>
              <button
                onClick={insertImage}
                className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                설정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
