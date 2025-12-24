'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const navItems = [
  { name: 'Hiring', href: '/hiring', active: false },
  { name: 'Events', href: '/events', active: false },
  { name: 'Communities', href: '/communities', active: false },
  { name: 'Earn', href: '/earn', active: false },
  { name: 'Blog', href: '/blog', active: false },
  { name: 'Academy', href: '/academy', active: false },
  { name: 'Sui Hub', href: '/sui-hub', active: false },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <nav className="header-nav">
        <div className="header-content">
          {/* Logo */}
          <Link href="/" className="header-logo">
            <Image
              src="/images/logos/sui-ng-logo.png"
              alt="Sui NG"
              width={40}
              height={40}
              className="header-logo-image"
            />
            <span className="header-logo-text">Sui NG</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="header-desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="header-cta-wrapper">
            <button className="btn-primary">
              SuiHub
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg style={{ width: 24, height: 24 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-items">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${item.active ? 'nav-link-active' : ''}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <button className="btn-primary" style={{ width: 'fit-content', marginTop: 16 }}>
                SuiHub
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
