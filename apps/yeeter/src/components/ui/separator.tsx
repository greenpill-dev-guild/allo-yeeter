'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

import { cn } from '@/lib/utils';

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: string;
}

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  SeparatorProps
>(
  (
    {
      className,
      orientation = 'horizontal',
      decorative = true,
      label,
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 bg-border relative',
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        className,
      )}
      {...props}
    >
      {label && (
        <span
          className={cn(
            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background text-xs text-muted-foreground flex items-center justify-center',
            orientation === 'horizontal'
              ? 'h-[1px] px-2 py-1'
              : 'w-[1px] px-1 py-2',
          )}
        >
          {label}
        </span>
      )}
    </SeparatorPrimitive.Root>
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
