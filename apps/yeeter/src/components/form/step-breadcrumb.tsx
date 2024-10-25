import { slideDefinitions } from '@/app/slideDefinitions';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
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
}) => (
  <BreadcrumbItem>
    <Link href={url} className="inline-flex items-center gap-2">
      <div
        className={cn(
          'rounded-full text-center aspect-square h-7 items-center justify-center flex',
          active ? 'bg-primary' : 'bg-gray-500',
          'text-foreground',
        )}
      >
        <div className="text-sm text-white">{number}</div>
      </div>
      <div className="text-sm">{text}</div>
    </Link>
  </BreadcrumbItem>
);
const StepBreadcrumb = ({ currentUrl }: { currentUrl: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-4">
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
