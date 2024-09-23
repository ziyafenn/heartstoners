"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Error boundaries must be Client Components

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex max-w-[640px] flex-1 justify-center">
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">Something went wrong!</h2>
        <p>
          If this error occurs, please contact us on{" "}
          <Link
            href="https://discord.gg/4zqnSMStha"
            className="text-blue-400"
            target="_blank"
          >
            Discord
          </Link>
        </p>
        <Button onClick={() => reset()}>Reload</Button>
      </div>
    </div>
  );
}
