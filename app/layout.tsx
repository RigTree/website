import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ClerkClientProvider } from "@/components/clerk-client-provider";
import { CustomCursor } from "@/components/custom-cursor";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#121212",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://rigtree.io"),
  title: "RigTree - Showcase Your Hardware",
  description:
    "Create a clean profile for your desktop, laptop, and everyday tech setups.",
  keywords: ["PC Builder", "Hardware", "Desk Setup", "Battlestation", "RigTree", "PC Specs"],
  openGraph: {
    title: "RigTree - Showcase Your Hardware",
    description:
      "A clean, shareable profile for the hardware you actually use. Show the build, the desk, the parts, and the story behind it.",
    url: "https://rigtree.io",
    siteName: "RigTree",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "RigTree - Showcase Your Hardware",
    description:
      "A clean, shareable profile for the hardware you actually use.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ClerkClientProvider>
          {children}
          <CustomCursor />
        </ClerkClientProvider>
      </body>
    </html>
  );
}
