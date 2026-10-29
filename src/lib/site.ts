/**
 * Canonical origin for metadata, sitemap and Open Graph URLs.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL   (set this for production)
 *   2. VERCEL_URL             (supplied automatically on Vercel)
 *   3. http://localhost:3000  (development only)
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");
  const vercel = process.env.VERCEL_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;
  return "http://localhost:3000";
}

export const siteName = "MOHSIN — The Experimental Archive";
export const siteDescription =
  "The interactive archive of Syed Mohd Mohsin Rizvi — creative developer and full-stack engineer in Lucknow, India. Selected work, experiments in algorithms, AI, IoT and interactive web.";
