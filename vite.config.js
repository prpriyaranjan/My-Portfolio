import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';
import envCompatible from 'vite-plugin-env-compatible';
import purgecss from 'vite-plugin-purgecss';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import inspect from 'vite-plugin-inspect';
import webfontDL from 'vite-plugin-webfont-dl';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Fallback for vite-plugin-webfont-dl import failure
let webfontPlugin = () => ({ 
  name: 'webfont-fallback', 
  config: () => {
    console.warn('[Vite] vite-plugin-webfont-dl not found. Ensure it is installed via `npm install vite-plugin-webfont-dl`. Using CSS fallback for Orbitron font in index.css.');
    return {};
  }
});
try {
  webfontPlugin = webfontDL;
  console.log('[Vite] Loaded vite-plugin-webfont-dl successfully');
} catch (e) {
  console.warn('[Vite] Failed to load vite-plugin-webfont-dl:', e.message, 'Run `npm install vite-plugin-webfont-dl`, check proxy: `npm config get proxy`, and verify registry: `npm config get registry`.');
}

// Fallback for vite-plugin-static-copy import failure
let staticCopyPlugin = () => ({ 
  name: 'static-copy-fallback', 
  config: () => {
    console.warn('[Vite] vite-plugin-static-copy not found. Ensure it is installed via `npm install vite-plugin-static-copy`. PDF rendering may fail without cmaps and standard_fonts.');
    return {};
  }
});
try {
  staticCopyPlugin = viteStaticCopy;
  console.log('[Vite] Loaded vite-plugin-static-copy successfully');
} catch (e) {
  console.warn('[Vite] Failed to load vite-plugin-static-copy:', e.message, 'Run `npm install vite-plugin-static-copy`.');
}

// Log plugin initialization
const logPlugin = (name) => ({
  name: `log-${name}`,
  config() {
    console.log(`[Vite] Initializing ${name} plugin`);
  },
});

export default defineConfig({
  plugins: [
    logPlugin('react'),
    react({
      fastRefresh: true,
      jsxRuntime: 'automatic',
    }),
    logPlugin('svgr'),
    svgr(),
    logPlugin('env-compatible'),
    envCompatible(),
    logPlugin('purgecss'),
    purgecss({
      content: ['./src/**/*.{jsx,tsx,html}', './public/**/*.{html}'],
      safelist: [
        'bg-aurora-gradient', 'shadow-cosmic-glow', 'text-cyan', 'font-orbitron',
        'border-cyan', 'hover:text-[#4deeea]', 'animate-pulse', 'bg-prismatic-gradient',
        'shadow-prismatic-glow', 'text-magenta', 'text-gold', 'border-magenta',
        'border-gold', 'animate-pulse-cosmic', 'animate-spin-slow', 'border-cosmic',
        'bg-cyan', 'bg-magenta', 'bg-gold', 'ring-cosmic', 'ring-cyan', 'ring-magenta',
        'ring-gold', 'opacity-15', 'opacity-25', 'opacity-35', 'glow-cosmic',
        'bg-cosmic-gradient', 'z-cosmic', 'z-overlay', 'pulse-glow', 'scale-cosmic',
        'spacing-cosmic-sm', 'spacing-cosmic-md', 'spacing-cosmic-lg', 'font-cosmic-bold',
        'pdf-fallback', 'pdf-loading'
      ],
    }),
    logPlugin('image-optimizer'),
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      svg: {
        plugins: [
          { name: 'preset-default', params: { overrides: { cleanupIds: false } } },
        ],
      },
    }),
    logPlugin('webfont-dl'),
    webfontPlugin({
      fonts: {
        google: [
          {
            family: 'Orbitron',
            variants: ['400', '700'],
          },
        ],
      },
    }),
    logPlugin('static-copy'),
    staticCopyPlugin({
      targets: [
        {
          src: 'node_modules/pdfjs-dist/cmaps/*',
          dest: 'cmaps',
        },
        {
          src: 'node_modules/pdfjs-dist/standard_fonts/*',
          dest: 'standard_fonts',
        },
      ],
    }),
    logPlugin('inspect'),
    inspect(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) return 'three';
          if (id.includes('gsap')) return 'gsap';
          if (id.includes('framer-motion')) return 'framer-motion';
          if (id.includes('pdfjs-dist')) return 'pdfjs';
        },
      },
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    open: true,
    hmr: {
      clientPort: 5173,
    },
  },
  optimizeDeps: {
    include: ['three', 'gsap', 'framer-motion', 'pdfjs-dist'],
  },
  esbuild: {
    supported: {
      'top-level-await': true,
    },
  },
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'html') {
        return { relative: `/assets/${filename}` };
      }
      return filename;
    },
  },
  // Cosmic theme optimizations
  // - svgr: SVG icons for Navbar.jsx, Hero.jsx
  // - purgecss: Optimize Tailwind CSS for aurora gradients, glows
  // - image-optimizer: Compress cosmic images and SVGs
  // - webfont-dl: Optimize Orbitron font for cosmic typography
  // - env-compatible: Support EmailJS keys for cosmic form animations
  // - static-copy: Copy pdfjs-dist cmaps and standard_fonts for PDF rendering
  // - inspect: Debug cosmic theme assets
  // - Debug ERESOLVE: Run `npm view vite-plugin-static-copy versions` to check compatibility
  // - Debug ERR_MODULE_NOT_FOUND: Run `Remove-Item -Recurse -Force node_modules, package-lock.json`, clear proxy: `npm config delete proxy`, then `npm install`
  // - Proxy issue: If proxy warning persists, run `npm config delete proxy` and `npm config delete https-proxy`
});