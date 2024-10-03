import { ComponentType, ReactNode } from "react";
import { UseQueryResult } from "@tanstack/react-query";
import { ErrorMessageLog } from "./error-message";
import { cn } from "../lib/utils";
import { EmptyState } from "./empty-state";

type ColumnValue = 0 | 1 | 2 | 3 | 4;
type Columns = [ColumnValue?, ColumnValue?, ColumnValue?, ColumnValue?];

export type GridProps<T> = {
  columns?: Columns;
  keys?: string[];
  renderItem?: (
    item: T & { key: string },
    Component: ComponentType<T>,
  ) => ReactNode;
};

type Props<T> = UseQueryResult<T[], unknown> &
  GridProps<T> & { component: ComponentType<T> };

export function Grid<T extends { id: string; isLoading?: boolean }>({
  columns = [1, 1, 2, 3],
  data,
  error,
  keys = ["id", "chainId"],
  isPending,
  component: Component,
  renderItem = (item, Component: any) => <Component {...item} />,
}: Props<T>) {
  if (error) return <ErrorMessageLog error={error} />;
  if (!isPending && !data?.length) return <EmptyState />;

  return (
    <div className={cn("gap-4 sm:grid", gridClass(columns))}>
      {(isPending ? createLoadingCards(6, keys) : data)?.map((item) =>
        renderItem(createItemKey(item as T, keys), Component),
      )}
    </div>
  );
}

function createItemKey<T>(item: T, keys: string[]) {
  const key = keys.map((k) => item[k as keyof typeof item]).join("_");
  return { ...item, key };
}
function createLoadingCards(length: number, keys: string[]) {
  return Array.from({ length })
    .fill(0)
    .map((_, id) => ({
      id: String(id),
      isLoading: true,
      ...Object.fromEntries(keys.map((k) => [k, id])),
    }));
}
function gridClass(columns: Columns): string {
  return columns.reduce<string>(
    (cols, col = 0, i) => cols.concat(columnMap?.[i]?.[col] ?? "") + " ",
    "",
  );
}
const columnMap = [
  {
    0: "",
    1: "sm:grid-cols-1",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  },
  {
    0: "",
    1: "md:grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  },
  {
    0: "",
    1: "lg:grid-cols-1",
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  },
  {
    0: "",
    1: "xl:grid-cols-1",
    2: "xl:grid-cols-2",
    3: "xl:grid-cols-3",
    4: "xl:grid-cols-4",
  },
] as const;
