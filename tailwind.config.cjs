/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'royal-blue': '#00b9ec',
                'royal-green': '#32f4bb',
                'royal-pink': '#ff7db2',
                'royal-orange': '#fe9e5b',
                'royal-yellow': '#ffea20',
                'royal-black': '#1A1A1A',
                'royal-gray': '#F8F9FA',
            },
            fontFamily: {
                'skater': ['FinalFont', 'sans-serif'],
                'sans': ['system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
