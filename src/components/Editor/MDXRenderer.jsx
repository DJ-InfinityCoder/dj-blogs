"use client";

import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { useEffect, useState } from "react";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import Admonition from "./Admonition";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  dracula,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

import { useTheme } from "@/context/theme-context";

import { Copy, ClipboardCheck } from "lucide-react";

const CodeBlock = ({ className, children }) => {
  const { theme } = useTheme();
  const language = className?.replace("language-", "") || "javascript";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group border border-gray-300 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700">
        <div className="flex space-x-2">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
      </div>

      <button
        onClick={handleCopy}
        className="absolute right-2 top-12 hover:cursor-pointer border text-gray-500 hover:text-gray-700 border-gray-300 dark:border-gray-600 
        dark:text-gray-300 dark:hover:text-gray-100
          hover:bg-gray-400/30 hover:backdrop-blur-md dark:hover:bg-gray-700/30 
          p-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        {copied ? (
          <ClipboardCheck size={23} strokeWidth={1.25} />
        ) : (
          <Copy size={23} strokeWidth={1.25} />
        )}
      </button>

      <SyntaxHighlighter
        language={language}
        style={theme === "dark" ? dracula : oneLight  }
        wrapLongLines={true}
        PreTag="div"
        className="!m-0 !whitespace-pre-wrap !break-words text-base font-mono"
        codeTagProps={{ className: "!m-0 !whitespace-pre-wrap !break-words" }}
        showLineNumbers={typeof children === "string" && children.split("\n").length > 10}
        lineNumberStyle={{ width: "40px", minWidth: "40px", textAlign: "center" }}
        lineProps={{ style: { padding: "1px 0" } }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};

function remarkCustomAdmonitions() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "containerDirective" &&
        ["tip", "warning", "danger", "info", "caution", "note"].includes(
          node.name
        )
      ) {
        node.data = {
          hName: "Admonition",
          hProperties: { type: node.name },
        };
      }
    });
  };
}

const components = {
  Admonition,
  code: (props) => {
    const { className, children, ...rest } = props;

    const isInline = !className;

    if (isInline) {
      return (
        <code
          {...rest}
          className="px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono text-sm"
        >
          {children}
        </code>
      );
    }

    return <CodeBlock className={className}>{children}</CodeBlock>;
  },
};


export default function MDXRenderer({ source }) {
  const [mdx, setMdx] = useState(null);

  useEffect(() => {
    async function processMdx() {
      const serialized = await serialize(source, {
        mdxOptions: {
          development: false,
          remarkPlugins: [remarkGfm, remarkDirective, remarkCustomAdmonitions],
        },
      });
      setMdx(serialized);
    }
    processMdx();
  }, [source]);

  if (!mdx) return <p>Loading...</p>;

  return (
    <div className="dj-prose">
      <MDXRemote {...mdx} components={components} />
    </div>
  );
}
