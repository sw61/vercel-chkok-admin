import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { CheckCircle, FolderInput } from 'lucide-react';

interface FormHeaderProps {
  imageFile: File | null;
  presignedUrl: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}
export default function FormHeaderSection({
  imageFile,
  presignedUrl,
  handleFileChange,
  isUploading,
}: FormHeaderProps) {
  return (
    <>
      <div>캠페인 수정</div>
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <Button
              className="ck-body-1 bg-ck-white text-ck-gray-900 hover:bg-ck-gray-300 border-1"
              disabled={isUploading}
              asChild
            >
              {/* 버튼 내부 컨텐츠 조건부 렌더링 */}
              {isUploading ? (
                // 1. 업로드 중일 때
                <div className="flex items-center gap-2">
                  <Spinner />
                  업로드 중...
                </div>
              ) : presignedUrl ? (
                // 2. 업로드 완료일 때 (presignedUrl이 존재)
                <div className="text-ck-blue-500 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  업로드 완료
                </div>
              ) : (
                // 3. 기본 상태 (또는 실패 상태)
                <div className="flex gap-2">
                  <FolderInput />
                  썸네일 이미지 수정
                </div>
              )}
            </Button>
          </label>

          {/* 업로드 실패 메시지 (버튼 외부) */}
          {!isUploading && imageFile && !presignedUrl && (
            <span className="ck-body-2 text-ck-red-500">업로드 실패</span>
          )}
        </div>
      </div>
    </>
  );
}
