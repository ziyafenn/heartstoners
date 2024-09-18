import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import type { InputHTMLAttributes } from "react";

export function FormItem({
  field,
  label,
  error,
  forgotPassTarget,
  ...attr
}: {
  field: string;
  label: string;
  error: string | undefined;
  forgotPassTarget?: "_blank" | "_self";
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor={field}>{label}</Label>
        {forgotPassTarget && (
          <Link
            href="/resetPassword"
            target={forgotPassTarget}
            className="text-blue-400 text-sm"
          >
            Forgot password?
          </Link>
        )}
      </div>
      <Input key={field} name={field} type={field} required {...attr} />
      <p className="mt-1 text-red-500 text-sm">{error}</p>
    </div>
  );
}
