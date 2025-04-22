"use client";

import { getPostLikes, isPostLiked, likePost } from "@/lib/actions";
import { Session } from "next-auth";
import React from "react";
import { useEffect, useState } from "react";
import { RiHeartAddLine, RiHeartAddFill } from "react-icons/ri";
import clsx from "clsx";
import LoginAlert from "@/app/ui/LoginAlert";

export default function PostsOptions({
  session,
  post_id,
  slug,
}: {
  session: Session | null;
  post_id: string;
  slug: string;
}) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  function handleClose() {
    setIsLoggedOut(!isLoggedOut);
  }

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
    } else {
      setIsLoggedOut(true);
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
    <>
      <div className="max-lg:bg-white max-lg:border-t-[0.5px] flex flex-row max-lg:justify-center max-lg:w-full lg:flex-col fixed bottom-0 lg:top-36 p-4 z-10">
        <div className="flex max-lg:gap-1 lg:flex-col">
          <button onClick={() => handleLike()}>
            {isLiked ? (
              <RiHeartAddFill className="size-6 text-secondaryDark hover:text-secondaryDark" />
            ) : (
              <RiHeartAddLine className="size-6 text-textMild hover:text-secondaryDark" />
            )}
          </button>
          <div
            className={clsx(
              "text-textMild text-sm flex justify-center max-lg:items-end",
              {
                "opacity-0": likes === 0,
              }
            )}
          >
            <span>{likes}</span>
          </div>
        </div>
      </div>
      {isLoggedOut && <LoginAlert slug={slug} handleClose={handleClose} />}
    </>
  );
}
