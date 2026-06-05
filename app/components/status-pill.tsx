import type { Status } from "@/app/lib/products";

const STYLES: Record<Status, { dot: string; text: string; glow: boolean }> = {
  "BETA OPEN": { dot: "var(--accent)", text: "var(--accent)", glow: true },
  "INVITE ONLY": { dot: "var(--accent-2)", text: "var(--accent-2)", glow: true },
  "IN DEVELOPMENT": { dot: "#8C8377", text: "var(--ink-dim)", glow: false },
  ALPHA: { dot: "var(--danger)", text: "var(--danger)", glow: false },
  RESEARCH: { dot: "#5A5347", text: "var(--ink-faint)", glow: false },
};

export default function StatusPill({ status }: { status: Status }) {
  const s = STYLES[status];
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.16em] uppercase whitespace-nowrap"
      style={{ color: s.text }}
    >
      <span
        className="inline-block w-[6px] h-[6px] rounded-full"
        style={{ background: s.dot, boxShadow: s.glow ? `0 0 9px ${s.dot}` : "none" }}
      />
      {status}
    </span>
  );
}
