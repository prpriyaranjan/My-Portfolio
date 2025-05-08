import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ErrorBoundary } from 'react-error-boundary';

// Error fallback component
const ErrorFallback = ({ error }) => (
  <div className="text-center text-red-500 p-4">
    <h2>Error: Failed to load Skills</h2>
    <p>{error.message}</p>
  </div>
);

const Skills = () => {
  const sectionRef = useRef(null);
  const supernovaRef = useRef(null);
  const titleRef = useRef(null);
  const skillRefs = useRef([]);

  // Define the skills array
  const skills = [
    {
      name: 'React',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" fill="#4deeea" />
          <path d="M12 2a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10m0-20a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10" />
        </svg>
      ),
    },
    {
      name: 'Three.js',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M4 4h16v16H4z" />
          <path d="M4 4l16 16M4 12h16M12 4v16" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'AI',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z" />
          <path d="M12 8v8M8 12h8" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'Node.js',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
          <path d="M12 7v10M7 9.5l5 2.5 5-2.5" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'Tailwind',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M4 12c2-4 6-6 8 0s2 8 4 8 6-2 8-6-2-8-4-8-6 2-8-2-6 6-4 8z" />
          <path d="M12 4v16" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'GSAP',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M2 12h20M12 2v20" />
          <circle cx="12" cy="12" r="4" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'HTML',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M5 3l-1 18h16l-1-18H5z" />
          <path d="M12 6v12M8 9h8M8 15h8" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'CSS',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M3 3h18v18H3z" />
          <path d="M9 6s3 3 6 0 3 6 0 9-6 0-6 0" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'Java',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M8 4h8v4H8z" />
          <path d="M6 8s2 8 6 12 6-12 6-12" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'C',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
          <path d="M8 16c2-4 4-4 4 0s2 4 4 0" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'C++',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9z" />
          <path d="M8 16c2-4 4-4 4 0s2 4 4 0M14 9h4M14 12h4" fill="#4deeea" />
        </svg>
      ),
    },
    {
      name: 'SASS',
      icon: (
        <svg className="skill-icon" viewBox="0 0 24 24" fill="none" stroke="#4deeea" strokeWidth="2">
          <path d="M12 4l6 6-6 6-6-6 6-6z" />
          <circle cx="12" cy="10" r="2" fill="#4deeea" />
        </svg>
      ),
    },
  ];

  // Initialize skillRefs
  useEffect(() => {
    skillRefs.current = skills.map(() => null);
  }, []);

  // Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Typing effect for title
          const titleElement = titleRef.current;
          const titleContent = titleElement.textContent;
          titleElement.textContent = '';
          let charIndex = 0;

          const typeText = () => {
            if (charIndex < titleContent.length) {
              titleElement.textContent += titleContent.charAt(charIndex);
              charIndex++;
              setTimeout(typeText, 50);
            }
          };

          gsap.from(titleElement, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: 'power4.out',
            delay: 0.3,
            onStart: typeText,
          });

          // Animate supernova
          gsap.from(supernovaRef.current, {
            scale: 0,
            opacity: 0,
            duration: 1,
            ease: 'power4.out',
          });

          // Animate skill cards
          skillRefs.current.forEach((skill, i) => {
            if (skill) {
              gsap.fromTo(
                skill,
                { opacity: 0, y: 50 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  delay: i * 0.15,
                  ease: 'power4.out',
                }
              );

              // Pulsing effect
              gsap.to(skill, {
                scale: 1.05,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2,
              });
            }
          });
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Card tilt and hover effects
  useEffect(() => {
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 5; // Max 5deg tilt
      const tiltY = -(x / rect.width) * 5;
      gsap.to(card, {
        rotationX: tiltX,
        rotationY: tiltY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = (card) => {
      gsap.to(card, {
        scale: 1.05,
        boxShadow: '0 0 15px rgba(77, 238, 234, 0.6)',
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = (card) => {
      gsap.to(card, {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        boxShadow: '0 0 10px rgba(77, 238, 234, 0.4)',
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    skillRefs.current.forEach((card) => {
      if (!card) return;
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
      card.addEventListener('mouseenter', () => handleMouseEnter(card));
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
    });

    return () => {
      skillRefs.current.forEach((card) => {
        if (!card) return;
        card.removeEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.removeEventListener('mouseenter', () => handleMouseEnter(card));
        card.removeEventListener('mouseleave', () => handleMouseLeave(card));
      });
    };
  }, []);

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

          /* Colors from tailwind.config.js */
          .bg-cyan { background-color: #4deeea; }
          .text-cyan { color: #4deeea; }
          .border-cyan { border-color: #4deeea; }
          .bg-magenta { background-color: #ff00cc; }
          .text-magenta { color: #ff00cc; }
          .border-magenta { border-color: #ff00cc; }
          .bg-gold { background-color: #ffd700; }
          .text-gold { color: #ffd700; }
          .border-gold { border-color: #ffd700; }

          /* Nebula Glow */
          .nebula-glow-bg {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(77, 238, 234, 0.1), transparent 70%);
            opacity: 0.3;
            pointer-events: none;
            z-index: -1;
          }

          /* Starfield */
          .starfield {
            position: absolute;
            inset: 0;
            pointer-events: none;
            overflow: hidden;
            z-index: -1;
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

          /* Cosmic Dust */
          .cosmic-dust {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
          }

          .dust-particle {
            position: absolute;
            background: rgba(77, 238, 234, 0.5);
            border-radius: 50%;
            animation: drift 8s infinite ease-in-out;
            will-change: transform, opacity;
          }

          @keyframes drift {
            0%, 100% { transform: translate(0, 0); opacity: 0.5; }
            50% { transform: translate(calc(var(--dx) * 15px), calc(var(--dy) * 15px)); opacity: 0.8; }
          }

          /* Supernova */
          .supernova-container {
            position: relative;
            width: 200px;
            height: 200px;
            margin-bottom: 4rem; /* Increased from 2rem to 4rem (64px) */
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          .supernova-core {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle, #333333 10%, #ff4500 30%, #ffd700 50%, transparent 70%);
            box-shadow: 0 0 20px rgba(255, 69, 0, 0.8);
            animation: supernova-pulse 2s ease-in-out infinite;
          }

          @keyframes supernova-pulse {
            0%, 100% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.1); opacity: 1; }
          }

          .shockwave {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            stroke: url(#shockwave-gradient);
            stroke-width: 6;
            fill: none;
            animation: shockwave-expand 5s linear infinite;
          }

          @keyframes shockwave-expand {
            0% { transform: scale(1); opacity: 0.9; }
            100% { transform: scale(2); opacity: 0; }
          }

          .supernova-remnants {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .remnant-particle {
            animation: remnant-burst 2s ease-out infinite;
            will-change: transform, opacity;
          }

          @keyframes remnant-burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc(var(--dx) * 40px), calc(var(--dy) * 40px)) scale(0); opacity: 0; }
          }

          /* Glass Card */
          .glass-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: box-shadow 0.3s ease;
            perspective: 1000px;
            transform-style: preserve-3d;
            min-width: 200px;
          }

          /* Skill Card */
          .skill-card {
            position: relative;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(77, 238, 234, 0.4);
          }

          .skill-icon {
            width: 48px;
            height: 48px;
            margin-bottom: 0.5rem;
          }

          /* Cosmic Flares */
          .cosmic-flares {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
          }

          .skill-card:hover .cosmic-flares,
          .skill-card:focus .cosmic-flares {
            opacity: 1;
          }

          .flare-particle {
            animation: flare 0.6s ease-out forwards;
            will-change: transform, opacity;
          }

          @keyframes flare {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc((var(--dx, 0) * 20px)), calc((var(--dy, 0) * 20px))) scale(0); opacity: 0; }
          }

          /* Floating Text */
          .floating-text {
            animation: float 3s ease-in-out infinite;
            will-change: transform;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          /* Holographic Text */
          .holographic-title {
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
        `}
      </style>

      <section
        ref={sectionRef}
        id="skills"
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 py-16"
        style={{ background: '#000000' }}
        aria-labelledby="skills-title"
      >
        {/* Nebula Glow */}
        <div className="nebula-glow-bg" />

        {/* Starfield */}
        <div className="starfield">
          {Array.from({ length: 20 }).map((_, i) => (
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

        {/* Supernova */}
        <div className="supernova-container">
          <div className="supernova-core" ref={supernovaRef} />
          <div className="cosmic-dust">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="dust-particle"
                style={{
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  '--dx': Math.random() * 2 - 1,
                  '--dy': Math.random() * 2 - 1,
                }}
              />
            ))}
          </div>
          <svg className="shockwave" width="200" height="200" viewBox="0 0 200 200" style={{ animationDelay: '0s' }}>
            <ellipse cx="100" cy="100" rx="90" ry="90" />
            <defs>
              <linearGradient id="shockwave-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ff4500', stopOpacity: 0.9 }} />
                <stop offset="100%" style={{ stopColor: '#ffd700', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>
          </svg>
          <svg className="shockwave" width="200" height="200" viewBox="0 0 200 200" style={{ animationDelay: '-2.5s' }}>
            <ellipse cx="100" cy="100" rx="85" ry="85" />
          </svg>
          <svg className="supernova-remnants" width="200" height="200" viewBox="0 0 200 200">
            {Array.from({ length: 6 }).map((_, i) => (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={Math.random() * 3 + 2}
                fill={Math.random() > 0.5 ? '#ff4500' : '#ffd700'}
                className="remnant-particle"
                style={{
                  '--dx': Math.random() * 2 - 1,
                  '--dy': Math.random() * 2 - 1,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </svg>
        </div>

        {/* Holographic Title */}
        <h2
          ref={titleRef}
          id="skills-title"
          className="text-3xl sm:text-4xl font-cosmic-bold mb-8 sm:mb-10 lg:mb-12 holographic-title floating-text"
        >
          Skills
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl" role="list">
          {skills.map((skill, index) => (
            <article
              key={index}
              ref={(el) => (skillRefs.current[index] = el)}
              className="skill-card glass-card p-6 rounded-lg cursor-pointer border-2 border-gold glow-cosmic"
              role="listitem"
              aria-label={`Skill: ${skill.name}`}
              tabIndex={0}
            >
              {skill.icon}
              <p className="text-xl font-cosmic-bold text-accent">{skill.name}</p>
              <svg className="cosmic-flares" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={`${Math.random() * 100}%`}
                    cy={`${Math.random() * 100}%`}
                    r={Math.random() * 2 + 1}
                    fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                    className="flare-particle"
                    style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                  />
                ))}
              </svg>
            </article>
          ))}
        </div>
      </section>
    </ErrorBoundary>
  );
};

export default Skills;