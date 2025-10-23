import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Campaign } from '@/services/campaigns/detail/detailType';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { MaskedInput } from '@/components/ui/maskedInput';

export default function CompanyForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<Campaign>();

  return (
    <div className="flex flex-col gap-4">
      <div className="ck-sub-title-1 border-t pt-4">회사 정보</div>
      <div className="grid gap-2">
        <Label htmlFor="companyName">회사 이름</Label>
        <Input
          id="companyName"
          placeholder="회사 이름을 입력하세요"
          {...register('company.companyName')}
        />
      </div>
      <FormField
        control={control}
        name="company.businessRegistrationNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="businessRegistrationNumber">
              사업자 등록 번호
            </FormLabel>
            <FormControl>
              <MaskedInput
                id="businessRegistrationNumber"
                mask="000-00-00000"
                placeholder="000-00-00000"
                value={field.value || ''}
                onAccept={(value: string) => field.onChange(value)}
                inputRef={field.ref}
              />
            </FormControl>
            <FormMessage>
              {errors.company?.businessRegistrationNumber?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      <div className="grid gap-2">
        <Label htmlFor="contactPerson">연락처 이름</Label>
        <Input
          id="contactPerson"
          placeholder="연락처 이름을 입력하세요."
          {...register('company.contactPerson')}
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
                mask="00[0]-000[0]-0000" // 9. 전화번호 마스크
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
    </div>
  );
}
