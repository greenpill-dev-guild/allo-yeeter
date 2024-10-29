'use client';

import { slideDefinitions } from '@/app/slideDefinitions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useSelectedToken } from '@/hooks/useSelectedToken';
import { cn } from '@/lib/utils';
import { useFormStore } from '@/store/form';
import { RiCheckLine } from '@remixicon/react';
import Link from 'next/link';
import { Fragment } from 'react';

const Step = ({
  number,
  text,
  url,
  active = false,
}: {
  number: number;
  text: string;
  url: string;
  active?: boolean;
}) => {
  const formState = useFormStore(state => state);
  const token = useSelectedToken();
  const completionStatus = [
    // recipients
    formState.addresses.length > 0 && formState.addresses[0],
    // token
    token?.address && formState.network > 0,
    // amount
    formState.amount > 0,
  ];

  return (
    <BreadcrumbItem>
      <Link href={url} className="inline-flex items-center gap-2">
        <div
          className={cn(
            'rounded-full text-center aspect-square h-7 items-center justify-center flex',
            active || completionStatus[number - 1]
              ? 'bg-primary'
              : 'bg-gray-500',
            'text-foreground',
          )}
        >
          {completionStatus[number - 1] ? (
            <RiCheckLine className="w-4 h-4" />
          ) : (
            <div className="text-sm text-white">{number}</div>
          )}
        </div>
        <div className="text-sm">{text}</div>
      </Link>
    </BreadcrumbItem>
  );
};
const StepBreadcrumb = ({ currentUrl }: { currentUrl: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-4 justify-center">
        {slideDefinitions.map((slide, index) => {
          return (
            <Fragment key={slide.title}>
              <Step
                number={index + 1}
                text={slide.shortTitle}
                url={slide.url}
                active={currentUrl === slide.url}
              />
              {index !== slideDefinitions.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default StepBreadcrumb;
