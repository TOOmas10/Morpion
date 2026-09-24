import type { CSSProperties } from "react";

export default async function Header() {
  return (
    <div className="relative flex min-w-0 items-center justify-center py-2">
      <svg
        viewBox="0 0 340 40"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-9 w-[110%] -translate-x-1/2 -translate-y-1/2 -rotate-1 mix-blend-multiply text-fluo-jaune"
        fill="none"
        stroke="currentColor"
        strokeLinecap="butt"
        strokeOpacity={0.7}
        strokeWidth={26}
        aria-hidden
      >
        <path
          pathLength={1}
          className="trace"
          style={{ "--delai": "150ms", "--duree": "400ms" } as CSSProperties}
          d="M 10 22 C 90 16 250 26 330 18"
        />
      </svg>
      <h1 className="font-ecole relative z-10 min-w-0 -rotate-1 text-2xl text-encre sm:text-3xl lg:text-4xl">
        Morpion Python
      </h1>
    </div>
  );
}
