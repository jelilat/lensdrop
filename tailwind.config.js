module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: {
        min: "300px",
        max: "799px",
      },
      md: "800px",
      lg: "1000px",
    }
  },
  plugins: [],
  variants: {
    visibility: ["responsive", "hover", "focus", "group-hover"],
  }
}