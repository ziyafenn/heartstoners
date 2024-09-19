import type { HTMLAttributes } from "react";

export function SidebarItemContainer({
  name,
  children,
  className,
}: {
  name: string;
  children: React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>["className"];
}) {
  return (
    <div className="flex w-full flex-col overflow-clip rounded border border-violet-950 bg-black/20">
      <h3 className="border-violet-950 border-b bg-violet-950/50 p-3 font-medium">
        {name}
      </h3>
      <div className={className}>{children}</div>
    </div>
  );
}
