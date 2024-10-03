import type { Application } from "../api/types";
import { cn } from "../lib/utils";
import { Badge } from "../ui/badge";

export function ApplicationStatusBadge({
  status,
}: {
  status?: Application["status"];
}) {
  if (!status) return null;
  return (
    <Badge variant={statusMap[status]} className={cn("capitalize")}>
      {status.toLowerCase()}
    </Badge>
  );
}

const statusMap = {
  APPROVED: "green",
  PENDING: "yellow",
  IN_REVIEW: "yellow",
  REJECTED: "red",
  CANCELLED: "red",
} as const;
