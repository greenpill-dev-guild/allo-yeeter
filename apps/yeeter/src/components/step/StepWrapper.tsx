import { PropsWithChildren } from 'react';
import { SlideDefinition } from '@/app/slideDefinitions';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import StepHeader from './StepHeader';

interface StepWrapperProps {
  className?: string;
}

const StepWrapper = ({
  children,
  className,
}: PropsWithChildren<StepWrapperProps>) => {
  return (
    <Card
      className={cn(
        'h-full w-full flex flex-col max-w-screen-sm mx-auto overflow-y-scroll px-12 py-8',
        className,
      )}
    >
      {children}
    </Card>
  );
};

export default StepWrapper;
