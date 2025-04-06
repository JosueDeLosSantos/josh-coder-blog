"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import { Session } from "next-auth";
import ProfileImage from "../ProfileImage";
import Button from "@/app/ui/Button";
import { poppins } from "@/app/ui/fonts";
import { getParentComments, submitComment, deleteComment } from "@/lib/actions";
import CommentsThreads from "../CommentsThreads";
import { Message } from "@/lib/definitions";

export default function CommentsEditor({
  htmlFor,
  value,
  session,
  post_id,
}: {
  htmlFor: string;
  value?: string;
  session: Session | null;
  post_id: string;
}) {
  const [text, setText] = useState<string>(value || "");
  const [comments, setComments] = useState<Message[]>([]);
  useEffect(() => {
    (async () => {
      const comments: Message[] = await getParentComments(post_id);
      setComments(comments);
    })();
  }, [post_id]);

  async function dumpComment(comment_id: string) {
    await deleteComment(comment_id);
    // update comments threads
    const updatedComments = await getParentComments(post_id);
    setComments(updatedComments);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("post_id", post_id);
    formData.append("email", session?.user?.email || "");
    await submitComment(formData);
    setText("");
    // update comments threads
    const updatedComments = await getParentComments(post_id);
    setComments(updatedComments);
  }

  const renderHeader = () => {
    return (
      <span className="ql-formats">
        <button className="ql-bold" aria-label="Bold"></button>
        <button className="ql-italic" aria-label="Italic"></button>
        <button className="ql-underline" aria-label="Underline"></button>
      </span>
    );
  };

  const header = renderHeader();

  return (
    <div className="flex flex-col gap-8 mt-10 border-t border-blogBg p-8">
      <h2
        className={`${poppins.className} text-text font-semibold text-3xl md:text-4xl`}
      >
        Comments
      </h2>
      {session && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-start">
          <div className="cursor-pointer ">
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              src={session?.user?.image}
              width={38}
              height={38}
              alt="Picture of the user"
            />
          </div>
          <div className="flex flex-col gap-2 w-5/6">
            <div className="">
              <label htmlFor={htmlFor}></label>
              <Editor
                value={text || ""}
                onTextChange={(e) => setText(e.htmlValue || "")}
                headerTemplate={header}
                placeholder="Write a comment..."
                style={{ height: "120px" }}
              />
              <input
                className="hidden"
                id={htmlFor}
                name={htmlFor}
                value={text || ""}
                readOnly
              />
            </div>
            <div>
              <Button
                disabled={text ? false : true}
                layout="form"
                type="submit"
                bg="primary"
              >
                Submit
              </Button>
            </div>
          </div>
        </form>
      )}
      <CommentsThreads
        comments={comments}
        session={session}
        dumpComment={dumpComment}
      />
    </div>
  );
}
