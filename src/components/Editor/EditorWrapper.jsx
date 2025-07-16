"use client";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("@/components/Editor/Editor"), {
  ssr: false,
});

const EditorWrapper = ({ content, setContent }) => {
  return <Editor content={content} setContent={setContent} />;
};

export default EditorWrapper;
