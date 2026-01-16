'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const upcomingSpaces = [
  {
    id: 1,
    hostName: 'Sui Gaming Ng',
    hostImage: '/images/community/bg-1.png',
    title: 'Sui Gaming Nigeria x TrevinVSGaming',
    coHosts: '@TrevinVS, @SuiGamingNG',
    date: 'October 16 Thursday',
    time: '12:00 AM UTC+1',
    reminderLink: '#',
  },
  {
    id: 2,
    hostName: 'Breezy',
    hostImage: '/images/community/bg-2.png',
    title: 'Sui Nigeria Weekly AMA Session',
    coHosts: '@CryptoNaija, @DeFiKing',
    date: 'October 20 Monday',
    time: '8:00 PM UTC+1',
    reminderLink: '#',
  },
  {
    id: 3,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-3.png',
    title: 'Building on Sui: Developer Workshop',
    coHosts: '@DevMaster, @Web3Builder',
    date: 'October 25 Saturday',
    time: '3:00 PM UTC+1',
    reminderLink: '#',
  },
  {
    id: 4,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-4.png',
    title: 'NFT Showcase: Nigerian Digital Artists',
    coHosts: '@ArtNaija, @NFTCreator',
    date: 'October 28 Tuesday',
    time: '6:00 PM UTC+1',
    reminderLink: '#',
  },
  {
    id: 5,
    hostName: 'Breezy',
    hostImage: '/images/community/bg-5.png',
    title: 'DeFi Deep Dive: Yield Strategies on Sui',
    coHosts: '@DeFiExpert, @YieldMaster',
    date: 'November 1 Friday',
    time: '4:00 PM UTC+1',
    reminderLink: '#',
  },
  {
    id: 6,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-6.png',
    title: 'Community Builders Roundtable',
    coHosts: '@CommunityLead, @SuiAmbassador',
    date: 'November 5 Tuesday',
    time: '7:00 PM UTC+1',
    reminderLink: '#',
  },
];

const recordedSpaces = [
  {
    id: 1,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-1.png',
    title: 'Sui NG WEEKLY SPACE: POST BASECAMP, COMMUNITY',
    date: 'May 11 Sunday',
    duration: '1h : 8min',
    playLink: '#',
    episodesLink: '#',
  },
  {
    id: 2,
    hostName: 'Breezy',
    hostImage: '/images/community/bg-2.png',
    title: 'Sui NG WEEKLY SPACE: POST BASECAMP, COMMUNITY',
    date: 'May 11 Sunday',
    duration: '1h : 8min',
    playLink: '#',
    episodesLink: '#',
  },
  {
    id: 3,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-3.png',
    title: 'Sui NG WEEKLY SPACE: POST BASECAMP, COMMUNITY',
    date: 'May 11 Sunday',
    duration: '1h : 8min',
    playLink: '#',
    episodesLink: '#',
  },
  {
    id: 4,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-4.png',
    title: 'Building DeFi Applications on Sui Network',
    date: 'May 4 Sunday',
    duration: '1h : 25min',
    playLink: '#',
    episodesLink: '#',
  },
  {
    id: 5,
    hostName: 'Breezy',
    hostImage: '/images/community/bg-5.png',
    title: 'NFT Gaming Revolution: Play to Earn on Sui',
    date: 'April 27 Sunday',
    duration: '1h : 45min',
    playLink: '#',
    episodesLink: '#',
  },
  {
    id: 6,
    hostName: 'Sui Gaming NG',
    hostImage: '/images/community/bg-6.png',
    title: 'Smart Contract Security Best Practices',
    date: 'April 20 Sunday',
    duration: '2h : 10min',
    playLink: '#',
    episodesLink: '#',
  },
  {
    id: 7,
    hostName: 'Breezy',
    hostImage: '/images/community/bg-7.png',
    title: 'Sui Ecosystem Overview: Projects & Opportunities',
    date: 'April 13 Sunday',
    duration: '1h : 32min',
    playLink: '#',
    episodesLink: '#',
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

export default function CommunitySpacesPage() {
  const [communityBg, setCommunityBg] = useState(communityBackgrounds[0]);
  const [isTitleVisible, setIsTitleVisible] = useState(false);
  const [isRecordedVisible, setIsRecordedVisible] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const recordedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * communityBackgrounds.length);
    setCommunityBg(communityBackgrounds[randomIndex]);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTitleVisible(false);
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

  // Observer for recorded spaces animation - resets on scroll away
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRecordedVisible(false);
          setTimeout(() => setIsRecordedVisible(true), 50);
        } else {
          setIsRecordedVisible(false);
        }
      },
      { threshold: 0.2 }
    );

    if (recordedRef.current) {
      observer.observe(recordedRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main className="spaces-page">
      <Header />

      {/* Hero Section */}
      <section className="spaces-hero">
        <div className="spaces-hero-gradient">
          {/* Hero Content - Left Side */}
          <div className="spaces-hero-content">
            <h1 className="spaces-hero-title">Sui Nigeria Community</h1>
            <p className="spaces-hero-subtitle">
              Join in on live spaces where builders speak and creators connect.
            </p>
          </div>

          {/* Dot Grid Decorations */}
          <div className="spaces-dots spaces-dots-top">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="spaces-dot"></span>
            ))}
          </div>
          <div className="spaces-dots spaces-dots-bottom">
            {[...Array(16)].map((_, i) => (
              <span key={i} className="spaces-dot"></span>
            ))}
          </div>

          {/* Sound Wave Visualizer - Left */}
          <div className="spaces-soundwave spaces-soundwave-left">
            {[144, 93, 46, 158, 209, 70, 128, 232, 105, 58, 174, 81, 86, 48, 48, 88, 37, 107, 58, 177, 190, 137, 72, 41, 21, 81, 37, 23, 88, 65, 95, 37, 72, 93, 75, 44, 181, 109, 156, 82, 67, 198, 45, 123, 89, 167, 54, 112, 78, 201].map((height, i) => (
              <span
                key={i}
                className="spaces-wave-bar"
                style={{ height: `${height * 0.6}px` }}
              ></span>
            ))}
          </div>

          {/* Sound Wave Visualizer - Right */}
          <div className="spaces-soundwave spaces-soundwave-right">
            {[145, 91, 56, 178, 42, 134, 99, 185, 71, 52, 163, 87, 119, 38, 196, 74, 141, 58, 103, 169, 47, 132, 84, 215, 61, 148, 95, 176, 39, 121, 76, 188, 53, 137, 92, 165, 44, 108, 79, 193, 66, 152, 88, 172, 49, 126, 83, 205, 57, 143].map((height, i) => (
              <span
                key={i}
                className="spaces-wave-bar"
                style={{ height: `${height * 0.6}px` }}
              ></span>
            ))}
          </div>

          {/* Sui Spaces Logo - Center */}
          <div className="spaces-logo">
            {/* Circular Text */}
            <svg className="spaces-circular-text" viewBox="0 0 200 200">
              <defs>
                <path
                  id="circlePath"
                  d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                />
              </defs>
              <text>
                <textPath href="#circlePath" startOffset="0%">Sui Nigeria spaces everyday  •  Sui Nigeria spaces everyday  •</textPath>
              </text>
            </svg>
            <Image
              src="/images/sui-spaces-logo.svg"
              alt="Sui Spaces"
              width={200}
              height={200}
              className="spaces-logo-img"
            />
          </div>

          {/* Mic Image */}
          <div className="spaces-mic">
            <Image
              src="/images/mic.png"
              alt="Microphone"
              width={763}
              height={763}
              className="spaces-mic-img"
            />
          </div>

          {/* Bottom Left - Tagline & Live Indicator */}
          <div className="spaces-bottom-left">
            <p className="spaces-tagline">Share. Speak. Inspire.</p>
            <div className="spaces-live-indicator">
              <div className="spaces-avatar-group">
                <div className="spaces-avatar">
                  <Image src="/images/community/bg-1.png" alt="Host" fill className="spaces-avatar-img" />
                </div>
                <div className="spaces-avatar">
                  <Image src="/images/community/bg-2.png" alt="Host" fill className="spaces-avatar-img" />
                </div>
                <div className="spaces-avatar">
                  <Image src="/images/community/bg-3.png" alt="Host" fill className="spaces-avatar-img" />
                </div>
              </div>
              <span className="spaces-live-text">LIVE: Nigerians Talk Sui</span>
              <div className="spaces-live-bars">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>

          {/* Bottom Right - CTA */}
          <div className="spaces-bottom-right">
            <p className="spaces-cta-text">Add your Space<br />to Schedule.</p>
            <Link href="#" className="spaces-register-btn">
              <span>Register Space</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Page Title Section */}
      <section className="spaces-title-section" ref={titleRef}>
        <div className="spaces-title-header">
          <p className={`spaces-title-upcoming ${isTitleVisible ? 'animate' : ''}`}>UPCOMING</p>
          <h2 className={`spaces-title-spaces ${isTitleVisible ? 'animate' : ''}`}>SPACES</h2>
          <div className="spaces-title-line"></div>
        </div>
      </section>

      {/* Spaces List Section */}
      <section className="spaces-list-section">
        <div className="spaces-list">
          {upcomingSpaces.map((space) => (
            <div key={space.id} className="space-row">
              {/* Card with Host + Title */}
              <div className="space-card">
                {/* Host Section */}
                <div className="space-host-section">
                  <div className="space-host-image">
                    <Image
                      src={space.hostImage}
                      alt={space.hostName}
                      fill
                      className="space-host-img"
                    />
                  </div>
                  <div className="space-host-info">
                    <div className="space-host-label">
                      <span>Host</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    </div>
                    <span className="space-host-name">{space.hostName}</span>
                    <Link href="#" className="space-view-btn">
                      <span>View</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Content Section */}
                <div className="space-content w-full">
                  <h3 className="space-title">{space.title}</h3>
                  <div className="space-cohosts">
                    <span className="space-cohosts-label">Co-hosts</span>
                    <span className="space-cohosts-names">{space.coHosts}</span>
                  </div>
                </div>
              </div>

              {/* Meta Section - Standalone */}
              <div className="space-meta">
                <div className="space-datetime">
                  <span className="space-date">{space.date}</span>
                  <span className="space-time">{space.time}</span>
                </div>
                <Link href={space.reminderLink} className="space-reminder-btn">
                  <span>Set Reminder</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recorded Spaces Section */}
      <section className="recorded-section" ref={recordedRef}>
        <h2 className="recorded-title">LISTEN TO RECORDED SPACES</h2>
        <div className="recorded-list">
          {recordedSpaces.map((recording) => (
            <div key={recording.id} className={`recorded-card ${isRecordedVisible ? 'animate' : ''}`}>
              {/* Host and Content Wrapper */}
              <div className="recorded-main">
                {/* Host Section */}
                <div className="recorded-host">
                  <div className="recorded-host-image">
                    <Image
                      src={recording.hostImage}
                      alt={recording.hostName}
                      fill
                      className="recorded-host-img"
                    />
                  </div>
                  <div className="recorded-host-info">
                    <div className="recorded-host-label">
                      <span>Host</span>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                    </div>
                    <span className="recorded-host-name">{recording.hostName}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="recorded-content">
                  <h3 className="recorded-space-title">{recording.title}</h3>
                  <Link href={recording.playLink} className="recorded-play-btn">
                    <span>Play Recording</span>
                    <div className="play-icon">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                        <polygon points="0,0 10,5 0,10" />
                      </svg>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Meta Section */}
              <div className="recorded-meta">
                <span className="recorded-date">{recording.date}</span>
                <span className="recorded-duration">{recording.duration}</span>
                <Link href={recording.episodesLink} className="recorded-episodes-btn">
                  <span>See Past Episodes</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
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
