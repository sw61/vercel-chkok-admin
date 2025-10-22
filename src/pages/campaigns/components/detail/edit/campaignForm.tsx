import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Campaign } from '@/services/campaigns/detail/detailType';
import { Textarea } from '@/components/ui/textarea';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/datePicker/datePicker';

export default function CampaignFormSection() {
  const {
    register,
    control,
    watch, // <--- Select 연동에 필요
    // formState: { errors },
  } = useFormContext<Campaign>();
  const isAlwaysOpen = watch('isAlwaysOpen');
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="ck-sub-title-1">캠페인 정보</div>
        <FormField
          control={control}
          name="isAlwaysOpen"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <label
                htmlFor="isAlwaysOpen"
                className="text-ck-gray-700 text-sm font-medium"
              >
                상시 캠페인
              </label>
              <FormControl>
                <Checkbox
                  id="isAlwaysOpen"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name="campaignType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>캠페인 상태</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="캠페인 상태를 선택하세요" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="블로그">블로그</SelectItem>
                <SelectItem value="유튜브">유튜브</SelectItem>
                <SelectItem value="인스타그램">인스타그램</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="category.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>캠페인 타입</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="캠페인 타입을 선택하세요" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="방문">방문형</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="category.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>카테고리 이름</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || ''}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="카테고리 이름을 선택하세요" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="맛집">맛집</SelectItem>
                <SelectItem value="카페">카페</SelectItem>
                <SelectItem value="뷰티">뷰티</SelectItem>
                <SelectItem value="숙박">숙박</SelectItem>
                <SelectItem value="식품">식품</SelectItem>
                <SelectItem value="화장품">화장품</SelectItem>
                <SelectItem value="생활용품">생활용품</SelectItem>
                <SelectItem value="패션">패션</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid gap-2">
        <Label htmlFor="title">캠페인 제목</Label>
        <Input
          id="title"
          placeholder="캠페인 제목을 입력하세요."
          {...register('title', {
            required: '캠페인 제목은 필수입니다.',
          })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="productShortInfo">간단 정보</Label>
        <Input
          id="productShortInfo"
          placeholder="간단 정보를 입력하세요."
          {...register('productShortInfo')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="productDetails">상세 정보</Label>
        <Textarea
          id="productDetails"
          placeholder="상세 정보를 입력하세요."
          {...register('productDetails')}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="selectionCriteria">선정 기준</Label>
        <Textarea
          id="selectionCriteria"
          placeholder="선정 기준을 입력하세요."
          {...register('selectionCriteria')}
        />
      </div>
      {!isAlwaysOpen && (
        <div className="grid gap-2">
          <Label htmlFor="maxApplicants">최대 신청자 수</Label>
          <Input
            id="maxApplicants"
            placeholder="최대 신청자 수를 입력하세요."
            {...register('maxApplicants')}
          />
        </div>
      )}
      <FormField
        control={control}
        name="recruitmentStartDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>모집 시작일</FormLabel>
            <FormControl>
              <DatePicker
                className="w-full"
                date={field.value ? new Date(field.value) : undefined}
                setDate={(date) =>
                  field.onChange(date ? format(date, 'yyyy-MM-dd') : undefined)
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {!isAlwaysOpen && (
        <>
          <FormField
            control={control}
            name="recruitmentEndDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>모집 마감일</FormLabel>
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
            name="selectionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>체험단 선정일</FormLabel>
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
