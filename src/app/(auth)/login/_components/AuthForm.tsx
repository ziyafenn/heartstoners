import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";
import { DiscordSignIn } from "./DiscordSignIn";

type Props = {
  redirectDeckCode?: string;
  onClose: () => void;
};

export function AuthForm({ redirectDeckCode, onClose }: Props) {
  return (
    <>
      <Tabs defaultValue="signin">
        <TabsList>
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignIn redirectDeckCode={redirectDeckCode} onClose={onClose} />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp redirectDeckCode={redirectDeckCode} onClose={onClose} />
        </TabsContent>
      </Tabs>
      <DiscordSignIn redirectDeckCode={redirectDeckCode} />
    </>
  );
}
