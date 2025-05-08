import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const achievements = [
  {
    title: 'Outstanding Developer Award',
    description: 'Received the 2024 Outstanding Developer Award for innovative contributions to open-source projects.',
    date: 'May 2024',
  },
  {
    title: 'Certified React Expert',
    description: 'Earned certification from Frontend Masters for advanced React and JavaScript proficiency.',
    date: 'March 2024',
  },
  {
    title: 'Hackathon Champion',
    description: 'Led a team to victory in the 2023 Global Hackathon, building a sustainable tech solution.',
    date: 'November 2023',
  },
  {
    title: '100k Portfolio Views',
    description: 'Cosmic Portfolio reached 100,000 views, showcasing global impact.',
    date: 'January 2025',
  },
];

const PulsarCore = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const shootingDust = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    angle: Math.random() * 360,
    speed: Math.random() * 150 + 100, // Increased distance for dust particles
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2,
  }));

  const gasJets = Array.from({ length: 4 }).map((_, i) => ({
    id: i,
    angle: i * 90 + 45, // Positioned at 45-degree intervals
    length: 120,
    delay: Math.random() * 1.5,
  }));

  return (
    <div
      className="cosmic-pulsar-container"
      style={{
        position: 'relative',
        width: '400px', // Increased size of the container
        height: '400px',
        marginBottom: '2rem',
      }}
    >
      <svg
        ref={sectionRef}
        width="400"
        height="400"
        viewBox="0 0 400 400"
        style={{ position: 'absolute', top: 0, left: 0 }}
        aria-hidden="true"
      >
        {isVisible && (
          <>
            {/* Pulsar Core with Pulsating Glow */}
            <motion.g transform="translate(200, 200)">
              <motion.circle
                cx="0"
                cy="0"
                r="40" // Increased core size
                fill="url(#pulsarCoreGradient)"
                filter="url(#noise)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 20px rgba(77, 238, 234, 0.8))' }}
              />
            </motion.g>

            {/* Pulsar Beams */}
            <motion.g
              transform="translate(200, 200)"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="-120" // Adjusted for larger size
                stroke="url(#beamGradient)"
                strokeWidth="4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(77, 238, 234, 0.8)) blur(1px)' }}
              />
              <motion.line
                x1="0"
                y1="0"
                x2="0"
                y2="120"
                stroke="url(#beamGradient)"
                strokeWidth="4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                style={{ filter: 'drop-shadow(0 0 10px rgba(77, 238, 234, 0.8)) blur(1px)' }}
              />
            </motion.g>

            {/* Energy Rings */}
            <motion.g transform="translate(200, 200)">
              <motion.circle
                cx="0"
                cy="0"
                r="70" // Adjusted for larger size
                stroke="#ff00cc"
                strokeWidth="2"
                fill="none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 6px #ff00cc)' }}
              />
              <motion.circle
                cx="0"
                cy="0"
                r="80"
                stroke="#4deeea"
                strokeWidth="2"
                fill="none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.2, 0.4, 0.2], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                style={{ filter: 'drop-shadow(0 0 6px #4deeea)' }}
              />
            </motion.g>

            {/* Shooting Dust Effect */}
            {shootingDust.map((particle) => (
              <motion.g
                key={particle.id}
                transform={`translate(200, 200) rotate(${particle.angle})`}
              >
                <motion.circle
                  cx="0"
                  cy="0"
                  r={particle.size}
                  fill="#ffffff"
                  initial={{ opacity: 0, x: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    x: [0, particle.speed, particle.speed + 30], // Dust travels farther
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: particle.delay,
                    ease: 'easeOut',
                  }}
                  style={{ filter: 'blur(0.5px)' }}
                />
              </motion.g>
            ))}

            {/* Ejecting Gas Jets */}
            {gasJets.map((jet) => (
              <motion.g
                key={jet.id}
                transform={`translate(200, 200) rotate(${jet.angle})`}
              >
                <motion.path
                  d={`M 0 0 Q 30 ${jet.length / 2} 0 ${jet.length}`}
                  fill="none"
                  stroke="url(#gasGradient)"
                  strokeWidth="8"
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: [0.2, 0.5, 0.2], pathLength: [0, 1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: jet.delay,
                    ease: 'easeInOut',
                  }}
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255, 0, 204, 0.5)) blur(2px)' }}
                />
              </motion.g>
            ))}

            {/* Definitions for Gradients and Filters */}
            <defs>
              <radialGradient id="pulsarCoreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.9 }} />
                <stop offset="70%" style={{ stopColor: '#ff00cc', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
              </radialGradient>
              <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
              </linearGradient>
              <linearGradient id="gasGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#ff00cc', stopOpacity: 0.6 }} />
                <stop offset="100%" style={{ stopColor: '#4deeea', stopOpacity: 0.1 }} />
              </linearGradient>
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
                <feColorMatrix type="saturate" values="0.4" />
              </filter>
            </defs>
          </>
        )}
      </svg>
    </div>
  );
};

const Achievements = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  return (
    <section
      id="achievements"
      className="section relative flex flex-col items-center"
      style={{ background: 'black', overflow: 'hidden' }}
    >
      <PulsarCore />
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center holographic-title mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ color: '#ffffff', textShadow: '0 0 5px rgba(255, 0, 204, 0.5)' }}
          id="achievements-heading"
        >
          Achievements
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              className="glass-card p-6 flex flex-col justify-between"
              variants={cardVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 16px 60px rgba(255, 0, 204, 0.4), 0 0 20px rgba(77, 238, 234, 0.3)',
                transition: { duration: 0.3 },
              }}
              style={{
                background: 'rgba(20, 20, 20, 0.8)',
                border: '1px solid rgba(255, 0, 204, 0.2)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <div>
                <h3 className="text-xl font-bold text-accent mb-2" style={{ color: '#ff00cc' }}>
                  {achievement.title}
                </h3>
                <p className="text-primary mb-4" style={{ color: '#e0e0e0' }}>
                  {achievement.description}
                </p>
              </div>
              <p className="text-sm text-secondary-accent" style={{ color: '#4deeea' }}>
                {achievement.date}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Achievements;