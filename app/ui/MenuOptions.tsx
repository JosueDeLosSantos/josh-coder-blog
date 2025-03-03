"use client";

import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Session } from "next-auth";

export default function MenubarOptions({
  vertical,
  session,
  openSubMenu,
}: {
  vertical: boolean;
  session: Session | null;
  openSubMenu?: () => void;
}) {
  const pathname = usePathname();
  const blogAddress = session ? "/auth/blog" : "/blog";
  const blogAbout = session ? "/auth/blog/about" : "/blog/about";

  return (
    <ul
      className={clsx(
        poppins.className,
        "flex items-center gap-5 font-semibold text-primary tracking-wider 2xl:text-base",
        { "flex-col items-start": vertical }
      )}
    >
      {session && (
        <li onClick={() => openSubMenu()}>
          <div className="cursor-pointer ">
            <Image
              className="ring-1 rounded-full ring-primaryBorder"
              src="/profile.png"
              width={38}
              height={38}
              alt="Picture of the user"
            />
          </div>
        </li>
      )}

      <li>
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

      <li>
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

      {!session && (
        <li>
          <Link href="/login" className="flex gap-1">
            <span className="opacity-0">{"{"}</span>
            Sign In/Up
            <span className="opacity-0">{"}"}</span>
          </Link>
        </li>
      )}
      {/*  {session && (
        <li onClick={() => setIsAuth(false)}>
          <div className="flex gap-1 cursor-pointer">
            <span className="opacity-0">{"{"}</span>
            Log out
            <span className="opacity-0">{"}"}</span>
          </div>
        </li>
      )} */}
    </ul>
  );
}
