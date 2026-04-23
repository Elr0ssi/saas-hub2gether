import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b',
        foreground: '#fafafa',
        card: '#111113',
        muted: '#1c1c20',
        primary: '#16a34a',
        secondary: '#2563eb',
        border: '#27272a'
      }
    }
  },
  plugins: []
};

export default config;
