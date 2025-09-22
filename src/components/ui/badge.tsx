import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'ck-caption-1 inline-flex items-center justify-center rounded-md  px-2 py-0.5   whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        blue: 'text-ck-blue-800 bg-ck-blue-100  px-3 py-1',
        블로그: 'text-green-500 bg-green-100',
        유튜브: 'text-ck-red-500 bg-ck-red-100',
        인스타그램: 'text-pink-500 bg-pink-100',
        틱톡: 'text-white bg-black',
        클라이언트:
          'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        사용자: 'text-green-500 bg-green-100',
        관리자: 'text-ck-red-500 bg-ck-red-100',
        승인됨: 'bg-ck-blue-500 text-white',
        대기중: 'bg-yellow-500 text-white',
        거절됨: 'bg-ck-red-500 text-white',
        type: 'bg-white text-ck-gray-900 border',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
