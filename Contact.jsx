import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ErrorBoundary } from 'react-error-boundary';
import emailjs from '@emailjs/browser';

// Error fallback component
const ErrorFallback = ({ error }) => (
  <div className="text-center text-red-500 p-4">
    <h2>Error: Failed to load Contact</h2>
    <p>{error.message}</p>
  </div>
);

const Contact = () => {
  const sectionRef = useRef(null);
  const galaxyRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState('');

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

          // Animate galaxy
          gsap.to(galaxyRef.current, {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });

          // Animate form
          gsap.from(formRef.current, {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power4.out',
            delay: 0.5,
          });

          // Tilt effect for form
          const handleMouseMove = (e) => {
            const rect = formRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const tiltX = (y / rect.height) * 5; // Max 5deg tilt
            const tiltY = -(x / rect.width) * 5;
            gsap.to(formRef.current, {
              rotationX: tiltX,
              rotationY: tiltY,
              duration: 0.5,
              ease: 'power2.out',
            });
          };

          const handleMouseLeave = () => {
            gsap.to(formRef.current, {
              rotationX: 0,
              rotationY: 0,
              duration: 0.5,
              ease: 'power2.out',
            });
          };

          formRef.current.addEventListener('mousemove', handleMouseMove);
          formRef.current.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            formRef.current.removeEventListener('mousemove', handleMouseMove);
            formRef.current.removeEventListener('mouseleave', handleMouseLeave);
          };
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  // Handle form submission
  const handleSendMessage = () => {
    try {
      if (!formRef.current) {
        setStatus('Form not found. Please try again.');
        return;
      }
      // Replace these placeholders with your actual EmailJS credentials
      const serviceId = 'service_277doip';
      const templateId = 'template_xkda6m6';
      const publicKey = 'GJUTRUBg4x1CvjrQM';
      if (serviceId === 'YOUR_SERVICE_ID' || templateId === 'YOUR_TEMPLATE_ID' || publicKey === 'YOUR_PUBLIC_KEY') {
        console.warn('EmailJS credentials missing. Please replace YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, and YOUR_PUBLIC_KEY in Contact.jsx.');
        setStatus('Configuration error: Please contact the administrator.');
        return;
      }
      emailjs.sendForm(serviceId, templateId, formRef.current, publicKey).then(
        () => {
          setStatus('Message sent successfully!');
          formRef.current.reset();
          gsap.to(formRef.current, {
            boxShadow: '0 0 30px rgba(77, 238, 234, 0.8)',
            duration: 0.5,
            yoyo: true,
            repeat: 1,
          });
          for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'flare-particle';
            particle.style.background = `linear-gradient(45deg, #4deeea, #ff00cc)`;
            const rect = formRef.current.getBoundingClientRect();
            particle.style.left = `${rect.left + Math.random() * rect.width}px`;
            particle.style.top = `${rect.top + Math.random() * rect.height}px`;
            document.body.appendChild(particle);
            gsap.to(particle, {
              x: (Math.random() - 0.5) * 200,
              y: (Math.random() - 0.5) * 200,
              opacity: 0,
              scale: Math.random() * 0.6 + 0.4,
              duration: 1.2,
              ease: 'power2.out',
              onComplete: () => particle.remove(),
            });
          }
        },
        (error) => {
          setStatus(`Failed to send message: ${error.text}`);
        }
      );
    } catch (e) {
      console.error('EmailJS Error:', e.message);
      setStatus('An error occurred. Please try again.');
    }
  };

  // Handle input focus animation
  const handleInputFocus = (e) => {
    gsap.to(e.target, {
      borderColor: '#ff00cc',
      boxShadow: '0 0 15px rgba(255, 0, 204, 0.8)',
      duration: 0.3,
    });
  };

  // Handle input blur animation
  const handleInputBlur = (e) => {
    gsap.to(e.target, {
      borderColor: '#4deeea',
      boxShadow: '0 0 0 rgba(255, 0, 204, 0)',
      duration: 0.3,
    });
  };

  // Handle input change with flare effects
  const handleInputChange = (e) => {
    if (Math.random() < 0.1) {
      const particle = document.createElement('div');
      particle.className = 'flare-particle';
      particle.style.background = '#4deeea';
      const rect = e.target.getBoundingClientRect();
      particle.style.left = `${rect.left + Math.random() * rect.width}px`;
      particle.style.top = `${rect.top + Math.random() * rect.height}px`;
      document.body.appendChild(particle);
      gsap.to(particle, {
        x: (Math.random() - 0.5) * 40,
        y: (Math.random() - 0.5) * 40,
        opacity: 0,
        scale: 0.3,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => particle.remove(),
      });
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

          /* Galaxy Effect */
          .galaxy-container {
            position: relative;
            width: 100%;
            max-width: 600px;
            height: 200px;
            margin-bottom: 2rem;
            perspective: 1000px;
            transform-style: preserve-3d;
          }

          .galaxy-core {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 60px;
            height: 60px;
            background: radial-gradient(circle, #333333 10%, #4deeea 40%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            box-shadow: 0 0 20px rgba(77, 238, 234, 0.8);
            animation: galaxy-pulse 3s ease-in-out infinite;
          }

          @keyframes galaxy-pulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
            50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
          }

          .galaxy-arms {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            animation: galaxy-rotate 20s linear infinite;
            will-change: transform;
          }

          @keyframes galaxy-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .galaxy-arm {
            stroke: url(#galaxy-gradient);
            stroke-width: 10;
            fill: none;
            opacity: 0.7;
          }

          .galaxy-star {
            position: absolute;
            border-radius: 50%;
            background: #ffd700;
            animation: star-twinkle 2s ease-in-out infinite;
            will-change: opacity, transform;
          }

          @keyframes star-twinkle {
            0%, 100% { opacity: 0.5; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.5); }
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
        id="contact"
        className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 sm:px-6 lg:px-8 py-12"
        style={{ background: '#000000' }}
        aria-labelledby="contact-title"
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

        {/* Galaxy Effect */}
        <div ref={galaxyRef} className="galaxy-container">
          <div className="galaxy-core" />
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
          <svg className="galaxy-arms" width="100%" height="100%" viewBox="0 0 400 400">
            <defs>
              <linearGradient id="galaxy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.8 }} />
                <stop offset="50%" style={{ stopColor: '#ff00cc', stopOpacity: 0.4 }} />
                <stop offset="100%" style={{ stopColor: '#ffd700', stopOpacity: 0.2 }} />
              </linearGradient>
            </defs>
            <path
              className="galaxy-arm"
              d="M200,200 c50,-50 100,-10 120,40 s10,100 -40,120 s-100,10 -120,-40 s-10,-100 40,-120"
            />
            <path
              className="galaxy-arm"
              d="M200,200 c-50,50 -100,10 -120,-40 s-10,-100 40,-120 s100,-10 120,40 s10,100 -40,120"
            />
            <path
              className="galaxy-arm"
              d="M200,200 c40,-40 80,-8 96,32 s8,80 -32,96 s-80,8 -96,-32 s-8,-80 32,-96"
              opacity="0.4"
            />
            {Array.from({ length: 15 }).map((_, i) => (
              <circle
                key={i}
                className="galaxy-star"
                cx={200 + Math.cos((i * 24 * Math.PI) / 180) * (50 + Math.random() * 120)}
                cy={200 + Math.sin((i * 24 * Math.PI) / 180) * (50 + Math.random() * 120)}
                r={Math.random() * 3 + 2}
                style={{ animationDelay: `${Math.random() * 2}s` }}
              />
            ))}
          </svg>
        </div>

        {/* Holographic Title */}
        <h2
          ref={titleRef}
          id="contact-title"
          className="text-3xl sm:text-4xl font-cosmic-bold mb-4 holographic-title floating-text"
        >
          Contact Me
        </h2>

        <p className="text-lg sm:text-xl text-primary mb-8 max-w-2xl glow-text-cosmic">
          Reach out to collaborate on cosmic web projects or discuss innovative ideas.
        </p>

        <form
          ref={formRef}
          className="glass-card p-8 rounded-lg max-w-lg w-full relative shadow-cosmic-glow"
        >
          <div className="mb-6">
            <label htmlFor="name" className="sr-only">Your Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Your Name"
              className="w-full p-4 bg-transparent border-2 border-cyan rounded-lg text-primary focus:outline-none"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              required
              aria-label="Your Name"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="sr-only">Your Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Your Email"
              className="w-full p-4 bg-transparent border-2 border-cyan rounded-lg text-primary focus:outline-none"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              required
              aria-label="Your Email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="sr-only">Your Message</label>
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              className="w-full p-4 bg-transparent border-2 border-cyan rounded-lg text-primary focus:outline-none resize-none h-32"
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={handleInputChange}
              required
              aria-label="Your Message"
            ></textarea>
          </div>
          <button
            type="button"
            onClick={handleSendMessage}
            className="bg-transparent border-2 border-gold px-6 py-3 text-lg font-cosmic-bold text-accent w-full rounded-lg hover:bg-gold hover:text-black transition-all duration-300 shadow-cosmic-glow"
            aria-label="Send Message"
          >
            Send Message
          </button>
          {status && (
            <p className="mt-4 text-accent glow-text-cosmic" role="status">
              {status}
            </p>
          )}
        </form>
      </section>
    </ErrorBoundary>
  );
};

export default Contact;