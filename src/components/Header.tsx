import React, { useEffect, useState } from 'react';
import { NAV_LINKS } from '../constants';

// URLs for the logo images
// These files are now in the public directory
const LOGO_WHITE = "/logo-white.png";
const LOGO_COLORED = "/logo-gold.png";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerClass = isScrolled
    ? 'bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm shadow-md'
    : 'bg-transparent shadow-none';

  const textClass = isScrolled
    ? 'text-text-light dark:text-text-dark'
    : 'text-white';

  // Determine which logo to show based on scroll state
  const logoSrc = isScrolled ? LOGO_COLORED : LOGO_WHITE;

  const navLinkClass = isScrolled
    ? 'text-text-light dark:text-text-dark hover:text-accent dark:hover:text-accent'
    : 'text-white/90 hover:text-white';

  const activeLinkClass = isScrolled
    ? 'text-accent dark:text-accent'
    : 'text-white';

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${headerClass}`}>
      <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <img
            src={logoSrc}
            alt="J.J Thai Spa Logo"
            className="h-12 w-auto object-contain transition-opacity duration-300"
          />
          <h2 className={`font-serif text-xl font-bold tracking-tight header-title ${textClass}`}>
            J<span style={{ position: 'relative', top: '-0.15em' }}>.</span>J Thai Spa
          </h2>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              className={`text-sm font-medium leading-normal transition-colors nav-link ${link.label === 'Reviews' ? `font-bold ${activeLinkClass}` : navLinkClass}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="flex min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-5 bg-primary hover:bg-primary/90 text-white text-sm font-bold leading-normal tracking-wide transition-colors">
            <span className="truncate">Book Now</span>
          </button>
          <button
            className={`md:hidden menu-button ${textClass}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown (Simple implementation) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background-light dark:bg-background-dark border-b border-border-light dark:border-border-dark p-4 shadow-lg flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              className="text-base font-medium text-text-light dark:text-text-dark hover:text-accent"
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;