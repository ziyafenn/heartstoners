import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "./ForgotPassword";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Button asChild variant="ghost" className="p-0">
            <Link href="/auth/login">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          Reset password
        </CardTitle>
        <CardDescription>
          Type your email to get a link to reset the password
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col px-6 pb-7">
        <ForgotPasswordForm />
      </CardContent>
    </Card>
  );
}
