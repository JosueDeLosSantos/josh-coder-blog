"use client";

import { getChildComments } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Message } from "@/lib/definitions";
import ProfileImage from "./ProfileImage";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Session } from "next-auth";

export default function CommentsThreads({
  comments,
  session,
  dumpComment,
}: {
  comments: Message[];
  session: Session | null;
  dumpComment: (comment_id: string) => void;
}) {
  function handleDelete(e: React.MouseEvent<SVGElement>) {
    dumpComment(e.currentTarget.id);
  }
  return (
    <>
      {comments.map((comment) => (
        <>
          <div key={comment.id} className="flex gap-4 bg-white rounded-md py-4">
            <div className="flex items-center gap-4">
              <ProfileImage
                className="ring-1 rounded-full ring-primaryBorder bg-white"
                src={comment.image}
                alt={comment.name || "User"}
                width={38}
                height={38}
              />
            </div>
            <div className="flex flex-col gap-4 shadow-sm p-4 w-full">
              <div>
                <h3 className="text-lg font-semibold">{comment.name}</h3>
              </div>
              <div
                contentEditable="true"
                dangerouslySetInnerHTML={{ __html: comment.message }}
              ></div>
              {session?.user?.email === comment.email && (
                <RiDeleteBin2Line
                  id={comment.id}
                  key={comment.id}
                  onClick={(e) => handleDelete(e)}
                />
              )}
            </div>
          </div>
          <ChildComments parent_id={comment.id} />
        </>
      ))}
    </>
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
    <>
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 bg-white rounded-md p-2">
          <div className="flex items-center gap-4">
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              src={comment.image}
              alt={comment.name || "User"}
              width={32}
              height={32}
            />
          </div>
          <div className="flex flex-col gap-4 shadow-sm p-4">
            <div>
              <h3 className="text-lg font-semibold">{comment.name}</h3>
            </div>
            <div
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: comment.message }}
            ></div>
          </div>
        </div>
      ))}
    </>
  );
}
