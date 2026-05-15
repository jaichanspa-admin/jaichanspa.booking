import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // JAI CHAN CI 2026 — warm neutral palette
        cream: {
          50: "#FDFAF7",   // pure off-white (cards, inputs)
          100: "#F5EDE4",  // page background (light content pages)
          200: "#E5DDD4",  // brand taupe (cover page tone)
          300: "#D4C9BB",  // dividers, subtle bg
        },
        brand: {
          dark: "#1C150D",         // near-black (primary text)
          brown: "#7A4E30",        // rich warm brown (secondary text, headings)
          terracotta: "#96583A",   // CI primary — warm terracotta (brand pages bg)
          gold: "#C9A26D",         // muted gold accent (highlights, focus)
          "light-brown": "#9E856F", // muted warm (placeholder, secondary labels)
          border: "#DDD5C8",       // warm border tone
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.25em",
        "brand-wide": "0.35em",
      },
    },
  },
  plugins: [],
};

export default config;
