import type { ComponentPropsWithRef } from "react";
import { cn } from "../lib/utils";

export const BackgroundImage = ({
  src,
  fallbackSrc,
  isLoading,
  className,
  ...props
}: {
  src?: string;
  fallbackSrc?: string;
  isLoading?: boolean;
} & ComponentPropsWithRef<"div">) => (
  <div
    {...props}
    className={cn(className, "bg-cover bg-center", {
      ["blur-[40px]"]: fallbackSrc && !src,
      ["animate-pulse bg-gray-100"]: isLoading,
    })}
    style={{ backgroundImage: `url("${src ?? fallbackSrc}")` }}
  />
);
