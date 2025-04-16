"use client";

import { authenticate } from "@/lib/actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { orbitron, poppins } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import Link from "next/link";
import { Password, Text } from "@/app/ui/forms/Fields";

export default function SignInForm({ slug }: { slug?: string }) {
  const searchParams = useSearchParams();
  const callbackUrl = slug
    ? searchParams.get("callbackUrl") || `/auth/blog/${slug}`
    : searchParams.get("callbackUrl") || "/auth/blog";
  const [state, action, pending] = useActionState(authenticate, undefined);

  return (
    <div className="flex flex-col max-w-96 w-full items-center justify-center p-10 md:p-10 bg-white border border-primaryBorder rounded-lg">
      <div className="mb-14">
        <h3
          className={`${orbitron.className} font-medium text-primary text-2xl`}
        >
          Sign In
        </h3>
      </div>
      <form action={action} className="flex flex-col gap-4 w-full">
        {/* Email */}
        <Text htmlFor="email" placeholder="johndoe@gmail.com" />
        {/* Password */}
        <Password state={state} />
        {/* Sign up */}
        <div className="text-textLight text-center">
          <span
            className={`${poppins.className}`}
          >{`Don't have an account?`}</span>{" "}
          <Link
            href="/signUp"
            className={`${poppins.className} text-primaryLight cursor-pointer hover:underline`}
          >
            Sign up
          </Link>
        </div>
        {/* Sign in */}
        <div className="flex justify-center mt-4">
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <Button bg="secondary" disabled={pending} type="submit" layout="form">
            Sign In
          </Button>
        </div>
      </form>
    </div>
  );
}
