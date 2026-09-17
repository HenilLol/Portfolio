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
        background: {
          DEFAULT: '#070709',
          surface: '#0B0B0E',
          elevated: '#141419',
          overlay: 'rgba(7, 7, 9, 0.92)',
        },
        foreground: {
          DEFAULT: '#F4F4F6',
          secondary: '#8F9098',
          muted: '#55555C',
        },
        accent: {
          DEFAULT: '#00F0FF',
          muted: 'rgba(0, 240, 255, 0.12)',
          glow: 'rgba(0, 240, 255, 0.22)',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          subtle: 'rgba(255, 255, 255, 0.05)',
          strong: 'rgba(255, 255, 255, 0.18)',
        },
      },
      fontFamily: {
        editorial: ['Space Grotesk', 'Syne', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(2.5rem, 8vw + 0.75rem, 10rem)', { lineHeight: '0.9', letterSpacing: '-0.04em' }],
        'display-xl': ['clamp(2rem, 5.5vw + 0.5rem, 7.5rem)', { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(1.75rem, 4vw + 0.5rem, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'display-md': ['clamp(1.35rem, 2.5vw + 0.5rem, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-sm': ['clamp(1.15rem, 1.5vw + 0.4rem, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        normal: '0em',
        wide: '0.05em',
        widest: '0.18em',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};
