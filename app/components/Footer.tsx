import Link from "next/link";
import { type ReactNode } from "react";

import { GridWrapper } from "./GridWrapper";

export function Footer(): ReactNode {
  return (
    <>
      <div className="relative max-w-7xl border-border-primary/50">
        <GridWrapper>
          <div className="flex max-w-6xl px-4 lg:mx-auto lg:px-4 xl:px-0">
            <div className="flex w-full items-center justify-between py-6 text-sm">
              <Link className="inline-block text-sm font-semibold tracking-tight text-text-primary" href="/">
                hardeep.cv
              </Link>
              <p className="text-gray-500" suppressHydrationWarning>
                © {new Date().getFullYear()} Hardeep Singh
              </p>
            </div>
          </div>
        </GridWrapper>
      </div>
      <div className="relative h-8 w-full [background-image:linear-gradient(45deg,theme(colors.border-primary)_12.50%,transparent_12.50%,transparent_50%,theme(colors.border-primary)_50%,theme(colors.border-primary)_62.50%,transparent_62.50%,transparent_100%)] [background-size:5px_5px]"></div>
    </>
  );
}
