import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blogBg: "var(--blog-bg)",
        primaryBorder: "var(--primary-border)",
        primaryLight: "var(--primary-light)",
        primary: "var(--primary)",
        primaryDark: "var(--primary-dark)",
        secondary: "var(--secondary)",
        secondaryDark: "var(--secondary-dark)",
        text: "var(--text)",
        textLight: "var(--text-light)",
      },
    },
  },
  plugins: [],
} satisfies Config;
