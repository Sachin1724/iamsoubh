import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { AgentationProvider } from "@/components/AgentationProvider";
import { RevealObserver } from "@/components/Reveal";
import { Analytics } from "@/components/Analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Supplied by the client; replaces Anek Odia for all Odia text.
const akshar = localFont({
  src: "./fonts/akshar.ttf",
  variable: "--font-odia",
  display: "swap",
  preload: true,
});

// Display Odia, used for the big hero title.
const jaya = localFont({
  src: "./fonts/jaya.ttf",
  variable: "--font-odia-display",
  display: "swap",
  preload: true,
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
  ],
  variable: "--font-gazpacho",
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
  openGraph: {
    title: "The Odia Viral Calendar is back | 2027 Edition",
    description: "Pre-orders open for the first 500 boxes. ₹299 pre-order price.",
    images: ["/assets/brand/odia-hero-title.webp"],
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
      className={`${inter.variable} ${akshar.variable} ${jaya.variable} ${gazpacho.variable} scroll-smooth`}
    >
      <body className="min-h-screen overflow-x-hidden bg-[#F6EFE2] text-[#1B1B1B] font-sans antialiased selection:bg-[#E0A526] selection:text-[#1B1B1B]">
        {children}
        <RevealObserver />
        <Analytics />
        <AgentationProvider />
      </body>
    </html>
  );
}

