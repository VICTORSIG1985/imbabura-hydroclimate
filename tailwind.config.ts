import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada en Imbabura
        andean: {
          deep:    '#0a2540',  // azul lagunas profundas (Mojanda, Cuicocha)
          water:   '#1d4ed8',  // azul río Mira
          paramo:  '#3a6e3a',  // verde páramo
          forest:  '#0f5132',  // verde bosque andino
          earth:   '#92400e',  // ocre tierra volcánica
          ash:     '#4b5563',  // gris ceniza/roca volcánica
          snow:    '#f3f4f6',  // blanco páramo
        },
        ssp: {
          126: '#22c55e',
          370: '#f59e0b',
          585: '#dc2626',
        },
        band: {
          B1: '#dc2626',
          B2: '#f59e0b',
          B3: '#16a34a',
        },
        sig: {
          increase:    '#dc2626',  // aumento térmico
          precip:      '#1d4ed8',  // aumento precipitación
          dry:         '#92400e',  // sequía
          none:        '#9ca3af',  // no significativo
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
