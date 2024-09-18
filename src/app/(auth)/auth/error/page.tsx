import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OauthErrorPage() {
  return (
    <div className="flex flex-col items-start justify-start">
      <p>Seems the sign-in process has been terminated</p>
      <p>If this is an error that persists, please get in touch with us.</p>
      <Button type="button" variant="link" className="p-0">
        <Link href="/">Return to main page</Link>
      </Button>
    </div>
  );
}
