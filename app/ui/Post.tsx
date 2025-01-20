"use client";

import { PostType } from "@/app/types";
import { poppins, inter } from "./fonts";
import clsx from "clsx";
import { DateTime } from "luxon";

export default function Post({ post }: { post: PostType }) {
  return (
    <div className="flex flex-col gap-2 bg-white w-full p-4 shadow-md rounded-lg">
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
      <div className={`${poppins.className} text-secondary`}>Read More</div>
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
