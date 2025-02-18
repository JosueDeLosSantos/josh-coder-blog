import SignInForm from "@/app/ui/forms/SignInForm";
import { Suspense } from "react";
import Logo from "@/app/ui/Logo";

export default function Page() {
  return (
    <div className="flex flex-col items-center max-md:gap-24 md:gap-40 min-h-screen blog-hero-bg max-md:p-2 md:p-10">
      <Logo mobileHero={true} />

      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
    </div>
  );
}
