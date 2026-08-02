export function AuthDivider() {
  return (
    <div className="flex items-center gap-4" role="separator">
      <span className="h-px flex-1 bg-border" />
      <span className="text-body-xs font-medium tracking-wide text-subtle-foreground">
        OR
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
