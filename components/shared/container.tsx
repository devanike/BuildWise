import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-360 px-6 md:px-10 lg:px-14",
        className,
      )}
    >
      {children}
    </div>
  );
}
