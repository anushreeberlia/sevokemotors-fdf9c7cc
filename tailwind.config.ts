import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        maruti: {
          orange: '#ff6b35',
          blue: '#0066cc',
          dark: '#1a1a1a',
          light: '#f8fafc'
        }
      }
    },
  },
  plugins: [],
}
export default config