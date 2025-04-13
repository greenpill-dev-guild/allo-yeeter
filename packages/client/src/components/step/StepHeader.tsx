import { SlideDefinition } from "@/components/step/slideDefinitions";
import { Separator } from "@/components/ui/separator";

interface StepHeaderProps {
  slide: SlideDefinition;
}

const StepHeader = ({ slide }: StepHeaderProps) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="inset-0 bg-avatar-ring rounded-full p-4">
        <div className="relative bg-background rounded-full p-2 border">
          {slide.icon}
        </div>
      </div>
      <h3 className="text-3xl font-semibold tracking-tight">{slide.title}</h3>
      {/* <span className="text-muted-foreground">{slide.subtitle}</span> */}
    </div>
  );
};

export default StepHeader;
