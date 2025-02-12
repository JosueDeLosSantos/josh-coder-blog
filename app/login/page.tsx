import SignInForm from "../ui/SignInForm";
import { Suspense } from "react";

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div>
        <h1>Sign In</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
