import clsx from "clsx";
import { poppins } from "./fonts";

export default function Button({
  message,
  bg,
}: {
  message: string;
  bg: string;
}) {
  return (
    <button
      className={clsx(
        poppins.className,
        "text-white max-2xl:font-medium 2xl:font-semibold max-md:text-sm md:text-lg 2xl:text-xl max-md:px-4 max-md:py-1 md:px-6 md:py-2 2xl:px-8 2xl:py-3 rounded",
        {
          "bg-primary": bg === "primary",
          "bg-secondary": bg === "secondary",
          "border border-secondaryDark": bg === "secondary",
        }
      )}
    >
      {message}
    </button>
  );
}
