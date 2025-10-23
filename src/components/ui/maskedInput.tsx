import * as React from 'react';
import { IMaskInput } from 'react-imask';
import { cn } from '@/lib/utils'; // shadcn/ui의 유틸리티 함수

// IMaskInput의 props 타입을 가져옵니다.
type IMaskInputProps = React.ComponentProps<typeof IMaskInput>;

const MaskedInput = React.forwardRef<HTMLInputElement, IMaskInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <IMaskInput
        {...props}
        inputRef={ref} // ref를 IMaskInput에 전달
        // as={Input}을 사용하지 않고,
        // Input 컴포넌트의 스타일을 직접 적용합니다.
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      />
    );
  }
);

MaskedInput.displayName = 'MaskedInput';

export { MaskedInput };
