import { PostType } from "@/app/types";
import { poppins, inter } from "./fonts";
import clsx from "clsx";
import { DateTime } from "luxon";
import { ReadingListType } from "@/lib/definitions";
import { RiBookmarkFill } from "react-icons/ri";

export default async function Post({ post }: { post: PostType }) {
  return (
    <div className="flex flex-col gap-2 bg-white w-full p-4 shadow-md rounded-lg cursor-default">
      <div
        className={`${poppins.className} text-text font-semibold max-md:text-lg md:text-xl`}
      >
        <h3>{post.title}</h3>
      </div>
      <div className={clsx(poppins.className, "text-sm text-textLight")}>
        {DateTime.fromISO(post._createdAt).toLocaleString({
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </div>
      <div className={`${inter.className} text-textMild`}>
        <p>{post.description}</p>
      </div>
      <div
        className={`${poppins.className} text-secondary mb-2 cursor-pointer`}
      >
        Read More
      </div>
      <div className="flex flex-wrap gap-2">
        {post.tag &&
          post.tag.length &&
          post.tag.map((name) => (
            <div
              key={name + post._id}
              className="text-primaryLight border border-primaryLight text-sm px-2 py-0.5 rounded"
            >
              {name}
            </div>
          ))}
      </div>
    </div>
  );
}

export async function BookmarkedPost({ post }: { post: ReadingListType }) {
  return (
    <div className="flex flex-col gap-2 bg-white w-full p-4 shadow-md rounded-lg cursor-default">
      <div
        className={`${poppins.className} text-text font-semibold max-md:text-lg md:text-xl`}
      >
        <h3>{post.title}</h3>
      </div>
      <div className={clsx(poppins.className, "text-sm text-textLight")}>
        <div className="flex gap-1 items-center">
          <RiBookmarkFill />
          {DateTime.fromISO(post.created_at.toISOString()).toLocaleString({
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </div>
      </div>
      <div className={`${inter.className} text-textMild`}>
        <p>{post.description}</p>
      </div>
      <div
        className={`${poppins.className} text-secondary mb-2 cursor-pointer`}
      >
        Read More
      </div>
      <div className="flex flex-wrap gap-2">
        {post.tags &&
          post.tags.length &&
          post.tags.map((name) => (
            <div
              key={name + post.slug}
              className="text-primaryLight border border-primaryLight text-sm px-2 py-0.5 rounded"
            >
              {name}
            </div>
          ))}
      </div>
    </div>
  );
}

export async function PostSkeleton() {
  return (
    <div className="bg-white ">
      <div className="animate-pulse flex flex-col gap-2 w-full p-4 shadow-md rounded-lg cursor-default">
        <div className="h-7 w-1/2 bg-text rounded-full mb-2 opacity-50" />
        <div className="h-5 w-24 bg-textLight rounded-full opacity-50 mb-2" />
        <div className="flex flex-col gap-2">
          {[...Array(2)].map((_, j) => (
            <div
              key={j}
              className="h-5 w-full bg-textMild rounded-full opacity-50"
            />
          ))}
        </div>
        <div className="mt-2 h-6 w-28 bg-secondary rounded-full opacity-50 mb-2" />
        <div className="bg-primaryLight h-6 w-20 rounded opacity-50" />
      </div>
    </div>
  );
}
