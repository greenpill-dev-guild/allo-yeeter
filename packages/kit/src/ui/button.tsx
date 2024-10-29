import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { LoaderIcon, LucideIcon } from "lucide-react";

import { cn } from "../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border shadow-button bg-button text-primary-foreground hover:bg-primary/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        success: "bg-success text-success-foreground hover:bg-success/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground bg-secondary text-muted-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        xs: "h-8 rounded-full text-xs px-2",
        sm: "h-9 rounded-full px-3",
        lg: "h-11 rounded-full px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  icon?: React.ComponentType;
  iconLeft?: React.ComponentType;
  iconRight?: LucideIcon | React.ComponentType<{ className: string }>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant,
      size,
      asChild = false,
      isLoading,
      icon,
      iconLeft,
      iconRight: RightIcon,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const LeftIcon = isLoading ? LoaderIcon : icon || iconLeft;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        <>
          {LeftIcon && (
            <LeftIcon
              className={cn("size-4", {
                ["mr-2"]: children,
                ["animate-spin"]: isLoading,
              })}
            />
          )}
          {children}
          {RightIcon && (
            <RightIcon className={cn("size-4", { ["ml-2"]: children })} />
          )}
        </>
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
