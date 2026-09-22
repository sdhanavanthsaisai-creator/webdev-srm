import type { Metadata } from "next";
import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--fd", weight: "variable" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--fb", weight: "variable" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--fm", weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: "ClubCraft — Craft the room. Claim your seat.",
  description:
    "ClubCraft — the workshop floor for our build club. Live sessions, one tap to claim a seat.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${grotesk.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
