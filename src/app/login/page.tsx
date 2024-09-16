import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabContent } from "./_components/TabContent";

export default function Auth() {
  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <TabContent />
      </Card>
    </div>
  );
}
