/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5F0E8",
        warmWhite: "#FAF8F4",
        charcoal: "#1C1C1A",
        gold: "#B8965A",
        goldLight: "#D4AF78",
        muted: "#6B6560",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Jost", "sans-serif"],
      },
      animation: {
        "pulse-gold": "pulseGold 2s infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { boxShadow: "0 4px 20px rgba(184,150,90,0.3)" },
          "50%": { boxShadow: "0 4px 32px rgba(184,150,90,0.7)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
}
