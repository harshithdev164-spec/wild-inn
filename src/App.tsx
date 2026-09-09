import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileTabBar from './components/MobileTabBar';
import logoUrl from './assets/logo.webp';


const Home = lazy(() => import('./pages/Home'));
const Tours = lazy(() => import('./pages/Tours'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const About = lazy(() => import('./pages/About'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const Reels = lazy(() => import('./pages/Reels'));
const Admin = lazy(() => import('./pages/Admin'));

// Scroll To Top component to fix standard SPA navigation scroll retention issues
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant' // Instant scroll on page transition for clean UX
    });
  }, [pathname]);

  return null;
}

export default function App() {
  const [isSiteLoading, setIsSiteLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Custom fine-grained progress counter for the premium luxury feel
    let interval: NodeJS.Timeout;
    const duration = 2000; // Elegant 2 seconds load time
    const step = 20;
    const increment = 100 / (duration / step);

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSiteLoading(false);
          }, 450); // Small pause at 100% for smooth pacing
          return 100;
        }
        // Organic progress steps with subtle natural pauses
        const randomBonus = Math.random() > 0.75 ? Math.random() * 6 : 0;
        return Math.min(100, Math.round(prev + increment + randomBonus));
      });
    }, step);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isSiteLoading && (
          <motion.div
            key="loader"
            initial={{ y: 0 }}
            exit={{ 
              y: "-100%", 
              transition: { duration: 1.1, ease: [0.85, 0, 0.15, 1] } 
            }}
            className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex flex-col items-center justify-center select-none overflow-hidden"
          >
            {/* Soft Ambient Gold Glow in the background */}
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.15 }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,_rgba(211,158,130,0.12)_0%,_transparent_70%)] pointer-events-none filter blur-3xl"
            />

            <div className="relative flex flex-col items-center">
              {/* Logo Container with custom scale in and slide */}
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ y: -30, opacity: 0, transition: { duration: 0.6, ease: "easeIn" } }}
                transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-28 h-28 rounded-full overflow-hidden border border-[#D39E82]/20 shadow-2xl shadow-[#D39E82]/5 bg-white flex items-center justify-center p-0.5 z-10"
              >
                <img
                  src={logoUrl}
                  alt="Wild Inn Loader Logo"
                  className="w-full h-full rounded-full object-cover"
                />
              </motion.div>

              {/* Typography Group */}
              <div className="mt-10 flex flex-col items-center text-center z-10">
                {/* Brand Name */}
                <motion.h1
                  initial={{ opacity: 0, letterSpacing: "0.2em", y: 10 }}
                  animate={{ opacity: 1, letterSpacing: "0.5em", y: 0 }}
                  exit={{ y: -20, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
                  transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans text-2xl font-light text-white uppercase ml-[0.5em]"
                >
                  Wild Inn
                </motion.h1>

                {/* Micro thin gold divider line */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "160px" }}
                  transition={{ delay: 0.8, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-[1px] bg-[#D39E82]/30 my-4"
                />

                {/* Tagline: "A story worth telling." */}
                <motion.p
                  initial={{ opacity: 0, y: 10, letterSpacing: "0.1em" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.25em" }}
                  exit={{ y: -10, opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
                  transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="font-sans text-[11px] font-medium text-[#D39E82]/80 uppercase ml-[0.25em]"
                >
                  A story worth telling.
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollToTop />
      <div id="app-root-shell" className="min-h-screen bg-black text-white flex flex-col selection:bg-terracotta selection:text-white pb-24 md:pb-0">
        {/* Sticky Global Navigation */}
        <Navbar />
        {/* Mobile bottom tab bar (replaces the hamburger menu) */}
        <MobileTabBar />

        {/* Dynamic Route Pages */}
        <main className="flex-grow pt-0">
          <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/experiences" element={<Tours />} />
              <Route path="/experiences/:slug" element={<TourDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/reels" element={<Reels />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Catch-all route to redirect back to Home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </main>

        {/* Global Landscape Footer */}
        <Footer />
      </div>
    </Router>
  );
}
