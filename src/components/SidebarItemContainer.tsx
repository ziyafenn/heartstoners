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
    <div className="flex w-full flex-col overflow-clip rounded border border-[#2b2142] bg-black/50">
      <h3 className="border-[#2b2142] border-b bg-[#130f1d] p-3 font-medium">
        {name}
      </h3>
      <div className={className}>{children}</div>
    </div>
  );
}
