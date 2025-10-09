import { useAlertDialog } from '@/components/alertDialog/useAlertDialog';
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
import { getBannersDetail } from '@/services/banners/detail/detailApi';
import { useEditBannerMutation } from '@/services/banners/detail/detailMutation';
import { useQuery } from '@tanstack/react-query';
import { FolderInput } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

export function BannerDetailEditSheet() {
  const { bannerId } = useParams<{ bannerId: string }>();
  // 배너 상세 정보 조회
  const { data: bannerData } = useQuery({
    queryKey: ['bannerDetail', bannerId],
    queryFn: () => getBannersDetail(bannerId!),
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [editBannerData, setEditBannerData] = useState({
    title: bannerData.title,
    bannerUrl: bannerData.bannerUrl,
    redirectUrl: bannerData.redirectUrl,
    description: bannerData.description,
    position: bannerData.position,
    displayOrder: bannerData.displayOrder,
  });
  // 배너 수정 Mutation
  const { mutate: editMutation } = useEditBannerMutation();
  // S3 Url Upload Mutation
  const {
    mutate: urlUploadMutation,
    isPending: isUploading,
    data: presignedUrl,
    reset: resetUrlUpload,
  } = useUrlUploadMutation();

  // 배너 수정 핸들러
  const handleBannerEdit = () => {
    const id = bannerId!;
    const payload = {
      ...editBannerData,
      bannerUrl: presignedUrl || bannerData.bannerUrl,
    };
    editMutation({ id, payload });
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

  // 폼 입력 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditBannerData((prev) => ({ ...prev, [name]: value }));
  };

  // Sheet 닫을 때 초기화
  const handleSheetClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setImageFile(null);
      resetUrlUpload();
    }
  };

  // 수정 Alert Dialog
  const { AlertDialogComponent: EditAlertDialog } = useAlertDialog({
    trigger: <Button type="submit">변경 사항 저장</Button>,
    title: '변경 사항을 저장하시겠습니까?',
    description: '',
    onAlert: handleBannerEdit,
  });

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetClose}>
      <SheetTrigger asChild>
        <Button variant="outline">수정</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>배너 수정</SheetTitle>
          <SheetDescription>
            수정하고 싶은 부분을 수정해주세요.
            <br />
            수정 후 변경 사항 저장 버튼을 눌러주세요.
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
            <Label htmlFor="detailName">배너 이름</Label>
            <Input
              id="detailName"
              name="title"
              value={editBannerData.title}
              onChange={handleInputChange}
              placeholder="배너 이름을 입력하세요."
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="detailName">설명</Label>
            <Input
              id="detailDescription"
              name="description"
              value={editBannerData.description}
              onChange={handleInputChange}
              placeholder="배너 설명을 입력하세요."
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="detailName">Redirect URL</Label>
            <Input
              id="detailRedirectUrl"
              name="redirectUrl"
              value={editBannerData.redirectUrl}
              onChange={handleInputChange}
              placeholder="Redirect URL을 입력하세요."
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="detailName">배너 위치</Label>
            <Input
              id="detailPosition"
              name="position"
              value={editBannerData.position}
              onChange={handleInputChange}
              placeholder="TOP / MIDDLE / BOTTOM / SIDEBAR"
            />
          </div>
        </div>
        <SheetFooter>
          <EditAlertDialog />
          <SheetClose asChild>
            <Button variant="outline">닫기</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
