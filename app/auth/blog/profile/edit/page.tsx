import EditProfile from "@/app/ui/forms/EditProfile";
import { getUserData } from "@/lib/actions";
import type { User } from "@/lib/definitions";

export default async function Page() {
  const user: User = await getUserData();

  return (
    <div className="flex flex-col items-center min-h-screen blog-hero-bg max-md:pt-16 md:py-24">
      <EditProfile user={user} />
    </div>
  );
}
