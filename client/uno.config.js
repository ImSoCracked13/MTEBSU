import { defineConfig } from 'unocss';
import presetUno from '@unocss/preset-uno';
import presetIcons from '@unocss/preset-icons';
import presetWind from '@unocss/preset-wind';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),
    presetWind()
  ],
  theme: {
    colors: {
      primary: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        200: '#bae6fd',
        300: '#7dd3fc',
        400: '#38bdf8',
        500: '#0ea5e9',
        600: '#0284c7',
        700: '#0369a1',
        800: '#075985',
        900: '#0c4a6e',
      },
      danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
      }
    }
  },
  shortcuts: {
    'btn': 'px-4 py-2 rounded-lg font-medium transition-colors duration-200',
    'btn-primary': 'bg-primary-600 text-white hover:bg-primary-700',
    'btn-danger': 'bg-danger-600 text-white hover:bg-danger-700',
    'card': 'bg-white rounded-lg shadow-sm p-4 border border-gray-200',
    'input-file': 'w-full border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-400 transition-colors duration-200',
  }
}); 