'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Frontrunning } from '@/components/Frontrunning';
import { Spotlight } from '@/components/Spotlight';
import { About } from '@/components/About';
import { BlogSection } from '@/components/BlogSection';
import { Milestones } from '@/components/Milestones';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const isScrolling = useRef(false);

  const handleScrollClick = () => {
    isScrolling.current = true;
    setScrollEnabled(true);
    setTimeout(() => {
      const nextSection = document.getElementById('frontrunning');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
      setTimeout(() => {
        isScrolling.current = false;
      }, 1000);
    }, 100);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return;

      // If scrolled back to top, re-lock scrolling
      if (window.scrollY < 100 && scrollEnabled) {
        setScrollEnabled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollEnabled]);

  return (
    <main className={`main ${!scrollEnabled ? 'main-scroll-locked' : ''}`}>
      <Header />
      <Hero onScrollClick={handleScrollClick} />
      <Frontrunning />
      <Spotlight />
      <About />
      <BlogSection />
      <Milestones />
      <Footer />
    </main>
  );
}
