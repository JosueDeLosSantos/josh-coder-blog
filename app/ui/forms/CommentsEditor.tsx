"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "primereact/editor";
import { Session } from "next-auth";
import ProfileImage from "../ProfileImage";
import { getUrl } from "@/lib/actions";
import Button from "@/app/ui/Button";
import { poppins } from "@/app/ui/fonts";
import { submitComment } from "@/lib/actions";

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
  const [imageUrl, setImageUrl] = useState<string>("/profile.png");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("post_id", post_id);
    formData.append("email", session?.user?.email || "");
    await submitComment(formData);
    setText("");
  }

  useEffect(() => {
    (async () => {
      const image = await getUrl(session);
      setImageUrl(image);
    })();
  }, [session]);

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
              src={imageUrl}
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
                children="Submit"
                layout="form"
                type="submit"
                bg="primary"
              />
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
