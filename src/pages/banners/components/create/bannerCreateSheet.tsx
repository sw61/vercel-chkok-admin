import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import { useUrlUploadMutation } from '@/hooks/useImageUrlUpload';
import { useCreateBannerMutation } from '@/services/banners/create/createApi';
import type { BannerData } from '@/services/banners/dragPage/dragType';
import { FolderInput } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface BannerCreateProps {
  bannerData: BannerData[];
}
export function BannerCreateSheet({ bannerData }: BannerCreateProps) {
  // 배너 생성 mutation
  const { mutate: createMutation, isPending: isCreating } =
    useCreateBannerMutation();
  // S3 Url Upload Mutation
  const {
    mutate: urlUploadMutation,
    isPending: isUploading,
    data: presignedUrl,
    reset: resetUrlUpload,
  } = useUrlUploadMutation();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [createBannerData, setCreateBannerData] = useState({
    redirectUrl: '',
    title: '',
    description: '',
    position: '',
  });
  const isFormValid = () =>
    createBannerData.title &&
    createBannerData.description &&
    createBannerData.redirectUrl &&
    createBannerData.position &&
    presignedUrl;

  // 배너 생성 핸들러
  const handleCreateBanner = () => {
    createMutation({
      ...createBannerData,
      bannerUrl: presignedUrl,
      displayOrder: bannerData.length + 1,
    });
  };
  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCreateBannerData((prev) => ({ ...prev, [name]: value }));
  };

  // 파일 입력 핸들러
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    if (file && !file.type.startsWith('image/')) {
      toast.error('이미지 파일만 업로드 가능합니다.');
      return;
    }
    if (file) {
      setImageFile(file);
      // 파일 선택 즉시 업로드 시작
      urlUploadMutation(file);
    }
  };
  // 생성 폼 초기화
  const resetForm = () => {
    setImageFile(null);
    setCreateBannerData({
      redirectUrl: '',
      title: '',
      description: '',
      position: '',
    });
    resetUrlUpload();
  };
  // Sheet 닫을 때 초기화
  const handleSheetClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetClose}>
      <SheetTrigger asChild>
        <Button variant="outline">배너 추가</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="ck-title">배너 추가</SheetTitle>
          <SheetDescription className="ck-body-2">
            배너를 추가하기 위해 아래 목록에 기입해주세요.
            <br />
            배너 생성 버튼을 눌러 배너를 생성해주세요.
          </SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <input
                id="file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <Button
                  className="ck-body-1 bg-ck-white text-ck-gray-900 hover:bg-ck-gray-300 border-1"
                  disabled={isUploading}
                  asChild
                >
                  <div className="flex gap-2">
                    <FolderInput />
                    이미지 선택
                  </div>
                </Button>
              </label>
              {/* 선택된 파일 이름 및 업로드 상태 표시 */}
              {isUploading && (
                <div className="ck-body-2 flex items-center gap-2">
                  <div>
                    <Spinner />
                  </div>
                  <div className="text-ck-gray-700 text-center">
                    업로드 중...
                  </div>
                </div>
              )}
              {!isUploading && imageFile && !presignedUrl && (
                <span className="ck-body-2 text-ck-red-500">
                  선택됨: {imageFile.name}
                  (업로드 실패)
                </span>
              )}
              {!isUploading && presignedUrl && (
                <span className="ck-body-2 text-ck-blue-500">업로드 완료</span>
              )}
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="bannerName">배너 이름</Label>
            <Input
              id="bannerName"
              name="title"
              value={createBannerData.title}
              placeholder="배너 이름을 입력하세요"
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="bannerDescription">설명</Label>
            <Input
              id="bannerDescription"
              name="description"
              value={createBannerData.description}
              onChange={handleInputChange}
              placeholder="설명을 입력하세요"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="bannerRedirectUrl">Redirect URL</Label>
            <Input
              id="bannerRedirectUrl"
              name="redirectUrl"
              value={createBannerData.redirectUrl}
              onChange={handleInputChange}
              placeholder="Redirect URL을 입력하세요"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="bannerPosition">배너 위치</Label>
            <Input
              id="bannerPosition"
              name="position"
              value={createBannerData.position}
              onChange={handleInputChange}
              placeholder="TOP / MIDDLE / BOTTOM / SIDEBAR"
            />
          </div>
        </div>
        <SheetFooter>
          <Button
            type="submit"
            onClick={handleCreateBanner}
            disabled={!isFormValid() || isCreating}
          >
            {isCreating ? (
              <>
                <Spinner />
                생성 중...
              </>
            ) : (
              '배너 생성'
            )}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
