import Link from "next/link";

import { NavAuthControls } from "@/components/auth-actions";
import { PartPicker, type BuildCoresIndex } from "@/components/editor/part-picker";
import { RigTreeMark } from "@/components/rigtree-mark";
import { Button } from "@/components/ui/button";
import buildCoresIndex from "@/data/buildcores-index.json";

const data = buildCoresIndex as BuildCoresIndex;

export const metadata = {
  title: "RigTree Editor",
  description: "Pick parts and draft a RigTree setup profile.",
};

export default function EditorPage() {
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
        <div className="mx-auto w-full max-w-[1680px] px-4 py-5 md:py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase text-muted-foreground">
                Setup editor
              </p>
              <h1 className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                Build your RigTree parts list.
              </h1>
            </div>
            <div className="grid grid-cols-3 divide-x divide-border border border-border bg-background/40 text-center md:min-w-[410px]">
              <div className="px-4 py-3">
                <p className="font-mono text-lg font-semibold">
                  {data.totalParts.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground">Parts</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-mono text-lg font-semibold">
                  {data.categories.length}
                </p>
                <p className="text-xs text-muted-foreground">Slots</p>
              </div>
              <div className="px-4 py-3">
                <p className="font-mono text-lg font-semibold">
                  {data.source.commit.slice(0, 7)}
                </p>
                <p className="text-xs text-muted-foreground">OpenDB</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1680px] px-4 py-5 md:py-6">
        <PartPicker index={data} />
      </section>
    </main>
  );
}
