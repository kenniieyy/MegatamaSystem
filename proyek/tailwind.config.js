// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ['./public/**/*.{html,js}'],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#2040AE',
        // primary: '#1e40af',
        secondary: '#FFA725',
        'primary-light': '#4060CE',
        'primary-dark': '#102080',
        'secondary-light': '#FFB745',
        'secondary-dark': '#E08000',
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'info': '#3B82F6'
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      keyframes: {
      fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
      },
      slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
      }
  }
   },
  },
  plugins: [],
}


