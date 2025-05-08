import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component with detailed logging
const ErrorFallback = ({ error }) => {
  console.error('Hero Component Error:', error);
  return (
    <div className="text-center text-red-500 p-4">
      <h2>Error: Failed to load Cosmic Portfolio</h2>
      <p>{error.message}</p>
      <p>Please check the console for more details or refresh the page.</p>
    </div>
  );
};

const Hero = () => {
  const textRef = useRef(null);
  const taglineRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const galaxyContainerRef = useRef(null);

  useEffect(() => {
    try {
      // Animate text entrance with typing effect for the main heading
      const textElement = textRef.current;
      if (!textElement) throw new Error('Text element not found');
      const textContent = textElement.textContent;
      textElement.textContent = '';
      let charIndex = 0;

      const typeText = () => {
        if (charIndex < textContent.length) {
          textElement.textContent += textContent.charAt(charIndex);
          charIndex++;
          setTimeout(typeText, 50);
        }
      };

      gsap.from(textElement, { opacity: 0, scale: 0.8, duration: 1, ease: 'power4.out', delay: 0.3, onStart: typeText });
      gsap.from(taglineRef.current, { opacity: 0, y: -20, duration: 0.8, ease: 'power4.out', delay: 0.5 });
      gsap.from(buttonContainerRef.current?.children || [], {
        opacity: 0,
        y: 50,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power4.out',
        delay: 1.0,
      });
      gsap.from(scrollIndicatorRef.current, { opacity: 0, y: 20, duration: 1, ease: 'power4.out', delay: 1.5 });

      // Interactive galaxy effect on mouse move
      const galaxyContainer = galaxyContainerRef.current;
      if (!galaxyContainer) throw new Error('Galaxy container not found');

      const handleMouseMove = (e) => {
        const rect = galaxyContainer.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / rect.height) * 10; // Max 10deg tilt
        const tiltY = -(x / rect.width) * 10;
        gsap.to(galaxyContainer, {
          rotationX: tiltX,
          rotationY: tiltY,
          duration: 0.5,
          ease: 'power2.out',
        });
      };

      const handleMouseEnter = () => {
        gsap.to(galaxyContainer, {
          scale: 1.05,
          filter: 'brightness(1.2)',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(galaxyContainer, {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          filter: 'brightness(1)',
          duration: 0.5,
          ease: 'power2.out',
        });
      };

      galaxyContainer.addEventListener('mousemove', handleMouseMove);
      galaxyContainer.addEventListener('mouseenter', handleMouseEnter);
      galaxyContainer.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        galaxyContainer.removeEventListener('mousemove', handleMouseMove);
        galaxyContainer.removeEventListener('mouseenter', handleMouseEnter);
        galaxyContainer.removeEventListener('mouseleave', handleMouseLeave);
      };
    } catch (error) {
      console.error('Hero useEffect Error:', error);
    }
  }, []);

  // Handle button hover effect
  const handleButtonHover = (e) => {
    const target = e.currentTarget;
    gsap.to(target, {
      '--flare-opacity': 1,
      duration: 0.3,
    });
  };

  // Handle button leave effect
  const handleButtonLeave = (e) => {
    gsap.to(e.currentTarget, { '--flare-opacity': 0, duration: 0.3 });
  };

  // Handle scroll down
  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn('About section not found');
    }
  };

  // Handle keyboard navigation for buttons
  const handleButtonKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <style>
        {`
          /* Theme-based Colors */
          [data-theme="light"] {
            --text-primary: #d1d5db;
            --text-accent: #4deeea;
            --bg-gradient-start: #1b263b;
            --bg-gradient-mid: #2e2e5b;
            --bg-gradient-end: #4b4b8c;
            --button-bg: rgba(77, 238, 234, 0.1);
          }

          [data-theme="dark"] {
            --text-primary: #ffffff;
            --text-accent: #4deeea;
            --bg-gradient-start: #030712;
            --bg-gradient-mid: #0f172a;
            --bg-gradient-end: #1e293b;
            --button-bg: rgba(255, 0, 204, 0.1);
          }

          .text-primary {
            color: var(--text-primary);
          }

          .text-accent {
            color: var(--text-accent);
          }

          /* Theme-based Cosmic Gradient Backgrounds */
          .bg-cosmic-gradient {
            background: linear-gradient(135deg, var(--bg-gradient-start) 0%, var(--bg-gradient-mid) 50%, var(--bg-gradient-end) 100%);
          }

          /* Background Nebula Glow */
          .nebula-glow-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(77, 238, 234, 0.1), transparent 70%);
            opacity: 0.3;
            pointer-events: none;
            z-index: 0;
          }

          /* Starfield Background */
          .starfield {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: 0;
          }

          .star {
            position: absolute;
            background: #ffffff;
            border-radius: 50%;
            opacity: 0.7;
            animation: twinkle 3s infinite ease-in-out;
            will-change: opacity;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.7; }
            50% { opacity: 0.3; }
          }

          /* Cosmic Dust Particles */
          .cosmic-dust {
            position: absolute;
            width: 300px;
            height: 300px;
            pointer-events: none;
            z-index: 1;
          }

          .dust-particle {
            position: absolute;
            background: rgba(77, 238, 234, 0.5);
            border-radius: 50%;
            animation: drift 10s infinite ease-in-out;
            will-change: transform, opacity;
          }

          @keyframes drift {
            0%, 100% { transform: translate(0, 0); opacity: 0.5; }
            50% { transform: translate(calc(var(--dx) * 20px), calc(var(--dy) * 20px)); opacity: 0.8; }
          }

          /* Nebula Galaxy Cluster */
          .nebula-galaxy-container {
            position: relative;
            width: 300px;
            height: 300px;
            margin-bottom: 2rem;
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          .galaxy-core-container {
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }

          .galaxy-core {
            animation: rotate-galaxy 30s linear infinite;
            will-change: transform;
          }

          @keyframes rotate-galaxy {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .nebula-cloud {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.4;
            animation: pulse-nebula 5s ease-in-out infinite;
            will-change: transform, opacity;
          }

          @keyframes pulse-nebula {
            0%, 100% { transform: scale(1); opacity: 0.4; }
            50% { transform: scale(1.1); opacity: 0.6; }
          }

          .energy-wave {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            stroke: #4deeea;
            stroke-width: 1;
            fill: none;
            opacity: 0;
            animation: energy-pulse 4s infinite ease-in-out;
            will-change: transform, opacity;
          }

          @keyframes energy-pulse {
            0% { transform: scale(0.5); opacity: 0; }
            50% { transform: scale(1.5); opacity: 0.3; }
            100% { transform: scale(2); opacity: 0; }
          }

          .orbiting-star {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            stroke: #4deeea;
            stroke-width: 1;
            fill: none;
            opacity: 0.5;
            transform-origin: center;
            will-change: transform;
          }

          .glowing-satellite {
            position: absolute;
            width: 6px;
            height: 6px;
            background: #ff00cc;
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(255, 0, 204, 0.8);
            animation: orbit-satellite linear infinite;
            will-change: transform;
          }

          @keyframes orbit-satellite {
            0% { transform: rotate(0deg) translateX(120px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); }
          }

          /* Colors */
          .bg-cyan {
            background-color: #4deeea;
          }

          .border-cyan {
            border-color: #4deeea;
          }

          .bg-magenta {
            background-color: #ff00cc;
          }

          .border-magenta {
            border-color: #ff00cc;
          }

          .bg-violet {
            background-color: #8b5cf6;
          }

          .border-violet {
            border-color: #8b5cf6;
          }

          /* Glass Card Effect with Glowing Border */
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: box-shadow 0.3s ease, transform 0.3s ease;
          }

          .glass-card:hover {
            box-shadow: 0 0 15px rgba(77, 238, 234, 0.5);
            transform: translateY(-3px);
          }

          .glass-card:focus {
            outline: 2px solid #4deeea;
            outline-offset: 2px;
          }

          /* Floating Text Animation */
          .floating-text {
            animation: float 3s ease-in-out infinite;
            will-change: transform;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          /* Holographic Text Effect for Tagline with Flicker */
          .holographic-tagline {
            text-transform: uppercase;
            letter-spacing: 2px;
            background: linear-gradient(45deg, #4deeea, #ff00cc);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5));
            animation: holographic-glow 2s infinite ease-in-out, flicker 0.1s infinite;
          }

          @keyframes holographic-glow {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5)); }
            50% { filter: drop-shadow(0 0 10px rgba(255, 0, 204, 0.7)); }
          }

          @keyframes flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.95; }
          }

          /* Cosmic Flare on Button Hover */
          .cosmic-button {
            position: relative;
            overflow: visible;
            cursor: pointer;
          }

          .cosmic-flare {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
          }

          .flare-particle {
            animation: flare 0.5s ease-out forwards;
            will-change: transform, opacity;
          }

          @keyframes flare {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(calc((var(--dx, 0) * 30px)), calc((var(--dy, 0) * 30px))) scale(0);
              opacity: 0;
            }
          }

          /* Scroll Down Indicator */
          .scroll-indicator {
            position: absolute;
            bottom: 2rem;
            cursor: pointer;
            animation: bounce 2s infinite ease-in-out;
            will-change: transform;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(10px); }
          }

          /* Button Container */
          .button-container {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            justify-content: center;
          }
        `}
      </style>

      <div id="hero" className="section relative flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 bg-cosmic-gradient">
        {/* Background Nebula Glow */}
        <div className="nebula-glow-bg" />

        {/* Starfield Background */}
        <div className="starfield">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Nebula Galaxy Cluster */}
        <div ref={galaxyContainerRef} className="nebula-galaxy-container">
          {/* Cosmic Dust Particles */}
          <div className="cosmic-dust">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="dust-particle"
                style={{
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  '--dx': Math.random() * 2 - 1,
                  '--dy': Math.random() * 2 - 1,
                }}
              />
            ))}
          </div>

          {/* Nebula Clouds */}
          <svg className="nebula-cloud" width="300" height="300" viewBox="0 0 300 300">
            <circle cx="150" cy="150" r="140" fill="url(#nebula-gradient-1)" />
            <circle cx="150" cy="150" r="120" fill="url(#nebula-gradient-2)" style={{ animationDelay: '-2s' }} />
            <defs>
              <radialGradient id="nebula-gradient-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#ff00cc', stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="nebula-gradient-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#ff00cc', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#4deeea', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
          </svg>

          {/* Galaxy Core with Noise Texture */}
          <div className="galaxy-core-container">
            <svg className="galaxy-core" width="300" height="300" viewBox="0 0 300 300">
              <clipPath id="circle-clip">
                <circle cx="150" cy="150" r="80" />
              </clipPath>
              <g clipPath="url(#circle-clip)">
                <circle cx="150" cy="150" r="80" fill="url(#galaxy-gradient)" filter="url(#noise)" />
              </g>
              <defs>
                <radialGradient id="galaxy-gradient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.9 }} />
                  <stop offset="100%" style={{ stopColor: '#ff00cc', stopOpacity: 0.7 }} />
                </radialGradient>
                <filter id="noise">
                  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                  <feColorMatrix type="saturate" values="0.4" />
                </filter>
              </defs>
              {/* Energy Wave */}
              <circle className="energy-wave" cx="150" cy="150" r="100" style={{ animationDelay: '0s' }} />
              <circle className="energy-wave" cx="150" cy="150" r="100" style={{ animationDelay: '-2s' }} />
              {/* Orbiting Stars */}
              <ellipse className="orbiting-star" cx="150" cy="150" rx="100" ry="40" style={{ animation: 'rotate-galaxy 15s linear infinite', animationDelay: '0s' }} />
              <ellipse className="orbiting-star" cx="150" cy="150" rx="110" ry="50" style={{ animation: 'rotate-galaxy 20s linear infinite reverse', animationDelay: '-5s' }} />
            </svg>
          </div>

          {/* Glowing Satellites */}
          <div className="glowing-satellite" style={{ animation: 'orbit-satellite 10s infinite', animationDelay: '0s' }} />
          <div className="glowing-satellite" style={{ animation: 'orbit-satellite 8s infinite reverse', animationDelay: '-3s' }} />
        </div>

        {/* Holographic Tagline */}
        <h2 ref={taglineRef} className="text-2xl sm:text-3xl font-bold mb-8 holographic-tagline">Elite Web Developer</h2>

        <h1 ref={textRef} className="text-4xl sm:text-6xl font-bold mb-4 floating-text text-accent">
          Welcome to Priyaranjan’s Cosmic Portfolio
        </h1>
        <p className="text-xl sm:text-2xl text-primary mb-8 max-w-2xl">
          Crafting interstellar web experiences with React, Three.js, and AI-driven innovation.
        </p>
        <div ref={buttonContainerRef} className="button-container">
          <a
            href="#projects"
            className="cosmic-button glass-card px-6 py-3 text-lg font-medium text-primary bg-transparent border-2 border-cyan rounded-full hover:bg-cyan hover:text-black transition-all duration-300 relative"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onKeyDown={handleButtonKeyDown}
            tabIndex={0}
            role="button"
            aria-label="View Projects"
            style={{
              '--flare-opacity': 0,
              background:
                'linear-gradient(90deg, rgba(77,238,234,0) 0%, rgba(77,238,234,var(--flare-opacity)) 50%, rgba(77,238,234,0) 100%)',
            }}
          >
            View Projects
            <svg className="cosmic-flare">
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  cx="50%"
                  cy="50%"
                  r={Math.random() * 3 + 1}
                  fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                  className="flare-particle"
                  style={{
                    '--dx': Math.random() * 2 - 1,
                    '--dy': Math.random() * 2 - 1,
                  }}
                />
              ))}
            </svg>
          </a>
          <a
            href="#contact"
            className="cosmic-button glass-card px-6 py-3 text-lg font-medium text-primary bg-transparent border-2 border-magenta rounded-full hover:bg-magenta hover:text-black transition-all duration-300 relative"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onKeyDown={handleButtonKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Contact Me"
            style={{
              '--flare-opacity': 0,
              background:
                'linear-gradient(90deg, rgba(255,0,204,0) 0%, rgba(255,0,204,var(--flare-opacity)) 50%, rgba(255,0,204,0) 100%)',
            }}
          >
            Contact Me
            <svg className="cosmic-flare">
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  cx="50%"
                  cy="50%"
                  r={Math.random() * 3 + 1}
                  fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                  className="flare-particle"
                  style={{
                    '--dx': Math.random() * 2 - 1,
                    '--dy': Math.random() * 2 - 1,
                  }}
                />
              ))}
            </svg>
          </a>
          <a
            href="/assets/resume.pdf"
            download="Priyaranjan_Resume.pdf"
            className="cosmic-button glass-card px-6 py-3 text-lg font-medium text-primary bg-transparent border-2 border-violet rounded-full hover:bg-violet hover:text-black transition-all duration-300 relative"
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            onKeyDown={handleButtonKeyDown}
            tabIndex={0}
            role="button"
            aria-label="Download Resume"
            style={{
              '--flare-opacity': 0,
              background:
                'linear-gradient(90deg, rgba(139,92,246,0) 0%, rgba(139,92,246,var(--flare-opacity)) 50%, rgba(139,92,246,0) 100%)',
            }}
          >
            Download Resume
            <svg className="cosmic-flare">
              {Array.from({ length: 5 }).map((_, i) => (
                <circle
                  key={i}
                  cx="50%"
                  cy="50%"
                  r={Math.random() * 3 + 1}
                  fill={Math.random() > 0.5 ? '#4deeea' : '#8b5cf6'}
                  className="flare-particle"
                  style={{
                    '--dx': Math.random() * 2 - 1,
                    '--dy': Math.random() * 2 - 1,
                  }}
                />
              ))}
            </svg>
          </a>
        </div>

        {/* Scroll Down Indicator */}
        <div
          ref={scrollIndicatorRef}
          className="scroll-indicator text-primary"
          onClick={handleScrollDown}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleScrollDown();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Scroll down to About section"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 5 L15 25 M5 15 L15 25 L25 15" />
          </svg>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Hero;