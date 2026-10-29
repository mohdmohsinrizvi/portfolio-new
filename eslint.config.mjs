import nextConfig from "eslint-config-next";

const [coreWebVitals, typescript, ...rest] = nextConfig;

const eslintConfig = [
  coreWebVitals,
  {
    ...typescript,
    rules: {
      ...(typescript?.rules ?? {}),
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  ...rest,
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "playwright-report/**",
      "test-results/**",
      "out/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      "react/no-unescaped-entities": "off",
      // The rules below encode React Compiler assumptions. The compiler is
      // not enabled in this project, and they reject patterns that are both
      // idiomatic and correct here — mutating Three.js shader uniforms
      // inside useFrame, capability detection via matchMedia in an effect,
      // and forwarding a ref through a polymorphic createElement call.
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/refs": "off",
    },
  },
];

export default eslintConfig;
