// tailwind.config.ts
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
        'peopleops': {
          DEFAULT: '#4770FF',
          'light': '#F0F3FF', 
          'dark': '#001330', 
        },
        slate: {
          100: '#F5F6FA', 
        }
      },
    },
  },
  plugins: [],
};
export default config;