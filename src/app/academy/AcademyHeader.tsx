'use client';

import { useState, useEffect } from 'react';
import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';

const navLinks = [
  { label: 'Paths', href: '#paths' },
  { label: 'Courses', href: '#courses' },
  { label: 'Community Forum', href: '/academy/forum' },
];

function addressToColor(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#EAFF7E', '#97F0E5', '#b8b4f8', '#E4CDFB', '#60a5fa',
    '#fbbf24', '#f472b6', '#34d399', '#f87171', '#a78bfa',
    '#fb923c', '#38bdf8', '#4ade80', '#e879f9', '#facc15',
  ];
  return colors[Math.abs(hash) % colors.length];
}

function addressToInitials(address: string): string {
  if (address.length >= 4) {
    return address.slice(2, 4).toUpperCase();
  }
  return '??';
}

function truncateAddress(address: string): string {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function AcademyHeader() {
  const account = useCurrentAccount();
  const client = useSuiClient();
  const [suinsName, setSuinsName] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('profile-image');
    if (saved) setProfileImage(saved);
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'profile-image') setProfileImage(e.newValue);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!account?.address) { setSuinsName(null); return; }
    client.resolveNameServiceNames({ address: account.address, limit: 1 })
      .then((res) => {
        if (res.data && res.data.length > 0) setSuinsName(res.data[0]);
        else setSuinsName(null);
      })
      .catch(() => {});
  }, [account?.address, client]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className={`academy-header ${isScrolled ? 'academy-header--scrolled' : ''}`}>
      <div className="academy-header-inner">
        {/* Logo */}
        <a href="/academy" className="academy-header-logo">
          <span className="academy-header-logo-seal">CUTTLEFISH</span>
        </a>

        {/* Center nav — desktop */}
        <nav className="academy-header-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="academy-header-nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Wallet — desktop */}
        <div className="academy-header-wallet">
          {account ? (
            <a
              href="/academy/profile"
              className="academy-header-account"
              title="Profile"
            >
              {profileImage ? (
                <img src={profileImage} alt="" className="academy-header-pfp" style={{ objectFit: 'cover' }} />
              ) : (
                <span
                  className="academy-header-pfp"
                  style={{ background: addressToColor(account.address) }}
                >
                  {addressToInitials(account.address)}
                </span>
              )}
              <span className="academy-header-name">
                {suinsName || truncateAddress(account.address)}
              </span>
            </a>
          ) : (
            <ConnectButton />
          )}
        </div>

        {/* Hamburger — mobile */}
        <button
          className="academy-header-hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="academy-header-mobile">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="academy-header-mobile-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="academy-header-mobile-wallet">
            {account ? (
              <a
                href="/academy/profile"
                className="academy-header-account"
                title="Profile"
              >
                {profileImage ? (
                  <img src={profileImage} alt="" className="academy-header-pfp" style={{ objectFit: 'cover' }} />
                ) : (
                  <span
                    className="academy-header-pfp"
                    style={{ background: addressToColor(account.address) }}
                  >
                    {addressToInitials(account.address)}
                  </span>
                )}
                <span className="academy-header-name">
                  {account.label || suinsName || truncateAddress(account.address)}
                </span>
              </a>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
