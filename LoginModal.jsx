import React, { useState, useContext, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext.jsx';
import { FaTimes } from 'react-icons/fa';

const LoginModal = ({ isOpen, onClose }) => {
  const { login, register, resetCredentials } = useContext(AuthContext) || {
    login: () => Promise.reject('AuthContext not available'),
    register: () => Promise.reject('AuthContext not available'),
    resetCredentials: () => Promise.reject('AuthContext not available'),
  };
  const [mode, setMode] = useState('login'); // 'login', 'register', 'reset'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus modal and trap focus
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
      firstInputRef.current?.focus();
      console.log('Modal opened, mode:', mode);

      const handleKeyDown = (e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'Tab') {
          const focusable = modalRef.current.querySelectorAll('input, button, [tabindex]');
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, mode, onClose]);

  // Clear form on mode change
  useEffect(() => {
    setUsername('');
    setPassword('');
    setEmail('');
    setNewUsername('');
    setNewPassword('');
    setError('');
    setSuccess('');
    console.log('Mode changed to:', mode);
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    console.log('Form submitted:', { mode, username, email, password, newUsername, newPassword });
    try {
      if (mode === 'login') {
        await login(username, password);
        setSuccess('Logged in successfully');
        setTimeout(onClose, 3000);
      } else if (mode === 'register') {
        await register(username, password, email);
        setSuccess('Registered successfully');
        await login(username, password);
        setTimeout(onClose, 3000);
      } else if (mode === 'reset') {
        await resetCredentials(email, newUsername || undefined, newPassword || undefined);
        setSuccess('Credentials reset successfully');
        setMode('login');
      }
    } catch (err) {
      setError(err.message || 'An error occurred');
      console.error(`Error in ${mode}:`, err);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-heading"
    >
      <motion.div
        className="modal-content glass-card"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="auth-modal-heading" className="text-2xl font-bold text-accent holographic-title">
            {mode === 'login' ? 'Login' : mode === 'register' ? 'Register' : 'Reset Credentials'}
          </h2>
          <button
            onClick={onClose}
            className="text-secondary-accent hover:text-white"
            aria-label="Close modal"
          >
            <FaTimes size={20} />
          </button>
        </div>
        {(error || success) && (
          <motion.p
            className={`text-center mb-4 p-2 rounded ${error ? 'bg-red-900 text-red-300' : 'bg-accent/30 text-accent'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            role={error ? 'alert' : 'status'}
            aria-live="assertive"
          >
            {error || success}
          </motion.p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode !== 'reset' && (
            <div>
              <label htmlFor="username" className="block text-accent mb-1 font-medium">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] text-white border border-accent rounded focus:ring-2 focus:ring-secondary-accent"
                placeholder="Enter username"
                required
                maxLength={50}
                ref={mode !== 'reset' ? firstInputRef : null}
                aria-required="true"
              />
            </div>
          )}
          {mode === 'register' && (
            <div>
              <label htmlFor="email" className="block text-accent mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] text-white border border-accent rounded focus:ring-2 focus:ring-secondary-accent"
                placeholder="Enter email"
                required
                maxLength={100}
                aria-required="true"
              />
            </div>
          )}
          {mode !== 'reset' && (
            <div>
              <label htmlFor="password" className="block text-accent mb-1 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 bg-[#1a1a1a] text-white border border-accent rounded focus:ring-2 focus:ring-secondary-accent"
                placeholder="Enter password"
                required
                maxLength={50}
                aria-required="true"
              />
            </div>
          )}
          {mode === 'reset' && (
            <>
              <div>
                <label htmlFor="reset-email" className="block text-accent mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 bg-[#1a1a1a] text-white border border-accent rounded focus:ring-2 focus:ring-secondary-accent"
                  placeholder="Enter your email"
                  required
                  maxLength={100}
                  ref={mode === 'reset' ? firstInputRef : null}
                  aria-required="true"
                />
              </div>
              <div>
                <label htmlFor="new-username" className="block text-accent mb-1 font-medium">
                  New Username (optional)
                </label>
                <input
                  type="text"
                  id="new-username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full p-2 bg-[#1a1a1a] text-white border border-accent rounded focus:ring-2 focus:ring-secondary-accent"
                  placeholder="Enter new username"
                  maxLength={50}
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-accent mb-1 font-medium">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  id="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 bg-[#1a1a1a] text-white border border-accent rounded focus:ring-2 focus:ring-secondary-accent"
                  placeholder="Enter new password"
                  maxLength={50}
                />
              </div>
            </>
          )}
          <motion.button
            type="submit"
            className="w-full py-2 bg-accent text-black rounded hover:bg-secondary-accent hover:text-white nebula-glow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={
              mode === 'reset'
                ? !email || (!newUsername && !newPassword)
                : mode === 'register'
                ? !username || !password || !email
                : !username || !password
            }
            aria-label={mode === 'login' ? 'Log in' : mode === 'register' ? 'Register' : 'Reset Credentials'}
          >
            {mode === 'login' ? 'Log In' : mode === 'register' ? 'Register' : 'Reset'}
          </motion.button>
        </form>
        <div className="mt-4 text-center space-y-2">
          {mode !== 'reset' && (
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-accent hover:text-secondary-accent underline"
              aria-label={mode === 'login' ? 'Switch to register' : 'Switch to login'}
            >
              {mode === 'login' ? 'Need an account? Register' : 'Have an account? Log in'}
            </button>
          )}
          {mode !== 'reset' && (
            <button
              onClick={() => setMode('reset')}
              className="block text-accent hover:text-secondary-accent underline"
              aria-label="Forgot username or password"
            >
              Forgot Username/Password?
            </button>
          )}
          {mode === 'reset' && (
            <button
              onClick={() => setMode('login')}
              className="text-accent hover:text-secondary-accent underline"
              aria-label="Back to login"
            >
              Back to Login
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginModal;