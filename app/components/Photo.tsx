"use client";

import { MouseEvent, Ref, forwardRef } from "react";
import Image, { ImageProps } from "next/image";
import { m, useMotionValue } from "framer-motion";

import { cn } from "../lib/utils";
import { getRandomNumberInRange } from "@/app/lib/getRandomNumberInRange";

const MotionImage = m(
  forwardRef(function MotionImage(
    props: ImageProps,
    ref: Ref<HTMLImageElement>,
  ) {
    const { alt, ...imageProps } = props;
    return <Image ref={ref} alt={alt} {...imageProps} />;
  }),
);
type Direction = "left" | "right";

const photoContainerStyle = (width: number, height: number) => ({
  width,
  height,
  perspective: 400,
  transform: `rotate(0deg) rotateX(0deg) rotateY(0deg)`,
  zIndex: 1,
  WebkitTouchCallout: "none" as const,
  WebkitUserSelect: "none" as const,
  userSelect: "none" as const,
  touchAction: "none" as const,
});

export const Photo = ({
  src,
  alt,
  className,
  direction,
  width,
  height,
  href,
  ...props
}: {
  src: string;
  alt: string;
  className?: string;
  direction?: Direction;
  width: number;
  height: number;
  href?: string;
}) => {
  const rotation = getRandomNumberInRange(1, 4) * (direction === "left" ? -1 : 1);
  const x = useMotionValue(200);
  const y = useMotionValue(200);

  function handleMouse(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const resetMouse = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <m.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      whileTap={{ scale: 1.2, zIndex: 9999 }}
      whileHover={{
        scale: 1.1,
        rotateZ: 2 * (direction === "left" ? -1 : 1),
        zIndex: 9999,
      }}
      whileDrag={{
        scale: 1.1,
        zIndex: 9999,
      }}
      initial={{ rotate: 0 }}
      animate={{ rotate: rotation }}
      style={photoContainerStyle(width, height)}
      className={cn(
        className,
        "relative mx-auto shrink-0 cursor-grab active:cursor-grabbing",
      )}
      onClick={() => { if (href) window.open(href, "_blank", "noopener,noreferrer"); }}
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      draggable={false}
      tabIndex={0}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg shadow-sm shadow-slate-900/30">
        <MotionImage
          className={cn("rounded-lg object-cover")}
          fill
          sizes={`${width}px`}
          src={src}
          alt={alt}
          {...props}
          draggable={false}
        />
      </div>
    </m.div>
  );
};
