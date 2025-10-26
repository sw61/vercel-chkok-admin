import { useState, useRef } from 'react';
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
import { useCreateNoticeMutation } from '@/services/notices/create/createApi';

export default function NoticeCreate() {
  const [title, setTitle] = useState<string>('');
  const [isMust, setIsMust] = useState<boolean>(false);
  const navigate = useNavigate();
  const editorRef = useRef<Editor | null>(null);
  const { imageHandler } = useAddImage();
  const { mutate: createMutation } = useCreateNoticeMutation();
  const handleCreateNotice = () => {
    if (!title) {
      toast.error('제목을 입력해주세요.');
      return;
    }
    if (!editorRef.current?.getInstance().getMarkdown()) {
      toast.error('내용을 입력해주세요.');
      return;
    }
    const markdownContent = editorRef.current.getInstance().getMarkdown() || '';
    const payload = {
      title,
      content: markdownContent,
      isMust,
    };

    createMutation(payload);
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <ChevronLeft
          onClick={() => window.history.back()}
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
                  <Button onClick={handleCreateNotice} variant="outline">
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
            <div className="w-full">
              <TuiEditor editorRef={editorRef} imageHandler={imageHandler} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
