"use client";
import Logo from "@/app/ui/Logo";
import MenuOptions from "@/app/ui/MenuOptions";
import clsx from "clsx";
import { MdMenu } from "react-icons/md";
import { GrClose } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa6";
import { RxExit } from "react-icons/rx";
import { useState, useEffect } from "react";
import { logout } from "@/lib/actions";
import { Session } from "next-auth";
import { poppins } from "@/app/ui/fonts";
import Link from "next/link";

export default function AuthLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  const [open, setOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  const [submenu, setSubmenu] = useState(false);

  useEffect(() => {
    if (isAuth === false) {
      (async function logoutUser(): Promise<void> {
        await logout();
      })();
    }
  }, [isAuth]);

  function openSubMenu() {
    setSubmenu(!submenu);
  }

  function closeSubMenu() {
    setSubmenu(false);
  }

  return (
    <div>
      {/* Background image */}
      <div className="fixed min-h-screen w-full blog-hero-bg h-screen -z-50"></div>
      {/* Dark Curtain */}
      <div
        className={clsx(
          "fixed top-[76px] right-0 left-0 h-[calc(100vh-76px)] bg-black opacity-40 z-10",
          {
            hidden: !open,
          }
        )}
        onClick={() => setOpen(!open)}
      ></div>
      {/* Small screens sidebar */}
      <div
        className={clsx(
          "fixed w-1/2 top-[76px] right-0 h-[calc(100vh-76px)] bg-white z-20 px-2 py-8",
          {
            hidden: !open,
          }
        )}
      >
        {/* Menu icon */}
        <GrClose
          onClick={() => setOpen(!open)}
          className="mb-5 ml-auto mr-8 text-xl md:text-2xl 2xl:text-3xl"
        />
        {/* Sidebar options */}
        <MenuOptions session={session} vertical={true} setIsAuth={setIsAuth} />
      </div>
      <div>
        {/* navbar */}
        <nav className="fixed top-0 left-0 flex w-full justify-between items-center bg-white px-8 md:px-20 py-6 drop-shadow z-50">
          <Logo />
          {/* Large screens menu */}
          <div className="hidden lg:block">
            <MenuOptions
              session={session}
              vertical={false}
              openSubMenu={openSubMenu}
            />
          </div>
          {/* Small screens menu */}
          <div className="lg:hidden">
            <div>
              {/* Menu button */}
              <div>
                <MdMenu
                  onClick={() => setOpen(!open)}
                  className={clsx("text-3xl", { hidden: open })}
                />
              </div>
            </div>
          </div>
        </nav>
        {/* User's options */}
        <div
          className={clsx(
            poppins.className,
            "fixed transition duration-500 -top-20 right-10 flex flex-col py-4 z-40 bg-white drop-shadow w-72",
            {
              "transition duration-500 translate-y-40": submenu,
            }
          )}
        >
          {/* User info */}
          <Link href="/auth/blog/profile" onClick={() => openSubMenu()}>
            <div className="flex justify-between cursor-pointer px-4 py-2 items-center hover:bg-textLight hover:text-white text-textLight">
              <div className="flex flex-col w-5/6">
                <span className="truncate font-semibold">
                  {session?.user?.name}
                </span>
                <div className="truncate text-sm">
                  {session?.user?.email || "no email found"}
                </div>
              </div>
              <FaRegUser className="size-8" />
            </div>
          </Link>
          {/* Sign out */}
          <div
            onClick={() => setIsAuth(false)}
            className="flex justify-between cursor-pointer px-4 py-2 items-center hover:bg-textLight hover:text-white text-textLight"
          >
            <div className="cursor-pointer">Sign Out</div>
            <RxExit className="size-8" />
          </div>
        </div>
        <main onClick={() => closeSubMenu()}>{children}</main>
      </div>
    </div>
  );
}
