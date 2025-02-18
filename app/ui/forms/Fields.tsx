"use client";

import { poppins, ubuntu } from "@/app/ui/fonts";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

export function Password({ state }: { state: string | undefined }) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className={`${poppins.className} text-text`} htmlFor="password">
          Password
        </label>
        <div className="relative">
          <input
            className="p-2 w-full bg-blogBg rounded-md focus:outline focus:outline-primaryLight text-textLight"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
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
          className="flex h-4 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {state && (
            <>
              <p className={`${ubuntu.className} text-sm text-red-500`}>
                {state}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function Text({
  htmlFor,
  placeholder,
}: {
  htmlFor: string;
  placeholder: string;
}) {
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label className={`${poppins.className} text-text`} htmlFor={htmlFor}>
          E-mail
        </label>
        <input
          className="p-2 w-full bg-blogBg rounded-md focus:outline focus:outline-primaryLight text-textLight"
          id={htmlFor}
          name={htmlFor}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
