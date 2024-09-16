import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotPasswordForm } from "./ForgotPassword";

export default function ForgotPassword() {
  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle>Reset password</CardTitle>
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
