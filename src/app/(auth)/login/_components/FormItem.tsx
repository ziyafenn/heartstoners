import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { InputHTMLAttributes, RefObject } from "react";

export function FormItem({
  field,
  label,
  error,
  description = "",
  forgotPassTarget,
  ref,
  ...attr
}: {
  field: string;
  label: string;
  description?: string;
  error: string | undefined;
  forgotPassTarget?: "_blank" | "_self";
  ref?: RefObject<HTMLInputElement>;
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
      <Input
        key={field}
        name={field}
        type={field}
        required
        ref={ref}
        {...attr}
      />
      <p className={cn("mt-2 text-gray-400 text-xs", error && "text-red-500")}>
        {error ? error : description}
      </p>
    </div>
  );
}
