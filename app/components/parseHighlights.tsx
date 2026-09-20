import React from "react";
import { Highlight, HighlightVariant } from "./Highlight";

/**
 * Parses a string with {{highlighted}} markers into JSX,
 * wrapping marked text in the Highlight component.
 */
export function parseHighlights(
  text: string,
  variant: HighlightVariant = "text-only"
): React.ReactNode[] {
  const parts = text.split(/\{\{(.+?)\}\}/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <Highlight key={`h-${part}`} variant={variant}>
        {part}
      </Highlight>
    ) : (
      <React.Fragment key={`t-${part}-${i}`}>{part}</React.Fragment>
    )
  );
}
