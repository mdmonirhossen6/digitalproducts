/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#eef2ff",
          100: "#e0e7ff",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
        },
        surface: {
          900: "#06060c",
          800: "#0e0e1a",
          700: "#14141f",
          600: "#1c1c2e",
          500: "#252538",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        digitools: {
          primary: "#6366f1",
          secondary: "#22d3ee",
          accent: "#f59e0b",
          neutral: "#1c1c2e",
          "base-100": "#0e0e1a",
          "base-200": "#14141f",
          "base-300": "#1c1c2e",
          info: "#22d3ee",
          success: "#10b981",
          warning: "#f59e0b",
          error: "#ef4444",
        },
      },
    ],
    darkTheme: "digitools",
  },
};
