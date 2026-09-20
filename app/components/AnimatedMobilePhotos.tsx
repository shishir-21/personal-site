"use client";

import { m } from "framer-motion";
import { useEffect, useLayoutEffect, useRef } from "react";
import { ShadowBox } from "./ShadowBox";
import Image from "next/image";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface AnimatedMobilePhotosProps {
  delay: number;
}

const photos = [
  {
    src: "/mountains-dog.webp",
    alt: "Hardeep petting a mountain dog on a trek",
    boxW: 170,
    boxH: 252,
    imgClass:
      "absolute left-0 top-2 h-[245px] w-[163px] rotate-[-5deg] rounded-lg object-cover",
  },
  {
    src: "/hero_2.webp",
    alt: "Hardeep at a café in a pink polo, holding coffee with a bookshelf behind",
    boxW: 188,
    boxH: 278,
    imgClass:
      "absolute left-0 top-0 h-[280px] w-[190px] rotate-[-8deg] rounded-lg object-cover shadow-lg shadow-black/20",
  },
  {
    src: "/cb.webp",
    alt: "Hardeep in a candid photo",
    boxW: 170,
    boxH: 252,
    imgClass:
      "absolute left-0 top-0 h-[245px] w-[163px] rotate-[10deg] rounded-lg object-cover shadow-lg shadow-black/20",
  },
  {
    src: "/chess.webp",
    alt: "Hardeep playing chess",
    boxW: 170,
    boxH: 252,
    imgClass:
      "absolute left-0 top-0 h-[245px] w-[163px] rotate-[-3deg] rounded-lg object-cover shadow-lg shadow-black/20",
  },
  {
    src: "/football.webp",
    alt: "Hardeep playing football",
    boxW: 170,
    boxH: 252,
    imgClass:
      "absolute left-0 top-2 h-[245px] w-[163px] rotate-[7deg] rounded-lg object-cover shadow-lg shadow-black/20",
  },
];

const REPEAT_COUNT = 5;
const MIDDLE_COPY = Math.floor(REPEAT_COUNT / 2);

export function AnimatedMobilePhotos({ delay }: AnimatedMobilePhotosProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const setWidthRef = useRef(0);

  useIsoLayoutEffect(() => {
    const measure = () => {
      const set = setRef.current;
      const scroller = scrollRef.current;
      if (!set || !scroller) return;
      const w = set.offsetWidth;
      if (!w) return;
      setWidthRef.current = w;
      scroller.scrollLeft = w * MIDDLE_COPY;
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (setRef.current) ro.observe(setRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const w = setWidthRef.current;
      if (!w) return;
      const minBoundary = w * 0.5;
      const maxBoundary = w * (REPEAT_COUNT - 1.5);
      if (scroller.scrollLeft < minBoundary) {
        scroller.scrollLeft += w;
      } else if (scroller.scrollLeft > maxBoundary) {
        scroller.scrollLeft -= w;
      }
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative -mx-12 lg:hidden">
      <div
        ref={scrollRef}
        className="relative w-full overflow-x-auto overflow-y-hidden py-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-fit items-center">
          {Array.from({ length: REPEAT_COUNT }).map((_, copyIdx) => (
            <div
              key={copyIdx}
              ref={copyIdx === 0 ? setRef : undefined}
              className="flex w-fit shrink-0 items-center"
            >
              {photos.map((photo, i) => {
                const inner = (
                  <>
                    <ShadowBox
                      width={photo.boxW}
                      height={photo.boxH}
                    ></ShadowBox>
                    <Image
                      className={photo.imgClass}
                      src={photo.src}
                      alt={photo.alt}
                      width={180}
                      height={270}
                    />
                  </>
                );
                return copyIdx === MIDDLE_COPY ? (
                  <m.div
                    key={`${copyIdx}-${photo.src}`}
                    className="relative mr-14 w-fit shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut",
                      delay: delay + i * 0.1,
                    }}
                  >
                    {inner}
                  </m.div>
                ) : (
                  <div
                    key={`${copyIdx}-${photo.src}`}
                    className="relative mr-14 w-fit shrink-0"
                  >
                    {inner}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
