import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import { FaArrowUp, FaGithub, FaLinkedin, FaTwitter, FaUsers } from 'react-icons/fa';
import { ErrorBoundary } from 'react-error-boundary';

// Social media links data
const socialLinks = [
  { name: 'GitHub', icon: <FaGithub />, url: 'https://github.com/prpriyaranjan?tab=repositories' },
  { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://www.linkedin.com/in/priyaranjan-428108135/' },
  { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com/johndoe' },
];

// Error fallback component
const ErrorFallback = ({ error }) => (
  <div className="text-center text-red-500 p-4">
    <h2>Error: Failed to load Footer</h2>
    <p>{error.message}</p>
  </div>
);

// Debounce utility function for scroll events
const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Scroll-to-Top Button component
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const toggleVisibility = debounce(() => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
        gsap.to(buttonRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power4.out',
        });
      } else {
        setIsVisible(false);
        gsap.to(buttonRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.8,
          duration: 0.5,
          ease: 'power4.out',
        });
      }
    }, 100);

    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    // Flare burst on click with particles drifting toward the edge
    for (let i = 0; i < 6; i++) {
      const particle = document.createElement('div');
      particle.className = 'flare-particle';
      particle.style.background = `linear-gradient(45deg, #4deeea, #ff00cc)`;
      const rect = buttonRef.current.getBoundingClientRect();
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(particle);
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: -window.innerHeight, // Drift toward the top edge
        opacity: 0,
        scale: Math.random() * 0.5 + 0.3,
        duration: 1.2,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  };

  return (
    <button
      ref={buttonRef}
      className="scroll-to-top fixed bottom-8 right-8 p-4 glass-card text-accent rounded-full shadow-cosmic-glow hover:bg-gold hover:text-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold transition-all duration-300"
      onClick={scrollToTop}
      style={{ opacity: 0, display: isVisible ? 'block' : 'none' }}
      aria-label="Scroll back to the top of the page"
    >
      <FaArrowUp size={24} />
    </button>
  );
};

// Visitor Counter component
const VisitorCounter = () => {
  const [visitCount, setVisitCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const buttonRef = useRef(null);
  const popupRef = useRef(null);

  // Increment visit count using localStorage
  useEffect(() => {
    const pageKey = `page_visits_${window.location.pathname}`; // Unique key for each page
    let visits = parseInt(localStorage.getItem(pageKey)) || 0;
    visits += 1;
    localStorage.setItem(pageKey, visits.toString());
    setVisitCount(visits);
  }, []);

  const showVisitorCount = () => {
    setShowPopup(true);
    // Animate popup
    gsap.fromTo(
      popupRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
    // Hide after 3 seconds
    setTimeout(() => {
      gsap.to(popupRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => setShowPopup(false),
      });
    }, 3000);
    // Particle burst on click
    for (let i = 0; i < 3; i++) {
      const particle = document.createElement('div');
      particle.className = 'flare-particle';
      particle.style.background = `linear-gradient(45deg, #4deeea, #ff00cc)`;
      const rect = buttonRef.current.getBoundingClientRect();
      particle.style.left = `${rect.left + rect.width / 2}px`;
      particle.style.top = `${rect.top + rect.height / 2}px`;
      document.body.appendChild(particle);
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 50,
        y: -window.innerHeight, // Drift toward the top edge
        opacity: 0,
        scale: Math.random() * 0.3 + 0.2,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
    }
  };

  // Animate button on hover
  useEffect(() => {
    const handleMouseEnter = () => {
      gsap.to(buttonRef.current, {
        scale: 1.2,
        duration: 0.3,
        ease: 'power4.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(buttonRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power4.out',
      });
    };

    const button = buttonRef.current;
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        className="visitor-counter text-accent hover:text-gold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gold transition-all duration-300"
        onClick={showVisitorCount}
        aria-label={`Show number of visits to this page: ${visitCount} visits`}
      >
        <FaUsers size={16} />
      </button>
      {showPopup && (
        <div
          ref={popupRef}
          className="visitor-popup absolute bottom-8 left-1/2 transform -translate-x-1/2 px-3 py-1 glass-card text-accent text-sm rounded-lg shadow-cosmic-glow"
          role="alert"
          aria-live="polite"
        >
          <p>{visitCount} Visits</p>
        </div>
      )}
    </div>
  );
};

const Footer = () => {
  const sectionRef = useRef(null);
  const nebulaRef = useRef(null);
  const copyrightRef = useRef(null);
  const socialRefs = useRef([]);

  useEffect(() => {
    socialRefs.current = socialLinks.map(() => null);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Typing effect for copyright text
          const copyrightElement = copyrightRef.current;
          const copyrightContent = copyrightElement.textContent;
          copyrightElement.textContent = '';
          let charIndex = 0;

          const typeText = () => {
            if (charIndex < copyrightContent.length) {
              copyrightElement.textContent += copyrightContent.charAt(charIndex);
              charIndex++;
              setTimeout(typeText, 30);
            }
          };

          gsap.from(copyrightElement, {
            opacity: 0,
            y: 20,
            duration: 1,
            ease: 'power4.out',
            delay: 0.3,
            onStart: typeText,
          });

          // Animate cosmic boundary
          gsap.to(nebulaRef.current, {
            boxShadow: [
              '0 0 10px rgba(77, 238, 234, 0.5)',
              '0 0 20px rgba(77, 238, 234, 0.8)',
              '0 0 10px rgba(77, 238, 234, 0.5)',
            ],
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          // Animate social links
          socialRefs.current.forEach((link, i) => {
            if (link) {
              gsap.fromTo(
                link,
                { opacity: 0, y: 30 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  delay: i * 0.2,
                  ease: 'power4.out',
                }
              );
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

  // Handle social link interactions
  useEffect(() => {
    const handleMouseMove = (e, link) => {
      const rect = link.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tiltX = (y / rect.height) * 5; // Max 5deg tilt
      const tiltY = -(x / rect.width) * 5;
      gsap.to(link, {
        rotationX: tiltX,
        rotationY: tiltY,
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleMouseEnter = (index, link) => {
      gsap.to(link, {
        scale: 1.2,
        color: '#4deeea',
        duration: 0.3,
        ease: 'power4.out',
      });
      // Flare particles on hover drifting toward the top edge
      for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.className = 'flare-particle';
        particle.style.background = `linear-gradient(45deg, #4deeea, #ff00cc)`;
        const rect = link.getBoundingClientRect();
        particle.style.left = `${rect.left + Math.random() * rect.width}px`;
        particle.style.top = `${rect.top + Math.random() * rect.height}px`;
        document.body.appendChild(particle);
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 40,
          y: -window.innerHeight, // Drift toward the top edge
          opacity: 0,
          scale: Math.random() * 0.4 + 0.2,
          duration: 1,
          ease: 'power2.out',
          onComplete: () => particle.remove(),
        });
      }
    };

    const handleMouseLeave = (link) => {
      gsap.to(link, {
        scale: 1,
        rotationX: 0,
        rotationY: 0,
        color: 'var(--text-primary)',
        duration: 0.5,
        ease: 'power2.out',
      });
    };

    const handleClick = (link) => {
      gsap.to(link, {
        scale: 0.9,
        duration: 0.2,
        ease: 'power4.out',
      });
    };

    socialRefs.current.forEach((link, index) => {
      if (!link) return;
      link.addEventListener('mousemove', (e) => handleMouseMove(e, link));
      link.addEventListener('mouseenter', () => handleMouseEnter(index, link));
      link.addEventListener('mouseleave', () => handleMouseLeave(link));
      link.addEventListener('click', () => handleClick(link));
    });

    return () => {
      socialRefs.current.forEach((link) => {
        if (!link) return;
        link.removeEventListener('mousemove', (e) => handleMouseMove(e, link));
        link.removeEventListener('mouseenter', () => handleMouseEnter(index, link));
        link.removeEventListener('mouseleave', () => handleMouseLeave(link));
        link.removeEventListener('click', () => handleClick(link));
      });
    };
  }, []);

  // Handle event horizon ripple on hover near the top edge
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = sectionRef.current.getBoundingClientRect();
      const threshold = 50;
      const topEdgeY = rect.top;

      if (e.clientY >= topEdgeY && e.clientY <= topEdgeY + threshold) {
        const ripple = document.createElement('div');
        ripple.className = 'event-horizon-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${topEdgeY}px`;
        sectionRef.current.appendChild(ripple);
        setTimeout(() => ripple.remove(), 2000);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate void stars and dark energy particles
  useEffect(() => {
    const starfield = sectionRef.current.querySelector('.starfield');

    // Generate Void Stars at the top edge
    for (let i = 0; i < 30; i++) {
      const voidStar = document.createElement('div');
      voidStar.className = 'void-star';
      const size = Math.random() * 2 + 1;
      voidStar.style.width = `${size}px`;
      voidStar.style.height = `${size}px`;
      voidStar.style.left = `${Math.random() * 100}%`;
      voidStar.style.top = `${Math.random() * 10}%`;
      voidStar.dataset.depth = Math.random() * 0.5 + 0.2;
      voidStar.style.animationDelay = `${Math.random() * 5}s`;
      starfield.appendChild(voidStar);
    }

    // Generate Dark Energy Particles at the top edge
    const createDarkEnergyParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'dark-energy-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 10}%`;
      particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 50}px`);
      particle.style.setProperty('--dy', `-${Math.random() * 50}px`);
      particle.style.animationDelay = `${Math.random() * 2}s`;
      starfield.appendChild(particle);
      setTimeout(() => particle.remove(), 5000);
    };
    const particleInterval = setInterval(createDarkEnergyParticle, 500);

    // Parallax effect for void stars
    const voidStars = starfield.querySelectorAll('.void-star');
    const handleScroll = () => {
      const scrollY = window.scrollY;
      voidStars.forEach((star) => {
        const depth = parseFloat(star.dataset.depth);
        star.style.transform = `translateY(${scrollY * depth * 0.1}px)`;
      });
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(particleInterval);
      window.removeEventListener('scroll', handleScroll);
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

          /* Cosmic Boundary Effect */
          .cosmic-boundary {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
          }

          /* Cosmic Horizon Glow at Top Edge */
          .cosmic-horizon {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background: linear-gradient(
              to bottom,
              rgba(77, 238, 234, 0.3) 0%,
              transparent 100%
            );
            animation: horizon-glow 10s infinite ease-in-out;
          }

          @keyframes horizon-glow {
            0% { opacity: 0.5; }
            50% { opacity: 0.8; }
            100% { opacity: 0.5; }
          }

          /* Space-Time Distortion at Top Edge */
          .space-time-distortion {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 50px;
            background: linear-gradient(
              to bottom,
              rgba(77, 238, 234, 0.2) 0%,
              transparent 100%
            );
            animation: distort-space 15s infinite ease-in-out;
          }

          @keyframes distort-space {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
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

          /* Void Stars at Top Edge */
          .void-star {
            position: absolute;
            border-radius: 50%;
            background: #ffffff;
            opacity: 0.5;
            animation: void-twinkle 5s infinite;
          }

          @keyframes void-twinkle {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.5); }
          }

          /* Dark Energy Particles at Top Edge */
          .dark-energy-particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, #4deeea, #ff00cc);
            border-radius: 50%;
            box-shadow: 0 0 10px rgba(77, 238, 234, 0.8);
            animation: dark-energy-drift 5s linear infinite;
          }

          @keyframes dark-energy-drift {
            0% { opacity: 1; transform: translate(0, 0); }
            100% { opacity: 0; transform: translate(var(--dx), var(--dy)); }
          }

          /* Event Horizon Ripple at Top Edge */
          .event-horizon-ripple {
            position: absolute;
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, rgba(77, 238, 234, 0.3), transparent);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: horizon-ripple 2s forwards;
            pointer-events: none;
            z-index: 0;
          }

          @keyframes horizon-ripple {
            0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
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

          /* Cosmic Glow Shadow */
          .shadow-cosmic-glow {
            box-shadow: 0 0 15px rgba(77, 238, 234, 0.6);
          }

          /* Flare Particle */
          .flare-particle {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            pointer-events: none;
          }

          /* Social Icon */
          .social-icon {
            display: inline-block;
            transition: all 0.3s ease;
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          /* Glow Text Cosmic */
          .glow-text-cosmic {
            text-shadow: 0 0 10px rgba(77, 238, 234, 0.6);
          }

          /* Visitor Popup */
          .visitor-popup {
            z-index: 1000;
          }
        `}
      </style>

      <footer
        ref={sectionRef}
        className="py-8 mt-20 relative"
        style={{ background: '#000000' }}
        aria-label="Footer"
      >
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

        {/* Cosmic Boundary Effect */}
        <div ref={nebulaRef} className="cosmic-boundary">
          <div className="cosmic-horizon" aria-hidden="true" />
          <div className="space-time-distortion" aria-hidden="true" />
        </div>

        {/* Footer Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Social Media Links */}
          <div className="flex justify-center space-x-6 mb-6" role="list" aria-label="Social media links">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon text-primary glow-text-cosmic"
                ref={(el) => (socialRefs.current[index] = el)}
                role="listitem"
                aria-label={`Visit my ${link.name} profile`}
              >
                <span className="text-3xl">{link.icon}</span>
              </a>
            ))}
          </div>

          {/* Footer Text */}
          <p
            ref={copyrightRef}
            className="text-lg font-cosmic-bold text-accent mb-2 glow-text-cosmic"
          >
            © {new Date().getFullYear()} Priyaranjan. All rights reserved.
          </p>
          <p className="text-sm font-cosmic-bold text-primary mb-4 glow-text-cosmic">
            Built with React, Tailwind CSS, and a touch of cosmic magic ✨
          </p>

          {/* Visitor Counter */}
          <VisitorCounter />

          {/* Scroll-to-Top Button */}
          <ScrollToTopButton />
        </div>
      </footer>
    </ErrorBoundary>
  );
};

export default Footer;