import { PropsWithChildren } from "react";

import { cn } from "@/lib/utils";
import { Card } from "../ui/card";

interface StepWrapperProps {
  className?: string;
}

const StepWrapper = ({
  children,
  className,
}: PropsWithChildren<StepWrapperProps>) => {
  return (
    <Card className={cn("h-full w-full px-8 pt-4", className)}>{children}</Card>
  );
};

export default StepWrapper;
