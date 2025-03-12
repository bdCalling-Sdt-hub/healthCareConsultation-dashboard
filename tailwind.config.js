/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#15405D",
        secondary: "#4C7998",
        base: "#4E4E4E",
      },
    },
  },
  plugins: [],
};
