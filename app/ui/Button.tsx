import clsx from "clsx";
import { poppins } from "./fonts";
import React from "react";

export default function Button({
  disabled = false,
  type,
  layout,
  children,
  bg,
}: {
  disabled: boolean;
  type: "button" | "submit";
  layout: "landing" | "form";
  children: string;
  bg: "primary" | "secondary";
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={clsx(
        poppins.className,
        {
          "text-white max-2xl:font-medium 2xl:font-semibold max-md:text-sm md:text-lg 2xl:text-xl max-md:px-4 max-md:py-2 md:px-6 md:py-2 2xl:px-8 2xl:py-3 rounded":
            layout === "landing",
          "text-white max-2xl:font-medium 2xl:font-semibold max-md:text-sm md:text-base 2xl:text-lg max-md:px-4 max-2xl:py-2 md:px-6 2xl:px-8 2xl:py-3 rounded":
            layout === "form",
        },
        {
          "bg-primary": bg === "primary" && !disabled,
          "bg-primaryLight": bg === "primary" && disabled,
          "bg-secondary border border-secondaryDark hover:bg-secondaryDark":
            bg === "secondary",
        }
      )}
    >
      {children}
    </button>
  );
}

export function DismissButton({
  children,
  setEditor,
}: {
  children: string;
  setEditor: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <button
      type="button"
      className="text-textMild hover:text-text hover:bg-blogBg max-2xl:font-medium 2xl:font-semibold max-md:text-sm md:text-base 2xl:text-lg max-md:px-4 max-2xl:py-2 md:px-6 2xl:px-8 2xl:py-3 rounded"
      onClick={() => setEditor(false)}
    >
      {children}
    </button>
  );
}
