import { isAfter } from "date-fns";
import type { Round } from "../api/types";
import { toNow } from "../lib/utils";

export const getRoundTime = (phases: Round["phases"] = {}): string => {
  const now = new Date();

  if (isAfter(phases.applicationsStartTime!, now))
    return `Starts ${toNow(phases.applicationsStartTime)}`;
  if (isAfter(now, phases.donationsEndTime!))
    return `Ended ${toNow(phases.donationsEndTime)}`;
  if (isAfter(phases.donationsEndTime!, now))
    return `Ends ${toNow(phases.donationsEndTime)}`;
  return "";
};
