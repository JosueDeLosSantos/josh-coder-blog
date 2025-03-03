"use client";

import { authenticate } from "@/lib/actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { orbitron, poppins } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import Link from "next/link";
import { Password, Text } from "@/app/ui/forms/Fields";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/auth/blog";
  const [state, action, pending] = useActionState(authenticate, undefined);

  return (
    <div className="flex flex-col max-w-96 w-full items-center justify-center p-10 md:p-10 bg-white border border-primaryBorder rounded-lg">
      <div className="mb-14">
        <h2
          className={`${orbitron.className} font-medium text-primary text-2xl`}
        >
          Sign In
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-8 w-full">
        {/* Email */}
        <Text htmlFor="email" placeholder="johndoe@gmail.com" />
        {/* Password */}
        <Password state={state} />
        {/* Sign up */}
        <div className="text-textLight text-center">
          <span
            className={`${poppins.className} text-text`}
          >{`Don't have an account?`}</span>{" "}
          <Link
            href="/signUp"
            className={`${poppins.className} text-primaryLight cursor-pointer`}
          >
            Sign up
          </Link>
        </div>
        {/* Sign in */}
        <div className="flex justify-center">
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button bg="secondary" disabled={pending} type="submit" layout="form">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
