import "@/app/ui/globals.css";
import { Metadata } from "next";
import { SanityLive } from "@/sanity/live";

export const metadata: Metadata = {
  title: "Josh Coder Blog",
  description: "hero page title",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        <SanityLive />
      </body>
    </html>
  );
}
