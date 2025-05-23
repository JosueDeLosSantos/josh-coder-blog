"use client";
import Logo from "@/app/ui/Logo";
import MenuOptions from "@/app/ui/MenuOptions";
import clsx from "clsx";
import { MdMenu } from "react-icons/md";
import { useState } from "react";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

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
        {/* Sidebar options */}
        <div className="h-screen" onClick={() => setOpen(!open)}>
          <MenuOptions session={null} vertical={true} />
        </div>
      </div>
      <div>
        {/* navbar */}
        <nav className="fixed top-0 left-0 flex w-full justify-between items-center bg-white px-8 md:px-20 py-6 drop-shadow z-50">
          <Logo />
          {/* Large screens menu */}
          <div className="hidden lg:block">
            <MenuOptions session={null} vertical={false} />
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
        <main>{children}</main>
      </div>
    </div>
  );
}
