"use client";

import React, { useState } from "react";
import { Editor } from "primereact/editor";

export default function BioEditor() {
  const [text, setText] = useState<string | null>(null);

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
      <Editor
        value={text as string}
        onTextChange={(e) => setText(e.htmlValue)}
        headerTemplate={header}
        style={{ height: "120px" }}
      />
    </div>
  );
}
