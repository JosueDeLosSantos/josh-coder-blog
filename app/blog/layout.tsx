import Logo from "@/app/ui/Logo";
import NavbarMenuOptions from "@/app/ui/MenubarOptions";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="fixed min-h-screen w-full blog-hero-bg h-screen -z-50"></div>
      <div>
        {/* navbar */}
        <nav className="fixed top-0 z-10 flex w-full justify-between items-center bg-white px-16 py-6 drop-shadow">
          <Logo />
          <NavbarMenuOptions />
        </nav>
        <main>{children}</main>
      </div>
    </>
  );
}
