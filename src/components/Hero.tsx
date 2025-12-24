'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

interface HeroProps {
  onScrollClick?: () => void;
}

export function Hero({ onScrollClick }: HeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setScrollProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(false);
          // Small delay to reset animation
          setTimeout(() => setIsVisible(true), 50);
        }
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsDragging(true);
  };

  return (
    <section className="hero" ref={heroRef}>
      {/* Background Image */}
      <div className="hero-bg-wrapper">
        <Image
          src="/images/backgrounds/hero-bg.png"
          alt="Lagos Bridge at Sunset"
          fill
          className="hero-bg-image"
          priority
        />
        {/* Gradient overlay at bottom only */}
        <div className="hero-gradient-overlay" />
      </div>

      {/* Main Content Container */}
      <div className="hero-content">
        {/* Welcome to - Top Left */}
        <div className={`hero-welcome ${isVisible ? 'animate-slide-left' : ''}`}>
          <h2 className="hero-welcome-text">
            <span className="hero-welcome-green">Welcome </span>
            <span className="hero-welcome-white">to</span>
          </h2>
        </div>

        {/* Sui NIGERIA - Large title */}
        <div className={`hero-title-wrapper ${isVisible ? 'animate-slide-right' : ''}`}>
          <h1 className="hero-title">
            <span className="hero-title-sui">Sui </span>
            <span className="hero-title-nigeria">NIGERIA</span>
          </h1>
        </div>

        {/* Right side - Move-ing with Sui + Nexa */}
        <div className="hero-right-text">
          <p className="hero-tagline">&lt;Move-ing with Sui&gt;</p>
          <p className="hero-nexa">Nexa</p>
        </div>

        {/* Floating text labels */}
        <div className="floating-text" style={{ bottom: '45%', left: '5%' }}>Mirai is a degen</div>
        <div className="floating-text" style={{ bottom: '40%', left: '5%' }}>Pay with flux pay</div>
        <div className="floating-text" style={{ bottom: '45%', left: '45%' }}>Fetching data</div>
        <div className="floating-text" style={{ bottom: '40%', left: '45%' }}>Linq it</div>
        <div className="floating-text" style={{ bottom: '45%', right: '20%' }}>Walrus protocol</div>
        <div className="floating-text" style={{ bottom: '18%', right: '30%' }}>i am Robot</div>
        <div className="floating-text" style={{ bottom: '14%', right: '28%' }}>Ika chan is cute</div>

        {/* Bottom Left - Rewriting what's Possible */}
        <div className="hero-bottom-left">
          <h3 className="hero-rewriting-title">
            Rewriting<br />what&apos;s Possible
          </h3>
          <p className="hero-description">
            Community run page dedicated to the advancement and adoption of Sui in Nigeria and Africa.
          </p>
          <button className="btn-primary">
            Join Our Community
            <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>

        {/* Bottom Right - Page Progress */}
        <div
          ref={dragRef}
          className="hero-progress-card"
          onMouseDown={handleMouseDown}
          style={{
            ...(position.x !== 0 || position.y !== 0
              ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' }
              : {}),
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        >
          <div className="progress-header">
            <span className="progress-title">PAGE PROGRESS</span>
            <svg className="progress-check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="progress-info">
            <span>Completed</span>
            <span>{scrollProgress}%</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${scrollProgress}%` }} />
          </div>
        </div>

        {/* Scroll indicator - Green chevron */}
        <button className="scroll-button" onClick={onScrollClick}>
          <Image
            src="/images/icons/see-more.svg"
            alt="Scroll down"
            width={36}
            height={51}
            className="scroll-icon"
          />
        </button>
      </div>
    </section>
  );
}
