import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { structuredData } from "./structured-data";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const SITE_URL = "https://www.djscodeai.in";
const SITE_NAME = "DJS CodeAI";
const SITE_TITLE =
  "DJS CodeAI — AI & ML Club of DJ Sanghvi College of Engineering, Mumbai";
const SITE_DESCRIPTION =
  "The AI & ML club of DJ Sanghvi College of Engineering, Mumbai. A student-led community building the future of intelligence — learn, create, innovate.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · DJS CodeAI",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "DJS CodeAI", url: SITE_URL }],
  creator: "DJS CodeAI",
  publisher: "DJS CodeAI",
  keywords: [
    "DJS CodeAI",
    "DJS Code AI",
    "DJ Sanghvi CodeAI",
    "DJ Sanghvi AI Club",
    "DJ Sanghvi ML Club",
    "DJ Sanghvi College AI",
    "DJSCE AI ML",
    "DJSCE AIML",
    "DJ Sanghvi College of Engineering",
    "AI club Mumbai",
    "ML club Mumbai",
    "student AI community India",
    "artificial intelligence club",
    "machine learning club",
    "hackathon Mumbai",
    "CodeVerse",
    "CODEQUEST",
    "college AI club",
  ],
  category: "Education",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@djs_codeai",
    site: "@djs_codeai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0907",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-obsidian text-silver">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
