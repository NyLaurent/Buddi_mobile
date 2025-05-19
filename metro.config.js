const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname, {
    // Enable CSS support
    projectRoot: __dirname,
});

module.exports = withNativeWind(config, {
    input: './global.css',
    // Enable hot reloading
    hot: true,
});