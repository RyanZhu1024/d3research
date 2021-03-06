module.exports = {
  theme: {
    extend: {},
  },
  variants: [
    "responsive",
    "group-hover",
    "focus-within",
    "first",
    "last",
    "odd",
    "even",
    "hover",
    "focus",
    "active",
    "visited",
    "disabled"
  ],
  plugins: [
    require("tailwindcss-transitions")(),
    require("tailwindcss-transforms")()
  ],
}
