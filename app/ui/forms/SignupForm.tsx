/* "use client";

import { signup } from "@/lib/actions";
import { useActionState } from "react";

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  );
}
 */

"use client";

import { signup } from "@/lib/actions";
import { useActionState } from "react";
import { orbitron } from "@/app/ui/fonts";
import Button from "@/app/ui/Button";
import { Password, Text } from "@/app/ui/forms/Fields";

export default function SignUpForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="flex flex-col max-w-96 w-full items-center justify-center p-10 md:p-10 bg-white border border-primaryBorder rounded-lg">
      <div className="mb-14">
        <h2
          className={`${orbitron.className} font-medium text-primary text-2xl`}
        >
          Sign Up
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-8 w-full">
        {/* Name */}
        <Text state={state} htmlFor="firstName" placeholder="John" />
        {/* Surname */}
        <Text state={state} htmlFor="surname" placeholder="Doe" />

        {/* Email */}
        <Text state={state} htmlFor="email" placeholder="johndoe@gmail.com" />

        {/* Password */}
        <Password state={state} />

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
