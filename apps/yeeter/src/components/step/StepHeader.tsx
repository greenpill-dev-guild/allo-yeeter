import { SlideDefinition } from '@/app/slideDefinitions';
import { Separator } from '@/components/ui/separator';

interface StepHeaderProps {
  slide: SlideDefinition;
}

const StepHeader = ({ slide }: StepHeaderProps) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="inset-0 bg-gradient-to-b from-primary/20 to-secondary/20 rounded-full p-6">
        <div className="relative bg-background rounded-full p-7 border">
          {slide.icon}
        </div>
      </div>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
        {slide.title}
      </h3>
      <span className="text-muted-foreground">{slide.subtitle}</span>
    </div>
  );
};

export default StepHeader;
