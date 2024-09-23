import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DiscordSignIn } from "./DiscordSignIn";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

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
          <SignUp />
        </TabsContent>
      </Tabs>
      <DiscordSignIn redirectDeckCode={redirectDeckCode} />
    </>
  );
}
