"use client";

import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { logout } from "@/lib/actions";

export default function MenubarOptions({
  vertical,
  session,
}: {
  vertical: boolean;
  session: Session | null;
}) {
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(true);
  const blogAddress = session ? "/auth/blog" : "/blog";
  const blogAbout = session ? "/auth/blog/about" : "/blog/about";

  useEffect(() => {
    if (isAuth === false) {
      logout();
    }
  }, [isAuth]);

  return (
    <ul
      className={clsx(
        poppins.className,
        "flex gap-5 font-semibold text-primary tracking-wider 2xl:text-base",
        { "flex-col items-start": vertical }
      )}
    >
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
      {session && (
        <li onClick={() => setIsAuth(false)}>
          <div className="flex gap-1 cursor-pointer">
            <span className="opacity-0">{"{"}</span>
            Log out
            <span className="opacity-0">{"}"}</span>
          </div>
        </li>
      )}
    </ul>
  );
}
