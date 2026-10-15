import type { MetadataRoute } from "next";
import { urlDuSite } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Les pages privées (connexion, compte, parties en ligne…) sont exclues par une balise « noindex ».
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${urlDuSite()}/sitemap.xml`,
  };
}
