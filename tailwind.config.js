/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        ocean: "#0f5fa8",
        skywash: "#eef7ff",
        line: "#d9e5f2"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(17, 54, 91, 0.08)"
      }
    },
  },
  plugins: [],
};
