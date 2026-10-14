import type { Badge } from "@/lib/boutique";
import { cn } from "@/lib/utils";

const NOMS_BADGES: Record<Badge, string> = {
  etoile: "étoile",
  coeur: "cœur",
  eclair: "éclair",
  trombone: "trombone doré",
  trefle: "trèfle",
  flamme: "flamme",
  fusee: "fusée",
  medaille: "médaille",
  diamant: "diamant",
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
    case "coeur":
      return (
        <path
          d="M12 20.5 C8 17.5 3.5 14.2 3.5 9.3 C3.5 6.5 5.6 4.5 8.1 4.5 C9.8 4.5 11.2 5.5 12 7 C12.8 5.5 14.2 4.5 15.9 4.5 C18.4 4.5 20.5 6.5 20.5 9.3 C20.5 14.2 16 17.5 12 20.5 Z"
          fill="#ff4d6d"
          stroke="#c9184a"
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
      );
    case "eclair":
      return (
        <path
          d="M14 2.5 L5.5 13.5 L11.5 13.5 L9.5 21.5 L18.5 9.5 L12.5 9.5 L14.5 2.5 Z"
          fill="#ffd43b"
          stroke="#b8860b"
          strokeWidth={1.3}
          strokeLinejoin="round"
        />
      );
    case "trefle":
      return (
        <g fill="#40c057" stroke="#2b8a3e" strokeWidth={1.2}>
          <circle cx={12} cy={7.5} r={3.6} />
          <circle cx={7.6} cy={12.4} r={3.6} />
          <circle cx={16.4} cy={12.4} r={3.6} />
          <path d="M12 12 C12.5 15.5 13.5 18.5 15.5 21" fill="none" strokeWidth={1.6} strokeLinecap="round" />
        </g>
      );
    case "flamme":
      return (
        <g strokeLinejoin="round">
          <path
            d="M12 2.5 C13 6.5 18.5 9 18.5 14.5 C18.5 18.4 15.6 21.5 12 21.5 C8.4 21.5 5.5 18.4 5.5 14.5 C5.5 11.5 7.5 9.8 8.5 8 C9 10 10 11 11 11.2 C10.5 8 11 5 12 2.5 Z"
            fill="#ff922b"
            stroke="#d9480f"
            strokeWidth={1.2}
          />
          <path d="M12 12 C13.2 14 15 15.2 15 17.3 C15 19.1 13.6 20.3 12 20.3 C10.4 20.3 9 19.1 9 17.3 C9 15.5 11 14.5 12 12 Z" fill="#ffd43b" />
        </g>
      );
    case "medaille":
      return (
        <g strokeLinejoin="round">
          <path d="M7 2.5 L10.5 10 L13.5 10 L10 2.5 Z" fill="#4dabf7" stroke="#1971c2" strokeWidth={1} />
          <path d="M17 2.5 L13.5 10 L10.5 10 L14 2.5 Z" fill="#ff6b6b" stroke="#c92a2a" strokeWidth={1} />
          <circle cx={12} cy={15} r={6} fill="#ffd43b" stroke="#b8860b" strokeWidth={1.3} />
          <path d="M12 12 L12.9 14 L15 14.2 L13.4 15.6 L13.9 17.7 L12 16.6 L10.1 17.7 L10.6 15.6 L9 14.2 L11.1 14 Z" fill="#fff3bf" />
        </g>
      );
    case "diamant":
      return (
        <g strokeLinejoin="round" stroke="#1098ad" strokeWidth={1.2}>
          <path d="M3.5 9 L7.5 4 L16.5 4 L20.5 9 L12 20.5 Z" fill="#99e9f2" />
          <path d="M3.5 9 L20.5 9 M7.5 4 L10 9 L12 20.5 L14 9 L16.5 4" fill="none" />
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
