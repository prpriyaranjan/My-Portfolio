import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaSun, FaMoon, FaArrowUp, FaGlobe, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext.jsx';
import { ThemeContext } from '../main.jsx';
import LoginModal from './LoginModal.jsx';

// Navigation links data
const navLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Skills', href: '#skills' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

// Conditional Write Blog link (only shown when authenticated)
const writeBlogLink = { name: 'Write Blog', href: '#write-blog' };

// Language options
const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
];

const Navbar = () => {
  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);
  const { themeMode, toggleTheme } = themeContext || { themeMode: 'light', toggleTheme: () => {} };
  const { isAuthenticated, currentUser, logout } = authContext || { isAuthenticated: false, currentUser: null, logout: () => {} };

  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const lastScrollRef = useRef(0);

  // Track active section using Intersection Observer
  useEffect(() => {
    const allLinks = [...navLinks, ...(isAuthenticated ? [writeBlogLink] : [])];
    const sections = allLinks.map((link) => document.querySelector(link.href));
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(`#${entry.target.id}`);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, [isAuthenticated]);

  // Throttled scroll handler for progress bar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      if (now - lastScrollRef.current < 100) return;
      lastScrollRef.current = now;

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / totalHeight) * 100;
      setScrollProgress(progress);

      setShowBackToTop(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler for navigation links
  const handleNavClick = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('Navbar: Target section not found:', href);
    }
    setIsOpen(false);
  };

  // Back to top handler
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Language change handler
  const handleLangChange = (lang) => {
    setCurrentLang(lang);
    document.documentElement.lang = lang;
  };

  // Animation variants for mobile menu
  const menuVariants = {
    open: { opacity: 1, height: 'auto', transition: { duration: 0.5, ease: 'easeInOut' } },
    closed: { opacity: 0, height: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  // Animation for navbar items
  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <>
      <style>
        {`
          /* Theme-based Colors */
          [data-theme="light"] {
            --text-primary: #d1d5db;
            --text-accent: #4deeea;
          }
          [data-theme="dark"] {
            --text-primary: #ffffff;
            --text-accent: #4deeea;
          }
          .text-primary { color: var(--text-primary); }
          .text-accent { color: var(--text-accent); }
          .bg-cyan { background-color: #4deeea; }
          .text-cyan { color: #4deeea; }
          .border-cyan { border-color: #4deeea; }
          .bg-magenta { background-color: #ff00cc; }
          .text-magenta { color: #ff00cc; }
          .border-magenta { border-color: #ff00cc; }
          .nebula-glow-overlay::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(51, 51, 51, 0.1), transparent 70%);
            opacity: 0.6;
            animation: nebula-pulse 10s infinite ease-in-out;
            pointer-events: none;
          }
          @keyframes nebula-pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 0.9; transform: scale(1.05); }
          }
          .scroll-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 4px;
            background: linear-gradient(90deg, #4deeea, #ff00cc);
            transition: width 0.2s ease;
            z-index: 10;
          }
          .nebula-glow {
            position: relative;
            transition: all 0.3s ease;
          }
          .nebula-glow:hover {
            filter: drop-shadow(0 0 10px rgba(77, 238, 234, 0.8));
            background: linear-gradient(90deg, rgba(77, 238, 234, 0.2) 0%, rgba(255, 0, 204, 0.2) 100%);
          }
          .holographic-text {
            text-transform: uppercase;
            letter-spacing: 2px;
            background: linear-gradient(45deg, #4deeea, #ff00cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5));
            animation: holographic-glow 2s infinite ease-in-out;
          }
          @keyframes holographic-glow {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5)); }
            50% { filter: drop-shadow(0 0 10px rgba(255, 0, 204, 0.7)); }
          }
          .logo-burst-container:hover .logo-burst { opacity: 1; }
          .logo-burst { transition: opacity 0.3s ease; }
          .logo-burst-particle { animation: logo-burst 0.8s ease-out forwards; }
          @keyframes logo-burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc((var(--dx, 0) * 30px)), calc((var(--dy, 0) * 30px))) scale(0); opacity: 0; }
          }
          .cosmic-nav-link { position: relative; display: inline-block; }
          .cosmic-nav-link:hover .cosmic-burst { opacity: 1; }
          .cosmic-burst { transition: opacity 0.3s ease; }
          .burst-particle { animation: burst 0.5s ease-out forwards; }
          @keyframes burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc((var(--dx, 0) * 20px)), calc((var(--dy, 0) * 20px))) scale(0); opacity: 0; }
          }
          .nebula-underline { position: relative; }
          .nebula-underline::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #4deeea, #ff00cc);
            filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5));
            animation: nebula-flow 2s infinite ease-in-out;
          }
          @keyframes nebula-flow {
            0%, 100% { transform: scaleX(1); }
            50% { transform: scaleX(1.1); }
          }
          .rotate-icon { transition: transform 0.3s ease; }
          .rotate-icon:hover { transform: rotate(15deg); }
          .back-to-top { transition: opacity 0.3s ease, transform 0.3s ease; }
          .back-to-top:hover { transform: translateY(-4px); }
          .lang-dropdown { position: relative; }
          .lang-dropdown-content {
            position: absolute;
            top: 100%;
            right: 0;
            background: #000000;
            backdrop-filter: blur(10px);
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            min-width: 120px;
            z-index: 20;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s ease, visibility 0.2s ease;
          }
          .lang-dropdown:hover .lang-dropdown-content {
            opacity: 1;
            visibility: visible;
          }
          .lang-option:hover {
            background: rgba(77, 238, 234, 0.1);
          }
        `}
      </style>

      <nav
        className="sticky top-0 left-0 w-full z-50 bg-opacity-80 backdrop-blur-md shadow-lg transition-opacity duration-300 nebula-glow-overlay"
        style={{ background: '#000000' }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="relative container mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div
            className="text-2xl font-bold text-cyan holographic-text logo-burst-container"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              aria-label="Go to home"
              className="focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 rounded"
            >
              Cosmic Portfolio
            </a>
            <svg className="logo-burst absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <circle
                  key={i}
                  cx="50%"
                  cy="50%"
                  r={Math.random() * 4 + 2}
                  fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                  className="logo-burst-particle"
                  style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                />
              ))}
            </svg>
          </motion.div>

          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-primary font-bold transition-colors duration-300 cosmic-nav-link focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 rounded ${
                  activeSection === link.href ? 'text-cyan nebula-underline' : 'hover:text-cyan'
                }`}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                aria-label={`Go to ${link.name} section`}
              >
                {link.name}
                <svg className="cosmic-burst absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={Math.random() * 3 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="burst-particle"
                      style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                    />
                  ))}
                </svg>
              </motion.a>
            ))}
            {isAuthenticated && (
              <motion.a
                href={writeBlogLink.href}
                onClick={(e) => handleNavClick(e, writeBlogLink.href)}
                className={`relative text-primary font-bold transition-colors duration-300 cosmic-nav-link focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 rounded ${
                  activeSection === writeBlogLink.href ? 'text-cyan nebula-underline' : 'hover:text-cyan'
                }`}
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                aria-label="Go to Write Blog section"
              >
                {writeBlogLink.name}
                <svg className="cosmic-burst absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={Math.random() * 3 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="burst-particle"
                      style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                    />
                  ))}
                </svg>
              </motion.a>
            )}
            {!isAuthenticated && (
              <motion.button
                onClick={() => setShowLoginModal(true)}
                className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={navLinks.length + 1}
                aria-label="Open login modal"
              >
                <FaSignInAlt size={20} />
              </motion.button>
            )}
            {isAuthenticated && (
              <motion.button
                onClick={logout}
                className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={navLinks.length + 2}
                aria-label="Log out"
              >
                <FaSignOutAlt size={20} />
              </motion.button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
              aria-label={`Switch to ${themeMode === 'light' ? 'dark mode (moon icon)' : 'light mode (sun icon)'}`}
            >
              {themeMode === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
            <div className="lang-dropdown">
              <button
                className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
                aria-label="Select language"
              >
                <FaGlobe size={20} />
              </button>
              <div className="lang-dropdown-content">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className="block w-full text-left px-4 py-2 text-primary hover:text-cyan lang-option"
                    aria-label={`Switch to ${lang.name}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleBackToTop}
              className={`p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow back-to-top ${
                showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Back to top"
            >
              <FaArrowUp size={20} />
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-primary hover:text-cyan focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 rounded transition-transform duration-300"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <FaTimes size={24} className="rotate-icon" /> : <FaBars size={24} className="rotate-icon" />}
            </button>
          </div>
        </div>

        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

        <motion.div
          className="md:hidden bg-opacity-90 backdrop-blur-md overflow-hidden"
          style={{ background: '#000000' }}
          initial="closed"
          animate={isOpen ? 'open' : 'closed'}
          variants={menuVariants}
        >
          <div className="flex flex-col items-center py-4 space-y-4">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`relative text-primary font-bold text-lg transition-colors duration-300 cosmic-nav-link focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 rounded ${
                  activeSection === link.href ? 'text-cyan nebula-underline' : 'hover:text-cyan'
                }`}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                aria-label={`Go to ${link.name} section`}
              >
                {link.name}
                <svg className="cosmic-burst absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={Math.random() * 3 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="burst-particle"
                      style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                    />
                  ))}
                </svg>
              </motion.a>
            ))}
            {isAuthenticated && (
              <motion.a
                href={writeBlogLink.href}
                onClick={(e) => handleNavClick(e, writeBlogLink.href)}
                className={`relative text-primary font-bold text-lg transition-colors duration-300 cosmic-nav-link focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 rounded ${
                  activeSection === writeBlogLink.href ? 'text-cyan nebula-underline' : 'hover:text-cyan'
                }`}
                custom={navLinks.length}
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                aria-label="Go to Write Blog section"
              >
                {writeBlogLink.name}
                <svg className="cosmic-burst absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={Math.random() * 3 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="burst-particle"
                      style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                    />
                  ))}
                </svg>
              </motion.a>
            )}
            {!isAuthenticated && (
              <motion.button
                onClick={() => setShowLoginModal(true)}
                className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={navLinks.length + 1}
                aria-label="Open login modal"
              >
                <FaSignInAlt size={20} />
              </motion.button>
            )}
            {isAuthenticated && (
              <motion.button
                onClick={logout}
                className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
                initial="hidden"
                animate="visible"
                variants={itemVariants}
                custom={navLinks.length + 2}
                aria-label="Log out"
              >
                <FaSignOutAlt size={20} />
              </motion.button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
              aria-label={`Switch to ${themeMode === 'light' ? 'dark mode (moon icon)' : 'light mode (sun icon)'}`}
            >
              {themeMode === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
            <div className="lang-dropdown">
              <button
                className="p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow"
                aria-label="Select language"
              >
                <FaGlobe size={20} />
              </button>
              <div className="lang-dropdown-content">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLangChange(lang.code)}
                    className="block w-full text-left px-4 py-2 text-primary hover:text-cyan lang-option"
                    aria-label={`Switch to ${lang.name}`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleBackToTop}
              className={`p-2 rounded-full bg-cyan text-black hover:bg-magenta hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan focus:ring-opacity-50 transition-all duration-300 nebula-glow back-to-top ${
                showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Back to top"
            >
              <FaArrowUp size={20} />
            </button>
          </div>
        </motion.div>

        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </nav>
    </>
  );
};

export default Navbar;