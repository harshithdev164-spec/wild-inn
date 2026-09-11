import { Link } from 'react-router-dom';
import { Instagram } from 'lucide-react';
import logoUrl from '../assets/logo.webp';

export default function Footer() {
  const scrolltoTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'About', path: '/about' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <footer id="global-footer" className="bg-black w-full pt-6">
      {/* Centered Inset Card Footer */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          style={{ 
            backgroundImage: "url('/img/pexels-uday-kiran-38711535-8509294.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center 30%"
          }}
          className="relative overflow-hidden text-[#FAF7F2] rounded-[2.5rem] p-10 sm:p-12 lg:p-16 border border-white/10 shadow-xl"
        >
          {/* Subtle low-opacity dark overlay to ensure maximum text readability */}
          <div className="absolute inset-0 bg-black/25 z-0 pointer-events-none" />
          
          {/* Main Footer Content */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
            
            {/* Left Brand Column */}
            <div className="md:col-span-6 space-y-6">
              <Link id="footer-logo" to="/" className="flex items-center gap-4 group" onClick={scrolltoTop}>
                <img
                  src={logoUrl}
                  alt="Wild Inn Logo"
                  className="w-12 h-12 rounded-full object-cover border border-white/10 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="font-sans text-[32px] sm:text-[40px] font-normal tracking-tight text-white leading-none">
                  Wild Inn.
                </span>
              </Link>
              <div className="h-[1px] w-12 bg-white/20" />
              <p className="text-white/70 text-xs sm:text-sm font-sans max-w-sm leading-relaxed">
                Discover the beauty of the wild through journeys that stay in your stories. Guided safaris, sunset viewing, stargazing, and private treks led by certified guides.
              </p>
            </div>

            {/* Right Links Columns */}
            <div className="md:col-span-6 grid grid-cols-2 gap-8 md:gap-12 md:justify-items-end">
              
              {/* Navigation Links Column */}
              <div className="space-y-4">
                <span className="text-white/40 text-xs sm:text-[13px] font-sans uppercase tracking-wider block font-medium">
                  Navigation
                </span>
                <ul className="space-y-2">
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        id={`footer-nav-link-${link.name.toLowerCase()}`}
                        to={link.path}
                        onClick={scrolltoTop}
                        className="text-white text-base sm:text-lg hover:text-white/85 transition-colors font-sans block font-normal"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact & Social Column */}
              <div className="space-y-4 text-left md:text-left min-w-[160px]">
                <span className="text-white/40 text-xs sm:text-[13px] font-sans uppercase tracking-wider block font-medium">
                  Contact
                </span>
                <ul className="space-y-3">
                  <li>
                    <span className="block text-[11px] text-white/40 font-sans uppercase">Phone</span>
                    <a
                      href="tel:+918525911685"
                      className="text-white text-[14px] sm:text-[15px] hover:text-white/85 transition-colors font-sans font-normal block"
                    >
                      +91 8525911685
                    </a>
                    <a
                      href="tel:+918660774511"
                      className="text-white/60 text-[12px] sm:text-[13px] hover:text-white/85 transition-colors font-sans font-normal block mt-0.5"
                    >
                      +91 8660774511
                    </a>
                  </li>
                  <li>
                    <span className="block text-[11px] text-white/40 font-sans uppercase">Email</span>
                    <a
                      href="mailto:support@wildinn.com"
                      className="text-white text-[14px] sm:text-[15px] hover:text-white/85 transition-colors font-sans font-normal break-all"
                    >
                      support@wildinn.com
                    </a>
                  </li>
                  <li className="pt-2">
                    <a
                      id="footer-social-instagram"
                      href="https://www.instagram.com/wild.inn_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors font-sans font-medium text-sm bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full hover:bg-white/10"
                    >
                      <Instagram className="w-4 h-4 text-white" />
                      <span>Instagram</span>
                    </a>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>

        {/* Outer Page-level Copyright and Legal Info Bottom Bar */}
        <div className="py-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans text-white/60">
          <div>
            © 2026 Wild Inn. All rights reserved.
          </div>
        </div>

      </div>
    </footer>
  );
}
