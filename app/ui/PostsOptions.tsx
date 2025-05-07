"use client";

import {
  getPostLikes,
  isPostLiked,
  likePost,
  savePost,
  getPostBookmarks,
  isPostBookmarked,
  commentsCount,
} from "@/lib/actions";
import { Session } from "next-auth";
import React from "react";
import { useEffect, useState } from "react";
import {
  RiHeartAddLine,
  RiHeartAddFill,
  RiBookmarkFill,
  RiBookmarkLine,
} from "react-icons/ri";
import { MdOutlineModeComment } from "react-icons/md";
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
  const [bookmarks, setBookmarks] = useState(0);
  const [comments, setComments] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  async function handleBookmark() {
    if (session?.user?.email) {
      const result = await savePost(post_id, session.user.email);
      if (result) {
        setBookmarks(bookmarks - 1);
        setIsBookmarked(false);
      } else {
        setBookmarks(bookmarks + 1);
        setIsBookmarked(true);
      }
    } else {
      setIsLoggedOut(true);
    }
  }

  function handleComments() {
    const commentSection = document.getElementById("comments-section");
    if (commentSection) {
      commentSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  useEffect(() => {
    (async () => {
      if (session?.user?.email) {
        const liked = await isPostLiked(post_id, session.user.email);
        setIsLiked(liked);
        const bookmarked = await isPostBookmarked(post_id, session.user.email);
        setIsBookmarked(bookmarked);
      }
      const likesAmount = await getPostLikes(post_id);
      setLikes(Number(likesAmount));
      const bookmarksAmount = await getPostBookmarks(post_id);
      setBookmarks(Number(bookmarksAmount));
      const commentsAmount = await commentsCount(post_id);
      setComments(Number(commentsAmount));
    })();
  }, [post_id, session?.user?.email]);

  return (
    <div className="lg:relative">
      <div className="lg:fixed lg:top-36 max-lg:p-4 max-lg:bg-white max-lg:border-t-[0.5px] flex flex-row gap-7 max-lg:justify-center max-lg:w-full lg:flex-col max-lg:fixed max-lg:bottom-0 z-10">
        {/* LIKES */}
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
        {/* BOOKMARKS */}
        <div className="flex max-lg:gap-1 lg:flex-col">
          <button onClick={() => handleBookmark()}>
            {isBookmarked ? (
              <RiBookmarkFill className="size-6 text-primaryDark hover:text-primaryDark" />
            ) : (
              <RiBookmarkLine className="size-6 text-textMild hover:text-primaryDark" />
            )}
          </button>
          <div
            className={clsx(
              "text-textMild text-sm flex justify-center max-lg:items-end",
              {
                "opacity-0": bookmarks === 0,
              }
            )}
          >
            <span>{bookmarks}</span>
          </div>
        </div>
        {/* COMMENTS */}
        <div className="flex max-lg:gap-1 lg:flex-col">
          <button onClick={() => handleComments()}>
            <MdOutlineModeComment className="size-6 text-textMild hover:text-primaryLight" />
          </button>
          <div
            className={clsx(
              "text-textMild text-sm flex justify-center max-lg:items-end",
              {
                "opacity-0": comments === 0,
              }
            )}
          >
            <span>{comments}</span>
          </div>
        </div>
      </div>
      {isLoggedOut && <LoginAlert slug={slug} handleClose={handleClose} />}
    </div>
  );
}
