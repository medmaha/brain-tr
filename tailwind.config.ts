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
        primary: "rgba(14,165,233,1);",
        warning: "rgba(251,146,60,1)",
        primaryHover: "rgba(14,165,233,0.9);",
      },
      animation: {
        "translate-left-and-right":
          "translate-left-and-right 4s linear infinite",
      },
      keyframes: {
        "translate-left-and-right": {
          "0%": {
            width: "0",
          },
          "50%": {
            width: "100%",
          },
          "100%": {
            width: "0",
            background: "transparent",
          },
        },
      },
    },
  },
  plugins: [],
};
export default config;
