import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { InputHTMLAttributes } from "react";

export function FormItem({
  field,
  label,
  error,
  ...attr
}: {
  field: string;
  label: string;
  error: string | undefined;
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={field}>{label}</Label>
      <Input key={field} name={field} type={field} required {...attr} />
      <p className="mt-1 text-red-500 text-sm">{error}</p>
    </div>
  );
}
