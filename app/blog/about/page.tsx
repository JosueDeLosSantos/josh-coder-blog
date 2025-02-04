import { FiMail } from "react-icons/fi";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin, FaInstagram } from "react-icons/fa";
import { inter, poppins } from "@/app/ui/fonts";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
//sanity
import { defineQuery } from "next-sanity";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { sanityFetch } from "@/sanity/live";
import { Author } from "@/app/types";

export default async function About() {
  const AUTHOR_INFO = defineQuery(`*[_type == "author"][0]`);
  const { data: author }: { data: Author } = await sanityFetch({
    query: AUTHOR_INFO,
  });

  // image builder
  const { projectId, dataset } = client.config();
  const urlFor = (source: SanityImageSource) =>
    projectId && dataset
      ? imageUrlBuilder({ projectId, dataset }).image(source)
      : null;
  //@ts-expect-error no logical error
  const profileImage = urlFor(author?.image).url();

  const components: Partial<PortableTextReactComponents> = {
    block: {
      h4: ({ children }) => (
        <h2 className="text-2xl font-semibold">{children}</h2>
      ),
      normal: ({ children }) => <p className="mb-4">{children}</p>,
    },
  };

  return (
    <div className="flex flex-col min-h-screen px-8 pb-8 pt-32 md:px-20 2xl:px-40">
      <div className="relative bg-white border border-primaryBorder rounded-lg text-center px-8 md:px-16 pb-8 pt-20 mx-auto max-w-3xl">
        <Image
          src={profileImage || "https://placehold.co/120x120/png"}
          alt={author.name || "Blog author"}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 rounded-full ring-1 ring-primaryBorder"
          height="120"
          width="120"
        />
        <div>
          <h1 className={`${poppins.className} text-2xl font-semibold  mb-8`}>
            About Josh Coder
          </h1>
          {author?.about ? (
            <div className={`${inter.className} text-text text-left`}>
              <PortableText value={author.about} components={components} />
            </div>
          ) : null}
        </div>
        <div>
          <h2 className={`${poppins.className} text-2xl font-semibold mt-8`}>
            Contact
          </h2>
          <p className={`${poppins.className} mt-8`}>
            I would love to hear from you!
          </p>
          <div className="flex gap-8 justify-center mt-8">
            <a href={`mailto:${author?.email}`} className="cursor-pointer">
              <FiMail className="size-8" />
            </a>
            <a href={`${author?.xtwitter}`} className="cursor-pointer">
              <FaXTwitter className="size-8" />
            </a>
            <a href={`${author?.linkedin}`} className="cursor-pointer">
              <FaLinkedin className="size-8" />
            </a>
            <a href={`${author?.instagram}`} className="cursor-pointer">
              <FaInstagram className="size-8" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
