import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"], mono: ["JetBrains Mono", "monospace"] },
      colors: { primary: { DEFAULT: "#4f46e5", hover: "#4338ca" } },
    },
  },
  plugins: [],
} satisfies Config;
