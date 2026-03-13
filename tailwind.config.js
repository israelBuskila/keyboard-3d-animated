/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                fog: {
                    50: '#F5F5F5',
                    100: '#ECECEC',
                    200: '#E6E6E6',
                    300: '#D9D9D9',
                },
            },
        },
    },
    plugins: [],
}
