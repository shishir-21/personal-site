"use client";

import { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";
import { useActiveSection } from "@/app/hooks/useActiveSection";
import type { TocHeading } from "@/app/lib/toc-utils";

interface TableOfContentsProps {
  headings: TocHeading[];
}

// X positions for SVG path (aligned with dot positions: -3 for H2, 11 for H3)
const X_H2 = 0;
const X_H3 = 14;

/**
 * Handle smooth scroll on TOC link click. Uses only DOM globals — no component
 * state — so it lives at module scope to avoid re-creation on every render.
 */
function handleLinkClick(
  e: React.MouseEvent<HTMLAnchorElement>,
  slug: string,
) {
  e.preventDefault();
  const element = document.getElementById(slug);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
    // Update URL without scroll jump
    window.history.pushState(null, "", `#${slug}`);
  }
}

/**
 * Generate SVG path that traces the TOC structure with indents for H3s
 */
function generateTocPath(
  headings: TocHeading[],
  positions: Map<string, { top: number; level: number }>
): string {
  if (headings.length === 0) return "";

  let pathD = "";
  let prevX = X_H2;
  let prevY = 0;
  let isFirstPoint = true;

  headings.forEach((heading) => {
    const pos = positions.get(heading.slug);
    if (!pos) return;

    const x = heading.level === 2 ? X_H2 : X_H3;
    const y = pos.top;

    if (isFirstPoint) {
      pathD = `M ${x} ${y}`;
      isFirstPoint = false;
    } else {
      if (x === prevX) {
        // Same indent level - straight vertical line
        pathD += ` L ${x} ${y}`;
      } else if (x > prevX) {
        // Indenting (H2 → H3) - go down 30%, then angle right
        const midY = prevY + (y - prevY) * 0.3;
        pathD += ` L ${prevX} ${midY}`;
        pathD += ` L ${x} ${y}`;
      } else {
        // Outdenting (H3 → H2) - angle left at 70% down
        const midY = prevY + (y - prevY) * 0.7;
        pathD += ` L ${x} ${midY}`;
        pathD += ` L ${x} ${y}`;
      }
    }

    prevX = x;
    prevY = y;
  });

  return pathD;
}


export function TableOfContents({ headings }: TableOfContentsProps) {
  const headingIds = headings.map((h) => h.slug);
  const activeId = useActiveSection({ headingIds });
  const navRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const supportsAnchors = typeof CSS !== "undefined" && CSS.supports("anchor-name", "--test");
  const [topPosition, setTopPosition] = useState(140);
  const [pathData, setPathData] = useState("");
  const fixedTop = 140;

  // Calculate topPosition synchronously before paint to avoid flash
  useLayoutEffect(() => {
    const contentWrapper = document.querySelector("article .wrapper.z-10");
    if (!contentWrapper) return;
    const wrapperRect = contentWrapper.getBoundingClientRect();
    setTopPosition(Math.max(fixedTop, wrapperRect.top));
  }, []);

  // Track scroll position to calculate dynamic top value
  useEffect(() => {
    // Find the article content wrapper (.wrapper.z-10)
    const contentWrapper = document.querySelector("article .wrapper.z-10");
    if (!contentWrapper) return;

    const calculateTopPosition = () => {
      // Get the content wrapper's position relative to the viewport
      const wrapperRect = contentWrapper.getBoundingClientRect();

      // If the content wrapper is below the fixed position, TOC follows it
      // If the content wrapper has scrolled past, TOC stays fixed
      const newTop = Math.max(fixedTop, wrapperRect.top);
      setTopPosition(newTop);
    };

    // Throttled scroll handler
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          calculateTopPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", calculateTopPosition);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", calculateTopPosition);
    };
  }, []);

  // Calculate SVG path for the line
  const calculatePath = useCallback(() => {
    if (!contentRef.current || headings.length === 0) return;

    const positions = new Map<string, { top: number; level: number }>();
    const containerRect = contentRef.current.getBoundingClientRect();

    headings.forEach((h) => {
      const link = contentRef.current?.querySelector(`a[href="#${h.slug}"]`);
      if (link) {
        const rect = link.getBoundingClientRect();
        positions.set(h.slug, {
          top: rect.top - containerRect.top + rect.height / 2,
          level: h.level,
        });
      }
    });

    const newPath = generateTocPath(headings, positions);
    setPathData(newPath);
  }, [headings]);

  // Calculate path on mount
  useLayoutEffect(() => {
    const timer = setTimeout(calculatePath, 50);
    return () => clearTimeout(timer);
  }, [calculatePath]);

  // Stable ref so the resize listener never needs to be re-registered when
  // `calculatePath` changes (avoids the advanced-event-handler-refs warning).
  const calculatePathRef = useRef(calculatePath);
  useEffect(() => {
    calculatePathRef.current = calculatePath;
  });

  // Recalculate path on resize — stable listener reads the latest handler via ref
  useEffect(() => {
    const stableHandler = () => calculatePathRef.current();
    window.addEventListener("resize", stableHandler);
    return () => window.removeEventListener("resize", stableHandler);
  }, []);

  // Update indicator position (handles both vertical and horizontal positioning)
  const updateIndicatorPosition = useCallback(() => {
    if (!activeId || !navRef.current || !indicatorRef.current) return;

    const activeLink = navRef.current.querySelector(
      `a[href="#${activeId}"]`,
    ) as HTMLElement | null;

    if (!activeLink) return;

    const tocContent = navRef.current.querySelector(".toc-content");
    if (!tocContent) return;

    const contentRect = tocContent.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    // Calculate vertical position (center of the link)
    const top = linkRect.top - contentRect.top + linkRect.height / 2;

    // Calculate horizontal position based on link's padding
    // H3 links have padding-left, so the dot should shift right
    const isH3 = activeLink.classList.contains("toc-link--h3");
    const left = isH3 ? 11 : -3; // Shift right for H3s to align with indented text

    indicatorRef.current.style.top = `${top}px`;
    indicatorRef.current.style.left = `${left}px`;
  }, [activeId]);

  // Trigger moving animation and update position — refs excluded from deps
  // react-doctor-disable-next-line react-doctor/exhaustive-deps
  useEffect(() => {
    if (!activeId) return;

    const indicator = indicatorRef.current;
    indicator?.classList.add("toc-indicator--moving");
    const timer = setTimeout(
      () => indicator?.classList.remove("toc-indicator--moving"),
      600,
    );

    // Update CSS anchor-name for anchor positioning browsers
    if (supportsAnchors && navRef.current) {
      const links = navRef.current.querySelectorAll("a[data-toc-link]");
      links.forEach((link) => {
        (link as HTMLElement).style.removeProperty("anchor-name");
      });

      const activeLink = navRef.current.querySelector(`a[href="#${activeId}"]`);
      if (activeLink) {
        // Use setProperty for CSS anchor-name (not yet in TypeScript CSSStyleDeclaration)
        (activeLink as HTMLElement).style.setProperty(
          "anchor-name",
          "--toc-active",
        );
      }
    }

    // Always update position via JS (CSS anchor positioning doesn't handle horizontal shift for H3s)
    updateIndicatorPosition();

    return () => {
      clearTimeout(timer);
      indicator?.classList.remove("toc-indicator--moving");
    };
  }, [activeId, supportsAnchors, updateIndicatorPosition]);

  // Don't render if no headings
  if (headings.length === 0) return null;

  return (
    <nav
      ref={navRef}
      aria-label="Table of contents"
      className="toc-container"
      style={{ top: `${topPosition}px` }}
    >
      <div ref={contentRef} className="toc-content">
        <p className="toc-label">Table of Contents</p>

        {/* SVG path showing the TOC structure */}
        <svg className="toc-path-svg" aria-hidden="true">
          {pathData && (
            <path d={pathData} className="toc-path-line" fill="none" />
          )}
        </svg>

        {/* The animated dot indicator */}
        <span
          ref={indicatorRef}
          className={`toc-indicator ${activeId ? "toc-indicator--visible" : ""}`}
          aria-hidden="true"
        />

        <ul className="toc-list">
          {headings.map((heading) => (
            <li key={heading.slug} className="toc-item">
              <a
                href={`#${heading.slug}`}
                data-toc-link
                className={`toc-link toc-link--h${heading.level} ${activeId === heading.slug ? "toc-link--active" : ""}`}
                onClick={(e) => handleLinkClick(e, heading.slug)}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
