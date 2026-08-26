/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,mdx}",
    "./public/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#181A1B",
          dark: "#23272E",
        },
        accent: {
          green: "#39FF14",
          cyan: "#00FFF7",
        },
        foreground: {
          DEFAULT: "#F3F4F6",
        },
      },
      fontFamily: {
        header: ["'JetBrains Mono'", "monospace"],
        body: ["'Inter'", "'Segoe UI'", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
}
