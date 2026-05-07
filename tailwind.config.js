/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem',
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      colors: {
        primary: "#312E81",
        "primary-light": "#4F46E5",
        "primary-dark": "#1E1B4B",
        accent: "#6366f1",
        "background-light": "#F8FAFC",
        "background-dark": "#0B0F19",
        "surface-light": "#FFFFFF",
        "surface-dark": "#111827",
        "neutral-100": "#F1F5F9",
        "neutral-200": "#E2E8F0",
        "neutral-800": "#1E293B",
      },
      fontFamily: {
        display: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Inter", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        card: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        premium:
          "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
        glow: "0 0 20px rgba(99, 102, 241, 0.3)",
      },
      animation: {
        blob: "blob 10s infinite",
        float: "float 6s ease-in-out infinite",
        "slide-up-fade": "slideUpFade 0.5s ease-out forwards",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        slideUpFade: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
