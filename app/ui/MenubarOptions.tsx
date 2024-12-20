"use client";

import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function MenubarOptions() {
  const pathname = usePathname();

  return (
    <ul
      className={`${poppins.className} flex gap-5 font-semibold text-primary tracking-wider`}
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
        <Link href="/blog/signIn" className="flex gap-1">
          {" "}
          Sign In/Up
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
    </ul>
  );
}
