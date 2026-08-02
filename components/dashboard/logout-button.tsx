"use client";

import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/outline";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

export function LogoutButton({
  block = false,
  iconOnly = false,
}: {
  block?: boolean;
  iconOnly?: boolean;
}) {
  return (
    <form action={signOutAction} className={block ? "w-full" : undefined}>
      <LogoutSubmit block={block} iconOnly={iconOnly} />
    </form>
  );
}

function LogoutSubmit({
  block,
  iconOnly,
}: {
  block: boolean;
  iconOnly: boolean;
}) {
  const { pending } = useFormStatus();
  const label = pending ? "Signing you out..." : "Log Out";

  return (
    <Button
      type="submit"
      variant="secondary"
      size="sm"
      block={block || undefined}
      disabled={pending}
      aria-disabled={pending}
      title={iconOnly ? label : undefined}
      className={iconOnly ? "size-9 px-0" : undefined}
    >
      <ArrowRightStartOnRectangleIcon aria-hidden="true" />
      {iconOnly ? <span className="sr-only">{label}</span> : label}
    </Button>
  );
}
