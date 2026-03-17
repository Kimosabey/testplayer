import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF6EF',
        charcoal: '#1A1A1A',
        amber: '#E07B39',
        dark: '#111010',
        muted: '#6B6458'
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-satoshi)', 'system-ui', 'sans-serif']
      },
      borderColor: {
        subtle: 'rgba(26,26,26,0.08)'
      }
    }
  },
  plugins: []
} satisfies Config
