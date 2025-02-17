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
        <Link href="/blog" className="flex gap-1">
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== "/blog",
            })}
          >
            {"{"}
          </span>
          Posts
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== "/blog",
            })}
          >
            {"}"}
          </span>
        </Link>
      </li>

      <li>
        <Link href="/login" className="flex gap-1">
          <span className="opacity-0">{"{"}</span>
          Sign In/Up
          <span className="opacity-0">{"}"}</span>
        </Link>
      </li>
      <li>
        <Link href="/blog/about" className="flex gap-1">
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== "/blog/about",
            })}
          >
            {"{"}
          </span>
          About
          <span
            className={clsx("text-secondary", {
              "opacity-0": pathname !== "/blog/about",
            })}
          >
            {"}"}
          </span>
        </Link>
      </li>
      {session && (
        <li onClick={() => setIsAuth(false)}>
          <div className="flex gap-1">
            <span className="opacity-0">{"{"}</span>
            Log out
            <span className="opacity-0">{"}"}</span>
          </div>
        </li>
      )}
    </ul>
  );
}
