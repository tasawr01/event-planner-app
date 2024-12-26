module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // This already includes all subfolders, including components
    "./src/components/**/*.{js,jsx,ts,tsx}", // Explicitly include components folder for safety
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
