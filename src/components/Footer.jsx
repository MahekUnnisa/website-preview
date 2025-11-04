import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', path: '#features' },
      { label: 'Chrome Extension', path: 'https://chromewebstore.google.com', external: true },
    ],
    legal: [
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
    ],
  };


  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Brand Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <img 
                    src="/assets/icons/zeroAI.png" 
                    alt="ZeroAI Logo" 
                    className="w-10 h-10 rounded-lg"
                  />
                  <span className="text-xl font-bold text-foreground-primary">ZeroAI</span>
                </div>
            <p className="text-foreground-muted text-sm mb-4 max-w-xs">
              An AI assistant that helps developers manage their calendar, tasks, and notes. 
              Supercharge your workflow — you focus on building, we take care of the rest.
            </p>
            <div className="inline-flex items-center space-x-2 bg-purple-15 border border-border-colored rounded-full px-3 py-1.5">
              <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-purple-200 font-medium">Now in Open Beta</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-foreground-primary font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  {link.external ? (
                    <a
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-foreground-muted hover:text-foreground-primary text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      href={link.path}
                      className="text-foreground-muted hover:text-foreground-primary text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-foreground-primary font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-foreground-muted hover:text-foreground-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-center text-foreground-muted text-sm">
            © {currentYear} ZeroAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

