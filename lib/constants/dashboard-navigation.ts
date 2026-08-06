import {
  BookmarkIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";

export const DASHBOARD_NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: Squares2X2Icon,
    available: true,
  },
  {
    label: "Create Plan",
    href: "/create-plan",
    icon: PlusCircleIcon,
    available: true,
  },
  {
    label: "Saved Plans",
    href: "/saved-plans",
    icon: BookmarkIcon,
    available: true,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Cog6ToothIcon,
    available: true,
  },
] as const;
