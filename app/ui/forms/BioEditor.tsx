"use client";

import React, { useState } from "react";
import { Editor } from "primereact/editor";
import { poppins } from "../fonts";

export default function BioEditor({
  htmlFor,
  value,
}: {
  htmlFor: string;
  value: string | null;
}) {
  const [text, setText] = useState<string | null>(value);

  console.log(text);

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
    <div className="card">
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
