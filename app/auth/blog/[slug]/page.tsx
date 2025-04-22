import { defineQuery } from "next-sanity";
import { PortableText, PortableTextReactComponents } from "@portabletext/react";
import { sanityFetch } from "@/sanity/live";
import { PostType } from "@/app/types";
import { poppins, inter } from "@/app/ui/fonts";
import clsx from "clsx";
import { DateTime } from "luxon";
import Image from "next/image";
import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { CommentsEditor } from "@/app/ui/forms/Editors";
import { auth } from "@/auth";
import { addPost } from "@/lib/actions";
import PostsOptions from "@/app/ui/PostsOptions";

//@ts-expect-error no logical error
export default async function Page({ params }) {
  const session = await auth();
  const { slug }: { slug: string } = await params;
  const POST = defineQuery(`*[slug.current == '${slug}'][0]`);
  const { data: post }: { data: PostType } = await sanityFetch({ query: POST });
  // add post to sql db
  await addPost(post);

  // image builder
  const { projectId, dataset } = client.config();
  const urlFor = (source: SanityImageSource) =>
    projectId && dataset
      ? imageUrlBuilder({ projectId, dataset }).image(source)
      : null;
  // block components
  const components: Partial<PortableTextReactComponents> = {
    types: {
      image: ({ value }) => {
        if (!value?.asset?._ref) return null;
        return (
          <div className="w-3/4 md:w-1/2 mx-auto">
            <Image
              //@ts-expect-error no logical error
              src={urlFor(value).url()}
              alt={value.alt || " "}
              layout="responsive"
              width={300}
              height={200}
            />
          </div>
        );
      },
    },
    marks: {
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary underline"
        >
          {children}
        </a>
      ),
      code: ({ children }) => (
        <code className="bg-gray-200 text-slate-600 px-1 rounded">
          {children}
        </code>
      ),
    },

    block: {
      h2: ({ children }) => (
        <h2 className="text-3xl md:text-4xl font-semibold mt-8 mb-4">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl md:text-3xl font-semibold mt-8 mb-4">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl md:text-2xl font-semibold my-3">{children}</h4>
      ),
      normal: ({ children }) => <p className="mb-4">{children}</p>,
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
      // number: ({ children }) => (
      //   <ol className="list-decimal pl-5">{children}</ol>
      // ),
    },
    listItem: {
      bullet: ({ children }) => <li className="my-2">{children}</li>,
      number: ({ children }) => <li className="my-2">{children}</li>,
    },
  };

  return (
    <div className="w-full">
      <PostsOptions session={session} post_id={post._id} slug={slug} />
      <div className="bg-white max-w-4xl py-4 rounded-lg cursor-default mx-auto mt-24">
        <div className="flex flex-col gap-4 lg:gap-5 px-4 md:px-16">
          <div
            className={`${poppins.className} text-text font-semibold text-3xl md:text-4xl lg:mt-16`}
          >
            <h1>{post.title}</h1>
          </div>
          <div
            className={clsx(
              poppins.className,
              "text-sm md:text-base text-textLight"
            )}
          >
            {DateTime.fromISO(post._createdAt).toLocaleString({
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tag &&
              post.tag.length &&
              post.tag.map((name) => (
                <div
                  key={name + post._id}
                  className="text-primaryLight border border-primaryLight text-sm md:text-base px-2 py-0.5 rounded"
                >
                  {name}
                </div>
              ))}
          </div>
        </div>
        <div
          className={`${inter.className} text-left mt-10 px-4 md:px-16 text-lg`}
        >
          <PortableText value={post.body} components={components} />
        </div>
        {/* Comments */}

        <CommentsEditor
          htmlFor="comment"
          session={session}
          post_id={post._id}
          slug={slug}
        />
      </div>
    </div>
  );
}
