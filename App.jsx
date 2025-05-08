import React, { Suspense, useState, useEffect, useContext, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Blog from './components/Blog';
import WriteBlog from './components/WriteBlog';
import Footer from './components/Footer';
import { ThemeContext } from './main.jsx';

// ErrorFallback with Glitch
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-[#000000] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      role="alert"
      aria-live="assertive"
    >
      <motion.h2
        className="text-3xl font-cosmic-bold mb-4"
        animate={shouldReduceMotion ? {} : { x: [0, 5, -5, 0], transition: { repeat: Infinity, duration: 0.2 } }}
      >
        A Cosmic Error Occurred!
      </motion.h2>
      <motion.p
        className="text-lg mb-4"
        animate={shouldReduceMotion ? {} : { opacity: [1, 0.8, 1], transition: { repeat: Infinity, duration: 0.3 } }}
      >
        {error.message}
      </motion.p>
      <div className="flex space-x-4">
        <motion.button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-cyan text-black font-cosmic-bold rounded-lg hover:bg-magenta hover:text-white transition-all duration-300 nebula-glow"
          aria-label="Try again"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Try Again
        </motion.button>
        <motion.a
          href="/"
          className="px-6 py-3 bg-magenta text-white font-cosmic-bold rounded-lg hover:bg-cyan hover:text-black transition-all duration-300 nebula-glow"
          aria-label="Go to homepage"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Go to Homepage
        </motion.a>
      </div>
    </motion.div>
  );
};

// CSS-based Starfield
const Starfield = ({ themeMode }) => {
  const starsRef = useRef(null);
  const nebulaRef = useRef(null);
  const [nebulaVisible, setNebulaVisible] = useState(false);

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;

    // Generate 100 stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 2 + 2}px`;
      star.style.height = star.style.width;
      star.style.opacity = themeMode === 'light' ? '0.6' : '0.8';
      star.style.animationDelay = `${Math.random() * 5}s`;
      container.appendChild(star);
    }

    // Toggle nebula on click
    const toggleNebula = () => {
      setNebulaVisible((prev) => !prev);
    };
    document.addEventListener('click', toggleNebula);

    return () => {
      document.removeEventListener('click', toggleNebula);
      container.innerHTML = '';
    };
  }, [themeMode]);

  return (
    <>
      <div
        ref={starsRef}
        className="fixed inset-0 z-0 pointer-events-none cosmic-starfield"
        style={{ background: '#000000' }} // Explicitly set pure black background
        aria-hidden="true"
      />
      <div
        ref={nebulaRef}
        className={`fixed inset-0 z-0 pointer-events-none transition-opacity duration-500 ${
          nebulaVisible ? 'opacity-30' : 'opacity-0'
        }`}
        style={{
          background: 'radial-gradient(circle at center, rgba(77, 238, 234, 0.3) 0%, rgba(225, 0, 184, 0.2) 50%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </>
  );
};

// SVG Particle Trails
const ParticleTrails = () => {
  const svgRef = useRef(null);
  const [particles, setParticles] = useState([]);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdateRef.current < 50) return;
      lastUpdateRef.current = now;

      const newParticle = {
        id: now,
        x: e.clientX,
        y: e.clientY,
        opacity: 1,
        scale: 1,
        color: Math.random() > 0.5 ? '#4deeea' : '#e100b8',
      };

      setParticles((prev) => {
        const updated = [...prev, newParticle].slice(-8);
        updated.forEach((particle, index) => {
          particle.opacity = 1 - index * 0.125;
          particle.scale = 1 - index * 0.125;
        });
        return updated;
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <svg
      ref={svgRef}
      className="fixed inset-0 z-[999] pointer-events-none"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <circle
          key={particle.id}
          cx={particle.x}
          cy={particle.y}
          r={6 * particle.scale}
          fill={particle.color}
          opacity={particle.opacity}
          style={{ transition: 'all 0.3s ease-out' }}
        />
      ))}
    </svg>
  );
};

// CSS/SVG Preloader
const Preloader = ({ onLoad }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onLoad();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onLoad]);

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#000000] z-50"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      role="status"
      aria-live="polite"
    >
      <div className="relative w-16 h-16">
        <svg
          className="w-full h-full animate-spin"
          viewBox="0 0 100 100"
          style={{ filter: 'drop-shadow(0 0 10px rgba(77, 238, 234, 0.9))' }}
        >
          <circle cx="50" cy="50" r="30" fill="none" stroke="#4deeea" strokeWidth="2" opacity="0.3" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="#e100b8" strokeWidth="2" opacity="0.5" />
          <circle cx="50" cy="50" r="10" fill="#ffffff" opacity="0.8" />
          <path
            d="M50 50 C70 30, 80 50, 90 50 C80 50, 70 70, 50 50 C30 70, 20 50, 10 50 C20 50, 30 30, 50 50"
            fill="none"
            stroke="#4deeea"
            strokeWidth="1"
            opacity="0.6"
          />
          {/* Warp speed lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + Math.cos(i * 0.785) * 50}
              y2={50 + Math.sin(i * 0.785) * 50}
              stroke="#ffffff"
              strokeWidth="1"
              opacity="0.5"
              style={{ animation: `warp ${1 + Math.random() * 0.5}s infinite` }}
            />
          ))}
        </svg>
      </div>
      <p className="mt-4 text-xl font-cosmic-bold text-cyan">Warping to Cosmic Portfolio...</p>
    </motion.div>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const { themeMode } = useContext(ThemeContext) || { themeMode: 'dark' };
  const sectionsRef = useRef([]);

  const handleReset = useCallback(() => {
    setResetKey((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Scroll-triggered star scaling
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
          } else {
            entry.target.classList.remove('section-visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [resetKey]);

  return (
    <div className="relative bg-[#000000] min-h-screen text-white overflow-x-hidden" key={resetKey}>
      {/* Starfield and Nebula */}
      <Starfield themeMode={themeMode} />

      {/* Particle Trails */}
      <ParticleTrails />

      {/* Preloader */}
      <AnimatePresence>
        {isLoading && <Preloader onLoad={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Main Content */}
      {!isLoading && (
        <Suspense fallback={<div className="text-center text-2xl font-cosmic-bold text-cyan">Loading...</div>}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <header>
              <Navbar />
            </header>
            <main className="space-y-20">
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="hero"
                  aria-labelledby="hero-heading"
                  ref={(el) => (sectionsRef.current[0] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Hero />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="about"
                  aria-labelledby="about-heading"
                  ref={(el) => (sectionsRef.current[1] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <About />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="projects"
                  aria-labelledby="projects-heading"
                  ref={(el) => (sectionsRef.current[2] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Projects />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="achievements"
                  aria-labelledby="achievements-heading"
                  ref={(el) => (sectionsRef.current[3] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Achievements />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="skills"
                  aria-labelledby="skills-heading"
                  ref={(el) => (sectionsRef.current[4] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Skills />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="blog"
                  aria-labelledby="blog-heading"
                  ref={(el) => (sectionsRef.current[5] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Blog />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="write-blog"
                  aria-labelledby="write-blog-heading"
                  ref={(el) => (sectionsRef.current[6] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <WriteBlog />
                </motion.section>
              </ErrorBoundary>
              <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset} resetKeys={[resetKey]}>
                <motion.section
                  id="contact"
                  aria-labelledby="contact-heading"
                  ref={(el) => (sectionsRef.current[7] = el)}
                  className="relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Contact />
                </motion.section>
              </ErrorBoundary>
            </main>
            <footer>
              <Footer />
            </footer>
          </motion.div>
        </Suspense>
      )}
    </div>
  );
};

export default App;