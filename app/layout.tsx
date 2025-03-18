import "@/app/ui/globals.css";
import { Metadata } from "next";
import { SanityLive } from "@/sanity/live";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
        <SpeedInsights />
      </body>
    </html>
  );
}
