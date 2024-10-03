import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

import colors, { white } from "tailwindcss/colors";

const defaultGray = "stone";

const moss = {
  50: "#d3f0ed",
  100: "#d3f0ed",
  300: "#307168",
  600: "#185b52",
  900: "#00433b",
};
const gray = {
  ...colors.stone,
  50: "#f7f7f7",
  100: "#ebebeb",
  300: "#cacbcb",
  600: "#979998",
  900: "#555555",
};
const blue = {
  ...colors.blue,
  50: "#c1eaff",
  100: "#4fb8ef",
  300: "#315871",
  600: "#082553",
};
const green = {
  ...colors.green,
  50: "#eafdd4",
  100: "#eafdd4",
  300: "#c4f092",
  600: "#65ac56",
};
const yellow = {
  ...colors.yellow,
  50: "#fff6ca",
  100: "#fff6ca",
  300: "#ffea7d",
  600: "#ffdd45",
};
const red = {
  ...colors.red,
  50: "#ffebe4",
  100: "#ffebe4",
  300: "#f97a2c",
  600: "#ae1700",
};
const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.tsx", "app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        gray,
        blue,
        yellow,
        green,
        red,
        moss,
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: moss["900"],
          foreground: white,
          // DEFAULT: "hsl(var(--primary))",
          // foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: colors[defaultGray][200],
          foreground: colors[defaultGray][800],
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
