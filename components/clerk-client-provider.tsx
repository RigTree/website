"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

const clerkAppearance = {
  theme: shadcn,
  variables: {
    colorBackground: "hsl(0 0% 7%)", // Match --background
    colorBorder: "hsl(0 0% 19%)", // Match --border
    colorDanger: "hsl(0 84% 60%)",
    colorForeground: "hsl(0 0% 96%)", // Match --foreground
    colorText: "hsl(0 0% 96%)", // Pure monochrome text
    colorTextSecondary: "hsl(0 0% 62%)", // Grayscale secondary text
    colorTextOnPrimaryBackground: "hsl(0 0% 5%)", // Monochrome primary contrast
    colorInput: "hsl(0 0% 11%)", // Match --card
    colorInputForeground: "hsl(0 0% 96%)",
    colorModalBackdrop: "hsl(0 0% 0% / 0.8)",
    colorMuted: "hsl(0 0% 17%)", // Match --muted
    colorMutedForeground: "hsl(0 0% 62%)", // Match --muted-foreground
    colorNeutral: "hsl(0 0% 96%)",
    colorPrimary: "hsl(0 0% 92%)", // Match --primary
    colorPrimaryForeground: "hsl(0 0% 5%)", // Match --primary-foreground
    colorRing: "hsl(0 0% 82% / 0.45)", // Match --ring
    colorShadow: "hsl(0 0% 0%)",
    borderRadius: "0.5rem",
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  elements: {
    card: "bg-card text-card-foreground border border-border shadow-soft rounded-xl",
    cardBox: "shadow-soft border-0",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground font-mono text-xs uppercase tracking-wider",
    footer: "border-t border-border bg-secondary/30",
    footerActionLink: "text-foreground hover:text-muted-foreground transition-colors font-medium",
    footerActionText: "text-muted-foreground",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/95 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
    formFieldInput:
      "border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 transition-all duration-150",
    formFieldInputShowPasswordButton:
      "text-muted-foreground hover:text-foreground",
    formFieldLabel: "text-foreground text-xs font-medium tracking-wide uppercase text-muted-foreground",
    headerSubtitle: "text-muted-foreground text-xs mt-1.5",
    headerTitle: "text-foreground text-2xl font-bold tracking-tight",
    modalBackdrop: "bg-black/80 backdrop-blur-md",
    modalContent: "rounded-xl border border-border bg-card shadow-soft",
    socialButtonsBlockButton:
      "border border-border bg-secondary/50 text-foreground hover:bg-secondary transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0",
    socialButtonsBlockButtonText: "font-medium text-foreground",
    socialButtonsProviderIcon: "brightness-0 invert",
    logoImage: "brightness-0 invert",
    poweredByBox: "grayscale opacity-50",
  },
};

export function ClerkClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider
      appearance={clerkAppearance}
      publishableKey={publishableKey}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
