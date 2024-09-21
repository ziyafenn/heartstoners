import { cn } from "@/lib/utils";
import Image from "next/image";

export function LoadingSpinner(props?: { slow?: boolean }) {
  return (
    <Image
      src="/img/logo-icon.png"
      width={742}
      height={742}
      alt="heartstone-logo"
      className={cn("size-24 animate-spin", props?.slow && "animate-spin-slow")}
    />
  );
}
