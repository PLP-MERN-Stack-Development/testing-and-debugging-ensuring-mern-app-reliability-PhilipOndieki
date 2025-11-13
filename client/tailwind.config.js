/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0A0A0A',
        secondary: '#141414',
        tertiary: '#1F1F1F',
        border: '#262626',
        text: {
          primary: '#FFFFFF',
          secondary: '#A3A3A3',
          tertiary: '#737373',
        },
        status: {
          open: '#EF4444',
          progress: '#3B82F6',
          resolved: '#10B981',
          closed: '#6B7280',
        },
        priority: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#F97316',
          critical: '#DC2626',
        },
        severity: {
          minor: '#3B82F6',
          major: '#F59E0B',
          critical: '#DC2626',
        },
        accent: {
          primary: '#3B82F6',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
