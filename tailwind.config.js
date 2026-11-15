/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mandar: {
          maroon: {
            50: '#fdf2f4',
            100: '#fce7eb',
            200: '#f9d2d9',
            300: '#f3abb9',
            400: '#e9758f',
            500: '#db4466',
            600: '#c5284b',
            700: '#a51c3a',
            800: '#891b33',
            900: '#731a2f',
            950: '#400a16',
          },
          gold: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
          },
          navy: {
            50: '#f0f7ff',
            100: '#e0effe',
            200: '#bae0fd',
            300: '#7cc7fb',
            400: '#38a9f8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#036ba1',
            800: '#075985',
            900: '#0c2340',
            950: '#061324',
          },
          sand: {
            50: '#fbfaf8',
            100: '#f7f4ee',
            200: '#ede7db',
            300: '#ded4c0',
            400: '#cbbba0',
            500: '#ba9e81',
          }
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        lontara: ['Aksara Lontara', 'sans-serif']
      }
    },
  },
  plugins: [],
}
