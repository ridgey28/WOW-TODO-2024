/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts}", "./dist/**/*.html"],
  theme: {
    extend: {
      colors: {
        matisse: {
          50: "#f2f8fd",
          100: "#e3effb",
          200: "#c1e0f6",
          300: "#8ac6ef",
          400: "#4ca9e4",
          500: "#258ed2",
          600: "#1671b3",
          700: "#15629d",
          800: "#144d78",
          900: "#164164",
          950: "#0f2a42",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class", // only generate classes
    }),
  ],
};
