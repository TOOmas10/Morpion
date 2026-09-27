"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function BoutonDeconnexion() {
  const router = useRouter();

  async function deconnecter() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={deconnecter}
      className="cursor-pointer py-1 text-graphite underline-offset-4 hover:underline"
    >
      Déconnexion
    </button>
  );
}
