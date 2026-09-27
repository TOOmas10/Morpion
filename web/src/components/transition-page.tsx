import { ViewTransition, type ReactNode } from "react";

const ANIMATIONS = {
  "nav-avant": "glisse-avant",
  "nav-arriere": "glisse-arriere",
  default: "fondu",
};

export default function TransitionPage({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={ANIMATIONS} exit={ANIMATIONS} default="none">
      {children}
    </ViewTransition>
  );
}
