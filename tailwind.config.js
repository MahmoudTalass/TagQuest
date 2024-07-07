/** @type {import('tailwindcss').Config} */
export default {
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         colors: {
            color1: "#393d3f",
            color2: "#2e3132",
         },
      },
   },
   plugins: [],
};
