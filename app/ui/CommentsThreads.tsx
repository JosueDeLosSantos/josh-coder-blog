"use client";

import { deleteComment, getChildComments } from "@/lib/actions";
import { useState, useEffect } from "react";
import { Message } from "@/lib/definitions";
import ProfileImage from "./ProfileImage";
import { Session } from "next-auth";
import { ReplyEditor } from "@/app/ui/forms/Editors";
import { IoIosArrowUp } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";
import clsx from "clsx";
import { poppins, inter } from "./fonts";

export default function CommentsThreads({
  post_id,
  comments,
  session,
  slug,
  dumpComment,
}: {
  post_id: string;
  comments: Message[];
  session?: Session | null;
  slug: string;
  dumpComment: (comment_id: string) => void;
}) {
  const [commentToSubmit, setCommentToSubmit] = useState<string>("");

  return (
    <div>
      {comments.map((comment) => (
        <div key={`${comment.id}-parent`} className="relative">
          <div className="flex gap-4 bg-white rounded-md py-4">
            {/* COMMENT'S IMAGE */}
            <div className="flex items-center gap-4 h-fit">
              <ProfileImage
                className="ring-1 rounded-full ring-primaryBorder bg-white"
                userImage={comment.image}
                alt={comment.name || "User"}
                width={38}
                height={38}
              />
            </div>
            {/* COMMENT'S CONTENT */}
            <div className="w-full">
              <div className="flex flex-col gap-2 shadow-sm w-full pb-4">
                <div className="w-fit">
                  <h3
                    className={`${poppins.className} text-lg font-semibold hover:bg-blogBg px-2 py-1 rounded-md`}
                  >
                    {comment.name}
                  </h3>
                </div>
                <div
                  dangerouslySetInnerHTML={{ __html: comment.message }}
                  className={`${inter.className} px-2 text-textMild`}
                ></div>
              </div>

              {/* REPLY EDITOR */}
              <ReplyEditor
                post_id={post_id}
                htmlFor="comment"
                session={session}
                parent_id={comment.id}
                setCommentToSubmit={setCommentToSubmit}
                email={comment.email}
                slug={slug}
                handleDelete={dumpComment}
              />
            </div>
          </div>

          <ChildComments
            session={session}
            post_id={post_id}
            parent_id={comment.id}
            commentToSubmit={commentToSubmit}
            slug={slug}
          />
        </div>
      ))}
    </div>
  );
}

function ChildComments({
  session,
  post_id,
  parent_id,
  commentToSubmit,
  slug,
}: {
  session?: Session | null;
  post_id: string;
  parent_id: string;
  commentToSubmit: string;
  slug: string;
}) {
  const [childComments, setChildComments] = useState<Message[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<string>("");
  const [childCommentToSubmit, setChildCommentToSubmit] = useState<string>("");
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    async function fetchChildComments() {
      if (commentToDelete !== "") {
        await deleteComment(commentToDelete);
        setCommentToDelete("");
      }
      const data = await getChildComments(parent_id);
      setChildComments(data);
    }
    fetchChildComments();
  }, [parent_id, commentToDelete, commentToSubmit]);

  function deleteChildComment(id: string) {
    setCommentToDelete(id);
  }

  return (
    <>
      <button
        type="button"
        className={clsx(
          "flex gap-2 align-middle blog-hero-bg rounded-md px-8 py-1 text-sm ml-8",
          {
            hidden: (childComments.length === 0 && !showReplies) || showReplies,
          }
        )}
        onClick={() => setShowReplies(true)}
      >
        {" "}
        <div className="relative">
          <IoIosArrowUp className="absolute top-[0.2rem] -left-3 text-textLight text-xs" />
          <IoIosArrowDown className="absolute top-[0.65rem] -left-3 text-textLight text-xs" />
        </div>
        <div>
          {`${childComments.length}`}{" "}
          {childComments.length === 1 ? "Reply" : "Replies"}
        </div>
      </button>
      {/* Reduce option */}
      <div
        className={clsx("absolute top-14 left-2", {
          hidden: !showReplies || childComments.length === 0,
        })}
      >
        <div
          className="relative hover:cursor-pointer"
          onClick={() => setShowReplies(false)}
        >
          <IoIosArrowDown className="absolute top-[0.2rem] left-0.5 text-textLight text-xs" />
          <IoIosArrowUp className="absolute top-[0.65rem] left-0.5 text-textLight text-xs" />
        </div>
      </div>
      <div key={`${parent_id}-container`} className="ml-8">
        {/* Replies */}
        {showReplies &&
          childComments.map((comment) => (
            <div key={comment.id} className="relative">
              <div className="flex gap-2 bg-white rounded-md py-4">
                {/* COMMENT'S IMAGE */}
                <div className="flex items-center gap-2 h-fit">
                  <ProfileImage
                    className="ring-1 rounded-full ring-primaryBorder bg-white"
                    userImage={comment.image}
                    alt={comment.name || "User"}
                    width={28}
                    height={28}
                  />
                </div>
                {/* COMMENT'S CONTENT */}
                <div className="w-full">
                  <div className="flex flex-col gap-2 shadow-sm w-full pb-4">
                    <div className="w-fit">
                      <h3
                        className={`${poppins.className} text-lg font-semibold hover:bg-blogBg px-2 py-1 rounded-md`}
                      >
                        {comment.name}
                      </h3>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{ __html: comment.message }}
                      className={`${inter.className} px-2 text-textMild`}
                    ></div>
                  </div>
                  {/* REPLY EDITOR */}
                  {session && (
                    <ReplyEditor
                      post_id={post_id}
                      htmlFor="comment"
                      session={session}
                      parent_id={comment.id}
                      email={comment.email}
                      handleDelete={deleteChildComment}
                      setCommentToSubmit={setChildCommentToSubmit}
                    />
                  )}
                  {!session && (
                    <ReplyEditor
                      post_id={post_id}
                      htmlFor="comment"
                      session={session}
                      parent_id={comment.id}
                      email={comment.email}
                      slug={slug}
                      handleDelete={deleteChildComment}
                      setCommentToSubmit={setChildCommentToSubmit}
                    />
                  )}
                </div>
              </div>

              <ChildComments
                session={session}
                post_id={post_id}
                parent_id={comment.id}
                commentToSubmit={childCommentToSubmit}
                slug={slug}
              />
            </div>
          ))}
      </div>
    </>
  );
}
