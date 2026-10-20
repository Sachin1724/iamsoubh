import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { RevealObserver } from "@/components/Reveal";
import { Analytics } from "@/components/Analytics";
import { SmoothScroll } from "@/components/SmoothScroll";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Supplied by the client; replaces Anek Odia for all Odia text.
const akshar = localFont({
  src: "./fonts/akshar.woff2",
  variable: "--font-odia",
  display: "swap",
  preload: true,
});

// Display Odia, used for the big hero title.
const jaya = localFont({
  src: "./fonts/jaya.woff2",
  variable: "--font-odia-display",
  display: "swap",
  preload: true,
});

// Story section (below the fold, so not preloaded): handwritten Odia headings
// and a plain Odia text face for the paragraphs.
const hatalekha = localFont({
  src: "./fonts/hatalekha.woff2",
  variable: "--font-odia-heading",
  display: "swap",
  preload: false,
});

const lohitOriya = localFont({
  src: "./fonts/Lohit-Oriya.woff2",
  variable: "--font-odia-body",
  display: "swap",
  preload: false,
});

const gazpacho = localFont({
  src: [
    {
      path: "./fonts/gazpacho/Gazpacho-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/gazpacho/Gazpacho-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/gazpacho/Gazpacho-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/gazpacho/Gazpacho-Heavy.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./fonts/gazpacho/Gazpacho-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "./fonts/gazpacho/Gazpacho Bold Italic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-gazpacho",
  display: "swap",
  preload: true,
});

const bigdream = localFont({
  src: "./fonts/Bigdream.ttf",
  variable: "--font-bigdream",
  weight: "100 900",
  display: "swap",
  preload: true,
});

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque.woff2",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#8A1717",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://iamsoubh.com"),
  title: "IAMSOUBH — Bara Masa Tera Parba 2027 | The Odia Viral Calendar",
  description:
    "Pre-orders open for the first 500 boxes of the 2027 edition. 12 festival cards, sealed 13th parba, stickers, and Odisha heritage. For everyone who misses Odisha without saying it.",
  // No photo of the 2027 box anywhere, including the link preview: three card
  // fronts fanned out is the share image until the first parcels ship.
  openGraph: {
    title: "The Odia Viral Calendar is back · 2027",
    description:
      "12 festival cards, one sealed 13th parba. Only 500 in batch 1, shipping the first week of November.",
    images: ["/assets/product%20mockup/View%204.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${akshar.variable} ${jaya.variable} ${hatalekha.variable} ${lohitOriya.variable} ${gazpacho.variable} ${bigdream.variable} ${bricolage.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden bg-rice text-ink font-sans antialiased selection:bg-turmeric selection:text-ink">
        <SmoothScroll>{children}</SmoothScroll>
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}

