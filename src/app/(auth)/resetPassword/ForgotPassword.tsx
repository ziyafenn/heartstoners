"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/service/supabase.auth.client";
import { type FormEvent, useRef, useState } from "react";
import { FormItem } from "../login/_components/FormItem";

export function ForgotPasswordForm() {
  const [isLinkSent, setIsLinkSent] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);

  async function onPasswordReset(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = emailRef.current;
    if (!email) return;
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.value);
    if (error) {
      setError(error.message);
      return;
    }
    setIsLinkSent(true);
    email.value = "";
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={onPasswordReset}>
      <FormItem field="email" label="Email" error="" required ref={emailRef} />
      {isLinkSent && (
        <p className="text-green-500 text-sm">
          Link to reset password was sent to the email
        </p>
      )}
      {!!error && <p className="text-red-500 text-sm">error</p>}
      <Button type="submit">Reset password</Button>
    </form>
  );
}
