import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
export default function Layout({
  children,
  auth,
}: { children: React.ReactNode; auth: React.ReactNode }) {
  return (
    <>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin" asChild>
                <Link href="/auth/login">Sign in</Link>
              </TabsTrigger>
              <TabsTrigger value="signup" asChild>
                <Link href="/auth/signup">Create profile</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div>{children}</div>
          <div>{auth}</div>
          <CardFooter className="flex flex-col gap-4">
            <span className="text-gray-400 text-sm">or continue with</span>
            <Button type="button" className="w-full">
              Discord
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
    </>
  );
}
