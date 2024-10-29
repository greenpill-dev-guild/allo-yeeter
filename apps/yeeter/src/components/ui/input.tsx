import * as React from 'react';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { RemixiconComponentType } from '@remixicon/react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: RemixiconComponentType;
  endIcon?: RemixiconComponentType;
  onEndIconClick?: () => void;
  onStartIconClick?: () => void;
  endContent?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      startIcon,
      endIcon,
      onEndIconClick,
      onStartIconClick,
      endContent,
      ...props
    },
    ref,
  ) => {
    const StartIcon = startIcon;
    const EndIcon = endIcon;

    return (
      <div className="w-full relative rounded-full overflow-hidden">
        {StartIcon && (
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
            <StartIcon
              size={18}
              className="text-muted-foreground"
              onClick={onStartIconClick}
            />
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex h-14 w-full rounded-full border border-input bg-background py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
            startIcon ? 'pl-12' : 'pl-4',
            endIcon ? 'pr-14' : 'pr-4',
            className,
          )}
          ref={ref}
          {...props}
        />
        {endContent && (
          <div className="absolute right-0 top-0 bottom-0">{endContent}</div>
        )}
        {EndIcon && (
          <div className="absolute right-5 top-1/2 transform -translate-y-1/2">
            <EndIcon
              className="text-muted-foreground"
              size={18}
              onClick={onEndIconClick}
            />
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
