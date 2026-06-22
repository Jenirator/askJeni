import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0D1B2A',
          mid: '#162233',
        },
        blue: {
          DEFAULT: '#2563EB',
          light: '#3B82F6',
          pale: '#EFF4FF',
        },
        cloud: {
          DEFAULT: '#E8F1FF',
          white: '#F7F9FC',
        },
        yellow: {
          DEFAULT: '#FFC84D',
          pale: '#FFF8E6',
        },
        border: '#E5E7EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        btn: '7px',
        card: '12px',
        hero: '14px',
      },
      boxShadow: {
        modal: '0 4px 24px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
