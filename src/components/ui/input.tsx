import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { X } from "lucide-react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & { onClear?: () => void; showClearIcon: boolean }
>(({ className, type, onClear, showClearIcon, ...props }, ref) => {
  return (
    <div className="relative h-10">
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
      {showClearIcon && (
        <Button
          variant="ghost"
          className="absolute bottom-0 right-0"
          onClick={onClear}
          type="button"
        >
          <X className="size-4" />
        </Button>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
