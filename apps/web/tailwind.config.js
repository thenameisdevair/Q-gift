/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        "text-soft": "var(--text-soft)",
        "ice-tea": "var(--ice-tea)",
        "ice-tea-ink": "var(--ice-tea-ink)",
        gold: "var(--gold)",
        "gold-deep": "var(--gold-deep)",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      fontSize: {
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.08em" }],
        meta: ["0.875rem", { lineHeight: "1.45" }],
        body: ["1rem", { lineHeight: "1.55" }],
        lead: ["1.25rem", { lineHeight: "1.45", letterSpacing: "-0.005em" }],
        title: ["1.625rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        "display-sm": ["2.25rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        display: ["3.5rem", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
      },
      letterSpacing: {
        caption: "0.08em",
      },
      borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.625rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        rise: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        bloom: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        rise: "rise 360ms cubic-bezier(0.25, 1, 0.5, 1) both",
        bloom: "bloom 480ms cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

module.exports = config;
