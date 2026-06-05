import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit, Hanken_Grotesk } from "next/font/google";
import Nav from "./components/nav";
import Footer from "./components/footer";
import "./globals.css";

// Slim logo / wordmark only
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["200", "300"],
});

// Bold headings / display
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["200", "300", "600", "700", "800"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nomadcodelabs.com"),
  title: {
    default: "NOMAD // CODELABS — An independent software house, out of the park",
    template: "%s — NOMAD // CODELABS",
  },
  description:
    "Nomad Code Labs is an independent software house. A worldwide team building bold, modern, beautifully engineered software — Audiocrypt, Feeper, Minto, Better TV, Fasting Cycle, and more.",
  keywords: [
    "Nomad Code Labs",
    "independent software house",
    "software studio",
    "worldwide developers",
    "Audiocrypt",
    "Feeper",
    "Minto",
    "Better TV",
    "Fasting Cycle",
  ],
  openGraph: {
    title: "NOMAD // CODELABS",
    description:
      "An independent software house building bold software for a borderless world.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${outfit.variable} ${hanken.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <div className="atmos-grain" aria-hidden />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
