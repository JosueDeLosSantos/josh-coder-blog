"use client";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { getPosts } from "@/app/lib/actions";
import { PostType } from "@/app/types";

export default function Home() {
  const [barLength, setBarLength] = useState(0);
  const [posts, setPosts] = useState<PostType[]>([]);
  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  console.log(posts);

  return (
    <div className="flex flex-col min-h-screen w-full px-8 pt-8 pb-8 md:px-20 2xl:px-40">
      <div className="w-full">
        {/* Search bar */}
        <div className="relative">
          <input
            type="text"
            maxLength={100}
            placeholder="Search..."
            className="w-full border-solid border pl-10 pr-16 py-1 border-primaryLight outline-none focus-visible:ring-1 focus-visible:ring-primaryLight text-textLight rounded"
            onChange={(e) => setBarLength(e.target.value.length)}
          />
          <HiMagnifyingGlass className="absolute top-0 left-0 z-10 text-2xl ml-2 mt-1 text-primaryLight" />
          <div className="absolute top-0 right-0 mr-2 mt-1">
            <span
              className={clsx(
                "text-xs",
                { "text-secondaryDark": barLength === 100 },
                { "text-textLight": barLength < 100 }
              )}
            >{`${barLength} / 100`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
