export function Pill({
  children,
  mono,
  className,
}: {
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`rounded-full border border-ink/15 px-3.5 py-2 text-[13px] ${
        mono ? "font-mono text-[11px] uppercase tracking-wide" : ""
      } ${className ?? ""}`}
    >
      {children}
    </span>
  );
}
