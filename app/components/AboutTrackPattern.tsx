"use client";

import { useScroll, useTransform, m, useMotionValue, useMotionValueEvent } from "framer-motion";
import React, { useLayoutEffect, useRef } from "react";

export function AboutTrackPattern() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const verticalPathRef = useRef<SVGPathElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathLengthRef = useRef(0);

  const cx = useMotionValue(145);
  const cy = useMotionValue(0);

  // Mobile timeline: 0%–100% within the inset container (so ball sits exactly at line endpoints)
  const mobileProgress = useTransform(scrollYProgress, (v) => `${v * 100}%`);
  // Color transitions from light indigo (indigo-200) to full indigo (indigo-600)
  const mobileColor = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(199, 210, 254)", "rgb(79, 70, 229)"]
  );

  useLayoutEffect(() => {
    if (!pathRef.current && !verticalPathRef.current) return;
    pathLengthRef.current =
      pathRef.current?.getTotalLength() ||
      verticalPathRef.current?.getTotalLength() ||
      0;
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const activePath =
      window.innerWidth >= 1024 ? pathRef.current : verticalPathRef.current;
    if (pathLengthRef.current && activePath) {
      const clampedProgress = Math.max(0, Math.min(latest, 1));
      const point = activePath.getPointAtLength(pathLengthRef.current * clampedProgress);
      cx.set(point.x);
      cy.set(point.y);
    }
  });

  return (
    <div ref={containerRef} className="h-full">
      {/* Mobile vertical timeline */}
      <div className="pointer-events-none relative block h-full lg:hidden">
        {/*
          Inset by 8px (half ball height) top and bottom.
          Ball travels 0%–100% inside this box, so its center sits exactly
          at the top endpoint and bottom endpoint of the gray line.
        */}
        <div className="absolute inset-x-0 bottom-2 top-2">
          {/* Base gray line — full height of inset area */}
          <div className="absolute right-4 top-0 h-full w-[2px] rounded-full bg-[#D6DADE]/[0.24]" />

          {/* Active colored line — grows with the ball */}
          <m.div
            className="absolute right-4 top-0 w-[2px] rounded-full"
            style={{ height: mobileProgress, backgroundColor: mobileColor }}
          />

          {/* Ball — solid, light → full indigo as you scroll */}
          <m.div
            className="absolute right-2 z-10 -translate-y-1/2"
            style={{ top: mobileProgress }}
          >
            <m.div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: mobileColor }}
            />
          </m.div>
        </div>
      </div>

      {/* Desktop curved SVG path */}
      <svg
        className="user-select-none pointer-events-none hidden lg:block"
        width="380"
        height="1787"
        viewBox="-10 -10 380 1795"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter
            id="purpleGlow"
            x="-100%"
            y="-100%"
            width="300%"
            height="300%"
          >
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.42
                      0 0 0 0 0.28
                      0 0 0 0 1
                      0 0 0 0.6 0"
            />
          </filter>

          {/* Create a mask using the path */}
          <mask id="pathMask">
            <path
              d="M145 0.5L145 43C145 51.84 137.84 59 129 59L20 59C11.16 59 4 66.16 4 75L4 515C4 523.84 11.16 531 20 531L256 531C264.84 531 272 538.16 272 547L272 830.37C272 834.62 270.31 838.69 267.31 841.69L78.69 1030.31C75.69 1033.31 71.62 1035 67.37 1035L20 1035C11.16 1035 4 1042.16 4 1051L4 1471C4 1479.84 11.16 1487 20 1487L256 1487C264.84 1487 272 1494.16 272 1503L272 1757C272 1765.84 279.16 1773 288 1773L380 1773"
              stroke="white"
              strokeWidth="8"
              strokeLinejoin="round"
              fill="none"
            />
          </mask>

          <filter
            id="filter0_i_395_898"
            x="0"
            y="0.5"
            width="380"
            height="1778"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="2" />
            <feGaussianBlur stdDeviation="0.75" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.65 0 0 0 0 0.68 0 0 0 0 0.72 0 0 0 0.32 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_395_898"
            />
          </filter>
        </defs>

        {/* Container for masked elements */}
        <g mask="url(#pathMask)">
          {/* Glowing circle */}
          <m.circle
            cx={cx}
            cy={cy}
            r="120"
            fill="#6C47FF"
            filter="url(#purpleGlow)"
            opacity="0.5"
          />
        </g>

        {/* Path on top */}
        <g filter="url(#filter0_i_395_898)">
          <path
            ref={pathRef}
            d="M145 0.5L145 43C145 51.84 137.84 59 129 59L20 59C11.16 59 4 66.16 4 75L4 515C4 523.84 11.16 531 20 531L256 531C264.84 531 272 538.16 272 547L272 830.37C272 834.62 270.31 838.69 267.31 841.69L78.69 1030.31C75.69 1033.31 71.62 1035 67.37 1035L20 1035C11.16 1035 4 1042.16 4 1051L4 1471C4 1479.84 11.16 1487 20 1487L256 1487C264.84 1487 272 1494.16 272 1503L272 1757C272 1765.84 279.16 1773 288 1773L380 1773"
            stroke="#D6DADE"
            strokeOpacity="0.24"
            strokeWidth="8"
            strokeLinejoin="round"
          />
        </g>

        {/* Main circle on top */}
        <m.circle
          className="fill-indigo-600"
          cx={cx}
          cy={cy}
          r="10"
        />
      </svg>
    </div>
  );
}
