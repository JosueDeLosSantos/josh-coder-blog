import EditProfile from "@/app/ui/forms/EditProfile";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-screen blog-hero-bg max-md:pt-16 md:py-24">
      <Suspense fallback={<div>Loading...</div>}>
        <EditProfile />
      </Suspense>
    </div>
  );
}
