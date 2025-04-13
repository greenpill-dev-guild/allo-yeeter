import React from "react";
import { UseFormReturn } from "react-hook-form";
import { RiFileListFill, RiGroupFill } from "@remixicon/react";

import { YeetFormData } from "../../hooks/useYeetForm";

const ICON_SIZE = 32;

export interface SlideProps {
  form: UseFormReturn<YeetFormData>;
  toast: any;
  fieldsToValidate: (keyof YeetFormData)[];
}

export interface SlideDefinition {
  url: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  fieldsToValidate: (keyof YeetFormData)[];
  icon: JSX.Element;
}

export const slideDefinitions: SlideDefinition[] = [
  {
    url: "/yeet/load",
    shortTitle: "Load",
    title: "Add Recipients & Amounts",
    subtitle: "Upload a CSV or use ENS to prep your payout list.",
    fieldsToValidate: ["token", "amount", "recipients"],
    icon: <RiGroupFill size={ICON_SIZE} className="text-primary" />,
  },
  {
    url: "/yeet/send",
    shortTitle: "Yeet",
    title: "Funds Sent!",
    subtitle: "Succesfully yeeted funds to recipients.",
    fieldsToValidate: [],
    icon: <RiFileListFill size={ICON_SIZE} className="text-primary" />,
  },
];
