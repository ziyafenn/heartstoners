"use client"; // Error boundaries must be Client Components

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">Something went wrong!</h2>
        <p>If this error occurs, please contact us on Discord</p>
        <h3>Error details</h3>
        <p>{error.message}</p>
      </div>
    </div>
  );
}
