export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Headless layout: no navbar or footer — the auth pages are full-screen
  return <>{children}</>;
}
