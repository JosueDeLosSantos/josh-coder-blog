"use client";

import { updatePassword } from "@/lib/actions";
import { useActionState } from "react";
import { orbitron } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import { Password } from "@/app/ui/forms/Fields";

export default function EditPassword() {
  const [state, action, pending] = useActionState(updatePassword, undefined);

  return (
    <div className="flex flex-col max-w-96 w-full items-center justify-center max-md:p-2 md:p-10 bg-white border border-primaryBorder rounded-lg md:min-w-[600px]">
      <div className="mb-14">
        <h2
          className={`${orbitron.className} font-medium text-primary text-2xl`}
        >
          Password
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-4 w-full">
        {/* Password */}
        <Password state={state} />
        <Password state={state} title="New Password" />

        {/* Sign Up */}
        <div className="flex justify-center mt-16">
          <Button bg="secondary" disabled={pending} type="submit" layout="form">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
