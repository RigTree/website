import Link from "next/link";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";

export const metadata = {
  title: "Privacy Policy - RigTree",
  description: "Privacy policy for RigTree.",
};

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
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-accent">
              <RigTreeMark className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">RigTree</span>
          </Link>
          <Button asChild variant="ghost" size="sm">
            <Link href="/">Back to Home</Link>
          </Button>
        </nav>
      </header>

      {/* Content */}
      <article className="container relative z-10 mt-16 max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-invert mt-12 max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-sky-400">
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
            We do not sell your personal data to third parties.
          </p>

          <h2>3. Third-Party Services</h2>
          <p>
            We use Clerk for authentication and identity management. Your login credentials and authentication state 
            are securely handled by Clerk. Additionally, hardware specifications and database information 
            are powered by BuildCores DB.
          </p>

          <h2>4. Data Visibility</h2>
          <p>
            Any hardware setups you mark as "public" will be visible to anyone on the internet who visits your 
            profile URL. If you mark a setup as "private", it will remain hidden from the public view.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us or open an issue on our GitHub repository.
          </p>
        </div>
      </article>
    </main>
  );
}
