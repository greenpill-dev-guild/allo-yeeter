import { type ClassValue, clsx } from "clsx";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num = 0) {
  return (
    Number(num)?.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }) ?? "0"
  );
}

export const suffixNumber = (num: number) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1_000, symbol: "k" },
    { value: 1_000_000, symbol: "M" },
  ];
  const regexp = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = [...lookup].reverse().find((item) => num >= item.value);
  return item
    ? (num / item.value).toFixed(2).replace(regexp, "$1") + item.symbol
    : "0";
};

export function formatMoney(val = 0, currency?: string, decimals = 2) {
  return Number(val).toLocaleString("en-US", {
    currency,
    style: currency ? "currency" : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export const toNow = (date?: string) =>
  date ? formatDistanceToNow(date, { addSuffix: true }) : undefined;
