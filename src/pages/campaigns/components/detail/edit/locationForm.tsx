import { useState } from 'react'; // 1. useState 임포트
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { Campaign } from '@/services/campaigns/detail/detailType';
import { Textarea } from '@/components/ui/textarea';
import SearchMapModal from '@/pages/articles/components/searchMapModal';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MaskedInput } from '@/components/ui/maskedInput';

export default function LocationFormSection() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<Campaign>();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // 모달에서 주소를 선택했을 때 실행될 핸들러
  const handleSelectLocation = (data: {
    roadAddr: string;
    lat: number;
    lng: number;
  }) => {
    setValue('location.businessAddress', data.roadAddr, {
      shouldValidate: true,
    });
    setValue('location.latitude', data.lat, { shouldValidate: true });
    setValue('location.longitude', data.lng, { shouldValidate: true });
    setIsModalOpen(false);
  };

  // 선택 없이 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="ck-sub-title-1 border-t pt-4">방문 정보</div>
        <div className="grid gap-2">
          <Label htmlFor="businessAddress">위치 정보</Label>
          <Input
            id="selectionCriteria"
            placeholder="클릭하여 위치 검색"
            {...register('location.businessAddress')}
            onClick={() => setIsModalOpen(true)}
            readOnly
            className="cursor-pointer"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="businessDetailAddress">위치 상세 정보</Label>
          <Input
            id="businessDetailAddress"
            placeholder="위치 상세 정보를 입력하세요."
            {...register('location.businessDetailAddress')}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="homepage">홈페이지</Label>
          <Input
            id="homepage"
            placeholder="https://chkok.kr"
            {...register('location.homepage')}
          />
        </div>
        <FormField
          control={control}
          name="company.phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="phoneNumber">연락처 번호</FormLabel>
              <FormControl>
                <MaskedInput
                  id="phoneNumber"
                  mask="00[0]-000[0]-0000"
                  placeholder="010-XXXX-XXXX"
                  value={field.value || ''}
                  onAccept={(value: string) => field.onChange(value)}
                  inputRef={field.ref}
                />
              </FormControl>
              <FormMessage>{errors.company?.phoneNumber?.message}</FormMessage>
            </FormItem>
          )}
        />
        <div className="grid gap-2">
          <Label htmlFor="visitAndReservationInfo">방문 및 예약 안내</Label>
          <Textarea
            id="visitAndReservationInfo"
            placeholder="방문 및 예약 안내를 입력하세요."
            {...register('location.visitAndReservationInfo')}
          />
        </div>
      </div>

      {/* 5. 모달 조건부 렌더링 */}
      {isModalOpen && (
        <SearchMapModal
          handleMapSelect={handleSelectLocation}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
}
