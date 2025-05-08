import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ErrorBoundary } from 'react-error-boundary';

// Dynamic project data with links
const projectsData = [
  {
    id: 1,
    title: 'Cosmic Portfolio',
    description: 'A 3D-powered portfolio with React and Three.js, showcasing immersive web experiences.',
    extendedDescription: 'This portfolio leverages React for dynamic rendering and Three.js for 3D visuals, creating an interactive cosmic journey.',
    border: 'border-magenta',
    hoverBg: 'hover:bg-magenta/10',
    demoUrl: 'https://example.com/cosmic-portfolio',
    githubUrl: 'https://github.com/example/cosmic-portfolio',
  },
  {
    id: 2,
    title: 'AI Web Dashboard',
    description: 'An AI-driven dashboard for real-time data visualization, built with React and Node.js.',
    extendedDescription: 'A scalable dashboard using React for the frontend and Node.js for real-time data processing, with AI-powered insights.',
    border: 'border-gold',
    hoverBg: 'hover:bg-gold/10',
    demoUrl: 'https://example.com/ai-dashboard',
    githubUrl: 'https://github.com/example/ai-dashboard',
  },
  {
    id: 3,
    title: 'The Shiv Library',
    description: 'A dynamic library management system with user and admin features, built with PHP and MySQL.',
    extendedDescription: 'The Shiv Library offers user registration, book borrowing, and admin-user messaging, powered by HTML, CSS, JavaScript, PHP, and MySQL for a seamless experience.',
    border: 'border-cyan',
    hoverBg: 'hover:bg-cyan/10',
    demoUrl: 'http://theshivlibrary.free.nf/',
    githubUrl: 'https://github.com/example/the-shiv-library', // TODO: Replace with real GitHub URL
  },
];

// Simple debounce function
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Error fallback component
const ErrorFallback = ({ error }) => (
  <div className="text-center text-red-500 p-4">
    <h2>Error: Failed to load Projects</h2>
    <p>{error.message}</p>
  </div>
);

const Projects = () => {
  const sectionRef = useRef(null);
  const blackHoleRef = useRef(null);
  const projectRefs = useRef([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const modalRef = useRef(null);

  // IntersectionObserver with debounce
  useEffect(() => {
    const handleIntersection = debounce(([entry]) => {
      console.log('IntersectionObserver triggered:', entry.isIntersecting);
      if (entry.isIntersecting) {
        try {
          // Black hole animation
          gsap.fromTo(
            blackHoleRef.current,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
          );

          // Project cards ejection effect
          console.log('Project refs for ejection:', projectRefs.current);
          projectRefs.current.forEach((project, i) => {
            if (!project) return;
            const blackHoleRect = blackHoleRef.current.getBoundingClientRect();
            const projectRect = project.getBoundingClientRect();
            const centerX = blackHoleRect.left + blackHoleRect.width / 2;
            const centerY = blackHoleRect.top + blackHoleRect.height / 2;

            gsap.set(project, {
              x: centerX - projectRect.left - projectRect.width / 2,
              y: centerY - projectRect.top - projectRect.height / 2,
              scale: 0,
              opacity: 0,
            });

            gsap.to(project, {
              scale: 0.5,
              opacity: 0.5,
              duration: 0.4,
              delay: i * 0.15,
              ease: 'power2.in',
              onComplete: () => {
                try {
                  gsap.to(project, {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                  });
                } catch (error) {
                  console.error('Card animation completion error:', error);
                }
              },
            });
          });
        } catch (error) {
          console.error('Black hole or card animation error:', error);
        }
      }
    }, 100);

    const observer = new IntersectionObserver(handleIntersection, { threshold: 0.1 });
    const section = sectionRef.current;
    if (section) observer.observe(section);
    return () => {
      if (section && observer) observer.unobserve(section);
    };
  }, []);

  // Modal focus and animation
  useEffect(() => {
    if (selectedProject && modalRef.current) {
      console.log('Modal opened for:', selectedProject.title);
      try {
        modalRef.current.focus();
        gsap.from(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        });
      } catch (error) {
        console.error('Modal animation error:', error);
      }
    }
  }, [selectedProject]);

  // Card tilt and hover effects
  useEffect(() => {
    const handleMouseMove = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 5; // Max 5deg tilt
      const tiltY = -(x / rect.width) * 5;
      try {
        gsap.to(card, {
          rotationX: tiltX,
          rotationY: tiltY,
          duration: 0.5,
          ease: 'power2.out',
        });
      } catch (error) {
        console.error('Card tilt animation error:', error);
      }
    };

    const handleMouseEnter = (card) => {
      try {
        gsap.to(card, {
          scale: 1.05,
          boxShadow: '0 0 15px rgba(77, 238, 234, 0.5)',
          duration: 0.3,
          ease: 'power2.out',
        });
      } catch (error) {
        console.error('Card hover animation error:', error);
      }
    };

    const handleMouseLeave = (card) => {
      try {
        gsap.to(card, {
          scale: 1,
          rotationX: 0,
          rotationY: 0,
          boxShadow: '0 0 8px rgba(77, 238, 234, 0.3)',
          duration: 0.5,
          ease: 'power2.out',
        });
      } catch (error) {
        console.error('Card leave animation error:', error);
      }
    };

    projectRefs.current.forEach((card, index) => {
      if (!card) return;
      console.log(`Attaching listeners for card ${index}:`, card);
      card.addEventListener('mousemove', (e) => handleMouseMove(e, card));
      card.addEventListener('mouseenter', () => handleMouseEnter(card));
      card.addEventListener('mouseleave', () => handleMouseLeave(card));
    });

    return () => {
      projectRefs.current.forEach((card, index) => {
        if (!card) return;
        console.log(`Removing listeners for card ${index}:`, card);
        card.removeEventListener('mousemove', (e) => handleMouseMove(e, card));
        card.removeEventListener('mouseenter', () => handleMouseEnter(card));
        card.removeEventListener('mouseleave', () => handleMouseLeave(card));
      });
    };
  }, []);

  const handleButtonHover = (e) => {
    try {
      gsap.to(e.currentTarget, { '--flare-opacity': 1, duration: 0.3 });
    } catch (error) {
      console.error('Button hover animation error:', error);
    }
  };

  const handleButtonLeave = (e) => {
    try {
      gsap.to(e.currentTarget, { '--flare-opacity': 0, duration: 0.3 });
    } catch (error) {
      console.error('Button leave animation error:', error);
    }
  };

  const handleKeyDown = (e, project) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      console.log(`Key down on ${project.title}:`, e.key);
      setSelectedProject(project);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
  };

  const handleModalKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal();
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

          /* Nebula Drift */
          .nebula-drift {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 30% 30%, rgba(255, 0, 204, 0.15), transparent 60%);
            opacity: 0.2;
            pointer-events: none;
            z-index: -1;
            animation: nebula-drift 20s linear infinite;
            will-change: transform;
          }

          @keyframes nebula-drift {
            0% { transform: translate(0, 0); }
            50% { transform: translate(-20px, 20px); }
            100% { transform: translate(0, 0); }
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

          /* Black Hole */
          .black-hole-container {
            position: relative;
            width: 120px;
            height: 120px;
            margin-bottom: 1.5rem;
            perspective: 1000px;
            transform-style: preserve-3d;
          }
          @media (min-width: 640px) {
            .black-hole-container {
              width: 160px;
              height: 160px;
            }
          }
          .black-hole {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: radial-gradient(circle, #111111 40%, #333333 100%);
            box-shadow: 0 0 12px rgba(0, 0, 0, 0.9);
          }
          .accretion-disk {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            stroke: url(#accretion-gradient);
            stroke-width: 8;
            fill: none;
            animation: swirl 8s linear infinite;
            will-change: transform;
          }
          @keyframes swirl {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .lensing-effect {
            position: absolute;
            top: -10px;
            left: -10px;
            width: calc(100% + 20px);
            height: calc(100% + 20px);
            border-radius: 50%;
            background: rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            pointer-events: none;
            z-index: -1;
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
          }

          /* Project Card */
          .project-card {
            position: relative;
            transition: all 0.3s ease;
            overflow: visible;
            will-change: transform, box-shadow;
          }
          .project-card:hover, .project-card:focus {
            animation: glow-pulse 1.5s ease-in-out infinite;
          }
          .cosmic-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
          }
          .project-card:hover .cosmic-particles,
          .project-card:focus .cosmic-particles {
            opacity: 1;
          }
          .star-particle {
            animation: star-burst 0.5s ease-out forwards;
            will-change: transform, opacity;
          }
          .trail-particle {
            animation: trail-burst 0.7s ease-out forwards;
            will-change: transform, opacity;
            opacity: 0;
          }
          .project-card:hover .trail-particle,
          .project-card:focus .trail-particle {
            opacity: 1;
          }
          @keyframes star-burst {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc(var(--dx) * 20px), calc(var(--dy) * 20px)) scale(0); opacity: 0; }
          }
          @keyframes trail-burst {
            0% { transform: translate(0, 0) scale(1); opacity: 0.8; }
            100% { transform: translate(calc(var(--dx) * 30px), calc(var(--dy) * 30px)) scale(0); opacity: 0; }
          }
          @keyframes glow-pulse {
            0%, 100% { box-shadow: 0 0 8px rgba(77, 238, 234, 0.5); }
            50% { box-shadow: 0 0 12px rgba(77, 238, 234, 0.6); }
          }

          /* Cosmic Flare */
          .cosmic-button {
            position: relative;
            overflow: visible;
          }
          .cosmic-flare {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: var(--flare-opacity, 0);
          }
          .flare-particle {
            animation: flare 0.5s ease-out forwards;
            will-change: transform, opacity;
          }
          @keyframes flare {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(calc(var(--dx) * 20px), calc(var(--dy) * 20px)) scale(0); opacity: 0; }
          }

          /* Floating Text */
          .floating-text {
            animation: float 3s ease-in-out infinite;
            will-change: transform;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
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
            50% { filter: drop-shadow(0 0 8px rgba(255, 0, 204, 0.7)); }
          }

          /* Modal */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
          }
          .modal-content {
            background: linear-gradient(135deg, #1b263b, #2e2e5b);
            padding: 1.5rem;
            border-radius: 10px;
            max-width: 90%;
            width: 480px;
            position: relative;
            box-shadow: 0 0 15px rgba(77, 238, 234, 0.5);
          }
          .modal-close {
            position: absolute;
            top: 0.75rem;
            right: 0.75rem;
            background: none;
            border: none;
            color: #4deeea;
            font-size: 1.25rem;
            cursor: pointer;
            transition: color 0.2s;
          }
          .modal-close:hover {
            color: #ff00cc;
          }
          .modal-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
          }
          .modal-button {
            flex: 1;
            padding: 0.5rem;
            border: 2px solid #4deeea;
            border-radius: 4px;
            text-decoration: none;
            text-align: center;
            font-weight: 500;
            color: #4deeea;
            transition: all 0.3s;
          }
          .modal-button:hover {
            background-color: rgba(77, 238, 234, 0.2);
            border-color: #ff00cc;
            color: #ff00cc;
          }
        `}
      </style>

      <section
        ref={sectionRef}
        id="projects"
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8"
        style={{ background: '#000000' }}
        aria-labelledby="projects-title"
      >
        {/* Nebula Glow */}
        <div className="nebula-glow-bg" />

        {/* Nebula Drift */}
        <div className="nebula-drift" />

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

        {/* Black Hole */}
        <div className="black-hole-container" role="presentation">
          <div className="lensing-effect" />
          <div className="black-hole" ref={blackHoleRef} />
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
          <svg
            className="accretion-disk"
            width="100%"
            height="100%"
            viewBox="0 0 200 200"
            aria-hidden="true"
          >
            <ellipse cx="100" cy="100" rx="90" ry="60" />
            <ellipse cx="100" cy="100" rx="85" ry="55" opacity="0.6" />
            <defs>
              <linearGradient id="accretion-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#ff00cc', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#ffd700', stopOpacity: 0.4 }} />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h2
          id="projects-title"
          className="text-3xl sm:text-4xl font-cosmic-bold mb-6 holographic-title floating-text"
        >
          Projects
        </h2>

        <p className="text-base sm:text-lg text-primary max-w-2xl mb-8 glow-text-cosmic">
          Explore my latest creations, infused with cosmic technology and stellar design.
        </p>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full"
          role="list"
        >
          {projectsData.map((project, index) => (
            <article
              key={project.id}
              ref={(el) => {
                projectRefs.current[index] = el;
                console.log(`Ref set for ${project.title}:`, el);
              }}
              className={`project-card glass-card p-5 rounded-lg cursor-pointer ${project.border} ${project.hoverBg} glow-cosmic`}
              onClick={() => {
                console.log(`Clicked ${project.title}`);
                setSelectedProject(project);
              }}
              onKeyDown={(e) => handleKeyDown(e, project)}
              tabIndex={0}
              role="listitem"
              aria-label={`Project: ${project.title}`}
            >
              <h3 className="text-lg font-cosmic-bold text-accent mb-2">{project.title}</h3>
              <p className="text-primary text-sm">{project.description}</p>
              <svg className="cosmic-particles" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={`${Math.random() * 100}%`}
                    cy={`${Math.random() * 100}%`}
                    r={Math.random() + 0.5}
                    fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                    className="star-particle"
                    style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                  />
                ))}
                <circle
                  cx="50%"
                  cy="50%"
                  r={Math.random() + 0.5}
                  fill={index % 2 === 0 ? '#4deeea' : '#ff00cc'}
                  className="trail-particle"
                  style={{
                    '--dx': index % 2 === 0 ? 1.5 : -1.5,
                    '--dy': index % 2 === 0 ? 1.5 : -1.5,
                  }}
                />
              </svg>
            </article>
          ))}
        </div>
      </section>

      {selectedProject && (
        <div
          className="modal-overlay"
          onClick={closeModal}
          role="dialog"
          aria-labelledby="modal-title"
        >
          <div
            className="modal-content glass-card"
            ref={modalRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleModalKeyDown}
          >
            <button
              className="modal-close"
              onClick={closeModal}
              aria-label="Close modal"
            >
              ×
            </button>
            <h3 id="modal-title" className="text-xl font-cosmic-bold text-accent mb-3">
              {selectedProject.title}
            </h3>
            <p className="text-primary mb-4">{selectedProject.extendedDescription}</p>
            <div className="modal-buttons">
              <a
                href={selectedProject.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-button cosmic-button"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                style={{ '--flare-opacity': 0 }}
                aria-label={`View live demo of ${selectedProject.title}`}
              >
                Live Demo
                <svg className="cosmic-flare">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={Math.random() * 2 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="flare-particle"
                      style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                    />
                  ))}
                </svg>
              </a>
              <a
                href={selectedProject.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-button cosmic-button"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
                style={{ '--flare-opacity': 0 }}
                aria-label={`View GitHub repository for ${selectedProject.title}`}
              >
                GitHub
                <svg className="cosmic-flare">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <circle
                      key={i}
                      cx="50%"
                      cy="50%"
                      r={Math.random() * 2 + 1}
                      fill={Math.random() > 0.5 ? '#4deeea' : '#ff00cc'}
                      className="flare-particle"
                      style={{ '--dx': Math.random() * 2 - 1, '--dy': Math.random() * 2 - 1 }}
                    />
                  ))}
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </ErrorBoundary>
  );
};

export default Projects;