"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { useState } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function TabContent() {
  const [activeTab, setActiveTab] = useState("signin");
  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full px-6"
      orientation="horizontal"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Create profile</TabsTrigger>
      </TabsList>
      <CardContent className="flex flex-col gap-4">
        <TabsContent value="signin">
          <SignIn onSignUp={() => setActiveTab("signup")} />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
        <CardFooter className="flex flex-col gap-4">
          <span className="text-gray-400 text-sm">or continue with</span>
          <Button type="button" className="w-full">
            Discord
          </Button>
        </CardFooter>
      </CardContent>
    </Tabs>
  );
}
