import { cn } from "@/lib/utils";

type PropsDecor = {
  className?: string;
};

export function Crayon({ className }: PropsDecor) {
  return (
    <svg
      viewBox="0 0 220 36"
      className={cn("drop-shadow-md", className)}
      aria-hidden
    >
      <rect x="2" y="10" width="20" height="16" rx="4" fill="#ff8fab" />
      <rect x="20" y="8" width="16" height="20" fill="#adb5bd" />
      <rect x="22" y="12" width="12" height="2" fill="#868e96" />
      <rect x="22" y="22" width="12" height="2" fill="#868e96" />
      <rect x="34" y="6" width="150" height="24" fill="#ffd43b" />
      <rect x="34" y="6" width="150" height="6" fill="#ffe066" />
      <path d="M184 6 L214 18 L184 30 Z" fill="#f1c27d" />
      <path d="M206 14 L214 18 L206 22 Z" fill="var(--graphite)" />
    </svg>
  );
}

type PropsSurligneur = PropsDecor & {
  couleur: string;
  ouvert?: boolean;
};

export function Surligneur({ couleur, ouvert, className }: PropsSurligneur) {
  return (
    <svg
      viewBox="0 0 160 40"
      className={cn("drop-shadow-md", className)}
      aria-hidden
    >
      <rect x="30" y="4" width="110" height="32" rx="6" fill={couleur} />
      <rect
        x="30"
        y="4"
        width="110"
        height="10"
        rx="5"
        fill="#ffffff"
        opacity={0.35}
      />
      {ouvert ? (
        <path d="M2 20 L30 8 L30 32 Z" fill={couleur} opacity={0.85} />
      ) : (
        <rect x="0" y="8" width="34" height="24" rx="4" fill="#2b2b2b" opacity={0.75} />
      )}
    </svg>
  );
}

export function Gomme({ className }: PropsDecor) {
  return (
    <svg
      viewBox="0 0 100 50"
      className={cn("drop-shadow-md", className)}
      aria-hidden
    >
      <rect
        x="4"
        y="8"
        width="92"
        height="34"
        rx="6"
        fill="#ffffff"
        stroke="#d8dade"
        strokeWidth={1.5}
      />
      <rect x="4" y="8" width="34" height="34" rx="6" fill="#4dabf7" />
      <rect x="30" y="8" width="8" height="34" fill="#4dabf7" />
    </svg>
  );
}

export function Trombone({ className }: PropsDecor) {
  return (
    <svg
      viewBox="0 0 60 100"
      className={cn("drop-shadow-md", className)}
      fill="none"
      stroke="#9aa1a9"
      strokeWidth={3}
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20 12 C20 5 28 2 35 2 C46 2 54 10 54 22 L54 65 C54 80 42 90 28 90 C14 90 4 80 4 65 L4 28 C4 20 10 14 18 14 C26 14 32 20 32 28 L32 68" />
    </svg>
  );
}

export function BlocPostIt({ className }: PropsDecor) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={cn("drop-shadow-md", className)}
      aria-hidden
    >
      <rect
        x="14"
        y="18"
        width="60"
        height="60"
        rx="3"
        fill="#63e6be"
        transform="rotate(-6 44 48)"
      />
      <rect
        x="16"
        y="14"
        width="60"
        height="60"
        rx="3"
        fill="#74c0fc"
        transform="rotate(4 46 44)"
      />
      <rect
        x="12"
        y="10"
        width="60"
        height="60"
        rx="3"
        fill="#a5d8ff"
        transform="rotate(-3 42 40)"
      />
      <rect
        x="10"
        y="6"
        width="60"
        height="60"
        rx="3"
        fill="#eaf4ff"
        stroke="#d0e5fb"
        strokeWidth={1}
      />
    </svg>
  );
}
