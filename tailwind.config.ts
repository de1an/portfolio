import type { Config } from "tailwindcss";

function withOpacity(cssVar: string) {
  return `rgb(var(${cssVar}) / <alpha-value>)`;
}

const config: Config = {
  darkMode: "media",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: withOpacity("--bg-rgb"),
        ink: withOpacity("--ink-rgb"),
        muted: "var(--muted)",
        "muted-2": "var(--muted-2)",
        faint: "var(--faint)",
        accent: withOpacity("--accent-rgb"),
        "accent-dim": "var(--accent-dim)",
        "on-ink-muted": "var(--on-ink-muted)",
        card: "var(--card)",
        "card-2": "var(--card-2)",
        "card-3": "var(--card-3)",
        "card-4": "var(--card-4)",
      },
      fontFamily: {
        display: ["var(--font-anton)", "Impact", "sans-serif"],
        sans: ["var(--font-archivo)", "Helvetica", "Arial", "sans-serif"],
        mono: ["Archivo Mono", "monospace"],
      },
      keyframes: {
        "rise-in": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "wipe-up": {
          from: { clipPath: "inset(100% 0 0 0)" },
          to: { clipPath: "inset(-25% 0 0 0)" },
        },
        "grid-drift": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-64px,-64px,0)" },
        },
        "rule-slide": {
          "0%": { transform: "translateX(-40%)" },
          "100%": { transform: "translateX(140%)" },
        },
        "trace-line": {
          "0%": { strokeDashoffset: "1500", opacity: "0" },
          "14%": { opacity: "1" },
          "60%": { strokeDashoffset: "0", opacity: "1" },
          "90%": { opacity: "0.3" },
          "100%": { strokeDashoffset: "0", opacity: "0" },
        },
        "node-pulse": {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.35)" },
        },
        "float-in": {
          from: {
            opacity: "0",
            transform: "translateY(46px) scale(0.98)",
          },
          to: { opacity: "1", transform: "none" },
        },
        "card-flip": {
          "0%, 20%": { transform: "rotateY(0deg)" },
          "45%, 65%": { transform: "rotateY(180deg)" },
          "90%, 100%": { transform: "rotateY(360deg)" },
        },
      },
      animation: {
        "rise-in": "rise-in 0.9s cubic-bezier(0.16,1,0.3,1) both",
        "wipe-up": "wipe-up 1.05s cubic-bezier(0.16,1,0.3,1) both",
        "grid-drift": "grid-drift 34s linear infinite",
        "rule-slide": "rule-slide 21s linear infinite",
        "trace-line": "trace-line 9s ease-in-out infinite",
        "node-pulse": "node-pulse 7s ease-in-out infinite",
        "float-in": "float-in 1.25s cubic-bezier(0.16,1,0.3,1) both",
        "card-flip": "card-flip 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
