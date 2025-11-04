/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#6b4ce8',
          secondary: '#eee9dc',
          tertiary: 'transparent',
        },
        // Primary Purple Scale
        purple: {
          15: 'rgba(107, 76, 232, 0.15)',
          50: '#e7e4f0',
          75: '#d4d0f1',
          100: '#a790ff',
          200: '#9277ff',
          300: '#8061ff',
          400: '#6b4ce8',
          500: '#5629c1',
          600: '#311b67',
          700: '#1f163d',
          800: '#100a21',
        },
        // Secondary Orange Scale
        orange: {
          50: '#eee1dd',
          75: '#ead0ca',
          100: '#ffb49d',
          400: '#ff5a27',
          500: '#bd411c',
          700: '#341a13',
        },
        // Background Colors
        background: {
          DEFAULT: '#0d0c0f',
          secondary: '#151418',
          tertiary: '#222126',
          light: '#efeef3',
          'light-secondary': '#f7f6f9',
          'light-tertiary': 'rgba(255, 255, 255, 0.4)',
        },
        // Foreground/Text Colors
        foreground: {
          DEFAULT: '#fff',
          primary: '#eee9dc',
          secondary: 'rgba(238, 233, 220, 0.9)',
          muted: 'rgba(255, 255, 255, 0.6)',
          subtle: 'rgba(255, 255, 255, 0.06)',
          link: '#9277ff',
        },
        // Semantic Colors
        success: {
          DEFAULT: '#0da767',
          50: '#dbf2e8',
          100: '#0da767',
          200: '#0e2c20',
        },
        error: {
          DEFAULT: '#d04554',
          50: '#f5d9dc',
          100: '#d04554',
          200: '#2d0e12',
        },
        warning: {
          DEFAULT: '#f39b16',
          50: '#fdecd3',
          100: '#f39b16',
          200: '#2c1e09',
        },
        // Border Colors
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          muted: 'rgba(255, 255, 255, 0.06)',
          subtle: 'rgba(255, 255, 255, 0.03)',
          strong: 'rgba(255, 255, 255, 0.2)',
          colored: 'rgba(107, 76, 232, 0.15)',
          selected: '#6b4ce8',
        },
      },
      fontFamily: {
        hauora: ['Hauora', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.625rem',
      },
      animation: {
        'progress-indeterminate': 'progress-indeterminate 1.4s ease-in-out infinite',
        'slide-down-fade-in': 'slide-down-fade-in 790ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-fade-in': 'slide-up-fade-in 790ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'progress-indeterminate': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        },
        'slide-down-fade-in': {
          '0%': { transform: 'translateY(-60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-up-fade-in': {
          '0%': { transform: 'translateY(60px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
