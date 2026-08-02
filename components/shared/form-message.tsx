import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils/cn";

export function FormMessage({
  tone,
  children,
  className,
}: {
  tone: "error" | "success";
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = tone === "error" ? ExclamationCircleIcon : CheckCircleIcon;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-input border p-4 text-body-sm",
        tone === "error"
          ? "border-error/40 bg-error/10"
          : "border-accent-line bg-accent-soft",
        className,
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "error" ? "text-error" : "text-accent-text",
        )}
      />
      <p className="text-foreground">{children}</p>
    </div>
  );
}
