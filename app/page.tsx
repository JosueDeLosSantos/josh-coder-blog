import Image from "next/image";
import heroImageOne from "@/public/hero-image-one.png";
import heroImageTwo from "@/public/hero-image-two.png";
import Logo from "@/app/ui/Logo";
import Button from "@/app/ui/Button";
import { orbitron, oxanium, inter, poppins } from "@/app/ui/fonts";
import clsx from "clsx";
import Link from "next/link";
//sanity
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/live";
import { PostType } from "@/app/types";

export default async function Hero() {
  const ALL_POSTS = defineQuery(`*[_type == "post"]`);
  const data = await sanityFetch({ query: ALL_POSTS });
  const posts: PostType[] = data.data;

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
        <div className="flex flex-wrap justify-center gap-5 2xl:gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 max-md:mt-8 md:mt-10 w-fit mx-auto">
          {posts.slice(0, 6).map((post) => (
            <Link
              key={post._id}
              href={`/blog/${encodeURIComponent(post.slug.current)}`}
            >
              <div className="flex flex-col gap-2 bg-white max-w-80 h-full min-h-64 p-4 shadow-md rounded-lg cursor-default">
                <div
                  className={`${poppins.className} text-text font-semibold max-md:text-lg md:text-xl`}
                >
                  <h3>{post.title}</h3>
                </div>
                <div className={`${inter.className} text-textLight`}>
                  <p>{post.description}</p>
                </div>
                <div
                  className={`${poppins.className} text-secondary cursor-pointer`}
                >
                  Read More
                </div>
              </div>
            </Link>
          ))}
        </div>
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
