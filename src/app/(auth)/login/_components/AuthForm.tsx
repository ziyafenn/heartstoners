import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { DiscordSignIn } from "./DiscordSignIn";

type Props = {
  redirectDeckCode?: string;
  onClose: () => void;
};

export function AuthForm({ redirectDeckCode, onClose }: Props) {
  const [success, setSuccess] = useState(false);

  return (
    <>
      {!success ? (
        <Tabs defaultValue="signin">
          <TabsList>
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin">
            <SignIn
              redirectDeckCode={redirectDeckCode}
              setSuccess={setSuccess}
            />
          </TabsContent>
          <TabsContent value="signup">
            <SignUp redirectDeckCode={redirectDeckCode} />
          </TabsContent>
        </Tabs>
      ) : (
        <div>
          success
          <Button onClick={() => onClose()} type="button">
            close
          </Button>
        </div>
      )}
      <div className="flex flex-col items-center gap-4">
        <span className="text-gray-400 text-sm">or continue with</span>
        <DiscordSignIn redirectDeckCode={redirectDeckCode} />
      </div>
    </>
  );
}
