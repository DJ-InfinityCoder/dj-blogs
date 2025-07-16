"use client";

import { useState } from "react";
import { MDXEditor } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  codeBlockPlugin,
  tablePlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  CreateLink,
  InsertImage,
  ListsToggle,
  BlockTypeSelect,
  InsertTable,
  InsertThematicBreak,
  CodeToggle,
  codeMirrorPlugin,
  sandpackPlugin,
  InsertCodeBlock,
  InsertSandpack,
  ChangeCodeMirrorLanguage,
  ShowSandpackInfo,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  InsertAdmonition,
  DiffSourceToggleWrapper,
  diffSourcePlugin,
  StrikeThroughSupSubToggles,
  frontmatterPlugin,
  InsertFrontmatter,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import "./editor.css";
import { useTheme } from "@/context/theme-context";

const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello DJ</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const sandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

const supportedLanguages = {
  js: "JavaScript",
  jsx: "JavaScript (React)",
  ts: "TypeScript",
  tsx: "TypeScript (React)",
  css: "CSS",
  html: "HTML",
  python: "Python",
  java: "Java",
  c: "C",
  cpp: "C++",
  bash: "Bash",
};

export default function Editor({ content, setContent }) {
  const [viewMode, setViewMode] = useState("rich-text");
  const { theme } = useTheme();

  const handleToggleViewMode = (newMode) => {
    setViewMode(newMode);
  };

  const imageUploadHandler = async (image) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(image);
    });
  };

  return (
    <div>
      <MDXEditor
        markdown={content}
        onChange={setContent}
        jsx={true}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          linkPlugin(),
          imagePlugin({
            imageUploadHandler,
          }),
          tablePlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: supportedLanguages, 
          }),
          sandpackPlugin({ sandpackConfig }),
          directivesPlugin({
            directiveDescriptors: [AdmonitionDirectiveDescriptor],
          }),
          diffSourcePlugin({
            diffMarkdown: "An older version",
            viewMode,
          }),
          frontmatterPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex items-center justify-between w-full">
                <DiffSourceToggleWrapper
                  onViewModeChange={handleToggleViewMode}
                >
                  <div className="relative flex items-center gap-x-2">
                    <UndoRedo />
                    <div className="w-px h-6 bg-gray-300" />
                    <BoldItalicUnderlineToggles />
                    <CodeToggle />
                    <div className="w-px h-6 bg-gray-300" />
                    <StrikeThroughSupSubToggles />
                    <div className="w-px h-6 bg-gray-300" />
                    <ListsToggle />
                    <BlockTypeSelect />
                    <div className="w-px h-6 bg-gray-300" />
                    <CreateLink />
                    <InsertImage />
                    <InsertTable />
                    <InsertThematicBreak />
                    <div className="w-px h-6 bg-gray-300" />
                    <InsertCodeBlock />
                    <InsertSandpack />
                    <div className="w-px h-6 bg-gray-300" />
                    <InsertAdmonition />
                    <div className="w-px h-6 bg-gray-300" />
                    <InsertFrontmatter />
                  </div>
                </DiffSourceToggleWrapper>
              </div>
            ),
          }),
        ]}
        className={`border dj-prose border-gray-300 rounded-md min-h-[300px] p-3 w-full text-wrap break-words overflow-auto ${
          theme === "dark" ? "dark-editor" : ""
        }`}
      />
    </div>
  );
}
