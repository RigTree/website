import Link from "next/link";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Privacy Policy — RigTree",
  description: "Learn how RigTree collects, uses, and protects your personal information.",
};

const LAST_UPDATED = "July 2025";

export default function PrivacyPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pb-24">
      {/* Background visuals */}
      <div className="orb orb-blue absolute left-[-10%] top-[10%] h-[500px] w-[500px] opacity-20 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.1] pointer-events-none" />
      <ParticlesBackground />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <nav className="container flex h-16 max-w-4xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-accent">
              <RigTreeMark className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight group-hover:text-sky-400 transition-colors">RigTree</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/terms">Terms</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </nav>
      </header>

      {/* Content */}
      <article className="container relative z-10 mt-16 max-w-3xl">
        {/* Header */}
        <div className="mb-12">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/30 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
            <span className="size-1.5 rounded-full bg-sky-400" />
            Legal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Privacy Policy</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-sky-400 prose-h2:mt-10 prose-h2:text-xl prose-h2:font-bold prose-p:leading-7">

          <p>
            This Privacy Policy explains how RigTree (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;the service&rdquo;) collects, uses, and protects your information when you use our platform. By using RigTree, you agree to the collection and use of information as described here.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            When you create an account on RigTree, we collect basic profile information including your username,
            email address, and profile picture (facilitated securely through Clerk).
            We also store the hardware setups and part specifications you choose to publish on your profile.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            The information you provide is primarily used to generate your public RigTree profile.
            We use your email address solely for account-related notifications and critical updates.
            We do not sell your personal data to third parties, ever.
          </p>

          <h2>3. Third-Party Services</h2>
          <p>
            We use <strong className="text-foreground">Clerk</strong> for authentication and identity management. Your login credentials and authentication state
            are securely handled by Clerk and subject to their privacy policy. Additionally, hardware specifications and database information
            are powered by BuildCores DB, an open-source hardware catalog.
          </p>

          <h2>4. Data Visibility</h2>
          <p>
            Any hardware setups you mark as &ldquo;public&rdquo; will be visible to anyone on the internet who visits your
            profile URL. If you mark a setup as &ldquo;private&rdquo;, it will remain hidden from the public view.
            You can change the visibility of your setups at any time from the editor.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your profile data for as long as your account is active. If you delete your account,
            your profile data and all associated setups will be permanently removed from our systems within
            30 days. Some anonymized, aggregated statistics (e.g., total parts count) may be retained
            indefinitely for product analytics.
          </p>

          <h2>6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal data at any time.
            To export or delete your data, you can manage your account settings through Clerk,
            or contact us directly via GitHub. We will respond to all data requests within 30 days.
          </p>

          <h2>7. Cookies & Local Storage</h2>
          <p>
            RigTree uses browser local storage to persist your editor state between sessions (e.g., your
            in-progress rig build). We use cookies strictly for authentication purposes through Clerk.
            We do not use tracking or advertising cookies.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please open an issue on our{" "}
            <a href="https://github.com/AltamashRafworx/RigTree" target="_blank" rel="noreferrer">GitHub repository</a>{" "}
            or reach out through the contact information listed there.
          </p>
        </div>

        <Separator className="my-12" />

        {/* Footer nav */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RigTree. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#" className="hover:text-foreground transition-colors">↑ Top</a>
          </div>
        </div>
      </article>
    </main>
  );
}
