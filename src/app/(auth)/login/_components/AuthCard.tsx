"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuthForm } from "./AuthForm";

type Props = { redirectDeckCode?: string; action?: (value: boolean) => void };

export default function AuthCard({
  redirectDeckCode,
  action: closeDialog,
}: Props) {
  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your preferred sign-in method</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pb-6">
        <AuthForm
          close={() => closeDialog!(true)}
          redirectDeckCode={redirectDeckCode}
        />
      </CardContent>
    </Card>
  );
}
