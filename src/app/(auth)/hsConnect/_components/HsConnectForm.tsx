"use client";
import { addHsReplayId } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderPinwheel } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button size="sm" type="submit">
      {pending ? (
        <span className="flex items-center gap-1">
          <LoaderPinwheel className="size-4 animate-spin text-gray-500" />
          Checking
        </span>
      ) : (
        "Connect"
      )}
    </Button>
  );
}

export function HsConnectForm() {
  const [state, action] = useActionState(addHsReplayId, {});

  return (
    <div className="relative flex h-44 flex-col items-center justify-between rounded-sm border border-border p-10">
      <div className="flex w-full items-center justify-between">
        <h3 className="font-semibold text-lg">
          Connect your HSReplay.net account
        </h3>
        <div className="flex flex-col items-center justify-center gap-8">
          <form className="z-50 flex items-center gap-4" action={action}>
            <Input
              type="url"
              required
              name="hsReplayUrl"
              defaultValue={state.hsReplayUrl}
              pattern="^https:\/\/hsreplay\.net\/collection\/\d+\/\d+\/?$"
              className="w-60"
            />
            <SubmitButton />
          </form>
        </div>
      </div>
      <div className="flex h-6 w-fit items-center justify-center text-center">
        {state.error && (
          <div className="font-medium text-red-300">{state.error}</div>
        )}
        {state.success && <div className="font-medium">{state.success}</div>}
      </div>
    </div>
  );
}
