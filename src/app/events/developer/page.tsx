'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const upcomingDevEvents = [
  {
    id: 1,
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    title: 'CODE IN MOTION - MOVE 101',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    registerLink: '#',
  },
  {
    id: 2,
    dateRange: 'Oct 15 - Oct 16',
    time: '9:00 AM - 4:00 PM UTC+1',
    title: 'SMART CONTRACT WORKSHOP',
    location: 'Zone Tech Park, Gbagada, Lagos.',
    description: 'Learn to build and deploy smart contracts on Sui. Hands-on experience with Move language and best practices for secure contract development.',
    registerLink: '#',
  },
  {
    id: 3,
    dateRange: 'Nov 5 - Nov 7',
    time: '10:00 AM - 6:00 PM UTC+1',
    title: 'SUI HACKATHON NIGERIA',
    location: 'Virtual + Landmark Centre, Lagos.',
    description: 'A 48-hour hackathon to build innovative dApps on Sui. Prizes worth $10,000 for top projects.',
    registerLink: '#',
  },
  {
    id: 4,
    dateRange: 'Dec 1 - Dec 2',
    time: '11:00 AM - 5:00 PM UTC+1',
    title: 'DEFI DEVELOPMENT MASTERCLASS',
    location: 'nHub Nigeria, Abuja.',
    description: 'Deep dive into building DeFi protocols on Sui. Learn about AMMs, lending protocols, and yield optimization.',
    registerLink: '#',
  },
];

const pastDevEvents = [
  {
    id: 1,
    title: 'CODE WITH SUI - AKSU',
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    location: 'Akwa Ibom State University, Ikot Akpaden.',
    description: 'A 2-day intensive bootcamp introducing students to Move programming and the Sui blockchain ecosystem.',
    image: '/images/events/code-with-sui.png',
  },
  {
    id: 2,
    title: 'SUI DEVELOPER MEETUP - LAGOS',
    dateRange: 'Aug 15 - Aug 16',
    time: '9:00 AM - 4:00 PM UTC+1',
    location: 'Zone Tech Park, Gbagada, Lagos.',
    description: 'Networking event for Sui developers to share projects, collaborate, and learn from industry experts.',
    image: '/images/community/bg-1.png',
  },
  {
    id: 3,
    title: 'MOVE HACKATHON 2024',
    dateRange: 'Jul 20 - Jul 22',
    time: '8:00 AM - 8:00 PM UTC+1',
    location: 'Virtual Event',
    description: 'A 48-hour hackathon challenging developers to build innovative dApps on the Sui network.',
    image: '/images/community/bg-2.png',
  },
  {
    id: 4,
    title: 'SUI BUILDERS BOOTCAMP - ABUJA',
    dateRange: 'Feb 14 - Feb 16',
    time: '9:00 AM - 5:00 PM UTC+1',
    location: 'nHub Nigeria, Abuja.',
    description: 'Three-day intensive program taking developers from zero to deploying their first Sui smart contract.',
    image: '/images/community/bg-7.png',
  },
  {
    id: 5,
    title: 'BLOCKCHAIN BASICS - PORT HARCOURT',
    dateRange: 'Jan 20 - Jan 21',
    time: '10:00 AM - 4:00 PM UTC+1',
    location: 'Rivers State University, Port Harcourt.',
    description: 'Beginner-friendly introduction to blockchain technology and why Sui stands out in the ecosystem.',
    image: '/images/community/bg-3.png',
  },
];

const globalEvents = [
  {
    id: 1,
    title: 'Sui Basecamp 2025',
    image: '/images/community/bg-4.png',
    status: 'Past',
  },
  {
    id: 2,
    title: 'Builder House Singapore 2024',
    image: '/images/community/bg-5.png',
    status: 'Past',
  },
  {
    id: 3,
    title: 'Korea Blockchain Week 2024',
    image: '/images/community/bg-6.png',
    status: 'Past',
  },
];

const communityBackgrounds = [
  '/images/community/bg-1.png',
  '/images/community/bg-2.png',
  '/images/community/bg-3.png',
  '/images/community/bg-4.png',
  '/images/community/bg-5.png',
  '/images/community/bg-6.png',
  '/images/community/bg-7.png',
];

export default function DeveloperEventsPage() {
  const [communityBg, setCommunityBg] = useState(communityBackgrounds[0]);
  const [currentPastIndex, setCurrentPastIndex] = useState(0);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [taglineText, setTaglineText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const titleRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const fullTagline = 'CODE. CREATE. CONNECT.';

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * communityBackgrounds.length);
    setCommunityBg(communityBackgrounds[randomIndex]);
  }, []);

  useEffect(() => {
    if (!isHeroVisible) {
      setTaglineText('');
      setIsTypingComplete(false);
      return;
    }

    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullTagline.length) {
        setTaglineText(fullTagline.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, 80);

    return () => clearInterval(timer);
  }, [isHeroVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsHeroVisible(true);
          } else {
            setIsHeroVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsTitleVisible(true);
          } else {
            setIsTitleVisible(false);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePrevPastEvent = () => {
    if (currentPastIndex > 0) {
      setCurrentPastIndex((prev) => prev - 1);
    }
  };

  const handleNextPastEvent = () => {
    if (currentPastIndex < pastDevEvents.length - 1) {
      setCurrentPastIndex((prev) => prev + 1);
    }
  };

  const isFirstPastEvent = currentPastIndex === 0;
  const isLastPastEvent = currentPastIndex === pastDevEvents.length - 1;
  const currentPastEvent = pastDevEvents[currentPastIndex];

  return (
    <main className="dev-events-page">
      <Header />

      {/* Hero Section */}
      <section className="dev-hero" ref={heroRef}>
        <div className="dev-hero-image">
          <video
            className="events-hero-video-element"
            playsInline
            muted
            loop
            autoPlay
          >
            <source src="/videos/dev-events.mp4" type="video/mp4" />
          </video>
          <div className="dev-hero-overlay"></div>

          {/* Left section */}
          <div className="dev-hero-left">
            <h1 className="dev-hero-tagline">{taglineText}{!isTypingComplete && <span className="tagline-cursor">|</span>}</h1>
          </div>

          {/* Right section */}
          <div className="dev-hero-right">
            <p className="dev-hero-cta">Build the Future of web3 with us.</p>
          </div>

          {/* Location badge */}
          <div className="dev-hero-location">
            <span className="dev-hero-location-label">
              <span>MOVE</span>
              <span>DEVELOPEMENT</span>
              <span>BOOTCAMP, OYO</span>
            </span>
            <span className="dev-hero-location-city">IBADAN</span>
          </div>

          {/* Sui Hub button */}
          <Link href="#" className="dev-hero-suihub">
            <span>Sui Hub</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Developer Events Title */}
      <section className="dev-title-section" ref={titleRef}>
        <div className="dev-title-header">
          <p className={`dev-title-developer ${isTitleVisible ? 'animate' : ''}`}>DEVELOPER</p>
          <h2 className={`dev-title-events ${isTitleVisible ? 'animate' : ''}`}>EVENTS</h2>
          <div className="dev-title-line"></div>
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="dev-upcoming-section">
        <div className="dev-events-list">
          {upcomingDevEvents.map((event) => (
            <div key={event.id} className="dev-event-row">
              <div className="dev-event-date-card">
                <div className="dev-event-date-content">
                  <span className="dev-event-date-range">{event.dateRange}</span>
                  <span className="dev-event-time">{event.time}</span>
                </div>
              </div>
              <div className="dev-event-content-card">
                <div className="dev-event-content">
                  <div className="dev-event-info">
                    <h3 className="dev-event-title">{event.title}</h3>
                    <div className="dev-event-location">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M12 21C12 21 5 13.5 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9C19 13.5 12 21 12 21Z" />
                        <circle cx="12" cy="9" r="3" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="dev-event-details">
                    <p className="dev-event-description">{event.description}</p>
                    <Link href={event.registerLink} className="btn-register">
                      <span>Register</span>
                      <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="dev-past-section">
        <h2 className="dev-past-title">CATCH UP WITH PAST EVENTS</h2>

        <div className="dev-past-content">
          <div className="dev-past-left">
            {/* Navigation */}
            <div className="dev-past-nav">
              <button
                className={`dev-past-nav-btn prev ${isFirstPastEvent ? 'disabled' : ''}`}
                onClick={handlePrevPastEvent}
                disabled={isFirstPastEvent}
                aria-label="Previous event"
              >
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className={`dev-past-nav-btn next ${isLastPastEvent ? 'disabled' : ''}`}
                onClick={handleNextPastEvent}
                disabled={isLastPastEvent}
                aria-label="Next event"
              >
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Event details */}
            <div className="dev-past-details">
              <h3 className="dev-past-event-title">{currentPastEvent.title}</h3>
              <div className="dev-past-event-datetime">
                <span>{currentPastEvent.dateRange}</span>
                <span>{currentPastEvent.time}</span>
              </div>
              <p className="dev-past-event-description">{currentPastEvent.description}</p>
              <Link href="#" className="btn-highlights">
                <span>Highlights</span>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="dev-past-right">
            <div className="dev-past-video">
              <Image
                src={currentPastEvent.image}
                alt={currentPastEvent.title}
                fill
                className="dev-past-image"
              />
              <button className="dev-past-play">
                <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
                  <path d="M20 15L35 25L20 35V15Z" fill="#D9D9D9" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Global Events Section */}
      <section className="dev-global-section">
        <h2 className="dev-global-title">CONNECT WITH SUI BUILDERS AROUND THE WORLD.</h2>

        <div className="dev-global-grid">
          {globalEvents.map((event) => (
            <div key={event.id} className="dev-global-card">
              <div className="dev-global-image">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="dev-global-img"
                />
                <span className="dev-global-status">{event.status}</span>
              </div>
              <h3 className="dev-global-event-title">{event.title}</h3>
              <Link href="#" className="dev-global-link">
                <span>Watch recap</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Community Signup Section */}
      <section className="community-section">
        <div className="community-bg">
          <Image
            src={communityBg}
            alt="Community Background"
            fill
            className="community-bg-image"
          />
          <div className="community-overlay"></div>
        </div>

        <h2 className="community-title">JOIN THE COMMUNITY OF BUILDERS AND CREATIVES</h2>

        <div className="community-content">
          <form className="community-form">
            <div className="form-field">
              <input type="text" placeholder="NAME" className="form-input" />
            </div>
            <div className="form-field">
              <input type="email" placeholder="EMAIL" className="form-input" />
            </div>
            <div className="form-field">
              <input type="tel" placeholder="PHONE" className="form-input" />
            </div>
            <p className="form-disclaimer">
              By Clicking this you agree to be onboarded into the Sui Nigeria Community and subscribe to our newsletter (No spam).
            </p>
            <button type="submit" className="btn-submit">
              <span>Submit</span>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Arrow decoration */}
        <div className="community-arrow">
          <Image
            src="/blog-arrow.svg"
            alt="Arrow"
            width={120}
            height={120}
            className="community-arrow-img"
          />
        </div>

        <p className="community-cta-text">Let's keep in touch - Be the first to know what's coming.</p>
      </section>

      <PageProgress />
      <Footer />
    </main>
  );
}
