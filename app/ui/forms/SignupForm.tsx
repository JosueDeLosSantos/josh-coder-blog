"use client";

import { signup } from "@/lib/actions";
import { useActionState } from "react";
import { orbitron } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import { Password, Text } from "@/app/ui/forms/Fields";
import { useSearchParams } from "next/navigation";

export default function SignUpForm({ slug }: { slug?: string }) {
  const searchParams = useSearchParams();
  const [state, action, pending] = useActionState(signup, undefined);
  const callbackUrl = slug
    ? searchParams.get("callbackUrl") || `/login/${slug}`
    : searchParams.get("callbackUrl") || "/login";

  return (
    <div className="flex flex-col max-w-96 w-full items-center justify-center p-10 md:p-10 bg-white border border-primaryBorder rounded-lg">
      <div className="mb-14">
        <h2
          className={`${orbitron.className} font-medium text-primary text-2xl`}
        >
          Sign Up
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-4 w-full">
        {/* Name */}
        <Text state={state} htmlFor="firstName" placeholder="John" />
        {/* Surname */}
        <Text state={state} htmlFor="surname" placeholder="Doe" />

        {/* Email */}
        <Text state={state} htmlFor="email" placeholder="johndoe@gmail.com" />

        {/* Password */}
        <Password state={state} />

        {/* Sign Up */}
        <input type="hidden" name="redirectTo" value={callbackUrl} />
        <div className="flex justify-center mt-4">
          <Button bg="secondary" disabled={pending} type="submit" layout="form">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
