const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const path = require("path");

module.exports = {
    ...defaultConfig,
    resolve: {
        ...defaultConfig.resolve,
        alias: {
            ...defaultConfig.resolve.alias,
            "@easy-accordion/components": path.resolve(__dirname, "src/components/"),
            "@easy-accordion/controls": path.resolve(__dirname, "src/controls/controls.js"),
            "@easy-accordion/constants": path.resolve(__dirname, "src/controls/constants.js"),
            "@easy-accordion/templates": path.resolve(__dirname, "src/templates/"),
            "@easy-accordion/hooks": path.resolve(__dirname, "src/hooks/"),
        },
    },
};
