import React from 'react';
import { NAV_LINKS } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark text-white border-t border-border-dark pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12 px-4 lg:px-8">
          {/* Brand & About */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <img src="/logo-green.png" alt="J.J Thai Spa Logo" className="h-8 w-8 object-contain" />
              <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
                J<span style={{ position: 'relative', top: '-0.15em' }}>.</span>J Thai Spa
              </h3>
            </div>
            <p className="text-white/70 leading-relaxed text-sm">
              Experience the ultimate relaxation and rejuvenation at J.J Thai Spa. Our expert therapists are dedicated to your wellness journey.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <span className="text-sm font-bold">IG</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <span className="text-sm font-bold">FB</span>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center transition-colors">
                <span className="text-sm font-bold">TW</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-accent">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-white/70 hover:text-primary transition-colors text-sm">
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a href="#" className="text-white/70 hover:text-primary transition-colors text-sm">
                  Gift Cards
                </a>
              </li>
              <li>
                <a href="/privacy-policy" className="text-white/70 hover:text-primary transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <button
                  onClick={() => (window as any).openCookieSettings?.()}
                  className="text-white/70 hover:text-primary transition-colors text-sm text-left"
                >
                  Cookie Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-serif text-lg font-bold mb-6 text-accent">Contact Us</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-0.5">location_on</span>
                <span className="text-white/70 text-sm leading-relaxed">
                  180 Winter St. Unit D<br />
                  Bridgewater, MA 02324
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">call</span>
                <a href="tel:+5088070141" className="text-white/70 hover:text-primary transition-colors text-sm">
                  (508) 807-0141
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">sms</span>
                <a href="sms:+8333752584" className="text-white/70 hover:text-primary transition-colors text-sm">
                  Text us: (833) 375-2584
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">mail</span>
                <a href="mailto:contact@jjthaispa.com" className="text-white/70 hover:text-primary transition-colors text-sm">
                  contact@jjthaispa.com
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <a
                href="https://app.squareup.com/appointments/book/kpgr4fsgm3uhjs/LXYE9K8E6NDSH/start"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full h-10 px-6 rounded bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors leading-10 text-center"
              >
                Book an Appointment
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 px-4 lg:px-8">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} JJ Thai Spa LLC. All rights reserved.
          </p>
          <div className="flex gap-6 flex-wrap justify-center md:justify-end">
            <a href="/policies" className="text-white/40 hover:text-white text-xs transition-colors">Terms of Service</a>
            <a href="/privacy-policy" className="text-white/40 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <button
              onClick={() => (window as any).openCookieSettings?.()}
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;