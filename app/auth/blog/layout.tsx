import AuthLayout from "@/app/ui/AuthLayout";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <AuthLayout session={session}>{children}</AuthLayout>;
}
