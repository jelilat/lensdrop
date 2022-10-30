module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: "300px",
      md: "800px",
      lg: "1000px",
    }
  },
  plugins: [],
  variants: {
    visibility: ["responsive", "hover", "focus", "group-hover"],
  }
}