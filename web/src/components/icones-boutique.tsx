import type { Badge } from "@/lib/boutique";
import { cn } from "@/lib/utils";

const NOMS_BADGES: Record<Badge, string> = {
  etoile: "étoile",
  trombone: "trombone doré",
  fusee: "fusée",
  couronne: "couronne",
};

function DessinBadge({ badge }: { badge: Badge }) {
  switch (badge) {
    case "etoile":
      return (
        <path
          d="M12 2.5 L14.6 9 L21.5 9.4 L16.2 13.9 L17.9 20.7 L12 17 L6.1 20.7 L7.8 13.9 L2.5 9.4 L9.4 9 Z"
          fill="#ffe600"
          stroke="#55595f"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      );
    case "trombone":
      return (
        <path
          d="M9 7 L9 16 C9 18 10.5 19.5 12.5 19.5 C14.5 19.5 16 18 16 16 L16 5.5 C16 3.8 14.7 2.5 13 2.5 C11.3 2.5 10 3.8 10 5.5 L10 15 C10 16 10.8 16.5 11.5 16.5 C12.2 16.5 13 16 13 15 L13 7"
          fill="none"
          stroke="#c9a227"
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      );
    case "fusee":
      return (
        <g strokeLinejoin="round" stroke="#55595f" strokeWidth={1.3}>
          <path d="M12 2.5 C15.5 5 16.5 9 16 14 L8 14 C7.5 9 8.5 5 12 2.5 Z" fill="#ffffff" />
          <circle cx={12} cy={8.5} r={2} fill="#22b8f0" />
          <path d="M8 14 L5.5 17.5 L8.5 16.5 Z M16 14 L18.5 17.5 L15.5 16.5 Z" fill="#ff4fa3" />
          <path d="M10 14.5 L12 21 L14 14.5 Z" fill="#ff9a1f" />
        </g>
      );
    case "couronne":
      return (
        <path
          d="M3.5 17.5 L4.5 7.5 L9 11.5 L12 5 L15 11.5 L19.5 7.5 L20.5 17.5 Z"
          fill="#ffd43b"
          stroke="#b8860b"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      );
  }
}

export function IconeBadge({ badge, className }: { badge: Badge; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={`Badge ${NOMS_BADGES[badge]}`}
      data-badge={badge}
      className={cn("inline-block size-[1.1em] shrink-0 align-[-0.15em]", className)}
    >
      <DessinBadge badge={badge} />
    </svg>
  );
}

export function IconePiece({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("inline-block size-[1.1em] shrink-0 align-[-0.15em]", className)}
    >
      <circle cx={12} cy={12} r={9.5} fill="#ffd43b" stroke="#c99a06" strokeWidth={1.5} />
      <circle cx={12} cy={12} r={6} fill="none" stroke="#c99a06" strokeWidth={1.2} />
      <path d="M9 8.5 C10 7.5 11 7.2 12 7.2" fill="none" stroke="#fff3bf" strokeWidth={1.4} strokeLinecap="round" />
    </svg>
  );
}
