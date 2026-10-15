import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F4",
        surface: "#FFFFFF",
        ink: "#1A1A1A",
        "ink-sec": "#5C5C57",
        "ink-ph": "#8A8A83",
        border: "#E4E1DA",
        accent: "#1F3A5F",
        "accent-hover": "#162B47",
        "accent-tint": "#E8EDF4",
        success: "#2F6B4F",
        warning: "#A86B12",
        danger: "#A63D2F",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Source Serif 4", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        "8px": "8px",
        "12px": "12px",
      },
    },
  },
  plugins: [],
};

export default config;
