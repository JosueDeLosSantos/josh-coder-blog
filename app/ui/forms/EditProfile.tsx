"use client";

import { updateProfile } from "@/lib/actions";
import { useActionState } from "react";
import { orbitron, poppins } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import { Text } from "@/app/ui/forms/Fields";
import type { User } from "@/lib/definitions";
import Link from "next/link";
import { BioEditor } from "@/app/ui/forms/Editors";

export default function EditForm({ user }: { user: User }) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const { firstname, surname, email, bio } = user;

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

        <BioEditor htmlFor="bio" value={bio} />

        {/* Do you want to update your password? */}
        <Link
          href={"/auth/blog/profile/password"}
          className={`${poppins.className} text-secondary mb-2 cursor-pointer hover:underline`}
        >
          Click here to update your password
        </Link>

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
