import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [{ pattern: /bg-+/ }],

  theme: {
    extend: {
      colors: {
        primary: {
          // DEFAULT: "red",
        },
      },
    },
  },
  plugins: [],
};
export default config;
