import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getChromeWebStoreUrl } from '../lib/env';

const chromeWebStoreUrl = getChromeWebStoreUrl();

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/#features', label: 'Features' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/assets/icons/icon.png"
              alt="DevBot Logo" 
              className="h-5 w-auto"
            />
            <img 
              src="/assets/icons/logo.png"
              alt="ZeroAI Logo" 
              className="h-5 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-foreground-muted hover:text-foreground-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={chromeWebStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Add to Chrome
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-background-tertiary transition-colors"
            aria-label="Toggle navigation menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6 text-foreground-primary"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="text-sm font-medium text-foreground-muted hover:text-foreground-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={chromeWebStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Add to Chrome
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

