/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}"
    ],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                primary: '#FF932E',
                gray: '#CBD5E1',
                blue: '#0A77FF',
                green:'#34C759'
            },
            fontFamily: {
                'comfortaa': ['Comfortaa-Regular'],
                'comfortaa-medium': ['Comfortaa-Medium'],
                'comfortaa-bold': ['Comfortaa-Bold'],
            },
        },
    },
    plugins: [],
} 