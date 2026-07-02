"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

const clerkAppearance = {
  theme: shadcn,
  variables: {
    colorBackground: "hsl(0 0% 12%)",
    colorBorder: "hsl(0 0% 24%)",
    colorDanger: "hsl(0 84% 60%)",
    colorForeground: "hsl(0 0% 96%)",
    colorInput: "hsl(0 0% 10%)",
    colorInputForeground: "hsl(0 0% 96%)",
    colorModalBackdrop: "hsl(0 0% 0% / 0.78)",
    colorMuted: "hsl(0 0% 16%)",
    colorMutedForeground: "hsl(0 0% 68%)",
    colorNeutral: "hsl(0 0% 96%)",
    colorPrimary: "hsl(0 0% 92%)",
    colorPrimaryForeground: "hsl(0 0% 5%)",
    colorRing: "hsl(0 0% 82% / 0.45)",
    colorShadow: "hsl(0 0% 0%)",
    borderRadius: "0.5rem",
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  elements: {
    card: "bg-card text-card-foreground",
    cardBox: "border border-border bg-card shadow-2xl shadow-black/60",
    dividerLine: "bg-border",
    dividerText: "text-muted-foreground",
    footer: "border-t border-border bg-card",
    footerActionLink: "text-foreground hover:text-muted-foreground",
    footerActionText: "text-muted-foreground",
    formButtonPrimary:
      "bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring",
    formFieldInput:
      "border-border bg-background/95 text-foreground placeholder:text-muted-foreground focus-visible:ring-ring",
    formFieldInputShowPasswordButton:
      "text-muted-foreground hover:text-foreground",
    formFieldLabel: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    headerTitle: "text-foreground",
    modalBackdrop: "bg-black/80 backdrop-blur-sm",
    modalContent: "rounded-lg",
    socialButtonsBlockButton:
      "border-border bg-secondary text-foreground hover:bg-accent",
  },
};

export function ClerkClientProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={clerkAppearance}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}
