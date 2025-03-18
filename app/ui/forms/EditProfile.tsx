"use client";

import { signup } from "@/lib/actions";
import { useActionState } from "react";
import { orbitron } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import { Password, Text } from "@/app/ui/forms/Fields";
import type { User } from "@/lib/definitions";

export default function EditForm({ user }: { user: User }) {
  const [state, action, pending] = useActionState(signup, undefined);
  const { firstname, surname, email } = user;

  return (
    <div className="flex flex-col max-w-96 w-full items-center justify-center max-md:p-2 md:p-10 bg-white border border-primaryBorder rounded-lg md:min-w-[600px]">
      <div className="mb-14">
        <h2
          className={`${orbitron.className} font-medium text-primary text-2xl`}
        >
          Profile
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-4 w-full">
        {/* Name */}
        <Text
          state={state}
          htmlFor="firstName"
          placeholder="John"
          value={firstname}
        />
        {/* Surname */}
        <Text
          state={state}
          htmlFor="surname"
          placeholder="Doe"
          value={surname}
        />

        {/* Email */}
        <Text
          state={state}
          htmlFor="email"
          placeholder="johndoe@gmail.com"
          value={email}
        />

        {/* Password */}
        <Password state={state} title="New Password" />

        {/* Sign Up */}
        <div className="flex justify-center mt-10">
          <Button bg="secondary" disabled={pending} type="submit" layout="form">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
