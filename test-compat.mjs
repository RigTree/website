import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

try {
  compat.extends("next/core-web-vitals", "next/typescript");
  console.log("Success!");
} catch (e) {
  console.error("Error:", e);
}
