'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const upcomingEvents = [
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
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    title: 'CODE IN MOTION - MOVE 101',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    registerLink: '#',
  },
  {
    id: 3,
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    title: 'CODE IN MOTION - MOVE 101',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    registerLink: '#',
  },
  {
    id: 4,
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    title: 'CODE IN MOTION - MOVE 101',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    registerLink: '#',
  },
];

const pastEvents = [
  {
    id: 1,
    title: 'CODE WITH SUI - AKSU',
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    image: '/images/events/code-with-sui.png',
    featured: true,
  },
  {
    id: 2,
    title: 'CODE WITH SUI - AKSU',
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    image: '/images/events/code-with-sui.png',
    featured: false,
  },
  {
    id: 3,
    title: 'CODE WITH SUI - AKSU',
    dateRange: 'Sept 26 - Sept 27',
    time: '10:00 AM - 5:00 PM UTC+1',
    location: 'H-FUTUREHUB Naweschools, Awka.',
    description: 'Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students, and anyone interested in blockchain technology, particularly the Sui ecosystem.',
    image: '/images/events/code-with-sui.png',
    featured: false,
  },
];
const communityBackgrounds = [  '/images/community/bg-1.png',  '/images/community/bg-2.png',  '/images/community/bg-3.png',  '/images/community/bg-4.png',  '/images/community/bg-5.png',  '/images/community/bg-6.png',  '/images/community/bg-7.png',];

export default function UpcomingEventsPage() {
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [communityBg, setCommunityBg] = useState(communityBackgrounds[0]);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * communityBackgrounds.length);
    setCommunityBg(communityBackgrounds[randomIndex]);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(false);
          // Small delay to reset animation
          setTimeout(() => setIsTitleVisible(true), 50);
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="events-page">
      <Header />

      {/* Hero Section */}
      <section className="events-hero">
        <div className="events-hero-video">
          <video
            className="events-hero-video-element"
            poster="/images/events/hero-poster.jpg"
            playsInline
            muted
            loop
            autoPlay
          >
            <source src="/videos/sui-nigeria-intro.mp4" type="video/mp4" />
          </video>
          <button
            className="events-play-button"
            style={{ opacity: 0 }}
            onClick={(e) => {
              const video = e.currentTarget.parentElement?.querySelector('video');
              if (video) {
                if (video.paused) {
                  video.play();
                  e.currentTarget.style.opacity = '0';
                } else {
                  video.pause();
                  e.currentTarget.style.opacity = '1';
                }
              }
            }}
          >
            <svg width="50" height="50" viewBox="0 0 50 50" fill="none">
              <path d="M20 15L35 25L20 35V15Z" fill="#D9D9D9" />
            </svg>
          </button>
        </div>

        {/* Arrow decoration */}
        <div className="events-hero-arrow">
          <Image
            src="/blog-arrow.svg"
            alt="Arrow"
            width={120}
            height={120}
          />
        </div>
      </section>

      {/* Page Title Section */}
      <section className="events-title-section" ref={titleRef}>
        <div className="events-title-header">
          <p className={`events-title-upcoming ${isTitleVisible ? 'animate' : ''}`}>UPCOMING</p>
          <h2 className={`events-title-events ${isTitleVisible ? 'animate' : ''}`}>EVENTS</h2>
          <div className="events-title-line"></div>
        </div>
      </section>

      {/* Upcoming Events List */}
      <section className="events-list-section">
        <div className="events-list">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="event-row">
              <div className="event-date-card">
                <div className="event-date-content">
                  <span className="event-date-range">{event.dateRange}</span>
                  <span className="event-time">{event.time}</span>
                </div>
              </div>
              <div className="event-content-card">
                <div className="event-content">
                  <div className="event-info">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-location">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                        <path d="M12 21C12 21 5 13.5 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9C19 13.5 12 21 12 21Z" />
                        <circle cx="12" cy="9" r="3" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="event-details">
                    <p className="event-description">{event.description}</p>
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
      <section className="past-events-section">
        <h2 className="past-events-title">Past Events</h2>

        {/* Featured Past Event */}
        <div className="featured-past-event">
          <div className="featured-event-image">
            <Image
              src="/images/events/code-with-sui.png"
              alt="Featured Past Event"
              fill
              className="featured-image"
            />
          </div>
          <div className="featured-event-details">
            <div className="featured-event-info">
              <h3 className="featured-event-title">CODE WITH SUI - AKSU</h3>
              <div className="featured-event-datetime">
                <span>{pastEvents[0].dateRange}</span>
                <span>{pastEvents[0].time}</span>
              </div>
            </div>
            <p className="featured-event-description">{pastEvents[0].description}</p>
            <div className="featured-event-location">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                <path d="M12 21C12 21 5 13.5 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9C19 13.5 12 21 12 21Z" />
                <circle cx="12" cy="9" r="3" />
              </svg>
              <span>H-FUTUREHUB Naweschools, Awka.</span>
            </div>
            <Link href="#" className="btn-highlights">
              <span>Highlights</span>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Past Events Grid */}
        <div className="past-events-grid">
          {pastEvents.filter(e => !e.featured).map((event) => (
            <div key={event.id} className="past-event-card">
              <div className="past-event-image">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="past-card-image"
                />
              </div>
              <div className="past-event-content">
                <div className="past-event-header">
                  <h4 className="past-event-title">{event.title}</h4>
                  <div className="past-event-datetime">
                    <span>{event.dateRange}</span>
                    <span>{event.time}</span>
                  </div>
                </div>
                <div className="past-event-divider"></div>
                <p className="past-event-description">{event.description}</p>
                <div className="past-event-location">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                    <path d="M12 21C12 21 5 13.5 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9C19 13.5 12 21 12 21Z" />
                    <circle cx="12" cy="9" r="3" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>
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
