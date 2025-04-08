"use client";

import { deleteComment, getChildComments } from "@/lib/actions";
import { useState, useEffect } from "react";
import { Message } from "@/lib/definitions";
import ProfileImage from "./ProfileImage";
import { Session } from "next-auth";
import { ReplyEditor } from "@/app/ui/forms/Editors";
import React from "react";

export default function CommentsThreads({
  post_id,
  comments,
  session,
  dumpComment,
}: {
  post_id: string;
  comments: Message[];
  session: Session | null;
  dumpComment: (comment_id: string) => void;
}) {
  const [commentToSubmit, setCommentToSubmit] = useState<string>("");

  return (
    <div>
      {comments.map((comment) => (
        <div key={`${comment.id}-parent`}>
          <div className="flex gap-4 bg-white rounded-md py-4">
            {/* COMMENT'S IMAGE */}
            <div className="flex items-center gap-4 h-fit">
              <ProfileImage
                className="ring-1 rounded-full ring-primaryBorder bg-white"
                src={comment.image}
                alt={comment.name || "User"}
                width={38}
                height={38}
              />
            </div>
            {/* COMMENT'S CONTENT */}
            <div className="w-full">
              <div className="flex flex-col gap-4 shadow-sm w-full pb-4">
                <div className="w-fit">
                  <h3 className="text-lg font-semibold hover:bg-blogBg px-2 py-1 rounded-md">
                    {comment.name}
                  </h3>
                </div>
                <div
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: comment.message }}
                  className="px-2"
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
                handleDelete={dumpComment}
              />
            </div>
          </div>

          <ChildComments
            session={session}
            post_id={post_id}
            parent_id={comment.id}
            commentToSubmit={commentToSubmit}
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
}: {
  session: Session | null;
  post_id: string;
  parent_id: string;
  commentToSubmit: string;
}) {
  const [childComments, setChildComments] = useState<Message[]>([]);
  const [commentToDelete, setCommentToDelete] = useState<string>("");
  const [childCommentToSubmit, setChildCommentToSubmit] = useState<string>("");

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
    <div key={`${parent_id}-container`} className="ml-10">
      {childComments.map((comment) => (
        <div key={comment.id}>
          <div className="flex gap-4 bg-white rounded-md py-4">
            {/* COMMENT'S IMAGE */}
            <div className="flex items-center gap-4 h-fit">
              <ProfileImage
                className="ring-1 rounded-full ring-primaryBorder bg-white"
                src={comment.image}
                alt={comment.name || "User"}
                width={38}
                height={38}
              />
            </div>
            {/* COMMENT'S CONTENT */}
            <div className="w-full">
              <div className="flex flex-col gap-4 shadow-sm w-full pb-4">
                <div className="w-fit">
                  <h3 className="text-lg font-semibold hover:bg-blogBg px-2 py-1 rounded-md">
                    {comment.name}
                  </h3>
                </div>
                <div
                  contentEditable="true"
                  dangerouslySetInnerHTML={{ __html: comment.message }}
                  className="px-2"
                ></div>
              </div>
              {/* REPLY EDITOR */}
              <ReplyEditor
                post_id={post_id}
                htmlFor="comment"
                session={session}
                parent_id={comment.id}
                email={comment.email}
                handleDelete={deleteChildComment}
                setCommentToSubmit={setChildCommentToSubmit}
              />
            </div>
          </div>

          <ChildComments
            session={session}
            post_id={post_id}
            parent_id={comment.id}
            commentToSubmit={childCommentToSubmit}
          />
        </div>
      ))}
    </div>
  );
}
