'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const navItems = [
  { name: 'Hiring', href: '/hiring', hasDropdown: true },
  { name: 'Events', href: '/events', hasDropdown: true },
  { name: 'Communities', href: '/communities', hasDropdown: false },
  { name: 'Earn', href: '/earn', hasDropdown: false },
  { name: 'Blog', href: '/blog', hasDropdown: true },
  { name: 'Academy', href: '/academy', hasDropdown: false },
];

const hiringDropdownItems = [
  { name: 'Hire a freelancer', href: '/hiring/freelancers' },
  { name: 'Get a job', href: '/hiring/gigs' },
  { name: 'Applications', href: '/hiring/applications' },
];

const eventsDropdownItems = [
  { name: 'Upcoming events', href: '/events/upcoming' },
  { name: 'Developer events', href: '/events/developer' },
  { name: 'Community Spaces', href: '/events/community-spaces' },
];

const blogDropdownItems = [
  { name: 'Post a Blog', href: '/blog/post' },
  { name: 'Blog Posts', href: '/blog' },
  { name: 'Community', href: '/blog/community' },
  { name: 'Sui Foundation', href: 'https://blog.sui.io/' },
];

interface HeaderProps {
  showGreenBorder?: boolean;
  solidBackground?: boolean;
}

export function Header({ showGreenBorder = false, solidBackground = false }: HeaderProps) {
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
      className={`header ${isScrolled ? 'header-scrolled' : ''} ${activeDropdown ? 'header-dropdown-open' : ''} ${showGreenBorder ? 'header-green-border' : ''} ${solidBackground ? 'header-solid-bg' : ''}`}
    >
      <div
        className={`header-wrapper ${activeDropdown ? 'header-wrapper-expanded' : ''}`}
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
                    {...(item.name === 'Academy' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {item.name}
                  </Link>
                )
              ))}
            </div>

            {/* CTA Button and Profile */}
            <div className="header-cta-wrapper">
              <Link href="/profile" className="btn-profile">
                <Image
                  src="/images/community/bg-2.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="profile-avatar"
                />
              </Link>
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
              aria-label="Toggle menu"
            >
              <svg className="icon-md" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Hiring Dropdown Panel */}
        {activeDropdown === 'Hiring' && (
          <div className="header-dropdown" ref={dropdownRef}>
            <div className="dropdown-content">
              <div className="dropdown-section">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Hiring</h3>
                </div>
                <div className="dropdown-links">
                  {hiringDropdownItems.map((item) => (
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

        {/* Blog Dropdown Panel */}
        {activeDropdown === 'Blog' && (
          <div className="header-dropdown" ref={dropdownRef}>
            <div className="dropdown-content">
              <div className="dropdown-section">
                <div className="dropdown-header">
                  <h3 className="dropdown-title">Blog</h3>
                </div>
                <div className="dropdown-links">
                  {blogDropdownItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="dropdown-link"
                      onClick={() => setActiveDropdown(null)}
                      {...(item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
                {...(item.name === 'Academy' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                {item.name}
              </Link>
            ))}
            <div className="mobile-profile-wrapper">
              <Link href="/profile" className="btn-profile">
                <Image
                  src="/images/community/bg-2.png"
                  alt="Profile"
                  width={40}
                  height={40}
                  className="profile-avatar"
                />
              </Link>
              <Link href="/sui-hub" className="btn-sui-hub btn-fit">
                <span>Sui Hub</span>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
