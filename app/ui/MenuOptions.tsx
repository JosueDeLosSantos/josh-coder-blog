"use client";

import { poppins, oxanium } from "@/app/ui/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Session } from "next-auth";
import ProfileImage from "@/app/ui/ProfileImage";

export default function MenubarOptions({
  vertical,
  session,
  openSubMenu,
  setIsAuth,
}: {
  vertical: boolean;
  session: Session | null;
  openSubMenu?: () => void;
  setIsAuth?: (isAuth: boolean) => void;
}) {
  const pathname = usePathname();
  const blogAddress = session ? "/auth/blog" : "/blog";
  const blogAbout = session ? "/auth/blog/about" : "/blog/about";

  return (
    <ul
      className={clsx(
        poppins.className,
        "flex gap-5 font-semibold text-primary tracking-wider 2xl:text-base",
        { "flex-col items-start w-full": vertical },
        { " items-center": !vertical }
      )}
    >
      {session && !vertical && (
        <li onClick={() => openSubMenu && openSubMenu()}>
          <div className={clsx("cursor-pointer ", { "pl-3": vertical })}>
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              session={session}
              width={38}
              height={38}
              alt="Picture of the user"
            />
          </div>
        </li>
      )}

      {session && vertical && (
        <li className="w-full pl-2 py-2 bg-blogBg">
          <Link href="/auth/blog/profile">
            <div className="flex flex-col gap-2 pl-2 text-textLight">
              <div className="cursor-pointer">
                <ProfileImage
                  className="ring-1 rounded-full ring-primaryBorder bg-white"
                  session={session}
                  width={38}
                  height={38}
                  alt="Picture of the user"
                />
              </div>
              <div>
                <div className={`${oxanium.className} truncate`}>
                  {session?.user?.name}
                </div>
                <div className="text-sm font-normal">Profile</div>
              </div>
            </div>
          </Link>
        </li>
      )}

      <li className={clsx({ "pl-2": vertical })}>
        <Link href={blogAddress} className="flex gap-1">
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== blogAddress,
            })}
          >
            {"{"}
          </span>
          Posts
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== blogAddress,
            })}
          >
            {"}"}
          </span>
        </Link>
      </li>

      <li className={clsx({ "pl-2": vertical })}>
        <Link href={blogAbout} className="flex gap-1">
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== blogAbout,
            })}
          >
            {"{"}
          </span>
          About
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== blogAbout,
            })}
          >
            {"}"}
          </span>
        </Link>
      </li>

      <li
        onClick={() => setIsAuth && setIsAuth(false)}
        className={clsx(
          "flex gap-1",
          { hidden: !session || !vertical },
          { "pl-2": vertical }
        )}
      >
        <span className="opacity-0">{"{"}</span>
        Sign Out
        <span className="opacity-0">{"}"}</span>
      </li>

      {!session && (
        <li className={clsx({ "pl-2": vertical })}>
          <Link href="/login" className="flex gap-1">
            <span className="opacity-0">{"{"}</span>
            Sign In/Up
            <span className="opacity-0">{"}"}</span>
          </Link>
        </li>
      )}
    </ul>
  );
}
