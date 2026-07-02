export type PartSpec = {
  label: string;
  value: string;
};

export type BuildCoresPart = {
  id: string;
  category: string;
  categoryLabel: string;
  name: string;
  manufacturer: string;
  series: string;
  variant: string;
  releaseYear: number | null;
  specs: PartSpec[];
  searchText: string;
};

export type BuildCoresCategory = {
  id: string;
  label: string;
  total: number;
  file: string;
  manufacturers: string[];
};

export type BuildCoresIndex = {
  source: {
    name: string;
    repository: string;
    commit: string;
    license: string;
    generatedAt: string;
  };
  totalParts: number;
  categories: BuildCoresCategory[];
};

export type DraftState = Record<string, BuildCoresPart[]>;

