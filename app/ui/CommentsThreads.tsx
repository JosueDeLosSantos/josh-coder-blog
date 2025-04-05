"use client";

import { getParentComments, getChildComments } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Message } from "@/lib/definitions";
import ProfileImage from "./ProfileImage";
import { Session } from "next-auth";

export default function CommentsThreads({ post_id }: { post_id: string }) {
  const [comments, setComments] = useState<Message[]>([]);
  useEffect(() => {
    (async () => {
      const comments: Message[] = await getParentComments(post_id);
      setComments(comments);
    })();
  }, [post_id]);

  return (
    <div className="flex flex-col gap-8 p-8">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col gap-4 bg-white shadow-sm rounded-md p-4"
        >
          <div className="flex items-center gap-4">
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              src={comment.image}
              alt={comment.name || "User"}
              width={38}
              height={38}
            />
            <div>
              <h3 className="text-lg font-semibold">{comment.name}</h3>
            </div>
          </div>
          <div
            contentEditable="true"
            dangerouslySetInnerHTML={{ __html: comment.message }}
          ></div>
          <ChildComments parent_id={comment.id} />
        </div>
      ))}
    </div>
  );
}

function ChildComments({ parent_id }: { parent_id: string }) {
  const [comments, setComments] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      const comments: Message[] = await getChildComments(parent_id);
      setComments(comments);
    })();
  }, [parent_id]);

  return (
    <div className="flex flex-col gap-8 p-8">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="flex flex-col gap-4 bg-white shadow-sm rounded-md p-4"
        >
          <div className="flex items-center gap-4">
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              src={comment.image}
              alt={comment.name || "User"}
              width={32}
              height={32}
            />
            <div>
              <h3 className="text-lg font-semibold">{comment.name}</h3>
            </div>
          </div>
          <div
            contentEditable="true"
            dangerouslySetInnerHTML={{ __html: comment.message }}
          ></div>
        </div>
      ))}
    </div>
  );
}
