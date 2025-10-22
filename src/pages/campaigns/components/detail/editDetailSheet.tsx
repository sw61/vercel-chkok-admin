// import { DatePicker } from '@/components/datePicker/datePicker';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useUrlUploadMutation } from '@/hooks/useImageUrlUpload';
import { getCampaignDetail } from '@/services/campaigns/detail/detailApi';
import { useCampaignUpdateMutation } from '@/services/campaigns/detail/detailMutation';
import type {
  Campaign,
  CampaignFormData,
} from '@/services/campaigns/detail/detailType';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { FormProvider, useForm } from 'react-hook-form';

import CampaignFormSection from './edit/campaignForm';
import FormHeaderSection from './edit/formHeader';
import LocationFormSection from './edit/locationForm';
import MissionInfoForm from './edit/missionInfoForm';
import CompanyForm from './edit/companyForm';

export default function EditCampaignDetailSheet() {
  const { campaignId } = useParams<{ campaignId: string }>();
  // data fetch
  const { data: campaignData } = useSuspenseQuery<Campaign>({
    queryKey: ['campaignDetail', campaignId],
    queryFn: () => getCampaignDetail(campaignId!),
  });
  // react-hook-form

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

  const stringToArray = (value: string): string[] => {
    if (typeof value !== 'string' || !value) return [];
    return value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean); // 빈 문자열 제거
  };
  // defaultValues 및 reset에 사용할 변환 함수 (array -> string)
  const arrayToString = (value: string[]): string => {
    return Array.isArray(value) ? value.join(', ') : '';
  };
  const formDefaultValues: CampaignFormData = {
    ...campaignData,
    missionInfo: {
      ...campaignData.missionInfo,
      // 배열을 쉼표로 구분된 문자열로 변환
      titleKeywords: arrayToString(campaignData.missionInfo.titleKeywords),
      bodyKeywords: arrayToString(campaignData.missionInfo.bodyKeywords),
    },
  };
  const methods = useForm<CampaignFormData>({
    defaultValues: formDefaultValues,
  });
  // Form 제출 핸들러
  const onValid = (data: CampaignFormData) => {
    const id = campaignId!;
    const payload: Campaign = {
      ...data,
      missionInfo: {
        ...data.missionInfo,
        titleKeywords: stringToArray(data.missionInfo.titleKeywords),
        bodyKeywords: stringToArray(data.missionInfo.bodyKeywords),
      },
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
      methods.reset(formDefaultValues);
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
        <SheetHeader>
          <SheetTitle className="ck-title flex items-center justify-between pr-6">
            <FormHeaderSection
              imageFile={imageFile}
              presignedUrl={presignedUrl}
              handleFileChange={handleFileChange}
              isUploading={isUploading}
            />
          </SheetTitle>
          <SheetDescription>
            수정 후 변경 사항 저장 버튼을 눌러주세요.
          </SheetDescription>
        </SheetHeader>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onValid)}
            className="flex flex-1 flex-col overflow-hidden"
          >
            <div className="flex flex-col gap-6 overflow-y-auto px-4">
              <div className="flex flex-col gap-4">
                <CampaignFormSection />
                <MissionInfoForm />
                <LocationFormSection />
                <CompanyForm />
                {/* <DatePicker /> */}
              </div>
            </div>
            <SheetFooter>
              <Button type="submit" disabled={isUploading}>
                변경 사항 저장
              </Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
