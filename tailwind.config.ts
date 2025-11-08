import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class', // 👈 manual control using .dark class
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        space: ['"Space Grotesk"', 'sans-serif'],
      }
    }
  },
  plugins: [],
};

export default config;
