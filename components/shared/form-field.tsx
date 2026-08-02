import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormFieldProps = React.ComponentProps<"input"> & {
  label: string;
  name: string;
  hint?: string;
};

export function FormField({ label, name, hint, ...props }: FormFieldProps) {
  const hintId = hint ? `${name}-hint` : undefined;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} aria-describedby={hintId} {...props} />
      {hint ? (
        <p id={hintId} className="text-body-xs text-subtle-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
