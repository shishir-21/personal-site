"use client";
import React, { useState, useSyncExternalStore } from "react";
import Image from "next/image";
import * as runtime from "react/jsx-runtime";
import { tokenize } from "sugar-high";
import Link from "next/link";

import { BgGradient } from "./BgGradient";
import { CodePlayground } from "./CodePlayground";
import { Details, DetailsSummary } from "./Details";
import { LinkPreview } from "./LinkPreview/LinkPreview";
import type { LinkPreviewData } from "@/app/lib/link-previews/types";
import type { LinkPreviewManifest } from "@/app/lib/link-previews/types";

interface MDXProps {
  code: string;
  components?: Record<string, React.ComponentType>;
  [key: string]: any;
}

function Table({ data }) {
  let headers = data.headers.map((header) => (
    <th key={header}>{header}</th>
  ));
  let rows = data.rows.map((row) => (
    <tr key={row.join("|")}>
      {row.map((cell, cellIndex) => (
        <td key={`${cellIndex}-${cell}`}>{cell}</td>
      ))}
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

// Simple hash function matching the build script
function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(12, "0").slice(0, 12);
}

// Cache for manifest data — loaded at module scope on first client import
let manifestCache: LinkPreviewManifest | null = null;
let manifestLoading = false;
let manifestLoaded = false;
const manifestListeners = new Set<() => void>();

function subscribeToManifest(onChange: () => void) {
  manifestListeners.add(onChange);
  return () => manifestListeners.delete(onChange);
}

function getManifestSnapshot() {
  return manifestCache;
}

function loadManifest() {
  if (manifestLoaded || manifestLoading) return;
  manifestLoading = true;
  fetch("/previews/manifest.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      manifestCache = data;
      manifestLoaded = true;
      manifestLoading = false;
      manifestListeners.forEach((fn) => fn());
    })
    .catch(() => {
      manifestLoaded = true;
      manifestLoading = false;
    });
}

if (typeof window !== "undefined") {
  loadManifest();
}

function useLinkPreviewManifest() {
  return useSyncExternalStore(subscribeToManifest, getManifestSnapshot, () => null);
}

function getPreviewFromManifest(
  manifest: LinkPreviewManifest | null,
  url: string
): LinkPreviewData | null {
  if (!manifest?.previews) return null;

  const hash = hashUrl(url);
  const entry = manifest.previews[hash];

  if (!entry || entry.status !== "success") {
    return null;
  }

  return {
    screenshotPath: entry.screenshotPath,
    width: entry.width,
    height: entry.height,
  };
}

function CustomLink({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: any }) {
  const manifest = useLinkPreviewManifest();

  const styles = `font-medium border-b border-indigo-400 hover:border-b-2 text-slate-900 transition-all duration-75`;

  // Internal links (starting with /)
  if (href.startsWith("/")) {
    return (
      <Link className={styles} href={href} {...rest}>
        {children}
      </Link>
    );
  }

  // Anchor links (starting with #)
  if (href.startsWith("#")) {
    return <a className={styles} href={href} {...rest}>{children}</a>;
  }

  // External links - check for preview
  const preview = getPreviewFromManifest(manifest, href);

  return (
    <LinkPreview href={href} className={styles} preview={preview}>
      {children}
    </LinkPreview>
  );
}

function RoundedImage(props) {
  return (
    <Image src={props.src} alt={props.alt ?? ""} width={0} height={0} className="h-auto w-full drama-shadow rounded-xl" />
  );
}

function Callout(props) {
  return (
    <div className="mb-8 flex items-center rounded border border-neutral-200 bg-neutral-50 p-1 px-4 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
      <div className="mr-4 flex w-4 items-center">{props.emoji}</div>
      <div className="callout w-full">{props.children}</div>
    </div>
  );
}

function ProsCard({ title, pros }) {
  return (
    <div className="my-4 w-full rounded-xl border border-emerald-200 bg-neutral-50 p-6 dark:border-emerald-900 dark:bg-neutral-900">
      <span>{`You might use ${title} if...`}</span>
      <div className="mt-4">
        {pros.map((pro) => (
          <div key={pro} className="mb-2 flex items-baseline font-medium">
            <div className="mr-2 h-4 w-4">
              <svg className="h-4 w-4 text-emerald-500" viewBox="0 0 24 24">
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </g>
              </svg>
            </div>
            <span>{pro}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsCard({ title, cons }) {
  return (
    <div className="my-6 w-full rounded-xl border border-red-200 bg-neutral-50 p-6 dark:border-red-900 dark:bg-neutral-900">
      <span>{`You might not use ${title} if...`}</span>
      <div className="mt-4">
        {cons.map((con) => (
          <div key={con} className="mb-2 flex items-baseline font-medium">
            <div className="mr-2 h-4 w-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-red-500"
              >
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </div>
            <span>{con}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SH_TYPES = ['identifier','keyword','string','class','property','entity','jsxliterals','sign','comment','break','space'] as const;
const T_BREAK = 9;

function CodeTokens({ code }: { code: string }) {
  const tokens = tokenize(code);
  const lines: { type: number; value: string; offset: number }[][] = [];
  let currentLine: { type: number; value: string; offset: number }[] = [];
  let offset = 0;

  for (const [type, rawValue] of tokens) {
    if (type === T_BREAK) {
      lines.push(currentLine);
      currentLine = [];
      offset += 1;
    } else {
      const parts = rawValue.split("\n");
      for (let j = 0; j < parts.length; j++) {
        currentLine.push({ type, value: parts[j], offset });
        offset += parts[j].length;
        if (j < parts.length - 1) {
          lines.push(currentLine);
          currentLine = [];
          offset += 1;
        }
      }
    }
  }
  if (currentLine.length) lines.push(currentLine);

  return (
    <>
      {lines.map((lineTokens) => (
        <span key={lineTokens[0]?.offset ?? 0} className="sh__line">
          {lineTokens.map(({ type, value, offset: off }) => {
            const typeName = SH_TYPES[type] ?? "identifier";
            return (
              <span key={off} className={`sh__token--${typeName}`} style={{ color: `var(--sh-${typeName})` }}>
                {value}
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

const Pre = ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
  const childrenArray = React.Children.toArray(children);
  const code = childrenArray.find(
    (child) => React.isValidElement(child) && child.type === "code",
  ) as React.ReactElement;

  const className = code?.props.className || "";
  const matches = className.match(/language-(?<lang>.*)/);
  const language = matches?.groups?.lang ?? "";
  const filename = matches?.groups?.filename ?? ""; // Extract filename if present

  return (
    <pre {...props}>
      <div className="code-frame">
        <div className="code-frame-content">
          <div className="frame-controls">
            <div className="frame-control" />
            <div className="frame-control" />
            <div className="frame-control" />
          </div>
          {filename && <div className="code-frame-filename">{filename}</div>}
        </div>
      </div>
      <div className="code-container">{code}</div>
    </pre>
  );
};

function Code({ children, ...props }) {
  const isMultiLine = children.includes("\n");
  const [isCopied, setIsCopied] = useState(false);

  const className = props.className || "";
  const matches = className.match(/language-(?<lang>.*?)(:(?<filename>.*))?$/);
  const language = matches?.groups?.lang ?? "";
  const filename = matches?.groups?.filename ?? "";

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(children)
      .then(() => {
        console.log("Code copied to clipboard");
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      })
      .catch((err) => {
        console.error("Failed to copy code: ", err);
      });
  };

  if (!isMultiLine) {
    return <code {...props}><CodeTokens code={children} /></code>;
  }

  return (
    <div className="w-full max-w-[805px]">
      <div className="code-frame relative font-mono">
        <div className="code-frame-content">
          <div className="frame-controls">
            <div className="frame-control" />
            <div className="frame-control" />
            <div className="frame-control" />
          </div>
          {filename && <span className="code-frame-filename">{filename}</span>}
        </div>
        <button type="button" onClick={copyToClipboard}>
          {isCopied ? (
            <svg
              className="h-5 w-5 text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.25 16.25L9.64 16.69C9.81 16.92 10.1 17.04 10.39 16.99C10.67 16.94 10.9 16.72 10.98 16.44L10.25 16.25ZM16.71 8.34C17.04 8.08 17.1 7.61 16.84 7.29C16.58 6.96 16.11 6.9 15.79 7.16L16.71 8.34ZM8.36 12.31C8.12 11.98 7.65 11.9 7.31 12.14C6.98 12.38 6.9 12.85 7.14 13.19L8.36 12.31ZM10.98 16.44C11.56 14.23 12.97 12.21 14.28 10.71C14.93 9.97 15.55 9.37 15.99 8.96C16.22 8.76 16.4 8.6 16.53 8.49C16.59 8.44 16.64 8.4 16.67 8.37C16.69 8.36 16.7 8.35 16.71 8.35C16.71 8.34 16.71 8.34 16.71 8.34C16.71 8.34 16.71 8.34 16.71 8.34C16.72 8.34 16.72 8.34 16.72 8.34C16.72 8.34 16.71 8.34 16.71 8.34C16.71 8.34 16.71 8.34 16.25 7.75C15.79 7.16 15.79 7.16 15.78 7.16C15.78 7.16 15.78 7.16 15.78 7.16C15.78 7.16 15.78 7.16 15.78 7.16C15.78 7.16 15.78 7.16 15.78 7.17C15.78 7.17 15.77 7.17 15.77 7.18C15.76 7.18 15.74 7.2 15.72 7.21C15.68 7.24 15.63 7.29 15.56 7.35C15.42 7.47 15.22 7.64 14.98 7.86C14.5 8.3 13.85 8.93 13.15 9.72C11.78 11.29 10.19 13.52 9.52 16.06L10.98 16.44ZM7.14 13.19L9.64 16.69L10.86 15.81L8.36 12.31L7.14 13.19Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5 text-slate-400 hover:text-[#64758B]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M6.5 15.25V15.25C5.53 15.25 4.75 14.47 4.75 13.5V6.75C4.75 5.65 5.65 4.75 6.75 4.75H13.5C14.47 4.75 15.25 5.53 15.25 6.5V6.5"
              />
              <rect
                width="10.5"
                height="10.5"
                x="8.75"
                y="8.75"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                rx="2"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="code-container">
        <code className="mb-12" {...props}><CodeTokens code={children} /></code>
      </div>
    </div>
  );
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim() // Remove whitespace from both ends of a string
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters except for -
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

function createHeading(level) {
  // eslint-disable-next-line react/display-name
  return ({ children }) => {
    let slug = slugify(children);
    let textSize = "text-4xl";
    if (level === 2) textSize = "text-2xl md:text-3xl";
    if (level === 3) textSize = "text-xl md:text-2xl";
    if (level === 4) textSize = "text-lg md:text-xl";
    return React.createElement(
      `h${level}`,
      {
        id: slug,
        className: `${textSize} text-text-primary font-medium leading-8 mb-6 ${level === 2 ? "mt-8" : "mt-3"} text-balance`,
      },
      [
        React.createElement("a", {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: "anchor ",
        }),
      ],
      children,
    );
  };
}

function paragraph({ children }) {
  // Check if children contains any block-level elements
  const hasBlockElements = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement(child) &&
      typeof child.type === "string" &&
      /^(div|p|ul|ol|h[1-6])$/i.test(child.type),
  );

  // If there are block-level elements, render without wrapping p tag
  if (hasBlockElements) {
    return <>{children}</>;
  }

  // Otherwise, wrap in a p tag as before
  return (
    <p className="mb-6 text-base leading-8 text-text-secondary">{children}</p>
  );
}

function OrderedList({ children }) {
  return <ol className="mb-8 list-decimal pl-8">{children}</ol>;
}

function UnorderedList({ children }) {
  return <ul className="mb-8 list-disc pl-8">{children}</ul>;
}

function ListItem({ children }) {
  return (
    <li className="mb-4 text-base leading-8 text-text-secondary">{children}</li>
  );
}

const badges = {
  idea: {
    bg: "bg-yellow-50",
    text: "text-yellow-800",
    ring: "ring-yellow-600/20",
    label: "Idea",
  },
  info: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-700/10",
    label: "Info",
  },
  thought: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    ring: "ring-indigo-700/10",
    label: "Thought",
  },
  warning: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    ring: "ring-rose-700/10",
    label: "Warning",
  },
};

function FullWidthCallout({ children, type }) {
  const hasLinks = React.Children.toArray(children).some((child) => {
    if (
      typeof child === "string" &&
      child.includes("[") &&
      child.includes("](")
    ) {
      return true;
    }

    if (React.isValidElement(child) && child.props?.children) {
      return React.Children.toArray(child.props.children).some(
        (grandchild) =>
          React.isValidElement(grandchild) && grandchild.type === CustomLink,
      );
    }

    return false;
  });

  const processedChildren = hasLinks
    ? React.Children.map(children, (child) => {
        if (
          typeof child === "string" &&
          child.includes("[") &&
          child.includes("](")
        ) {
          const segments: (string | JSX.Element)[] = [];
          let currentIndex = 0;
          const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
          let match;

          while ((match = linkRegex.exec(child)) !== null) {
            if (match.index > currentIndex) {
              segments.push(child.substring(currentIndex, match.index));
            }

            segments.push(
              <CustomLink key={match.index} href={match[2]}>
                {match[1]}
              </CustomLink>,
            );

            currentIndex = match.index + match[0].length;
          }

          if (currentIndex < child.length) {
            segments.push(child.substring(currentIndex));
          }

          return segments;
        }

        return child;
      })
    : children;

  const badge = badges[type];

  return (
    <blockquote className="relative -mx-3 mb-8 w-[100vw] overflow-clip border-y border-border-primary px-6 py-8 [background-image:linear-gradient(45deg,theme(colors.border-primary)_12.50%,transparent_12.50%,transparent_50%,theme(colors.border-primary)_50%,theme(colors.border-primary)_62.50%,transparent_62.50%,transparent_100%)] [background-size:5px_5px] md:col-start-1 md:col-end-4 md:mx-0 md:w-full md:px-0">
      <span className="absolute -top-1/2 left-1/2 -z-10 -translate-x-1/2 opacity-50">
        <BgGradient />
      </span>
      <div className="blog-container drama-shadow mx-auto rounded-md bg-bg-primary p-6">
        {badge && (
          <span
            className={`mb-3.5 inline-flex items-center rounded-full ${badge.bg} px-4 py-1 text-xs font-medium uppercase ${badge.text} ring-1 ring-inset ${badge.ring}`}
          >
            {badge.label}
          </span>
        )}
        <div className="text-text-secondary">{processedChildren}</div>
      </div>
    </blockquote>
  );
}

function IdeaQuote({ children }) {
  return <FullWidthCallout type="idea">{children}</FullWidthCallout>;
}

function WarningQuote({ children }) {
  return <FullWidthCallout type="warning">{children}</FullWidthCallout>;
}

function InfoQuote({ children }) {
  return <FullWidthCallout type="info">{children}</FullWidthCallout>;
}

function ThoughtQuote({ children }) {
  return <FullWidthCallout type="thought">{children}</FullWidthCallout>;
}

const sharedComponents = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  Image: RoundedImage,
  img: RoundedImage,
  a: CustomLink,
  Callout,
  ProsCard,
  ConsCard,
  Ideaquote: IdeaQuote,
  Infoquote: InfoQuote,
  Thoughtquote: ThoughtQuote,
  Warningquote: WarningQuote,
  code: Code,
  Table,
  CodePlayground,
  Details,
  DetailsSummary,
  p: paragraph,
  ol: OrderedList,
  ul: UnorderedList,
  li: ListItem,
};

const useMDXComponent = (code: string) => {
  const fn = Function(code);
  return fn({ ...runtime }).default;
};

export const MDXContent = ({ code, components, ...props }: MDXProps) => {
  const Component = useMDXComponent(code);
  return (
    <Component components={{ ...sharedComponents, ...components }} {...props} />
  );
};
