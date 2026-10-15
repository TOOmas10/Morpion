import type { MetadataRoute } from "next";
import { NIVEAUX } from "@/lib/moteur";
import { urlDuSite } from "@/lib/site";

// Pages publiques proposées aux moteurs de recherche.
export default function sitemap(): MetadataRoute.Sitemap {
  const site = urlDuSite();
  const page = (chemin: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" | "yearly") => ({
    url: `${site}${chemin}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  });
  return [
    page("/", 1, "weekly"),
    page("/jouer", 0.9, "monthly"),
    page("/jouer/ia", 0.8, "monthly"),
    ...NIVEAUX.map((niveau) => page(`/jouer/ia/${niveau}`, 0.8, "monthly")),
    page("/jouer/duo", 0.7, "monthly"),
    page("/regles", 0.8, "monthly"),
    page("/classement", 0.6, "daily"),
    page("/boutique", 0.5, "weekly"),
    page("/credits", 0.3, "yearly"),
    page("/mentions-legales", 0.2, "yearly"),
    page("/confidentialite", 0.2, "yearly"),
    page("/conditions", 0.2, "yearly"),
  ];
}
