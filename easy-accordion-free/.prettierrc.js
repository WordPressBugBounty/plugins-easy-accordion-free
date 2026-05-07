// Import the default config file and expose it in the project root.
// Useful for editor integrations.
const config = require("@wordpress/prettier-config");

config.overrides = [
  {
    files: [
      "src/**/*.{scss,js,css,jsx,ts,tsx}"
    ],
    options: {
      printWidth: 120,
      singleQuote: false
    },
  },
];

module.exports = config;
