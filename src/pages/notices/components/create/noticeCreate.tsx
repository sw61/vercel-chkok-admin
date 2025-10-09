import { useState, useRef } from 'react';
import axiosInterceptor from '@/lib/axiosInterceptors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import TuiEditor from '@/components/markdown/editor/toastUiEditor';
import { useAddImage } from '@/hooks/useAddImage';
import { Editor } from '@toast-ui/react-editor';
import { toast } from 'sonner';

export default function NoticeCreate() {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isMust, setIsMust] = useState<boolean>(false);
  const navigate = useNavigate();
  const editorRef = useRef<Editor | null>(null);
  const { imageHandler } = useAddImage();

  const createNotice = async () => {
    if (!title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!editorRef.current?.getInstance().getMarkdown()) {
      toast.error('내용을 입력해주세요.');
      return;
    }

    try {
      const html = editorRef.current.getInstance().getHTML();
      await axiosInterceptor.post('/api/admin/notices', {
        title,
        content: html,
        isMust,
      });
      toast.success('문서가 생성되었습니다.');
      navigate('/notices');
    } catch (error) {
      console.error('문서 생성 오류:', error);
      toast.error('문서 생성에 실패했습니다.');
    }
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
              <div className="mb-2 flex items-center justify-between">
                <div className="ck-body-2 flex flex-col justify-end">제목</div>
                <div className="flex gap-4">
                  <Button
                    onClick={() => navigate('/notices')}
                    variant="outline"
                  >
                    취소
                  </Button>
                  <Button onClick={createNotice} variant="outline">
                    생성
                  </Button>
                </div>
              </div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full"
              />
            </div>

            <div className="mb-4 flex items-center gap-2">
              <Checkbox
                id="isMust"
                checked={isMust}
                onCheckedChange={(checked) => setIsMust(checked as boolean)}
              />
              <label
                htmlFor="isMust"
                className="text-ck-gray-700 text-sm font-medium"
              >
                중요 공지사항
              </label>
            </div>

            <TuiEditor
              content={content}
              editorRef={editorRef}
              imageHandler={imageHandler}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
