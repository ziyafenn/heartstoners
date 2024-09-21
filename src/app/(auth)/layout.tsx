export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return <div className="flex items-center justify-center p-8">{children}</div>;
}
