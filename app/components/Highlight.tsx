export type HighlightVariant = "bold" | "text-only";

export function Highlight({
  children,
  variant = "bold",
}: {
  children: React.ReactNode;
  variant?: HighlightVariant;
}) {
  return <span className="font-semibold text-[#6C47FF]">{children}</span>;
}
