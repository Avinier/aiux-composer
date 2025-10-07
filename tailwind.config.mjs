/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {
      colors: {
        text: 'var(--text-color)',
        background: 'var(--primary-bg)',
        accent: 'var(--accent)',
        gray: 'var(--gray)',
        darkgray: 'var(--dark-gray)',
        lightgray: '#a0a0a0',
        // Project colors for dynamic shadows
        'project-yellow': '#ffbb00',
        'project-pink': '#ff006f',
        'project-blue': '#00b7ff',
        'project-green': '#00ff33',
        'project-purple': '#a855f7',
        'project-orange': '#ff6b35',
        'project-cyan': '#06ffa5',
        'project-rose': '#fb5607',
        'project-violet': '#7209b7',
        'project-amber': '#ffd60a'
      },
      fontSize: {
        'xs': '0.750rem',    // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.333rem',     // 21px
        '2xl': '1.777rem',    // 28px
        '3xl': '2.369rem',    // 38px
        '4xl': '3.158rem',    // 51px
        '5xl': '4.210rem'     // 67px
      },
      fontFamily: {
        heading: ['Libre Baskerville', 'serif'],
        body: ['Kollektif', 'sans-serif']
      },
      fontWeight: {
        normal: '400',
        bold: '700'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 5s linear infinite',
        'spin-slower': 'spin-slow 10s linear infinite',
        'blink': 'blink 1.1s infinite step-start'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        blink: {
          '50%': { opacity: '0' }
        }
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
        '500': '500ms'
      }
    }
  }
}
