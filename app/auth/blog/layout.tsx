import AuthLayout from "@/app/ui/AuthLayout";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  console.log(session);
  return (
    <div>
      <AuthLayout session={session}>{children}</AuthLayout>
    </div>
  );
}
