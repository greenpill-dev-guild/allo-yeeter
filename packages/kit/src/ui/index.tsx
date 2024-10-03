import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

type Variants<T> = Parameters<typeof cva<T>>[1];

/*

Utility function to create components

const Button = createComponent("button", "base-classes-here rounded p-2", {
  variants: { variant: { default: "bg-blue-200" } }
})

*/

export function createComponent<T extends { variant: Record<string, any> }>(
  tag = "div",
  className = "",
  config?: Variants<T>,
) {
  const variants = cva(className, { ...config });

  const Component = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants>
  >(({ className, variant, ...props }, ref) =>
    React.createElement(tag, {
      ref,
      className: cn(variants({ variant }), className),
      ...props,
    }),
  );
  Component.displayName = "Component";

  return (
    props: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof variants>,
  ) => <Component {...props} />;
}
