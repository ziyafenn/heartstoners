import { SignIn } from "./_components/SignIn";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <SignIn />;
}
