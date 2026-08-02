import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const COLOR_NAMES = [
  "background",
  "background-deep",
  "surface",
  "surface-raised",
  "surface-hover",
  "border",
  "border-strong",
  "foreground",
  "muted-foreground",
  "subtle-foreground",
  "accent",
  "accent-hover",
  "accent-foreground",
  "accent-text",
  "accent-soft",
  "accent-line",
  "accent-deep",
  "accent-shadow",
  "success",
  "warning",
  "error",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "h1",
            "h2",
            "h3",
            "h4",
            "h5",
            "h6",
            "body-lg",
            "body",
            "body-sm",
            "body-xs",
          ],
        },
      ],
      "text-color": [{ text: COLOR_NAMES }],
      "bg-color": [{ bg: COLOR_NAMES }],
      "border-color": [{ border: COLOR_NAMES }],
      rounded: [
        { rounded: ["button", "card", "input", "dropdown", "modal", "badge"] },
      ],
      shadow: [{ shadow: ["soft", "raised"] }],
      "font-family": [{ font: ["display", "sans"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
