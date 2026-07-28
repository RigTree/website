import Link from "next/link";

import { NavAuthControls } from "@/components/auth-actions";
import { EditorContent } from "@/components/editor/editor-content";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import buildCoresIndex from "@/data/buildcores-index.json";
import type { BuildCoresIndex } from "@/lib/buildcores-types";

const data = buildCoresIndex as BuildCoresIndex;

export const metadata = {
  title: "RigTree Editor",
  description: "Pick parts and draft a RigTree setup profile.",
};


import { auth, currentUser } from "@clerk/nextjs/server";

export default async function EditorPage() {
  await auth.protect({
    unauthenticatedUrl: "/sign-in",
  });

  const user = await currentUser();
  const isPremium = (user?.publicMetadata as Record<string, unknown>)?.plan === "premium";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-16 w-full max-w-[1680px] flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-md border border-border bg-secondary text-foreground">
              <RigTreeMark className="size-5" />
            </span>
            <span className="text-sm font-semibold">RigTree</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">Home</Link>
            </Button>
            <NavAuthControls />
          </div>
        </nav>
      </header>

      <section className="border-b border-border bg-secondary/20">
        <div className="mx-auto w-full max-w-[1680px] px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase text-muted-foreground">
                Setup editor
              </p>
              <h1 className="mt-0.5 text-xl font-bold leading-tight md:text-2xl">
                Build your parts list
              </h1>
            </div>
            <p className="hidden font-mono text-xs text-muted-foreground sm:block">
              {data.totalParts.toLocaleString()} parts · {data.categories.length} slots · {data.source.commit.slice(0, 7)}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-5 md:py-6">
        <EditorContent data={data} isPremium={isPremium} />
      </section>
    </main>
  );
}
