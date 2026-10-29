import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { experiments } from "@/data/lab";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();

  const routes = ["", "/work", "/lab", "/journey", "/about", "/contact"].map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: r === "" ? 1 : 0.7,
  }));

  const work = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const lab = experiments
    .filter((e) => e.status === "interactive")
    .map((e) => ({
      url: `${base}/lab#${e.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

  return [...routes, ...work, ...lab];
}
