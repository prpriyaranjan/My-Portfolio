import React, { useState, useEffect, useContext, useRef } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaTrash } from 'react-icons/fa';

const GalacticCore = () => {
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

  const lensingEffects = Array.from({ length: 3 }).map((_, i) => ({
    id: i,
    radius: 120 + i * 20,
    delay: i * 0.5,
  }));

  return (
    <div
      className="cosmic-galactic-container"
      style={{
        position: 'absolute',
        top: '2rem', // Moved approximately one inch higher
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        height: '400px',
        zIndex: 5,
      }}
    >
      <svg
        ref={sectionRef}
        width="400"
        height="400"
        viewBox="0 0 400 400"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'transparent',
          overflow: 'visible',
        }}
        aria-hidden="true"
      >
        {isVisible && (
          <>
            <motion.g transform="translate(200, 200)">
              <motion.circle
                cx="0"
                cy="0"
                r="50"
                fill="url(#galacticCoreGradient)"
                filter="url(#noise)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0.8, 1, 0.8], scale: [0.95, 1.05, 0.95] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ filter: 'drop-shadow(0 0 25px rgba(77, 238, 234, 0.9))' }}
              />
              <motion.circle
                cx="0"
                cy="0"
                r="60"
                fill="none"
                stroke="url(#coreHaloGradient)"
                strokeWidth="10"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 2.5, repeat: Infinity }}
                style={{ filter: 'blur(5px)' }}
              />
            </motion.g>

            {lensingEffects.map((effect) => (
              <motion.g key={effect.id} transform="translate(200, 200)">
                <motion.ellipse
                  cx="0"
                  cy="0"
                  rx={effect.radius}
                  ry={effect.radius * 0.7}
                  stroke="url(#lensingGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0.3, 0.5, 0], scale: [0.8, 1.2, 1.5] }}
                  transition={{ duration: 4, repeat: Infinity, delay: effect.delay }}
                  style={{ filter: 'drop-shadow(0 0 5px rgba(77, 238, 234, 0.5))' }}
                />
              </motion.g>
            ))}

            <defs>
              <radialGradient id="galacticCoreGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.9 }} />
                <stop offset="70%" style={{ stopColor: '#00bcd4', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.2 }} />
              </radialGradient>
              <radialGradient id="coreHaloGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style={{ stopColor: '#00bcd4', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#ffffff', stopOpacity: 0.1 }} />
              </radialGradient>
              <linearGradient id="lensingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#4deeea', stopOpacity: 0.5 }} />
                <stop offset="100%" style={{ stopColor: '#00bcd4', stopOpacity: 0.2 }} />
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

const Blog = () => {
  const { currentUser } = useContext(AuthContext) || { currentUser: null };
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const recentPosts = storedPosts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    setPosts(recentPosts);
  }, []);

  const handleDelete = (postId) => {
    const storedPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    const updatedPosts = storedPosts.filter((post) => post.id !== postId);
    localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3));

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.innerText = 'Blog post deleted successfully';
    document.body.appendChild(liveRegion);
    setTimeout(() => {
      if (liveRegion && liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    }, 5000);
  };

  return (
    <motion.section
      className="min-h-screen bg-[#000000] text-white py-16 flex flex-col items-center relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      id="blog"
      aria-labelledby="blog-heading"
      style={{ position: 'relative', paddingTop: '500px' }}
    >
      <style>
        {`
          .holographic-title {
            text-transform: uppercase;
            letter-spacing: 2px;
            background: linear-gradient(45deg, #4deeea, #00bcd4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5));
            animation: holographic-glow 2s infinite ease-in-out;
          }
          @keyframes holographic-glow {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(77, 238, 234, 0.5)); }
            50% { filter: drop-shadow(0 0 10px rgba(0, 188, 212, 0.7)); }
          }
          .glass-card {
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 10px rgba(77, 238, 234, 0.2);
          }
        `}
      </style>
      <GalacticCore />
      <div className="container mx-auto px-4 relative z-10">
        <h2 id="blog-heading" className="text-4xl font-bold text-center mb-12 holographic-title">
          Cosmic Blog
        </h2>
        {posts.length === 0 ? (
          <p className="text-center text-lg text-[#4deeea]">
            No blog posts yet. Be the first to write one!
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                className="glass-card p-6 rounded-lg relative"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-2xl font-bold text-[#4deeea] mb-2">{post.title}</h3>
                <p className="text-sm text-gray-300 mb-4">{new Date(post.date).toLocaleDateString()}</p>
                <p className="mb-4 text-white">{post.content}</p>
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label={`Delete post titled ${post.title}`}
                  >
                    <FaTrash />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default Blog;