import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ExperienceProvider } from "@/components/providers/ExperienceProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { RouteTransition } from "@/components/layout/RouteTransition";
import { Cursor } from "@/components/ui/Cursor";
import { SignalBackdrop } from "@/components/three/SignalBackdrop";
import { getSiteUrl, siteDescription, siteName } from "@/lib/site";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const url = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    default: siteName,
    template: "%s · MOHSIN",
  },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    "Mohd Mohsin Rizvi",
    "creative developer",
    "full-stack engineer",
    "portfolio",
    "Three.js",
    "Lucknow",
    "algorithm research",
  ],
  openGraph: {
    type: "website",
    url,
    siteName,
    title: siteName,
    description: siteDescription,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: { canonical: url },
};

export const viewport: Viewport = {
  themeColor: "#08090D",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Syed Mohd Mohsin Rizvi",
  alternateName: "MOHSIN",
  jobTitle: "Creative Developer",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Integral University, Lucknow",
  },
  sameAs: [
    "https://www.linkedin.com/in/mohd-mohsin-rizvi",
    "https://github.com/mohdmohsinrizvi",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* marks the document as scripted before hydration so reveal states
            never flash, and is absent entirely without JavaScript */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js');`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <a href="#main" className="sr-only-focusable z-(--z-transition) bg-bone px-4 py-2 text-void">
          Skip to content
        </a>

        <ExperienceProvider>
          <SignalBackdrop />
          <SiteHeader />
          <RouteTransition />
          <main id="main">{children}</main>
          <SiteFooter />
          <Cursor />
        </ExperienceProvider>
      </body>
    </html>
  );
}
