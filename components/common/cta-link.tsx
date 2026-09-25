import Link from "next/link";

/** Pill-shaped ink-filled call-to-action with an arrow, used for hero/nav/contact CTAs. */
export function CtaLink({
  href,
  children,
  className,
  size = "md",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  const padding = size === "sm" ? "px-5 py-2.5 text-sm" : "px-6 py-3.5 text-[15px]";
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full bg-ink font-medium text-bg transition-colors hover:bg-muted-2 ${padding} ${className ?? ""}`}
    >
      {children} <span aria-hidden="true">↗</span>
    </Link>
  );
}
