module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm: "300px",
      md: "600px",
      lg: "900px",
    }
  },
  plugins: [],
  variants: {
    visibility: ["responsive", "hover", "focus", "group-hover"],
  }
}