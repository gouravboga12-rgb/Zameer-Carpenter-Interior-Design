import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, Phone } from 'lucide-react';
import { COMPANY_INFO } from '../../data/companyInfo';
import MobileDrawer from './MobileDrawer';

export const HEADER_NAV_LINKS = [
  { name: 'HOME', path: '/' },
  { name: 'ABOUT US', path: '/about' },
  { name: 'SERVICES', path: '/services' },
  { name: 'RECENT PROJECTS', path: '/projects' },
  { name: 'CONTACT', path: '/contact' }
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md py-3 shadow-md border-b border-luxury-border/60'
            : 'bg-[#FDFBF7]/90 backdrop-blur-sm py-4 border-b border-black/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group focus:outline-none"
            >
              <img
                src="/logo.png"
                alt={COMPANY_INFO.name}
                className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)] transition-transform duration-300 group-hover:scale-105"
              />
            </Link>

            {/* Desktop Navigation Links (Center) */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {HEADER_NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative text-xs font-bold tracking-[0.18em] uppercase transition-colors duration-200 py-1 font-heading ${
                      isActive
                        ? 'text-luxury-gold-dark font-extrabold'
                        : 'text-luxury-walnut/80 hover:text-luxury-gold-dark'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-luxury-gold rounded-full" />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Header Right: BOOK NOW Button */}
            <div className="hidden sm:flex items-center space-x-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-2.5 rounded bg-luxury-walnut hover:bg-luxury-charcoal text-luxury-gold border border-luxury-gold/80 hover:border-luxury-gold text-xs font-bold uppercase tracking-[0.18em] shadow-sm hover:shadow-gold-glow transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>BOOK NOW</span>
              </Link>
            </div>

            {/* Mobile Hamburger Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-lg bg-luxury-surface text-luxury-walnut hover:bg-luxury-border border border-luxury-border focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Slide-over Drawer */}
      <MobileDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={HEADER_NAV_LINKS}
      />
    </>
  );
}
