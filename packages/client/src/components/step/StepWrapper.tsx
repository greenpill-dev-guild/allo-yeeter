import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface StepWrapperProps {
  className?: string;
}

const StepWrapper = ({
  children,
  className,
}: PropsWithChildren<StepWrapperProps>) => {
  return <div className={cn("h-full w-full", className)}>{children}</div>;
};

export default StepWrapper;
