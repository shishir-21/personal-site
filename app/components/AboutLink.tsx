"use client";

import { useState, useEffect } from "react";
import { LinkPreview } from "./LinkPreview/LinkPreview";
import type {
  LinkPreviewManifest,
  LinkPreviewData,
} from "@/app/lib/link-previews/types";

// Must match the hash function in the generate script and mdx.tsx
function hashUrl(url: string): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(12, "0").slice(0, 12);
}

// Module-level manifest cache shared across all AboutLink instances
let manifestCache: LinkPreviewManifest | null = null;
let loadState: "idle" | "loading" | "loaded" = "idle";
const listeners: Array<() => void> = [];

function ensureManifestLoaded() {
  if (loadState !== "idle") return;
  loadState = "loading";
  fetch("/previews/manifest.json")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      manifestCache = data;
      loadState = "loaded";
      listeners.forEach((fn) => fn());
      listeners.length = 0;
    })
    .catch(() => {
      loadState = "loaded";
      listeners.forEach((fn) => fn());
      listeners.length = 0;
    });
}

function getPreview(
  manifest: LinkPreviewManifest | null,
  url: string
): LinkPreviewData | null {
  if (!manifest?.previews) return null;
  const entry = manifest.previews[hashUrl(url)];
  if (!entry || entry.status !== "success") return null;
  return {
    screenshotPath: entry.screenshotPath,
    width: entry.width,
    height: entry.height,
  };
}

interface AboutLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AboutLink({ href, children, className }: AboutLinkProps) {
  const [manifest, setManifest] = useState<LinkPreviewManifest | null>(
    manifestCache
  );

  useEffect(() => {
    // If already loaded, manifestCache is already set as initial state — nothing to do.
    if (loadState === "loaded") return;

    const update = () => setManifest(manifestCache);
    listeners.push(update);
    ensureManifestLoaded();

    return () => {
      const idx = listeners.indexOf(update);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  const preview = getPreview(manifest, href);

  return (
    <LinkPreview href={href} preview={preview} className={className}>
      {children}
    </LinkPreview>
  );
}
