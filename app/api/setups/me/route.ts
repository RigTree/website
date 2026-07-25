import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import type { BuildCoresIndex, BuildCoresPart, PartSpec } from "@/lib/buildcores-types";
import { getOwnSetup, saveSetup, type SetupVisibility } from "@/lib/setups";
import buildCoresIndex from "@/data/buildcores-index.json";

const source = (buildCoresIndex as BuildCoresIndex).source;
const maxPartsPerSetup = 150;

export const runtime = "edge";

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

function asTrimmedString(value: unknown, fallback = "", maxLength = 120) {
  return asString(value, fallback).slice(0, maxLength);
}

function normalizeSpecs(value: unknown): PartSpec[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .slice(0, 16)
    .map((spec) => {
      if (!spec || typeof spec !== "object") {
        return null;
      }

      const record = spec as Record<string, unknown>;
      const label = asTrimmedString(record.label, "", 48);
      const specValue = asTrimmedString(record.value, "", 160);

      return label && specValue ? { label, value: specValue } : null;
    })
    .filter((spec): spec is PartSpec => Boolean(spec));
}

function normalizePart(value: unknown): BuildCoresPart | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const id = asTrimmedString(record.id, "", 120);
  const category = asTrimmedString(record.category, "", 80);
  const categoryLabel = asTrimmedString(record.categoryLabel, category, 80);
  const name = asTrimmedString(record.name, "", 220);
  const manufacturer = asTrimmedString(record.manufacturer, "", 120);
  const releaseYear =
    typeof record.releaseYear === "number" && Number.isFinite(record.releaseYear)
      ? record.releaseYear
      : null;

  if (!id || !category || !name || !manufacturer) {
    return null;
  }

  const specs = normalizeSpecs(record.specs);

  return {
    category,
    categoryLabel,
    id,
    manufacturer,
    name,
    releaseYear,
    searchText: [
      category,
      categoryLabel,
      name,
      manufacturer,
      ...specs.flatMap((spec) => [spec.label, spec.value]),
    ]
      .join(" ")
      .toLowerCase(),
    series: asTrimmedString(record.series, "", 120),
    specs,
    variant: asTrimmedString(record.variant, "", 120),
  };
}

function getUsernameBase(user: Awaited<ReturnType<typeof currentUser>>) {
  return (
    user?.username ||
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    user?.firstName ||
    "builder"
  );
}

function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>) {
  return (
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress.split("@")[0] ||
    "RigTree builder"
  );
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const setup = await getOwnSetup(userId);

  return NextResponse.json({
    setup,
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Record<string, unknown>;
  const parts = Array.isArray(body.parts)
    ? body.parts.slice(0, maxPartsPerSetup).map(normalizePart).filter(Boolean)
    : [];

  if (!parts.length) {
    return NextResponse.json(
      { error: "Pick at least one part before publishing." },
      { status: 400 },
    );
  }

  const user = await currentUser();
  const visibility: SetupVisibility =
    body.visibility === "private" ? "private" : "public";
  const customUsername = typeof body.username === "string" && body.username.trim() ? body.username.trim() : undefined;

  const saved = await saveSetup({
    avatarUrl: user?.imageUrl ?? null,
    clerkUserId: userId,
    customUsername,
    description: asTrimmedString(body.description, "", 280),
    displayName: getDisplayName(user),
    parts: parts as BuildCoresPart[],
    source,
    title: asTrimmedString(body.title, "My RigTree setup", 80),
    usernameBase: getUsernameBase(user),
    visibility,
  });

  return NextResponse.json({
    profileUrl: `/u/${saved.profile.username}`,
    setup: saved,
  });
}
