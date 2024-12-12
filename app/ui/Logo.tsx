import { bungee, ubuntu } from "@/app/ui/fonts";
import clsx from "clsx";

export default function Logo({ motto = false, mobileHero = false }) {
  return (
    <div className="flex w-fit flex-col items-center 2xl:gap-1 md:text-4xl 2xl:text-5xl">
      <div
        className={clsx(bungee.className, "antialiased", {
          "max-md:text-xl": !mobileHero,
          "max-md:text-3xl": mobileHero,
        })}
      >
        <span className="text-secondaryDark">{"<"}</span>
        <span className="text-primaryDark">Josh Coder</span>
        <span className="text-secondaryDark">{"/>"}</span>
      </div>
      {motto && (
        <div
          className={clsx(
            ubuntu.className,
            "antialiased text-xs md:text-base 2xl:text-xl",
            { hidden: !mobileHero }
          )}
        >
          <span>Productivity tips for software developers</span>
        </div>
      )}
    </div>
  );
}
