import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        DEFUALT_WHITE: '#F8F8FF',
        DEFUALT_BLACK: '#012E2B', 
        BRAND_COLOR: '#FFDC73'
      },
      gridTemplateColumns: {
        GRID_LAYOUT: 'repeat(12, 5.45rem)',
        GRID_LAYOUT_mb: 'repeat(6, 5.45rem)',
      },
      spacing: {
        GRID_COLUMN_GAP: '0.875rem',
        NAV_HEIGHT: '4rem',
        NAV_MOBILE: '3rem',
      },
      borderRadius: {
        NAV_BORDER_RADIUS: '9px',
      },
    },
  },
  plugins: [],
} satisfies Config;
