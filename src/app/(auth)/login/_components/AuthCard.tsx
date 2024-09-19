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
  function onClose() {
    if (closeDialog) closeDialog(true);
  }
  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle>Join HeartStoners</CardTitle>
        <CardDescription>Sign in or create your account</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6 pb-6">
        <AuthForm onClose={onClose} redirectDeckCode={redirectDeckCode} />
      </CardContent>
    </Card>
  );
}
