"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import { poppins } from "../fonts";
import { Session } from "next-auth";
import ProfileImage from "../ProfileImage";
import Button, { DismissButton } from "@/app/ui/Button";
import {
  getParentComments,
  submitComment,
  deleteComment,
  likeComment,
  getCommentLikes,
  isCommentLiked,
} from "@/lib/actions";
import CommentsThreads from "../CommentsThreads";
import { Message } from "@/lib/definitions";
import { BiMessageRounded } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import Link from "next/link";

export function BioEditor({
  htmlFor,
  value,
}: {
  htmlFor: string;
  value: string | null;
}) {
  const [text, setText] = useState<string | null>(value);

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
    <div>
      <label className={`${poppins.className} text-text`} htmlFor={htmlFor}>
        Biography
      </label>
      <Editor
        value={text || ""}
        onTextChange={(e) => setText(e.htmlValue || "")}
        headerTemplate={header}
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
  );
}

export function CommentsEditor({
  htmlFor,
  value,
  session,
  post_id,
  slug,
}: {
  htmlFor: string;
  value?: string;
  session?: Session | null;
  post_id: string;
  slug?: {
    current: string;
    _type: "slug";
  };
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
    <div className="flex flex-col gap-14 mt-10 border-t border-blogBg py-8 px-4 md:px-16">
      <h2
        className={`${poppins.className} text-text font-semibold text-3xl md:text-4xl`}
      >
        Comments
      </h2>
      {!session && (
        <div className="text-textLight">
          <span
            className={`${poppins.className}`}
          >{`Do you want to leave a comment?`}</span>{" "}
          <Link
            href={`/login/${slug?.current}`}
            className={`${poppins.className} text-primaryLight cursor-pointer hover:underline`}
          >
            Log in
          </Link>
        </div>
      )}
      {session && (
        <form onSubmit={handleSubmit} className="flex gap-2 items-start">
          <div className="cursor-pointer ">
            <ProfileImage
              className="ring-1 rounded-full ring-primaryBorder bg-white"
              session={session}
              width={38}
              height={38}
              alt="Picture of the user"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
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
        post_id={post_id}
        comments={comments}
        session={session}
        dumpComment={dumpComment}
      />
    </div>
  );
}

export function ReplyEditor({
  htmlFor,
  value,
  session,
  post_id,
  parent_id,
  email,
  handleDelete,
  setCommentToSubmit,
}: {
  htmlFor: string;
  value?: string;
  session: Session | null;
  post_id: string;
  parent_id: string;
  email: string;
  handleDelete: (id: string) => void;
  setCommentToSubmit: (comment_id: string) => void;
}) {
  const [text, setText] = useState<string>(value || "");
  const [editor, setEditor] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("post_id", post_id);
    formData.append("email", session?.user?.email || "");
    formData.append("parent_id", parent_id);
    const newComment = await submitComment(formData);
    setCommentToSubmit(newComment);
    setText("");
    setEditor(false);
  }

  async function handleLike() {
    if (session?.user?.email) {
      const result = await likeComment(parent_id, session.user.email);
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
        const liked = await isCommentLiked(parent_id, session.user.email);
        setIsLiked(liked);
      }
      const commentsAmount = await getCommentLikes(parent_id);
      setLikes(Number(commentsAmount));
    })();
  }, [parent_id]);

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
    <div key={`${parent_id}-editor`} className="flex flex-col gap-8">
      {/* OPTIONS */}
      {!editor && (
        <div
          key={`${parent_id}-button-group`}
          className="flex items-center gap-1"
        >
          {/* Likes */}
          <button
            key={`${parent_id}-likes`}
            id={`${parent_id}-likes`}
            type="button"
            className="flex items-center gap-2 hover:bg-blogBg px-2 py-1 rounded-md mt-1"
            onClick={() => handleLike()}
          >
            {isLiked ? (
              <IoHeartSharp className="text-lg" />
            ) : (
              <IoHeartOutline className="text-lg" />
            )}{" "}
            {likes > 0 && `${likes}`}
          </button>
          {/* Reply */}
          <button
            key={`${parent_id}-reply`}
            id={`${parent_id}-reply`}
            type="button"
            className="flex items-center gap-2 hover:bg-blogBg px-2 py-1 rounded-md mt-1"
            onClick={() => setEditor(true)}
          >
            <BiMessageRounded className="text-lg" /> Reply
          </button>
          {/* Delete */}
          {session?.user?.email === email && (
            <button
              key={`${parent_id}-delete`}
              id={`${parent_id}-delete`}
              type="button"
              onClick={() => handleDelete(parent_id)}
              className="flex items-center gap-2 hover:bg-blogBg px-2 py-1 rounded-md mt-1"
            >
              <MdDeleteOutline className="text-lg" /> Delete
            </button>
          )}
        </div>
      )}
      {session && editor && (
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 w-full">
            <div className="">
              <label htmlFor={htmlFor}></label>
              <Editor
                value={text || ""}
                onTextChange={(e) => setText(e.htmlValue || "")}
                headerTemplate={header}
                placeholder="Write your reply..."
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
            <div className="flex gap-2">
              <Button
                disabled={text ? false : true}
                layout="form"
                type="submit"
                bg="primary"
              >
                Submit
              </Button>
              <div onClick={() => setEditor(false)}>
                <DismissButton>Dismiss</DismissButton>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
