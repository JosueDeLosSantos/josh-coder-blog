"use client";

import { useState, useEffect } from "react";
import { poppins } from "@/app/ui/fonts";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Session } from "next-auth";
import ProfileImage from "@/app/ui/ProfileImage";
// supabase
import { getUrl } from "@/lib/actions";

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
  const [imageUrl, setImageUrl] = useState<{
    src: string;
    date: number;
  } | null>(null);
  if (session) {
    useEffect(() => {
      (async () => {
        const image = await getUrl(session);
        setImageUrl(image);
      })();
    }, [session]);
  }

  return (
    <ul
      className={clsx(
        poppins.className,
        "flex items-center gap-5 font-semibold text-primary tracking-wider 2xl:text-base",
        { "flex-col items-start": vertical }
      )}
    >
      {session && (
        <li onClick={() => openSubMenu && openSubMenu()}>
          <div className="cursor-pointer ">
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              image={imageUrl}
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
    </ul>
  );
}
