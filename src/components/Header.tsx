'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { name: 'Hiring', href: '/hiring', hasDropdown: false },
  { name: 'Events', href: '/events', hasDropdown: true },
  { name: 'Communities', href: '/communities', hasDropdown: false },
  { name: 'Earn', href: '/earn', hasDropdown: false },
  { name: 'Blog', href: '/blog', hasDropdown: false },
  { name: 'Academy', href: '/academy', hasDropdown: false },
];

const eventsDropdownItems = [
  { name: 'Upcoming events', href: '/events/upcoming' },
  { name: 'Developer events', href: '/events/developer' },
  { name: 'Community Spaces', href: '/events/community-spaces' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight;
      setIsScrolled(window.scrollY > heroHeight - 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavItemClick = (item: typeof navItems[0]) => {
    if (item.hasDropdown) {
      setActiveDropdown(activeDropdown === item.name ? null : item.name);
    } else {
      setActiveDropdown(null);
    }
  };

  return (
    <header
      ref={headerRef}
      className={`header ${isScrolled ? 'header-scrolled' : ''} ${activeDropdown ? 'header-dropdown-open' : ''}`}
    >
      <div
        className={`header-wrapper ${activeDropdown ? 'header-wrapper-expanded' : ''}`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
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
                item.hasDropdown ? (
                  <button
                    key={item.name}
                    className={`nav-link ${activeDropdown === item.name ? 'nav-link-active' : ''}`}
                    onClick={() => handleNavItemClick(item)}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="nav-link"
                    onClick={() => setActiveDropdown(null)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* CTA Button */}
            <div className="header-cta-wrapper">
              <Link href="/sui-hub" className="btn-sui-hub">
                <span>Sui Hub</span>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
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
        </nav>

        {/* Events Dropdown Panel */}
        {activeDropdown === 'Events' && (
          <div className="header-dropdown" ref={dropdownRef}>
            <div className="dropdown-content">
              <div className="dropdown-section">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Events</h3>
                </div>
                <div className="dropdown-links">
                  {eventsDropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="dropdown-link"
                      onClick={() => setActiveDropdown(null)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-menu-items">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/sui-hub" className="btn-sui-hub" style={{ width: 'fit-content', marginTop: 16 }}>
              <span>Sui Hub</span>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
