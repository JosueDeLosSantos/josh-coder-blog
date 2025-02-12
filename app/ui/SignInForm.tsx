"use client";

import { authenticate } from "@/lib/actions";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/auth";
  const [state, action, pending] = useActionState(authenticate, undefined);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <form action={action}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" name="email" placeholder="Email" />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
          <button disabled={pending} type="submit">
            Sign In
          </button>
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state && (
              <>
                <p className="text-sm text-red-500">{state}</p>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
