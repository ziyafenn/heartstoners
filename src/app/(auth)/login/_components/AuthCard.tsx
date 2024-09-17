"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { DiscordSignIn } from "./DiscordSignIn";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type Props = { redirect?: string; action?: (value: boolean) => void };

function TabContent({ redirect, action: setSuccess }: Props) {
  return (
    <Tabs defaultValue="signin">
      <TabsList>
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Sign up</TabsTrigger>
      </TabsList>
      <TabsContent value="signin">
        <SignIn redirect={redirect} setSuccess={setSuccess} />
      </TabsContent>
      <TabsContent value="signup">
        <SignUp redirect={redirect} />
      </TabsContent>
    </Tabs>
  );
}

export default function AuthCard({ redirect, action: closeDialog }: Props) {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  function onFinish() {
    closeDialog!(true);
    // router.refresh();
  }

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your preferred sign-in method</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6">
        {!success ? (
          <TabContent redirect={redirect} action={setSuccess} />
        ) : (
          <div>
            success
            <Button onClick={() => onFinish()} type="button">
              close
            </Button>
          </div>
        )}
        <CardFooter className="flex flex-col gap-4">
          <span className="text-gray-400 text-sm">or continue with</span>
          <DiscordSignIn redirectPath={redirect} />
        </CardFooter>
      </CardContent>
    </Card>
  );
}
