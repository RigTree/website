import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";

const repoRoot = process.argv[2] ?? "/tmp/buildcores-open-db";
const outputDir = process.argv[3] ?? "public/data/buildcores";
const indexPath = process.argv[4] ?? "data/buildcores-index.json";
const reportPath = process.argv[5];

const categoryLabels = {
  Accessory: "Accessory",
  CPU: "CPU",
  CPUCooler: "CPU cooler",
  CaptureCard: "Capture card",
  CaseFan: "Case fan",
  Chair: "Chair",
  Desk: "Desk",
  GPU: "GPU",
  Headphones: "Headphones",
  Keyboard: "Keyboard",
  Laptop: "Laptop",
  Lighting: "Lighting",
  Microphone: "Microphone",
  Monitor: "Monitor",
  Motherboard: "Motherboard",
  Mouse: "Mouse",
  Mousepad: "Mousepad",
  NetworkCard: "Network card",
  OS: "Operating system",
  PCCase: "Case",
  PSU: "Power supply",
  PrebuiltDesktop: "Prebuilt desktop",
  RAM: "Memory",
  SoundCard: "Sound card",
  Speaker: "Speaker",
  Stand: "Stand",
  Storage: "Storage",
  ThermalCompound: "Thermal compound",
  VRHeadset: "VR headset",
  Webcam: "Webcam",
};

const preferredOrder = [
  "CPU",
  "GPU",
  "Motherboard",
  "RAM",
  "Storage",
  "PSU",
  "PCCase",
  "CPUCooler",
  "CaseFan",
  "Monitor",
  "Keyboard",
  "Mouse",
  "Mousepad",
  "Headphones",
  "Microphone",
  "Speaker",
  "Webcam",
  "CaptureCard",
  "NetworkCard",
  "SoundCard",
  "Laptop",
  "PrebuiltDesktop",
  "Desk",
  "Chair",
  "Lighting",
  "Accessory",
  "OS",
  "Stand",
  "ThermalCompound",
  "VRHeadset",
];

const categorySpecs = {
  Accessory: [
    ["Type", "type"],
    ["Color", "color"],
    ["Material", "material"],
  ],
  CPU: [
    ["Socket", "socket"],
    ["Cores", "cores.total"],
    ["Threads", "cores.threads"],
    ["Boost", "clocks.performance.boost", " GHz"],
    ["TDP", "specifications.tdp", " W"],
    ["Memory", "specifications.memory.types"],
  ],
  CPUCooler: [
    ["Type", "type"],
    ["Fan RPM", "fan_rpm"],
    ["Noise", "noise_level", " dBA"],
    ["Radiator", "radiator_size", " mm"],
    ["Height", "height", " mm"],
    ["TDP", "tdp", " W"],
  ],
  CaptureCard: [
    ["Interface", "interface"],
    ["Input", "input"],
    ["Output", "output"],
    ["Passthrough", "passthrough"],
    ["Capture", "capture_resolution"],
  ],
  CaseFan: [
    ["Size", "size", " mm"],
    ["RPM", "rpm"],
    ["Airflow", "airflow", " CFM"],
    ["Noise", "noise_level", " dBA"],
    ["PWM", "pwm"],
    ["Lighting", "lighting"],
  ],
  Chair: [
    ["Type", "type"],
    ["Color", "color"],
    ["Material", "material"],
    ["Weight capacity", "weight_capacity", " lb"],
  ],
  Desk: [
    ["Type", "type"],
    ["Width", "width", " mm"],
    ["Depth", "depth", " mm"],
    ["Height", "height", " mm"],
    ["Material", "material"],
  ],
  GPU: [
    ["Chipset", "chipset"],
    ["VRAM", "memory", " GB"],
    ["Memory", "memory_type"],
    ["Boost", "core_boost_clock", " MHz"],
    ["TDP", "tdp", " W"],
    ["Length", "length", " mm"],
  ],
  Headphones: [
    ["Type", "type"],
    ["Connection", "connection"],
    ["Frequency", "frequency_response"],
    ["Mic", "microphone"],
    ["Surround", "surround_sound"],
  ],
  Keyboard: [
    ["Style", "style"],
    ["Switch", "switch_type"],
    ["Layout", "layout"],
    ["Connection", "connection"],
    ["Backlit", "backlit"],
  ],
  Laptop: [
    ["CPU", "cpu"],
    ["GPU", "gpu"],
    ["Memory", "memory"],
    ["Storage", "storage"],
    ["Display", "display"],
  ],
  Lighting: [
    ["Type", "type"],
    ["Color", "color"],
    ["Connection", "connection"],
  ],
  Microphone: [
    ["Type", "type"],
    ["Pattern", "polar_pattern"],
    ["Connection", "connection"],
    ["Frequency", "frequency_response"],
    ["Sample rate", "sample_rate"],
  ],
  Monitor: [
    ["Size", "screen_size", '"'],
    ["Resolution", "resolution"],
    ["Refresh", "refresh_rate", " Hz"],
    ["Panel", "panel_type"],
    ["Response", "response_time", " ms"],
    ["Sync", "adaptive_sync"],
  ],
  Motherboard: [
    ["Socket", "socket"],
    ["Form", "form_factor"],
    ["Chipset", "chipset"],
    ["Memory", "memory.type"],
    ["Slots", "memory.slots"],
    ["Max RAM", "memory.max", " GB"],
  ],
  Mouse: [
    ["Connection", "connection"],
    ["Sensor", "sensor"],
    ["DPI", "max_dpi"],
    ["Buttons", "buttons"],
    ["Weight", "weight", " g"],
  ],
  Mousepad: [
    ["Width", "width", " mm"],
    ["Depth", "depth", " mm"],
    ["Thickness", "thickness", " mm"],
    ["Material", "material"],
  ],
  NetworkCard: [
    ["Interface", "interface"],
    ["Protocol", "protocol"],
    ["Speed", "speed"],
    ["Wi-Fi", "wifi"],
    ["Bluetooth", "bluetooth"],
  ],
  OS: [
    ["Version", "version"],
    ["Architecture", "architecture"],
    ["License", "license"],
  ],
  PCCase: [
    ["Type", "type"],
    ["Side panel", "side_panel"],
    ["Color", "color"],
    ["PSU", "power_supply"],
    ["GPU clearance", "max_gpu_length", " mm"],
    ["Cooler clearance", "max_cpu_cooler_height", " mm"],
  ],
  PSU: [
    ["Wattage", "wattage", " W"],
    ["Rating", "efficiency_rating"],
    ["Modular", "modular"],
    ["Form", "form_factor"],
    ["Length", "length", " mm"],
  ],
  PrebuiltDesktop: [
    ["CPU", "cpu"],
    ["GPU", "gpu"],
    ["Memory", "memory"],
    ["Storage", "storage"],
    ["PSU", "psu"],
  ],
  RAM: [
    ["Type", "type"],
    ["Speed", "speed", " MT/s"],
    ["Capacity", "capacity", " GB"],
    ["Modules", "modules"],
    ["CAS", "cas_latency"],
    ["Voltage", "voltage", " V"],
  ],
  SoundCard: [
    ["Interface", "interface"],
    ["Channels", "channels"],
    ["Sample rate", "sample_rate"],
    ["SNR", "snr", " dB"],
  ],
  Speaker: [
    ["Configuration", "configuration"],
    ["Wattage", "wattage", " W"],
    ["Connection", "connection"],
    ["Frequency", "frequency_response"],
  ],
  Stand: [
    ["Type", "type"],
    ["Mount", "mount"],
    ["Color", "color"],
  ],
  Storage: [
    ["Type", "type"],
    ["Capacity", "capacity", " GB"],
    ["Interface", "interface"],
    ["Form", "form_factor"],
    ["Cache", "cache", " MB"],
    ["NAND", "nand_type"],
  ],
  ThermalCompound: [
    ["Amount", "amount", " g"],
    ["Thermal conductivity", "thermal_conductivity", " W/mK"],
  ],
  VRHeadset: [
    ["Resolution", "resolution"],
    ["Refresh", "refresh_rate", " Hz"],
    ["Tracking", "tracking"],
    ["Connection", "connection"],
  ],
  Webcam: [
    ["Resolution", "resolution"],
    ["FPS", "fps"],
    ["Connection", "connection"],
    ["Focus", "focus_type"],
    ["Mic", "microphone"],
  ],
};

function getValue(source, path) {
  return path.split(".").reduce((value, key) => {
    if (value == null || typeof value !== "object") {
      return undefined;
    }

    return value[key];
  }, source);
}

function formatValue(value, suffix = "") {
  if (value == null || value === "" || value === 0) {
    return "";
  }

  if (Array.isArray(value)) {
    return value
      .flat()
      .filter((item) => item != null && item !== "")
      .map(String)
      .join(", ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "object") {
    return "";
  }

  return `${value}${suffix}`;
}

function genericSpecs(raw) {
  const ignored = new Set([
    "opendb_id",
    "metadata",
    "general_product_information",
    "series",
    "color",
    "lighting",
  ]);
  const specs = [];

  for (const [key, value] of Object.entries(raw)) {
    if (ignored.has(key)) {
      continue;
    }

    const formatted = formatValue(value);
    if (!formatted) {
      continue;
    }

    specs.push({
      label: key.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      value: formatted,
    });

    if (specs.length >= 6) {
      break;
    }
  }

  return specs;
}

function compactSpecs(category, raw) {
  const preferred = (categorySpecs[category] ?? [])
    .map(([label, path, suffix]) => ({
      label,
      value: formatValue(getValue(raw, path), suffix),
    }))
    .filter((spec) => spec.value)
    .slice(0, 6);

  return preferred.length ? preferred : genericSpecs(raw);
}

function partName(raw) {
  const metadata = raw.metadata ?? {};
  return metadata.name ?? raw.name ?? metadata.variant ?? raw.opendb_id;
}

function normalizePart(category, categoryLabel, raw) {
  const metadata = raw.metadata ?? {};
  const name = partName(raw);
  const specs = compactSpecs(category, raw);
  const tags = [
    metadata.manufacturer,
    metadata.series,
    metadata.variant,
    raw.socket,
    raw.chipset,
    raw.type,
    raw.form_factor,
    raw.interface,
    raw.connection,
    raw.color,
  ]
    .flat()
    .filter(Boolean)
    .map(String);

  return {
    id: raw.opendb_id,
    category,
    categoryLabel,
    name,
    manufacturer: metadata.manufacturer ?? "Unknown",
    series: metadata.series ?? raw.series ?? "",
    variant: metadata.variant ?? "",
    releaseYear: metadata.releaseYear ?? null,
    specs,
    searchText: [
      categoryLabel,
      name,
      metadata.manufacturer,
      metadata.series,
      metadata.variant,
      raw.series,
      ...specs.map((spec) => `${spec.label} ${spec.value}`),
      ...tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  };
}

function compareParts(a, b) {
  const aYear = a.releaseYear ?? 0;
  const bYear = b.releaseYear ?? 0;

  if (aYear !== bYear) {
    return bYear - aYear;
  }

  const maker = a.manufacturer.localeCompare(b.manufacturer);
  if (maker !== 0) {
    return maker;
  }

  return a.name.localeCompare(b.name);
}

async function readPreviousIndex() {
  if (!existsSync(indexPath)) {
    return null;
  }

  try {
    return JSON.parse(await readFile(indexPath, "utf8"));
  } catch {
    return null;
  }
}

function signedDelta(value) {
  if (value > 0) {
    return `+${value.toLocaleString()}`;
  }

  return value.toLocaleString();
}

function percentOfTotal(value, total) {
  if (!total) {
    return "0.0%";
  }

  return `${((value / total) * 100).toFixed(1)}%`;
}

function shortCommit(commit) {
  return commit ? commit.slice(0, 7) : "unknown";
}

function createReport(index, previousIndex, durationMs) {
  const previousByCategory = new Map(
    previousIndex?.categories?.map((category) => [category.id, category]) ?? [],
  );
  const categoryRows = index.categories.map((category) => {
    const previous = previousByCategory.get(category.id);
    const delta = category.total - (previous?.total ?? 0);

    return {
      ...category,
      delta,
      manufacturerCount: category.manufacturers.length,
    };
  });

  const changedRows = categoryRows.filter((category) => category.delta !== 0);
  const topCategories = [...categoryRows]
    .sort((left, right) => right.total - left.total)
    .slice(0, 10);
  const totalDelta = index.totalParts - (previousIndex?.totalParts ?? 0);
  const previousCommit = previousIndex?.source?.commit;
  const sourceChanged = previousCommit !== index.source.commit;
  const generatedAt = new Date(index.source.generatedAt);
  const checkedAt = new Date();
  const categoryCount = index.categories.length;
  const manufacturerTotal = new Set(
    index.categories.flatMap((category) => category.manufacturers),
  ).size;

  const lines = [
    "# RigTree OpenDB Refresh",
    "",
    `Checked ${checkedAt.toUTCString()} against [${index.source.name}](${index.source.repository}).`,
    "",
    `Current cached snapshot was generated ${generatedAt.toUTCString()}.`,
    "",
    "## Run Metrics",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    `| Source commit | \`${shortCommit(index.source.commit)}\` |`,
    `| Previous commit | \`${shortCommit(previousCommit)}\` |`,
    `| Commit changed | ${sourceChanged ? "Yes" : "No"} |`,
    `| Total parts | ${index.totalParts.toLocaleString()} |`,
    `| Parts delta | ${signedDelta(totalDelta)} |`,
    `| Categories | ${categoryCount.toLocaleString()} |`,
    `| Unique makers | ${manufacturerTotal.toLocaleString()} |`,
    `| Import duration | ${(durationMs / 1000).toFixed(1)}s |`,
    "",
    "## Largest Categories",
    "",
    "| Category | Parts | Share | Makers |",
    "| --- | ---: | ---: | ---: |",
    ...topCategories.map(
      (category) =>
        `| ${category.label} | ${category.total.toLocaleString()} | ${percentOfTotal(
          category.total,
          index.totalParts,
        )} | ${category.manufacturerCount.toLocaleString()} |`,
    ),
    "",
    "## Category Changes",
    "",
  ];

  if (changedRows.length) {
    lines.push(
      "| Category | Current | Change | Makers |",
      "| --- | ---: | ---: | ---: |",
      ...changedRows
        .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))
        .map(
          (category) =>
            `| ${category.label} | ${category.total.toLocaleString()} | ${signedDelta(
              category.delta,
            )} | ${category.manufacturerCount.toLocaleString()} |`,
        ),
      "",
    );
  } else {
    lines.push("No category count changes were detected in this refresh.", "");
  }

  lines.push(
    "## Full Category Inventory",
    "",
    "| Category | Parts | Makers | Data file |",
    "| --- | ---: | ---: | --- |",
    ...categoryRows.map(
      (category) =>
        `| ${category.label} | ${category.total.toLocaleString()} | ${category.manufacturerCount.toLocaleString()} | \`${category.file}\` |`,
    ),
    "",
    "## Source License",
    "",
    `${index.source.license}.`,
    "",
  );

  return lines.join("\n");
}

async function main() {
  const startedAt = Date.now();
  const openDbRoot = join(repoRoot, "open-db");
  if (!existsSync(openDbRoot)) {
    throw new Error(`BuildCores open-db directory not found at ${openDbRoot}`);
  }

  const commit = execFileSync("git", ["-C", repoRoot, "rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const previousIndex = await readPreviousIndex();

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await mkdir(dirname(indexPath), { recursive: true });

  const sourceCategories = (await readdir(openDbRoot, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);

      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }

      if (aIndex === -1) {
        return 1;
      }

      if (bIndex === -1) {
        return -1;
      }

      return aIndex - bIndex;
    });

  const categories = [];
  let totalParts = 0;

  for (const category of sourceCategories) {
    const label = categoryLabels[category] ?? category;
    const categoryDir = join(openDbRoot, category);
    const files = (await readdir(categoryDir))
      .filter((file) => file.endsWith(".json"))
      .sort();
    const parts = [];

    for (const file of files) {
      const raw = JSON.parse(await readFile(join(categoryDir, file), "utf8"));
      parts.push(normalizePart(category, label, raw));
    }

    parts.sort(compareParts);
    await writeFile(
      join(outputDir, `${category}.json`),
      JSON.stringify({ category, label, total: parts.length, parts }),
    );

    const manufacturers = [
      ...new Set(parts.map((part) => part.manufacturer).filter(Boolean)),
    ].sort((a, b) => a.localeCompare(b));

    totalParts += parts.length;
    categories.push({
      id: category,
      label,
      total: parts.length,
      file: `/data/buildcores/${category}.json`,
      manufacturers,
    });
  }

  const index = {
    source: {
      name: "BuildCores OpenDB",
      repository: "https://github.com/buildcores/buildcores-open-db",
      commit,
      license: "Open Data Commons Attribution License (ODC-By) v1.0",
      generatedAt:
        previousIndex?.source?.commit === commit
          ? previousIndex.source.generatedAt
          : new Date().toISOString(),
    },
    totalParts,
    categories,
  };

  await writeFile(indexPath, JSON.stringify(index, null, 2));

  if (reportPath) {
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(
      reportPath,
      createReport(index, previousIndex, Date.now() - startedAt),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
