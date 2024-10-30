/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
     ],

     theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: "#3b82f6",
            foreground: "#ffffff",
          },
          secondary: {
            DEFAULT: "#f3f4f6",
            foreground: "#1f2937",
          },
        },
      },
    },
  plugins: [],
}

