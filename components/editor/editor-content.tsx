"use client";

import { Laptop, Monitor, Smartphone, ChevronLeft } from "lucide-react";
import { useState } from "react";

import { PartPicker } from "@/components/editor/part-picker";
import { PhonePicker } from "@/components/editor/phone-picker";
import { Button } from "@/components/ui/button";
import type { BuildCoresIndex } from "@/lib/buildcores-types";

type EditorContentProps = {
  data: BuildCoresIndex;
};

export function EditorContent({ data }: EditorContentProps) {
  const [deviceType, setDeviceType] = useState<"desktop" | "laptop" | "phone" | null>(null);

  const filteredIndex = {
    ...data,
    categories: data.categories.filter((c) => c.id !== "PrebuiltDesktop"),
  };

  if (!deviceType) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center py-12">
        <h2 className="mb-8 text-center text-3xl font-bold">What are you building?</h2>
        <div className="grid w-full gap-6 md:grid-cols-3">
          <button
            onClick={() => setDeviceType("desktop")}
            className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary hover:bg-accent"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Monitor className="size-8" />
            </div>
            <h3 className="text-xl font-semibold">Desktop PC</h3>
            <p className="mt-2 text-sm text-muted-foreground">Pick custom PC parts and peripherals for your rig.</p>
          </button>

          <button
            onClick={() => setDeviceType("laptop")}
            className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary hover:bg-accent"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Laptop className="size-8" />
            </div>
            <h3 className="text-xl font-semibold">Laptop</h3>
            <p className="mt-2 text-sm text-muted-foreground">Log your pre-built laptop and add accessories.</p>
          </button>

          <button
            onClick={() => setDeviceType("phone")}
            className="group flex flex-col items-center rounded-xl border border-border bg-card p-8 text-center transition-all hover:border-primary hover:bg-accent"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Smartphone className="size-8" />
            </div>
            <h3 className="text-xl font-semibold">Mobile Phone</h3>
            <p className="mt-2 text-sm text-muted-foreground">Find detailed specs for your smartphone.</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {deviceType === "desktop" && (
        <div>
          <Button variant="ghost" onClick={() => setDeviceType(null)} className="mb-4">
            <ChevronLeft className="mr-2 size-4" /> Change Device Type
          </Button>
          <PartPicker index={filteredIndex} />
        </div>
      )}

      {deviceType === "laptop" && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-16 text-center">
          <Laptop className="mb-4 size-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold">Laptop Builder</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            We are working on bringing laptop tracking to RigTree! Check back soon for updates.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setDeviceType(null)}>
            Go Back
          </Button>
        </div>
      )}

      {deviceType === "phone" && (
        <div>
          <Button variant="ghost" onClick={() => setDeviceType(null)} className="mb-4">
            <ChevronLeft className="mr-2 size-4" /> Change Device Type
          </Button>
          <PhonePicker />
        </div>
      )}
    </div>
  );
}
