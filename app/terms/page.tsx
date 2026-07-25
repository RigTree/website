import Link from "next/link";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import { ParticlesBackground } from "@/components/particles-background";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: "Terms of Service — RigTree",
  description: "Read the terms and conditions for using the RigTree hardware profile platform.",
};

const LAST_UPDATED = "July 2025";

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
          <Link href="/" className="flex items-center gap-3 group">
            <span className="flex size-8 items-center justify-center rounded-md border border-border bg-secondary text-foreground transition-colors hover:bg-accent">
              <RigTreeMark className="size-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight group-hover:text-sky-400 transition-colors">RigTree</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/privacy">Privacy</Link>
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
            <span className="size-1.5 rounded-full bg-violet-400" />
            Legal
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">Terms of Service</h1>
          <p className="mt-3 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="prose prose-invert max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-sky-400 prose-h2:mt-10 prose-h2:text-xl prose-h2:font-bold prose-p:leading-7">

          <p>
            These Terms of Service govern your use of RigTree. By accessing or using our platform,
            you agree to be bound by these terms. If you do not agree, please do not use this service.
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using RigTree, you accept and agree to be bound by the terms and provisions of this agreement.
            If you do not agree to abide by these terms, please do not use this service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            RigTree provides users with tools to create, manage, and share hardware profiles and setup configurations.
            We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice.
            We will make reasonable efforts to notify users of significant changes.
          </p>

          <h2>3. User Conduct and Responsibilities</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account information and for all activities
            that occur under your account. You agree not to use the service to post any content that is unlawful,
            harmful, threatening, abusive, or otherwise objectionable. Impersonation of other users or public figures is prohibited.
          </p>

          <h2>4. Hardware Data</h2>
          <p>
            The hardware part data, specifications, and related information provided on this platform are powered by
            BuildCores DB, an open-source hardware catalog. While we strive for accuracy, we cannot guarantee that all
            hardware specifications are entirely error-free or up-to-date. Users are encouraged to verify specifications
            with official manufacturer sources.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The visual interfaces, design, compilation, information, code, and all other elements of the service
            are protected by intellectual property rights. Users retain ownership over the textual content they submit,
            but grant RigTree a worldwide, royalty-free license to display and distribute it as part of the platform.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            RigTree is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. To the fullest extent permitted by law,
            RigTree shall not be liable for any indirect, incidental, special, consequential, or punitive damages
            resulting from your use of or inability to use the service.
          </p>

          <h2>7. Changes to These Terms</h2>
          <p>
            We reserve the right to update these Terms of Service at any time. When we do, we will revise the
            &ldquo;Last Updated&rdquo; date at the top of this page. Continued use of the service after changes constitutes
            your acceptance of the revised terms.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms shall be governed by and construed in accordance with applicable law. Any disputes
            arising from these terms or your use of the service shall be resolved through good-faith negotiation
            before pursuing any formal legal process.
          </p>

          <h2>9. Contact</h2>
          <p>
            If you have any questions about these Terms, please open an issue on our{" "}
            <a href="https://github.com/AltamashRafworx/RigTree" target="_blank" rel="noreferrer">GitHub repository</a>{" "}
            or reach out through the contact information listed there.
          </p>
        </div>

        <Separator className="my-12" />

        {/* Footer nav */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RigTree. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <a href="#" className="hover:text-foreground transition-colors">↑ Top</a>
          </div>
        </div>
      </article>
    </main>
  );
}
