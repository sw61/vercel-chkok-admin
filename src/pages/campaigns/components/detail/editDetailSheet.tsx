import { DatePicker } from '@/components/datePicker/datePicker';
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
import { Textarea } from '@/components/ui/textarea';
import { useUrlUploadMutation } from '@/hooks/useImageUrlUpload';
import { getCampaignDetail } from '@/services/campaigns/detail/detailApi';
import { useCampaignUpdateMutation } from '@/services/campaigns/detail/detailMutation';
import type { Campaign } from '@/services/campaigns/detail/detailType';
import { useSuspenseQuery } from '@tanstack/react-query';
import { FolderInput } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';

export default function EditCampaignDetailSheet() {
  const { campaignId } = useParams<{ campaignId: string }>();

  const { data: campaignData } = useSuspenseQuery<Campaign>({
    queryKey: ['campaignDetail', campaignId],
    queryFn: () => getCampaignDetail(campaignId!),
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Campaign>({
    defaultValues: campaignData,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // 캠페인 수정 Mutation
  const { mutate: editMutation } = useCampaignUpdateMutation();
  // S3 Url Upload Mutation
  const {
    mutate: urlUploadMutation,
    isPending: isUploading,
    data: presignedUrl,
    reset: resetUrlUpload,
  } = useUrlUploadMutation();

  // Form 제출 핸들러
  const onValid = (data: Campaign) => {
    const id = campaignId!;
    const payload = {
      ...data,
      thumbnailUrl: presignedUrl || campaignData.thumbnailUrl,
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

  // Sheet 닫을 때 초기화
  const handleSheetClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset(campaignData);
      setImageFile(null);
      resetUrlUpload();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleSheetClose}>
      <SheetTrigger asChild>
        <Button variant="outline">수정</Button>
      </SheetTrigger>
      <SheetContent>
        <form onSubmit={handleSubmit(onValid)}>
          <SheetHeader>
            <SheetTitle className="ck-title flex items-center justify-between pr-6">
              <div>배너 수정</div>
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
                        썸네일 이미지 수정
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
                    <span className="ck-body-2 text-ck-blue-500">
                      업로드 완료
                    </span>
                  )}
                </div>
              </div>
            </SheetTitle>
            <SheetDescription>
              수정 후 변경 사항 저장 버튼을 눌러주세요.
            </SheetDescription>
          </SheetHeader>
          <div className="flex flex-col gap-6 px-4">
            <div className="flex flex-col gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">캠페인 제목</Label>
                <Input
                  id="title"
                  placeholder="캠페인 제목을 입력하세요."
                  {...register('title', {
                    required: '캠페인 제목은 필수입니다.',
                  })}
                />
                {/* 에러 메시지 표시 */}
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="productShortInfo">설명</Label>
                <Input
                  id="productShortInfo"
                  placeholder="제품 정보를 입력하세요."
                  {...register('productShortInfo')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="selectionCriteria">선정 기준</Label>
                <Input
                  id="selectionCriteria"
                  placeholder="선정 기준을 입력하세요."
                  {...register('selectionCriteria')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="titleKeywords">제목 키워드</Label>
                <Textarea
                  id="titleKeywords"
                  placeholder="제목 키워드를 입력하세요"
                  {...register('missionInfo.titleKeywords')}
                />
                <div className="text-ck-gray-600 ck-caption-1">
                  * 키워드를 쉼표(,)로 구분하여 입력해주세요.
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bodyKeywords">본문 키워드</Label>
                <Textarea
                  id="bodyKeywords"
                  placeholder="본문 키워드를 입력하세요."
                  {...register('missionInfo.bodyKeywords')}
                />
                <div className="text-ck-gray-600 ck-caption-1">
                  * 키워드를 쉼표(,)로 구분하여 입력해주세요.
                </div>
              </div>
              <DatePicker />
            </div>
          </div>
        </form>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleCampaignEdit}>
              변경 사항 저장
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
