import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

export function EmptyState() {
  return (
    <Alert>
      <Info className="size-4" />
      <AlertTitle>No results found!</AlertTitle>
      <AlertDescription>
        Couldn&apos;t find any results matching your query
      </AlertDescription>
    </Alert>
  );
}
