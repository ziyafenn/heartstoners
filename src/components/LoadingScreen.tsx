import { LoadingSpinner } from "./LoadingSpinner";

export function LoadingScreen() {
  return (
    <div className="flex size-screen flex-1 flex-col items-center justify-center gap-4">
      <LoadingSpinner slow />
      <span className="font-hs text-2xl">Loading...</span>
    </div>
  );
}
