import Image from "next/image";
import heroImageOne from "@/public/hero-image-one.png";
import heroImageTwo from "@/public/hero-image-two.png";
import Logo from "@/app/ui/Logo";
import Button from "@/app/ui/Button";
import { orbitron, oxanium } from "@/app/ui/fonts";
import clsx from "clsx";
import Link from "next/link";
import { FeaturedPosts, FeaturedPostsSkeleton } from "@/app/ui/FeaturedPosts";
import { Suspense } from "react";

export default async function Hero() {
  return (
    <>
      <div className="fixed min-h-screen w-full blog-hero-bg h-screen -z-50"></div>
      {/* This is the hero section */}
      <div className="max-md:p-2 md:p-6 2xl:p-10">
        <header className="flex justify-center">
          <Logo motto={true} mobileHero={true} />
        </header>
        <div className="flex flex-col max-md:mt-8 md:mt-20 2xl:mt-36 items-center max-md:gap-8 md:gap-10 2xl:gap-12 justify-center">
          <div
            className={clsx(
              orbitron.className,
              "text-center max-md:text-2xl md:text-3xl 2xl:text-5xl text-primary"
            )}
          >
            <h1>The go-to blog for all software developers</h1>
          </div>
          {/* This button takes users to a list of all posts */}
          <Link href="/blog">
            <Button
              bg="secondary"
              disabled={false}
              type="button"
              layout="landing"
            >
              Read Now
            </Button>
          </Link>
          <div
            className={clsx(
              oxanium.className,
              "max-md:text-2xl md:text-3xl 2xl:text-4xl text-text"
            )}
          >
            <h3>Featured Posts</h3>
          </div>
        </div>
        {/* This section contains Featured Posts */}
        <Suspense fallback={<FeaturedPostsSkeleton />}>
          <FeaturedPosts />
        </Suspense>

        <Image
          src={heroImageOne}
          alt="hero image one"
          width={286}
          height={325}
          className="object-cover fixed bottom-0 left-0 opacity-40 max-sm:hidden -z-10"
        />
        <Image
          src={heroImageTwo}
          alt="hero image two"
          width={286}
          height={325}
          className="object-cover fixed bottom-0 right-0 opacity-40 max-sm:hidden -z-20"
        />
      </div>
    </>
  );
}
