"use client";

import { getPostLikes, isPostLiked, likePost } from "@/lib/actions";
import { Session } from "next-auth";
import React from "react";
import { useEffect, useState } from "react";
import { RiHeartAddLine, RiHeartAddFill } from "react-icons/ri";
import clsx from "clsx";

export default function PostsOptions({
  session,
  post_id,
}: {
  session: Session | null;
  post_id: string;
}) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  async function handleLike() {
    if (session?.user?.email) {
      const result = await likePost(post_id, session.user.email);
      if (result) {
        setLikes(likes - 1);
        setIsLiked(false);
      } else {
        setLikes(likes + 1);
        setIsLiked(true);
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (session?.user?.email) {
        const liked = await isPostLiked(post_id, session.user.email);
        setIsLiked(liked);
      }
      const commentsAmount = await getPostLikes(post_id);
      setLikes(Number(commentsAmount));
    })();
  }, [post_id]);

  return (
    <div className="flex flex-col fixed top-36 left-4 max-lg:hidden">
      <div className="flex flex-col">
        <button onClick={() => handleLike()}>
          {isLiked ? (
            <RiHeartAddFill className="size-6 text-secondaryDark hover:text-secondaryDark" />
          ) : (
            <RiHeartAddLine className="size-6 text-textMild hover:text-secondaryDark" />
          )}
        </button>
        <span
          className={clsx("text-textMild text-sm text-center", {
            "opacity-0": likes === 0,
          })}
        >
          {likes}
        </span>
      </div>
    </div>
  );
}
