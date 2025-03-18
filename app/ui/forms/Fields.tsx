"use client";

import { FormState } from "@/lib/definitions";
import { poppins, ubuntu } from "@/app/ui/fonts";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export function Password({
  state,
  value,
  title,
}: {
  state: string | FormState | undefined;
  value?: string;
  title?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className={`${poppins.className} text-text`} htmlFor="password">
          {title || "Password"}
        </label>
        <div className="relative">
          <input
            className="p-2 w-full bg-blogBg rounded-md focus:outline focus:outline-primaryLight text-textLight"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            defaultValue={value}
          />
          {showPassword ? (
            <FaEye
              onClick={() => setShowPassword(false)}
              className="absolute right-2 top-2 text-textLight text-xl"
            />
          ) : (
            <FaEyeSlash
              onClick={() => setShowPassword(true)}
              className="absolute right-2 top-2 text-textLight text-xl"
            />
          )}
        </div>
        <div
          className="flex flex-col h-4 space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {typeof state === "string" && (
            <>
              <p className={`${ubuntu.className} text-sm text-red-500`}>
                {state}
              </p>
            </>
          )}
          {typeof state === "object" && state?.errors?.password && (
            <>
              {state.errors.password.map((error: string) => (
                <p
                  key={error}
                  className={`${ubuntu.className} text-sm text-red-500`}
                >
                  {error}
                </p>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Text({
  state,
  htmlFor,
  placeholder,
  value,
}: {
  state?: FormState;
  htmlFor: string;
  placeholder: string;
  value?: string;
}) {
  return (
    <div>
      {htmlFor === "firstName" && (
        <div className="flex flex-col gap-2">
          <label className={`${poppins.className} text-text`} htmlFor={htmlFor}>
            Name
          </label>
          <input
            className="p-2 w-full bg-blogBg rounded-md focus:outline focus:outline-primaryLight text-textLight"
            id={htmlFor}
            name={htmlFor}
            placeholder={placeholder}
            defaultValue={value}
          />
          <div
            className="flex h-4 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state?.errors?.firstName && (
              <p className={`${ubuntu.className} text-sm text-red-500`}>
                {state.errors.firstName}
              </p>
            )}
          </div>
        </div>
      )}
      {htmlFor === "surname" && (
        <div className="flex flex-col gap-2">
          <label className={`${poppins.className} text-text`} htmlFor={htmlFor}>
            Surname
          </label>
          <input
            className="p-2 w-full bg-blogBg rounded-md focus:outline focus:outline-primaryLight text-textLight"
            id={htmlFor}
            name={htmlFor}
            placeholder={placeholder}
            defaultValue={value}
          />
          <div
            className="flex h-4 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state?.errors?.surname && (
              <p className={`${ubuntu.className} text-sm text-red-500`}>
                {state.errors.surname}
              </p>
            )}
          </div>
        </div>
      )}
      {htmlFor === "email" && (
        <div className="flex flex-col gap-2">
          <label className={`${poppins.className} text-text`} htmlFor={htmlFor}>
            E-mail
          </label>
          <input
            className="p-2 w-full bg-blogBg rounded-md focus:outline focus:outline-primaryLight text-textLight"
            id={htmlFor}
            name={htmlFor}
            placeholder={placeholder}
            defaultValue={value}
          />
          <div
            className="flex h-4 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {state?.errors?.email && (
              <p className={`${ubuntu.className} text-sm text-red-500`}>
                {state.errors.email}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
