import type { Metadata } from "next";
import { Geist, Newsreader } from "next/font/google";
import { site } from "@/data/site";
import "@/styles/primitives.css";
import "@/styles/themes.css";
import "@/styles/components.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  authors: [{ name: site.name }],
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${newsreader.variable}`}>
      <body>{children}</body>
    </html>
  );
}
