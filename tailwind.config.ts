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
    },
  },
  plugins: [],
};
export default config;
