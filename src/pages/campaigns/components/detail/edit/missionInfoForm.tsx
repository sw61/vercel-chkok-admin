import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Campaign } from '@/services/campaigns/detail/detailType';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/datePicker/datePicker';
import { format } from 'date-fns';

export default function MissionInfoForm() {
  const {
    register,
    control,
    watch,
    // formState: { errors },
  } = useFormContext<Campaign>();
  const isAlwaysOpen = watch('isAlwaysOpen');
  return (
    <div className="flex flex-col gap-4">
      <div className="ck-sub-title-1 border-t pt-4">미션 정보</div>
      <div className="grid gap-2">
        <Label htmlFor="titleKeywords">제목 키워드</Label>
        <Textarea
          id="titleKeywords"
          placeholder="제목 키워드를 쉼표(,)로 구분하여 입력하세요"
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
          placeholder="본문 키워드를 쉼표(,)로 구분하여 입력하세요."
          {...register('missionInfo.bodyKeywords')}
        />
        <div className="text-ck-gray-600 ck-caption-1">
          * 키워드를 쉼표(,)로 구분하여 입력해주세요.
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="numberOfVideo">비디오 수</Label>
        <Input
          id="numberOfVideo"
          placeholder="비디오 수를 입력하세요."
          {...register('missionInfo.numberOfVideo')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="numberOfImage">이미지 수</Label>
        <Input
          id="numberOfImage"
          placeholder="이미지 수를 입력하세요."
          {...register('missionInfo.numberOfImage')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="numberOfText">텍스트 수</Label>
        <Input
          id="numberOfText"
          placeholder="텍스트 수를 입력하세요."
          {...register('missionInfo.numberOfText')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="missionGuide">미션 가이드</Label>
        <Textarea
          id="missionGuide"
          placeholder="선정 기준을 입력하세요."
          {...register('missionInfo.missionGuide')}
        />
      </div>
      {!isAlwaysOpen && (
        <>
          {' '}
          <FormField
            control={control}
            name="missionInfo.missionStartDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>미션 시작일</FormLabel>
                <FormControl>
                  <DatePicker
                    className="w-full"
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) =>
                      field.onChange(
                        date ? format(date, 'yyyy-MM-dd') : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="missionInfo.missionDeadlineDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>미션 종료일</FormLabel>
                <FormControl>
                  <DatePicker
                    className="w-full"
                    date={field.value ? new Date(field.value) : undefined}
                    setDate={(date) =>
                      field.onChange(
                        date ? format(date, 'yyyy-MM-dd') : undefined
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
