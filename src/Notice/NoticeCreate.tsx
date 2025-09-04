import { useState } from 'react';
import MDEditor, {
  commands,
  type ICommand,
  type TextState,
} from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import { toast } from 'react-toastify';
import axiosInterceptor from '@/lib/axios-interceptors';
import axios from 'axios';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import { renderToStaticMarkup } from 'react-dom/server';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export default function NoticeCreate() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string | undefined>('');
  const [isMust, setIsMust] = useState<boolean>(false); // isMust 상태 추가
  const [showImageSizeModal, setShowImageSizeModal] = useState<boolean>(false);
  const [pendingImageData, setPendingImageData] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editorApi, setEditorApi] = useState<any>(null);
  const navigate = useNavigate();

  const createNotice = async () => {
    if (!title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!content) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    // HTML 생성
    const markdownComponent = (
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    );
    const html = renderToStaticMarkup(markdownComponent);

    try {
      console.log('전송 데이터:', { title, content: html, isMust });
      const response = await axiosInterceptor.post('/api/admin/notices', {
        title,
        content: html,
        isMust,
      });
      console.log('API 응답:', response);
      toast.success('문서가 생성되었습니다.');
      navigate('/notices');
    } catch (error) {
      console.error('문서 생성 오류:', error);
      toast.error('문서 생성에 실패했습니다.');
    }
  };

  // 파일을 직접 받아서 S3 업로드 처리하는 함수
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
        headers: {
          'Content-Type': contentType,
        },
      });
      return presignedUrl;
    } catch (error: unknown) {
      toast.error('이미지 업로드에 실패했습니다.');
      throw error;
    }
  };

  // 이미지 크기 설정 모달을 열고 이미지 데이터를 저장
  const openImageSizeModal = (url: string, name: string) => {
    setPendingImageData({ url, name });
    setShowImageSizeModal(true);
  };

  // 이미지 크기 설정 완료 후 마크다운에 삽입
  const insertImageWithSize = () => {
    if (!pendingImageData || !editorApi) return;

    const { url, name } = pendingImageData;

    // HTML img 태그를 사용하여 크기 지정
    const markdownImage = `![${name}](${url})`;
    editorApi.replaceSelection(markdownImage);

    // 모달 닫기 및 상태 초기화
    setShowImageSizeModal(false);
    toast.success('이미지가 삽입 되었습니다.');
    setPendingImageData(null);
  };

  // 커스텀 이미지 업로드 커맨드
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
      // 에디터 API 저장
      setEditorApi(api);

      // 파일 선택 input 생성
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files && input.files[0]) {
          const file = input.files[0];

          // 파일을 직접 처리하여 S3 업로드
          const url = await uploadImageFile(file);

          // 이미지 크기 설정 모달 열기
          openImageSizeModal(url, file.name);
        }
      };
      input.click();
    },
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => navigate('/notices')}
          className="cursor-pointer"
        />
      </div>
      <Card>
        <div className="flex flex-col items-center px-6">
          <div className="w-full" data-color-mode="light">
            <div className="mb-4">
              <div className="mb-2 flex justify-between items-center">
                <div className="ck-body-2 flex flex-col justify-end">제목</div>
                <Button
                  onClick={createNotice}
                  className="px-4 py-2"
                  variant="outline"
                >
                  생성
                </Button>
              </div>

              <Input
                value={title}
                onChange={(e) => setTitle(() => e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full"
              />
            </div>

            {/* isMust 체크박스 추가 */}
            <div className="mb-4 flex items-center gap-2">
              <Checkbox
                id="isMust"
                checked={isMust}
                onCheckedChange={(checked) => setIsMust(checked as boolean)}
              />
              <label
                htmlFor="isMust"
                className="text-sm font-medium text-ck-gray-700"
              >
                중요 공지사항
              </label>
            </div>

            <MDEditor
              value={content}
              onChange={setContent}
              height={700}
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
                imageUploadCommand, // 커스텀 이미지 추가 버튼
                commands.divider,
                commands.unorderedListCommand,
                commands.orderedListCommand,
                commands.checkedListCommand,
                commands.divider,
                commands.help,
              ]}
            />
          </div>

          {/* 이미지 크기 설정 모달 */}
          {showImageSizeModal && (
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
                      setShowImageSizeModal(false);
                      setPendingImageData(null);
                    }}
                    className="flex-1 rounded-md bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
                  >
                    취소
                  </button>
                  <button
                    onClick={insertImageWithSize}
                    className="flex-1 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                  >
                    설정
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
