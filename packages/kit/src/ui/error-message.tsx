import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle } from "lucide-react";

export function ErrorMessageLog({ error }: { error: unknown }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="size-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Something went wrong</AlertDescription>
      <details>
        <summary>Show error</summary>
        <pre className="w-full overflow-hidden whitespace-pre-wrap bg-gray-900 p-4 text-xs leading-5 text-gray-200">
          {(error as any).message}
        </pre>
      </details>
    </Alert>
  );
}

export function ErrorMessage({ message = "" }) {
  return (
    message && (
      <Alert variant="destructive">
        <AlertCircle className="size-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    )
  );
}
