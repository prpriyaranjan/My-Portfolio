import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component with detailed logging
const ErrorFallback = ({ error }) => {
  console.error('About Component Error:', error);
  return (
    <div className="text-center text-red-500 p-4">
      <h2>Error: Failed to load About Section</h2>
      <p>{error.message}</p>
      <p>Please check the console for more details or refresh the page.</p>
    </div>
  );
};

const About = () => {
  const bioRef = useRef(null);
  const sectionRef = useRef(null);
  const vortexContainerRef = useRef(null);
  const starfieldRef = useRef(null);

  useEffect(() => {
    try {
      console.log('About section mounted');

      // Animate bio text with a reveal and cosmic trail effect
      if (bioRef.current) {
        gsap.from(bioRef.current, {
          opacity: 0,
          y: 20,
          duration: 1,
          ease: 'power2.out',
          delay: 0.3,
        });
      } else {
        console.warn('bioRef not found');
      }

      // Set up intersection observer for milestone animations
      let isVisible = false;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            isVisible = true;
            console.log('About section visible, animating milestones');
            const milestones = sectionRef.current?.querySelectorAll('.milestone') || [];
            console.log(`Found ${milestones.length} milestones`);
            gsap.fromTo(
              milestones,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.2,
                ease: 'power4.out',
                onComplete: () => {
                  milestones.forEach((m) => (m.style.opacity = '1')); // Ensure opacity persists
                },
              }
            );
          }
        },
        { threshold: 0.1 }
      );

      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      } else {
        console.warn('sectionRef not found, animating milestones immediately');
        isVisible = true;
        const milestones = document.querySelectorAll('.milestone');
        gsap.fromTo(
          milestones,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, ease: 'power4.out' }
        );
      }

      // Starfield mouse interactivity with throttling
      const starfield = starfieldRef.current;
      if (starfield) {
        const stars = starfield.querySelectorAll('.star');
        console.log(`Found ${stars.length} stars in About starfield`);
        let lastMove = 0;
        const handleStarMove = (e) => {
          const now = Date.now();
          if (now - lastMove < 50) return; // Throttle to ~20 FPS
          lastMove = now;
          stars.forEach((star) => {
            const rect = star.getBoundingClientRect();
            const starX = rect.left + rect.width / 2;
            const starY = rect.top + rect.height / 2;
            const dx = (e.clientX - starX) * 0.05;
            const dy = (e.clientY - starY) * 0.05;
            gsap.to(star, {
              x: dx,
              y: dy,
              duration: 1,
              ease: 'power2.out',
              overwrite: 'auto',
            });
          });
        };
        document.addEventListener('mousemove', handleStarMove);
        return () => document.removeEventListener('mousemove', handleStarMove);
      }

      // Interactive vortex effect on mouse move
      const vortexContainer = vortexContainerRef.current;
      if (vortexContainer) {
        const handleMouseMove = (e) => {
          const rect = vortexContainer.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          const tiltX = (y / rect.height) * 10;
          const tiltY = -(x / rect.width) * 10;
          gsap.to(vortexContainer, {
            rotationX: tiltX,
            rotationY: tiltY,
            duration: 0.5,
            ease: 'power2.out',
          });
        };

        const handleMouseEnter = () => {
          gsap.to(vortexContainer, {
            scale: 1.05,
            filter: 'brightness(1.2)',
            duration: 0.3,
            ease: 'power2.out',
          });
        };

        const handleMouseLeave = () => {
          gsap.to(vortexContainer, {
            scale: 1,
            rotationX: 0,
            rotationY: 0,
            filter: 'brightness(1)',
            duration: 0.5,
            ease: 'power2.out',
          });
        };

        vortexContainer.addEventListener('mousemove', handleMouseMove);
        vortexContainer.addEventListener('mouseenter', handleMouseEnter);
        vortexContainer.addEventListener('mouseleave', handleMouseLeave);

        return () => {
          vortexContainer.removeEventListener('mousemove', handleMouseMove);
          vortexContainer.removeEventListener('mouseenter', handleMouseEnter);
          vortexContainer.removeEventListener('mouseleave', handleMouseLeave);
        };
      } else {
        console.warn('vortexContainerRef not found');
      }

      return () => {
        console.log('Cleaning up About section');
        if (sectionRef.current && observer) {
          observer.unobserve(sectionRef.current);
        }
      };
    } catch (error) {
      console.error('About useEffect Error:', error);
    }
  }, []);

  // Handle milestone hover effect
  const handleMilestoneHover = (e) => {
    const target = e.currentTarget;
    gsap.to(target, { scale: 1.05, duration: 0.3 });
    gsap.to(target, {
      boxShadow: '0 0 20px rgba(77, 238, 234, 0.8)',
      duration: 0.3,
    });
  };

  // Handle milestone leave effect
  const handleMilestoneLeave = (e) => {
    const target = e.currentTarget;
    gsap.to(target, { scale: 1, duration: 0.3 });
    gsap.to(target, { boxShadow: '0 0 10px rgba(77, 238, 234, 0.4)', duration: 0.3 });
  };

  // Handle keyboard interaction for milestones
  const handleMilestoneKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleMilestoneHover(e);
      setTimeout(() => handleMilestoneLeave(e), 500); // Simulate hover duration
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
          }

          [data-theme="dark"] {
            --text-primary: #ffffff;
            --text-accent: #4deeea;
          }

          .text-primary {
            color: var(--text-primary);
          }

          .text-accent {
            color: var(--text-accent);
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
            opacity: 0.8;
            animation: twinkle 3s infinite;
            will-change: transform, opacity;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.8); }
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

          /* Cosmic Vortex */
          .cosmic-vortex-container {
            position: relative;
            width: 300px;
            height: 300px;
            margin-bottom: 2rem;
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          .vortex-core-container {
            overflow: hidden;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }

          .vortex-core {
            animation: rotate-vortex 30s linear infinite;
            will-change: transform;
          }

          @keyframes rotate-vortex {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .vortex-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.4;
            animation: pulse-vortex 5s ease-in-out infinite;
            will-change: transform, opacity;
          }

          @keyframes pulse-vortex {
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

          .vortex-star {
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

          .bg-gold {
            background-color: #ffd700;
          }

          .text-gold {
            color: #ffd700;
          }

          .border-gold {
            border-color: #ffd700;
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

          /* Holographic Text Effect for Title */
          .holographic-title {
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

          /* Cosmic Trail on Bio Text */
          .bio-text {
            position: relative;
            display: inline-block;
          }

          .bio-text::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #4deeea, transparent);
            opacity: 0;
            transform: translateY(-50%);
            animation: trail 1.5s ease-out forwards;
          }

          @keyframes trail {
            0% { opacity: 0; transform: translateY(-50%) translateX(-100%); }
            50% { opacity: 1; transform: translateY(-50%) translateX(0); }
            100% { opacity: 0; transform: translateY(-50%) translateX(100%); }
          }

          /* Glass Card Effect for Milestones */
          .milestone {
            position: relative;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 0 10px rgba(77, 238, 234, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            min-height: 120px;
          }

          .milestone:focus {
            outline: 2px solid #4deeea;
            outline-offset: 2px;
            box-shadow: 0 0 20px rgba(77, 238, 234, 0.8);
          }

          /* Cosmic Ripple on Milestone Hover */
          .cosmic-ripple {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            border-radius: 0.5rem;
            border: 1px solid #4deeea;
            opacity: 0;
            transform: translate(-50%, -50%);
            pointer-events: none;
            animation: ripple 1s ease-out forwards;
          }

          @keyframes ripple {
            0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
            100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
          }

          /* Cosmic Star Particles on Milestone Hover/Click */
          .cosmic-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
          }

          .star-particle {
            animation: star-burst 0.8s ease-out forwards;
            will-change: transform, opacity;
          }

          @keyframes star-burst {
            0% {
              transform: translate(0, 0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(calc((var(--dx, 0) * 50px)), calc((var(--dy, 0) * 50px))) scale(0);
              opacity: 0;
            }
          }
        `}
      </style>

      <div
        ref={sectionRef}
        id="about"
        className="relative flex flex-col items-center justify-center min-h-[120vh] text-center px-4 sm:px-6 lg:px-8 py-12"
        style={{ background: '#000000' }}
        aria-labelledby="about-title"
      >
        {/* Background Nebula Glow */}
        <div className="nebula-glow-bg" />

        {/* Starfield Background */}
        <div ref={starfieldRef} className="starfield">
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

        {/* Cosmic Vortex */}
        <div ref={vortexContainerRef} className="cosmic-vortex-container">
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

          {/* Vortex Layers */}
          <svg className="vortex-layer" width="300" height="300" viewBox="0 0 300 300">
            <ellipse cx="150" cy="150" rx="140" ry="100" fill="url(#vortex-gradient-1)" />
            <ellipse cx="150" cy="150" rx="120" ry="80" fill="url(#vortex-gradient-2)" style={{ animationDelay: '-2s' }} />
            <defs>
              <radialGradient id="vortex-gradient-1" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#ff00cc', stopOpacity: 0 }} />
              </radialGradient>
              <radialGradient id="vortex-gradient-2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#ff00cc', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#4deeea', stopOpacity: 0 }} />
              </radialGradient>
            </defs>
          </svg>

          {/* Vortex Core with Noise Texture */}
          <div className="vortex-core-container">
            <svg className="vortex-core" width="300" height="300" viewBox="0 0 300 300">
              <clipPath id="vortex-clip">
                <ellipse cx="150" cy="150" rx="80" ry="60" />
              </clipPath>
              <g clipPath="url(#vortex-clip)">
                <ellipse cx="150" cy="150" rx="80" ry="60" fill="url(#vortex-gradient)" filter="url(#noise)" />
              </g>
              <defs>
                <radialGradient id="vortex-gradient" cx="50%" cy="50%" r="50%">
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
              <ellipse className="vortex-star" cx="150" cy="150" rx="100" ry="40" style={{ animation: 'rotate-vortex 15s linear infinite', animationDelay: '0s' }} />
              <ellipse className="vortex-star" cx="150" cy="150" rx="110" ry="50" style={{ animation: 'rotate-vortex 20s linear infinite reverse', animationDelay: '-5s' }} />
            </svg>
          </div>

          {/* Glowing Satellites */}
          <div className="glowing-satellite" style={{ animation: 'orbit-satellite 10s infinite', animationDelay: '0s' }} />
          <div className="glowing-satellite" style={{ animation: 'orbit-satellite 8s infinite reverse', animationDelay: '-3s' }} />
        </div>

        {/* Holographic Title */}
        <h2 id="about-title" className="text-3xl sm:text-4xl font-bold mb-4 floating-text holographic-title">
          About Priyaranjan
        </h2>

        <p ref={bioRef} className="text-lg sm:text-xl text-primary mb-12 max-w-3xl bio-text">
          Priyaranjan, a visionary web developer with over 5 years of experience, specializes in crafting
          immersive digital experiences using React, Three.js, and AI-driven innovation. Passionate about
          pushing the boundaries of web technology, he creates cosmic-grade solutions that captivate and inspire.
        </p>

        <div className="w-full max-w-4xl">
          <h3 className="text-2xl font-semibold mb-6 text-gold">Milestones</h3>
          <div className="space-y-6" role="list" aria-label="Career milestones">
            {[
              { title: 'B.Tech in Computer Science, 2019', description: 'Graduated with honors, laying the foundation for a career in cutting-edge web development.', border: 'border-cyan', hoverBg: 'hover:bg-cyan' },
              { title: 'React Lead Developer, 2020', description: 'Led a team to deliver high-performance web applications for global clients.', border: 'border-magenta', hoverBg: 'hover:bg-magenta' },
              { title: 'Vision for AI-Driven Web, 2025', description: 'Pioneering the integration of AI and 3D technologies to redefine user experiences.', border: 'border-gold', hoverBg: 'hover:bg-gold' },
            ].map((milestone, index) => (
              <div
                key={index}
                className={`milestone border-2 ${milestone.border} p-6 rounded-lg cursor-pointer relative hover:bg-opacity-10 ${milestone.hoverBg}`}
                onMouseEnter={handleMilestoneHover}
                onMouseLeave={handleMilestoneLeave}
                onKeyDown={handleMilestoneKeyDown}
                tabIndex={0}
                role="listitem"
                aria-label={milestone.title}
              >
                <h4 className="text-xl font-medium text-accent">{milestone.title}</h4>
                <p className="text-primary">{milestone.description}</p>
                <div className="cosmic-ripple" />
                <svg className="cosmic-particles">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <circle
                      key={i}
                      cx={`${Math.random() * 100}%`}
                      cy={`${Math.random() * 100}%`}
                      r={Math.random() * 3 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="star-particle"
                      style={{
                        '--dx': Math.random() * 2 - 1,
                        '--dy': Math.random() * 2 - 1,
                      }}
                    />
                  ))}
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default About;