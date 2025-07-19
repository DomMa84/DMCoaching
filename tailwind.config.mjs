/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          gold: '#D4AF37',
          DEFAULT: '#D4AF37',
          light: '#E6C665',
          dark: '#B89728',
        },
        dark: {
          DEFAULT: '#1A1A1A',
          lighter: '#2A2A2A',
          lightest: '#3A3A3A',
        },
        light: {
          DEFAULT: '#FFFFFF',
          darker: '#F5F5F5',
          darkest: '#EBEBEB',
        },
        text: {
          dark: '#1A1A1A',
          light: '#FFFFFF',
          muted: '#6B7280',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};