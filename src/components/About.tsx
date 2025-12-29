'use client';

import { useEffect, useRef, useState } from 'react';

export function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [paragraphsVisible, setParagraphsVisible] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerObserver = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    const paragraphsObserver = new IntersectionObserver(
      ([entry]) => {
        setParagraphsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (headerRef.current) {
      headerObserver.observe(headerRef.current);
    }
    if (paragraphsRef.current) {
      paragraphsObserver.observe(paragraphsRef.current);
    }

    return () => {
      headerObserver.disconnect();
      paragraphsObserver.disconnect();
    };
  }, []);

  return (
    <section className="about">
      <div className="about-container">
        {/* Full-width Header */}
        <div className="about-header" ref={headerRef}>
          <p className={`about-label ${isVisible ? 'animate' : ''}`}>ABOUT</p>
          <h2 className={`about-title ${isVisible ? 'animate' : ''}`}>SUI NIGERIA</h2>
          <div className="about-header-line" />
        </div>

        {/* Content Grid */}
        <div className="about-grid">
          {/* Left side - Robot Image */}
          <div className="about-visual">
            <div className="about-robot-wrapper">
              <img
                src="/robot.png"
                alt="Robot illustration"
                className="about-robot-image"
              />
            </div>
          </div>

          {/* Right side - Paragraphs */}
          <div className="about-content" ref={paragraphsRef}>
            <div className="about-paragraphs">
              <div className={`about-paragraph-row ${paragraphsVisible ? 'animate delay-1' : ''}`}>
                <p className="about-paragraph">
                  The Sui Nigeria Community is a grassroots hub of developers, creators, and blockchain enthusiasts working to expand the reach of the Sui ecosystem in Nigeria. It serves as a platform where people can explore the possibilities of blockchain technology and learn how to build meaningful solutions on Sui.
                </p>
                <div className="about-paragraph-indicator" />
              </div>
              <div className={`about-paragraph-row ${paragraphsVisible ? 'animate delay-2' : ''}`}>
                <p className="about-paragraph">
                  Through meetups, workshops, hackathons, and training programs, the community provides education and hands-on experience with tools like the Move language and other Sui innovations. These events help members gain practical skills, connect with mentors, and collaborate on impactful projects.
                </p>
                <div className="about-paragraph-indicator" />
              </div>
              <div className={`about-paragraph-row ${paragraphsVisible ? 'animate delay-3' : ''}`}>
                <p className="about-paragraph">
                  By fostering knowledge-sharing and supporting locally relevant applications, Sui Nigeria bridges the gap between local innovation and global blockchain opportunities. The community&apos;s goal is to drive adoption, empower builders, and create solutions that address real challenges in Nigeria and beyond.
                </p>
                <div className="about-paragraph-indicator" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom line under robot */}
        <div className="about-bottom-line" />
      </div>
    </section>
  );
}
