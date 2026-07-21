import Link from "next/link";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";

export const metadata = {
  title: "Terms of Service - RigTree",
  description: "Terms of service for RigTree.",
};

export default function TermsPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pb-24">
      {/* Background visuals */}
      <div className="orb orb-purple absolute right-[-10%] top-[10%] h-[500px] w-[500px] opacity-20 pointer-events-none" />
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
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

        <div className="prose prose-invert mt-12 max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-sky-400">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RigTree, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by these terms, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            RigTree provides users with tools to create, manage, and share hardware profiles and setup configurations. 
            We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
          </p>

          <h2>3. User Conduct and Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities 
            that occur under your account. You agree to not use the service to post any content that is unlawful, 
            harmful, threatening, abusive, or otherwise objectionable.
          </p>

          <h2>4. Hardware Data</h2>
          <p>
            The hardware part data, specifications, and related information provided on this platform are powered by 
            BuildCores DB. While we strive for accuracy, we cannot guarantee that all hardware specifications are entirely 
            error-free or up-to-date.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The visual interfaces, design, compilation, information, code, and all other elements of the service 
            are protected by intellectual property rights. Users retain ownership over the textual content they submit, 
            but grant RigTree a license to display it.
          </p>
        </div>
      </article>
    </main>
  );
}
