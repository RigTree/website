import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

import { RigTreeMark } from "@/components/rigtree-mark";
import { ParticlesBackground } from "@/components/particles-background";

export const runtime = "edge";

export const metadata = {
  title: "Sign In — RigTree",
  description: "Sign in to your RigTree account to manage and share your hardware setups.",
};

export default function SignInPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-background text-foreground overflow-hidden px-4 py-12">
      {/* ── Background ── */}
      <div className="orb orb-blue absolute left-[-10%] top-[10%] h-[500px] w-[500px] opacity-25 pointer-events-none" />
      <div className="orb orb-purple absolute right-[-10%] bottom-[10%] h-[450px] w-[450px] opacity-20 pointer-events-none" />
      <div className="grid-field absolute inset-0 opacity-[0.12] pointer-events-none" />
      <ParticlesBackground />

      {/* ── Branding ── */}
      <div className="site-enter relative z-10 mb-8 flex flex-col items-center text-center gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-secondary/80 text-foreground group-hover:bg-accent transition-colors duration-200 shadow-soft">
            <RigTreeMark className="size-5" />
          </span>
          <span className="text-lg font-bold tracking-tight group-hover:text-[#a3e635] transition-colors">
            RigTree
          </span>
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage your hardware profiles.
          </p>
        </div>
      </div>

      {/* ── Clerk Widget ── */}
      <div className="site-enter-slow relative z-10">
        <SignIn />
      </div>

      {/* ── Footer nudge ── */}
      <p className="site-enter-slow relative z-10 mt-8 text-xs text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="text-[#a3e635] hover:text-[#a3e635]/80 transition-colors underline underline-offset-2">
          Create one free
        </Link>
      </p>
    </main>
  );
}
