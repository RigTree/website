import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".vercel/**",
      "node_modules/**",
      "next-env.d.ts",
      "worker-configuration.d.ts",
      "cloudflare-env.d.ts",
      ".open-next/**",
      ".wrangler/**",
      ".tmp/**"
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off"
    }
  }
];

export default eslintConfig;

