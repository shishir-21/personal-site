"use client";

import { useState } from "react";
import { GridWrapper } from "./GridWrapper";
import { siteMetadata } from "@/app/data/siteMetadata";

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <polyline points="9 15 12 18 15 15" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

const socials = [
  {
    icon: LinkedInIcon,
    label: "LinkedIn",
    href: siteMetadata.linkedin,
  },
  {
    icon: XIcon,
    label: "X / Twitter",
    href: siteMetadata.twitter,
  },
  {
    icon: GitHubIcon,
    label: "GitHub",
    href: siteMetadata.github,
  },
];

export function GetInTouch() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(siteMetadata.emailAddress);
      return true;
    }

    const textArea = document.createElement("textarea");
    textArea.value = siteMetadata.emailAddress;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const didCopy = document.execCommand("copy");
    document.body.removeChild(textArea);
    return didCopy;
  };

  const handleCopy = async () => {
    const didCopy = await copyEmail().catch(() => false);
    if (!didCopy) return;

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative pb-16">
      <GridWrapper>
        <div className="relative overflow-x-clip">
          <div className="drama-shadow rounded-2xl bg-dark-primary p-14 md:p-[100px]">
            {/* Lines */}
            <div className="absolute left-0 right-0 top-[34px] z-10 h-px w-full bg-zinc-600 md:top-[48px]"></div>
            <div className="absolute bottom-0 right-[34px] top-0 z-10 h-full w-px bg-zinc-600 md:right-[48px]"></div>
            <div className="absolute bottom-[34px] left-0 right-0 z-10 h-px w-full bg-zinc-600 md:bottom-[48px]"></div>
            <div className="absolute bottom-0 left-[34px] top-0 z-10 h-full w-px bg-zinc-600 md:left-[48px]"></div>

            {/* Top Right Cross */}
            <div className="absolute right-[44.5px] top-[48px] z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute right-[48px] top-[44.5px] z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>
            {/* Top Left Cross */}
            <div className="absolute left-[44.5px] right-0 top-[48px] z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute left-[48px] right-0 top-[44.5px] z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>
            {/* Bottom Left Cross */}
            <div className="absolute bottom-[48px] left-[44.5px] right-0 z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute bottom-[44.5px] left-[48px] right-0 z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>
            {/* Bottom Right Cross */}
            <div className="absolute bottom-[48px] right-[44.5px] z-20 hidden h-px w-2 bg-zinc-300 md:block"></div>
            <div className="absolute bottom-[44.5px] right-[48px] z-20 hidden h-2 w-px bg-zinc-300 md:block"></div>

            <div className="relative z-30">
              <h2 className="mb-8 text-3xl font-medium text-slate-50">
                Get in touch
              </h2>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
                {/* Left column — text */}
                <div className="flex flex-col justify-between lg:w-[65%]">
                  <p className="max-w-[420px] text-base leading-8 text-gray-300">
                    I&apos;m open to AI engineering roles, contract work, and
                    interesting problems.
                    <br />
                    If something I&apos;ve built resonates, drop me a message!
                  </p>
                  <p className="mt-8 text-sm text-gray-400">
                    Based in Delhi, India.
                    <br />
                    Open to remote.
                  </p>
                </div>

                {/* Right column — CTA + secondary links */}
                <div className="flex flex-col">
                  {/* Primary CTA — email */}
                  <a
                    href={siteMetadata.email}
                    className="group inline-flex w-fit items-center gap-2.5 rounded-xl bg-indigo-500 px-6 py-3.5 text-base font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-400 hover:shadow-indigo-400/30"
                  >
                    <MailIcon className="shrink-0" />
                    <span>Say Hello</span>
                    <ArrowIcon className="shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </a>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="mt-3 flex w-fit items-center gap-2 text-sm text-gray-400 transition-colors hover:text-slate-50"
                    title="Copy email"
                  >
                    <span>{siteMetadata.emailAddress}</span>
                    {copied ? (
                      <CheckIcon className="text-indigo-400" />
                    ) : (
                      <CopyIcon className="text-gray-500" />
                    )}
                    <span className="text-gray-600">
                      {copied ? "copied" : "copy"}
                    </span>
                  </button>

                  {/* Secondary links — menu rows */}
                  <div className="mt-6 flex max-w-[260px] flex-col border-t border-zinc-700/60 pt-3">
                    <a
                      href={siteMetadata.resume}
                      download
                      className="group flex items-center gap-3 rounded-lg py-2.5 text-base text-gray-300 transition-colors hover:text-slate-50"
                    >
                      <FileIcon className="shrink-0 text-gray-500 transition-colors group-hover:text-indigo-300" />
                      <span>My CV</span>
                      <ArrowIcon className="ml-auto text-gray-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-300 group-hover:opacity-100" />
                    </a>
                    {socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-lg py-2.5 text-base text-gray-300 transition-colors hover:text-slate-50"
                      >
                        <social.icon className="shrink-0 text-gray-500 transition-colors group-hover:text-indigo-300" />
                        <span>{social.label}</span>
                        <ArrowIcon className="ml-auto text-gray-600 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-300 group-hover:opacity-100" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GridWrapper>
    </div>
  );
}
