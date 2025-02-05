"use client";
import Logo from "@/app/ui/Logo";
import MenuOptions from "@/app/ui/MenuOptions";
import clsx from "clsx";
import { MdMenu } from "react-icons/md";
import { GrClose } from "react-icons/gr";
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
          "fixed top-0 right-0 bottom-0 left-0 bg-black opacity-40 z-10",
          { hidden: !open }
        )}
      ></div>
      {/* Small screens sidebar */}
      <div
        className={clsx(
          "fixed w-1/2 top-0 bottom-0 right-0 bg-white z-20 px-2 py-8 mt-[75px]",
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
        <MenuOptions vertical={true} />
      </div>
      <div>
        {/* navbar */}
        <nav className="fixed top-0 left-0 flex w-full justify-between items-center bg-white px-8 md:px-20 py-6 drop-shadow z-50">
          <Logo />
          {/* Large screens menu */}
          <div className="hidden lg:block">
            <MenuOptions vertical={false} />
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
