import type { ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "../lib/utils";

export function Markdown({
  className,
  ...props
}: ComponentProps<typeof ReactMarkdown>) {
  return (
    <ReactMarkdown className={cn("prose max-w-full", className)} {...props} />
  );
}
