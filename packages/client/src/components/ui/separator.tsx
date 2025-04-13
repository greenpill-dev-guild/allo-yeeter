'use client';

import * as React from 'react';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import { cn } from '@/lib/utils';

type Orientation = 'horizontal' | 'vertical';

interface SeparatorProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  label?: string;
  dashed?: boolean;
  orientation?: Orientation;
}

const styles = {
  horizontal: {
    base: 'h-[1px] w-full',
    dashed:
      'bg-[linear-gradient(to_right,transparent_50%,hsl(var(--border))_50%)] bg-[length:8px_1px]',
    label: 'h-[1px] px-2 py-1',
  },
  vertical: {
    base: 'h-full w-[1px]',
    dashed:
      'bg-[linear-gradient(to_bottom,transparent_50%,hsl(var(--border))_50%)] bg-[length:1px_8px]',
    label: 'w-[1px] px-1 py-2',
  },
};

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
      dashed = false,
      ...props
    },
    ref,
  ) => {
    const baseStyles = cn(
      'shrink-0 relative',
      styles[orientation].base,
      dashed ? styles[orientation].dashed : 'bg-border',
    );

    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative}
        orientation={orientation}
        className={cn(baseStyles, className)}
        {...props}
      >
        {label && (
          <span
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'bg-background text-xs text-muted-foreground',
              'flex items-center justify-center',
              styles[orientation].label,
            )}
          >
            {label}
          </span>
        )}
      </SeparatorPrimitive.Root>
    );
  },
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
