import React, { Suspense, useCallback, useMemo, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';

// Lazy load components for Suspense-based code splitting
const App = React.lazy(() => import('./App.jsx'));
const Blog = React.lazy(() => import('./components/Blog.jsx'));
const WriteBlog = React.lazy(() => import('./components/WriteBlog.jsx'));

// Theme context to toggle between light and dark modes
export const ThemeContext = React.createContext();

const ThemeWrapper = ({ children }) => {
  const [themeMode, setThemeMode] = React.useState(() => {
    const savedTheme = localStorage.getItem('themeMode');
    return savedTheme ? savedTheme : 'dark'; // Default to dark for cosmic theme
  });

  // Persist theme to localStorage and apply to DOM
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.body.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prevMode) => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      // Announce theme change for accessibility
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('role', 'status');
      liveRegion.style.position = 'absolute';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.style.clip = 'rect(0, 0, 0, 0)';
      liveRegion.innerText = `Theme switched to ${newMode} mode`;
      document.body.appendChild(liveRegion);
      setTimeout(() => {
        if (liveRegion && liveRegion.parentNode) {
          liveRegion.parentNode.removeChild(liveRegion);
        }
      }, 10000); // Increased delay for accessibility
      return newMode;
    });
  }, []);

  const contextValue = useMemo(() => ({ themeMode, toggleTheme }), [themeMode, toggleTheme]);

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// Global Error Handler for Uncaught Errors
const handleGlobalError = (event) => {
  console.error('Uncaught Error:', event.error);
  // Placeholder for logging to a service
  // logErrorToService(event.error);
};

const handleUnhandledRejection = (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // Placeholder for logging to a service
  // logErrorToService(event.reason);
};

// Add global error listeners only once
const setupErrorListeners = () => {
  if (!window.__errorListenersSet) {
    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.__errorListenersSet = true;
  }
};

// Accessibility Announcement for App Load
const announceAppLoaded = () => {
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('role', 'status');
  liveRegion.setAttribute('id', 'app-load-announcement');
  liveRegion.style.position = 'absolute';
  liveRegion.style.width = '1px';
  liveRegion.style.height = '1px';
  liveRegion.style.overflow = 'hidden';
  liveRegion.style.clip = 'rect(0, 0, 0, 0)';
  liveRegion.innerText = 'Cosmic Portfolio App has loaded successfully';
  document.body.appendChild(liveRegion);

  setTimeout(() => {
    if (liveRegion && liveRegion.parentNode) {
      liveRegion.parentNode.removeChild(liveRegion);
    }
  }, 10000); // Increased delay for accessibility
};

// Fallback for App Load Failure
const AppLoadErrorFallback = () => (
  <div className="flex items-center justify-center h-screen bg-black text-white">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Failed to Load Cosmic Portfolio</h2>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-[#4deeea] text-black rounded-lg hover:bg-magenta hover:text-white transition-all duration-300"
        aria-label="Retry loading the app"
      >
        Retry
      </button>
    </div>
  </div>
);

// Loading Fallback Component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <div className="text-2xl font-bold text-[#4deeea] animate-pulse">
      Loading Cosmic Portfolio...
    </div>
  </div>
);

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Memoized render function to prevent multiple renders
const renderApp = () => {
  const startTime = performance.now();
  root.render(
    <ThemeWrapper>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <AppLoadErrorBoundary>
              <Routes>
                <Route path="/" element={<App />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/write-blog" element={<WriteBlog />} />
              </Routes>
            </AppLoadErrorBoundary>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeWrapper>
  );
  const endTime = performance.now();
  console.log(`Initial render took ${endTime - startTime}ms`);
};

// Simple Error Boundary for App Load Failure
const AppLoadErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    const errorHandler = (error) => {
      console.error('App Load Error:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    window.addEventListener('unhandledrejection', errorHandler);
    return () => {
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', errorHandler);
    };
  }, []);

  if (hasError) {
    return <AppLoadErrorFallback />;
  }

  return children;
};

// Render the app and set up listeners
setupErrorListeners();
renderApp();

window.addEventListener('load', () => {
  announceAppLoaded();
  const loadTime = performance.now();
  console.log(`Page fully loaded in ${loadTime}ms`);
});

// Cleanup global error listeners on app unload
window.addEventListener('beforeunload', () => {
  window.removeEventListener('error', handleGlobalError);
  window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  delete window.__errorListenersSet;
});