import Image from "next/image";
import heroImageOne from "@/public/hero-image-one.png";
import heroImageTwo from "@/public/hero-image-two.png";
import Logo from "@/app/ui/Logo";
import Button from "@/app/ui/button";
import { orbitron, oxanium, inter, poppins } from "./ui/fonts";
import clsx from "clsx";

const samplePost = {
  title: "CSS quantity Queries Are Really Cool",
  description:
    "Quantity queries are an incredible CSS feature that allows you to style elements based on the number of elements in a container without using any JavaScript at all.",
};

const samplePosts = new Array(4).fill(samplePost);

export default function Home() {
  return (
    <>
      <div className="fixed min-h-screen w-full blog-hero-bg h-screen -z-50"></div>
      <div className="max-md:p-4 md:p-6 2xl:p-10">
        <header className="flex justify-center">
          <Logo motto={true} mobileHero={true} />
        </header>
        <div className="flex flex-col max-md:mt-8 md:mt-28 2xl:mt-36 items-center max-md:gap-8 md:gap-10 2xl:gap-12 justify-center">
          <div
            className={clsx(
              orbitron.className,
              "text-center max-md:text-xl md:text-3xl 2xl:text-5xl text-primary"
            )}
          >
            The go-to blog for all software developers
          </div>
          <Button message="Read Now" bg="secondary" />
          <div
            className={clsx(
              oxanium.className,
              "max-md:text-xl md:text-3xl 2xl:text-4xl text-text"
            )}
          >
            Featured Posts
          </div>
        </div>
        <div className="flex flex-wrap justify-center max-2xl:gap-5 2xl:gap-6 max-md:mt-8 md:mt-10">
          {samplePosts.map((post, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 bg-white max-w-80 p-4 shadow-md rounded-lg"
            >
              <div
                className={`${poppins.className} text-text font-semibold max-md:text-lg md:text-xl`}
              >
                <h3>{post.title}</h3>
              </div>
              <div className={`${inter.className} text-textLight`}>
                <p>{post.description}</p>
              </div>
              <div className={`${poppins.className} text-secondary`}>
                Read More
              </div>
            </div>
          ))}
        </div>
        <Image
          src={heroImageOne}
          alt="hero image one"
          width={286}
          height={325}
          className="object-cover absolute bottom-0 left-0 opacity-40 max-sm:hidden -z-10"
        />
        <Image
          src={heroImageTwo}
          alt="hero image two"
          width={286}
          height={325}
          className="object-cover absolute bottom-0 right-0 opacity-40 max-sm:hidden -z-20"
        />
      </div>
    </>
  );
}
