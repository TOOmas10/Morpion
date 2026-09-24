import type { CSSProperties } from "react";

export default async function Header() {
  return (
    <div className="relative py-2 text-center">
      <svg
        viewBox="0 0 340 40"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-6 w-[110%] -translate-x-1/2 -translate-y-1/2 -rotate-1 mix-blend-multiply text-fluo-jaune sm:h-7 lg:h-9"
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
      <h1 className="font-ecole relative z-10 inline-block -rotate-1 text-lg text-encre sm:text-2xl lg:text-4xl">
        Morpion Python
      </h1>
    </div>
  );
}
