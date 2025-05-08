import animate from 'tailwindcss-animate';

let animatePlugin = animate;
try {
  console.log('[Tailwind Config] Loaded tailwindcss-animate successfully');
} catch (e) {
  console.warn('[Tailwind Config] Failed to load tailwindcss-animate:', e.message);
  animatePlugin = () => ({ handler: () => {} });
}

export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        cyan: '#4deeea',
        magenta: '#ff00cc',
        gold: '#ffd700',
      },
      backgroundImage: {
        'prismatic-gradient': 'linear-gradient(45deg, #4deeea, #ff00cc, #ffd700)',
        'aurora-gradient': 'radial-gradient(circle, rgba(77, 238, 234, 0.2), rgba(255, 0, 204, 0.2))',
        'cosmic-gradient': 'linear-gradient(to bottom, rgba(77, 238, 234, 0.5), rgba(255, 0, 204, 0.5))',
      },
      boxShadow: {
        'cosmic-glow': '0 0 20px rgba(77, 238, 234, 0.8)',
        'prismatic-glow': '0 0 30px rgba(255, 0, 204, 0.8)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      fontWeight: {
        'cosmic-bold': 700,
      },
      animation: {
        'pulse-cosmic': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(77, 238, 234, 0.6)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 0, 204, 0.8)',
          },
        },
      },
      transitionProperty: {
        cosmic: 'color, background-color, border-color, box-shadow, opacity, transform',
      },
      borderColor: {
        cyan: '#4deeea',
        magenta: '#ff00cc',
        gold: '#ffd700',
      },
      textColor: {
        cyan: '#4deeea',
        magenta: '#ff00cc',
        gold: '#ffd700',
      },
      backgroundColor: {
        cyan: '#4deeea',
        magenta: '#ff00cc',
        gold: '#ffd700',
      },
      ringColor: {
        cyan: '#4deeea',
        magenta: '#ff00cc',
        gold: '#ffd700',
      },
      opacity: {
        '15': '0.15',
        '25': '0.25',
        '35': '0.35',
      },
      zIndex: {
        cosmic: '1000',
        overlay: '2000',
      },
      spacing: {
        'cosmic-sm': '0.5rem',
        'cosmic-md': '1.5rem',
        'cosmic-lg': '3rem',
      },
      scale: {
        cosmic: '1.1',
        'cosmic-lg': '1.3',
      },
      textShadow: {
        cosmic: '0 0 5px rgba(77, 238, 234, 0.8), 0 0 10px rgba(255, 0, 204, 0.6)',
      },
    },
  },
  plugins: [
    animatePlugin,
    function ({ addUtilities }) {
      addUtilities({
        '.border-cosmic': {
          border: '2px solid',
          borderImage: 'linear-gradient(45deg, #4deeea, #ff00cc) 1',
        },
        '.ring-cosmic': {
          '--tw-ring-color': 'rgba(77, 238, 234, 0.8)',
          '--tw-ring-offset-width': '2px',
          '--tw-ring-offset-color': '#ff00cc',
          boxShadow:
            '0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color), 0 0 10px var(--tw-ring-color)',
        },
        '.glow-cosmic': {
          animation: 'pulse 1.5s ease-in-out infinite',
          boxShadow:
            '0 0 15px rgba(77, 238, 234, 0.6), 0 0 30px rgba(255, 0, 204, 0.4)',
        },
        '.pulse-glow': {
          animation: 'pulseGlow 3s ease-in-out infinite',
        },
        '.scale-cosmic': {
          transform: 'scale(1.1)',
          transition: 'transform 0.3s ease-in-out',
        },
        '.font-cosmic-bold': {
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: '700',
        },
        '.text-cosmic-shadow': {
          textShadow:
            '0 0 5px rgba(77, 238, 234, 0.8), 0 0 10px rgba(255, 0, 204, 0.6)',
        },
        '.glow-text-cosmic': {
          textShadow:
            '0 0 8px rgba(77, 238, 234, 1), 0 0 15px rgba(255, 0, 204, 0.8)',
          transition: 'text-shadow 0.3s ease-in-out',
        },
        '.hover\\:glow-text-cosmic:hover': {
          textShadow:
            '0 0 12px rgba(77, 238, 234, 1), 0 0 20px rgba(255, 0, 204, 1)',
        },
      });
    },
  ],
};