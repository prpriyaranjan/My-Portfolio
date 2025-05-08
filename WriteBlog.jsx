import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { Navigate } from 'react-router-dom';

const WriteBlog = () => {
  const { isAuthenticated, currentUser } = useContext(AuthContext) || { isAuthenticated: false, currentUser: null };
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    const newPost = {
      id: Date.now(),
      title,
      content,
      date: new Date().toISOString(),
      author: currentUser?.username || 'Anonymous',
    };

    const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
    localStorage.setItem('blogPosts', JSON.stringify([...existingPosts, newPost]));

    setTitle('');
    setContent('');
    setError('');

    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('role', 'status');
    liveRegion.style.position = 'absolute';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    liveRegion.style.clip = 'rect(0, 0, 0, 0)';
    liveRegion.innerText = 'Blog post created successfully';
    document.body.appendChild(liveRegion);
    setTimeout(() => {
      if (liveRegion && liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion);
      }
    }, 5000);
  };

  return (
    <motion.section
      className="min-h-screen flex items-center justify-center bg-[#000000] text-white py-16"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      id="write-blog"
      aria-labelledby="write-blog-heading"
    >
      <div className="container mx-auto px-4">
        <h2
          id="write-blog-heading"
          className="text-4xl font-bold text-center mb-8 holographic-title"
        >
          Write a Cosmic Blog Post
        </h2>
        <motion.div
          className="max-w-2xl mx-auto glass-card p-8 rounded-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          {error && (
            <motion.p
              className="text-red-400 mb-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              role="alert"
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-lg font-medium text-[#4deeea] mb-2"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-[#1a1a1a] text-white border border-[#4deeea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff00cc] transition-all duration-300"
                placeholder="Enter blog title"
                aria-required="true"
                maxLength={100}
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-lg font-medium text-[#4deeea] mb-2"
              >
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-[#1a1a1a] text-white border border-[#4deeea] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff00cc] transition-all duration-300"
                placeholder="Write your blog content..."
                rows={10}
                aria-required="true"
                maxLength={5000}
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-3 bg-[#4deeea] text-black font-bold rounded-lg hover:bg-[#ff00cc] hover:text-white transition-all duration-300 nebula-glow"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Submit blog post"
            >
              Publish Post
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default WriteBlog;