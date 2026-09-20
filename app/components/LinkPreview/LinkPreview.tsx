"use client";

import { useReducer, useRef, useCallback, useId, useEffect } from "react";
import { createPortal } from "react-dom";
import { LinkPreviewPopover } from "./LinkPreviewPopover";
import type { LinkPreviewData } from "@/app/lib/link-previews/types";

interface LinkPreviewProps {
  href: string;
  children: React.ReactNode;
  preview: LinkPreviewData | null;
  className?: string;
}

const POPOVER_WIDTH = 320;
const POPOVER_HEIGHT_ESTIMATE = 220;

/**
 * Check if browser supports CSS Anchor Positioning
 */
function supportsAnchorPositioning(): boolean {
  if (typeof CSS === "undefined") return false;
  return CSS.supports("anchor-name", "--test");
}

/**
 * Check if device is touch-only (no hover capability)
 */
function isTouchDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

// ── Reducer ──────────────────────────────────────────────────────────────────

interface LinkPreviewState {
  position: { top: number; left: number } | null;
  isMounted: boolean;
  supportsAnchor: boolean;
  isTouch: boolean;
}

type LinkPreviewAction =
  | { type: "MOUNT"; supportsAnchor: boolean; isTouch: boolean }
  | { type: "SET_POSITION"; position: { top: number; left: number } | null };

function reducer(
  state: LinkPreviewState,
  action: LinkPreviewAction
): LinkPreviewState {
  switch (action.type) {
    case "MOUNT":
      return {
        ...state,
        isMounted: true,
        supportsAnchor: action.supportsAnchor,
        isTouch: action.isTouch,
      };
    case "SET_POSITION":
      return { ...state, position: action.position };
    default:
      return state;
  }
}

const initialState: LinkPreviewState = {
  position: null,
  isMounted: false,
  // Lazy-init: safe to call during render on client; will be false on SSR.
  supportsAnchor:
    typeof CSS !== "undefined" && CSS.supports("anchor-name", "--test"),
  isTouch:
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function LinkPreview({
  href,
  children,
  preview,
  className,
}: LinkPreviewProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { position, isMounted, supportsAnchor, isTouch } = state;

  // Hover tracking refs — don't need to trigger re-renders; show/hide is
  // driven directly in event handlers via the timeout refs below.
  const isHoveringLinkRef = useRef(false);
  const isHoveringPopoverRef = useRef(false);

  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const uniqueId = useId();

  const popoverId = `popover-${uniqueId.replace(/:/g, "")}`;
  const anchorName = `--anchor-${uniqueId.replace(/:/g, "")}`;

  // Mount check for portal — isMounted starts false to avoid SSR mismatch.
  // supportsAnchor and isTouch are pre-initialized from module-scope checks
  // but re-confirmed here to handle hydration edge cases.
  useEffect(() => {
    dispatch({
      type: "MOUNT",
      supportsAnchor: supportsAnchorPositioning(),
      isTouch: isTouchDevice(),
    });
  }, []);

  const calculatePosition = useCallback(() => {
    if (!linkRef.current) return null;

    const rect = linkRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Default: position above the link, centered
    let top = rect.top - POPOVER_HEIGHT_ESTIMATE - 12;
    let left = rect.left + rect.width / 2 - POPOVER_WIDTH / 2;

    // If not enough space above, position below
    if (top < 10) {
      top = rect.bottom + 12;
    }

    // Keep within horizontal viewport bounds
    if (left < 10) {
      left = 10;
    } else if (left + POPOVER_WIDTH > viewportWidth - 10) {
      left = viewportWidth - POPOVER_WIDTH - 10;
    }

    // If still no space, don't show
    if (top + POPOVER_HEIGHT_ESTIMATE > viewportHeight - 10 && top < 10) {
      return null;
    }

    return { top, left };
  }, []);

  // ── Show / hide helpers called directly from event handlers ───────────────

  const scheduleShow = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (!popoverRef.current?.matches(":popover-open")) {
      showTimeoutRef.current = setTimeout(() => {
        if (!supportsAnchor) {
          const pos = calculatePosition();
          if (!pos) return;
          dispatch({ type: "SET_POSITION", position: pos });
        }
        try {
          popoverRef.current?.showPopover();
        } catch (e) {
          // Ignore
        }
      }, 200);
    }
  }, [supportsAnchor, calculatePosition]);

  const scheduleHide = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    hideTimeoutRef.current = setTimeout(() => {
      // Only hide if neither link nor popover is still hovered
      if (!isHoveringLinkRef.current && !isHoveringPopoverRef.current) {
        try {
          popoverRef.current?.hidePopover();
        } catch (e) {
          // Ignore
        }
      }
    }, 100);
  }, []);

  // Cleanup on unmount — refs excluded from deps by convention
  // react-doctor-disable-next-line react-doctor/exhaustive-deps
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // If no preview available or touch device, render simple link
  if (!preview || isTouch) {
    return (
      <a
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <>
      <a
        ref={linkRef}
        href={href}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => {
          isHoveringLinkRef.current = true;
          scheduleShow();
        }}
        onMouseLeave={() => {
          isHoveringLinkRef.current = false;
          scheduleHide();
        }}
        onFocus={() => {
          isHoveringLinkRef.current = true;
          scheduleShow();
        }}
        onBlur={() => {
          isHoveringLinkRef.current = false;
          scheduleHide();
        }}
        aria-describedby={popoverId}
        style={supportsAnchor ? { anchorName: anchorName } as React.CSSProperties : undefined}
      >
        {children}
      </a>

      {isMounted &&
        createPortal(
          <LinkPreviewPopover
            ref={popoverRef}
            id={popoverId}
            screenshotPath={preview.screenshotPath}
            url={href}
            width={preview.width}
            height={preview.height}
            position={supportsAnchor ? null : position}
            anchorName={supportsAnchor ? anchorName : undefined}
            onMouseEnter={() => {
              isHoveringPopoverRef.current = true;
              scheduleShow();
            }}
            onMouseLeave={() => {
              isHoveringPopoverRef.current = false;
              scheduleHide();
            }}
          />,
          document.body
        )}
    </>
  );
}
