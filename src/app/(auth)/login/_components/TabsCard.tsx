"use client";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import { useFormState } from "react-dom";
import { signup } from "@/actions/login.action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TabsCard() {
  // const [activeTab, setActiveTab] = useState<"signin" | "signup">("signup");
  const [state, action] = useFormState(signup, { page: "signup" });

  console.log(state, "current state");

  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your preferred sign-in method</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 px-6">
        <Tabs defaultValue="signup">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create profile</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" key="signin">
            <SignIn />
          </TabsContent>
          <TabsContent value="signup" key="signup">
            <form className="flex flex-col gap-8" action={action}>
              {state.error && (
                <span className="pt-2 text-center text-red-500">
                  {state.error}
                </span>
              )}
              <div className="flex flex-col gap-2">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    name="username"
                    type="username"
                    required
                    key="username"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    key="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    name="password"
                    type="password"
                    required
                    key="password"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create your account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex flex-col gap-4">
          <span className="text-gray-400 text-sm">or continue with</span>
          <Button type="button" className="w-full">
            Discord
          </Button>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
