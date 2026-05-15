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
        aura: {
          bg:      "#f5f7ff",
          surface: "#ffffff",
          primary: "#5b8def",
          teal:    "#2dd4bf",
          violet:  "#8b5cf6",
          rose:    "#f43f5e",
          amber:   "#f59e0b",
          green:   "#10b981",
          slate:   "#64748b",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2.5xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        aura: "0 4px 24px rgba(80,80,140,0.08)",
        "aura-lg": "0 12px 48px rgba(80,80,140,0.14)",
        teal: "0 0 24px rgba(45,212,191,0.25)",
        glow: "0 0 40px rgba(91,141,239,0.2)",
      },
      backgroundImage: {
        "mesh": "radial-gradient(ellipse 60% 50% at 20% 30%, rgba(91,141,239,0.07) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 80% 70%, rgba(45,212,191,0.06) 0%, transparent 70%), #f5f7ff",
        "gradient-primary": "linear-gradient(135deg, #5b8def, #3b67d4)",
        "gradient-teal": "linear-gradient(135deg, #2dd4bf, #0d9488)",
        "gradient-wellness": "linear-gradient(135deg, #5b8def 0%, #8b5cf6 50%, #2dd4bf 100%)",
        "gradient-rose": "linear-gradient(135deg, #f43f5e, #e879b9)",
        "gradient-card": "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,247,255,0.6))",
      },
    },
  },
  plugins: [],
};
export default config;
