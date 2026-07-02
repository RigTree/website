import type { Metadata } from "next";
import { ClerkClientProvider } from "@/components/clerk-client-provider";
import { CustomCursor } from "@/components/custom-cursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "RigTree - Showcase Your Hardware",
  description:
    "Create a clean profile for your desktop, laptop, and everyday tech setups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        <ClerkClientProvider>
          {children}
          <CustomCursor />
        </ClerkClientProvider>
      </body>
    </html>
  );
}
