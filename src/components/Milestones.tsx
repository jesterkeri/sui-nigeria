'use client';

import { useState, useCallback } from 'react';

const milestones = [
  {
    number: '01',
    title: '4dummies launches fluxpay',
    description: 'Bacon ipsum dolor amet meatball tongue prosciutto, pastrami fatback ball tip capicola ham pork loin kevin. Bacon tenderloin bresaola ham hock fatback meatball capicola short loin. Corned beef cow drumstick',
    previewImage: '/milestone-preview.png',
    videoImage: '/milestone-video.png',
  },
  {
    number: '02',
    title: 'Sui Nigeria Community Launch',
    description: 'The official launch of Sui Nigeria community, bringing together developers and blockchain enthusiasts across the nation to explore the Sui ecosystem.',
    previewImage: '/milestone-preview.png',
    videoImage: '/milestone-video.png',
  },
  {
    number: '03',
    title: 'First Hackathon',
    description: 'Hosting our first hackathon event with over 100 participants building innovative solutions on the Sui blockchain.',
    previewImage: '/milestone-preview.png',
    videoImage: '/milestone-video.png',
  },
];

export function Milestones() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState<'prev' | 'next'>('next');
  const currentMilestone = milestones[currentIndex];

  const navigate = useCallback((dir: 'prev' | 'next') => {
    if (isAnimating) return;
    
    setDirection(dir);
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentIndex((prev) => {
        if (dir === 'prev') {
          return prev === 0 ? milestones.length - 1 : prev - 1;
        }
        return prev === milestones.length - 1 ? 0 : prev + 1;
      });
      setIsAnimating(false);
    }, 150);
  }, [isAnimating]);

  const infoClass = 'milestones-info' + (isAnimating ? ' animating-' + direction : '');
  const videoClass = 'milestones-video' + (isAnimating ? ' animating-' + direction : '');
const isFirst = currentIndex === 0;  const isLast = currentIndex === milestones.length - 1;  const prevBtnClass = "milestones-nav-btn prev" + (isFirst ? " disabled" : "");  const nextBtnClass = "milestones-nav-btn next" + (isLast ? " disabled" : "");

  return (
    <section className="milestones">
      <div className="milestones-container">
        {/* Section Header - Marquee scrolling text */}
        <div className="milestones-header">
          <div className="milestones-heading-wrapper">
            <div className="milestones-heading-marquee">
              <span className="milestones-heading-text">MILESTONE</span>
              <span className="milestones-heading-text">MILESTONE</span>
              <span className="milestones-heading-text">MILESTONE</span>
              {/* Duplicate set for seamless loop */}
              <span className="milestones-heading-text">MILESTONE</span>
              <span className="milestones-heading-text">MILESTONE</span>
              <span className="milestones-heading-text">MILESTONE</span>
            </div>
          </div>
          <div className="milestones-heading-gradient" />
        </div>

        {/* Main Content */}
        <div className="milestones-content">
          {/* Left Side - Info */}
          <div className={infoClass}>
            {/* Navigation Arrows */}
            <div className="milestones-nav">
              <button className={prevBtnClass} onClick={() => navigate('prev')} aria-label="Previous">
                <svg width="9" height="18" viewBox="0 0 9 18" fill="none">
                  <path d="M8 1L1 9L8 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button className={nextBtnClass} onClick={() => navigate('next')} aria-label="Next">
                <svg width="9" height="18" viewBox="0 0 9 18" fill="none">
                  <path d="M1 1L8 9L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Text Content */}
            <div className="milestones-text">
              <h3 className="milestones-title">{currentMilestone.title}</h3>
              <p className="milestones-description">{currentMilestone.description}</p>
            </div>

            {/* Small Preview Image */}
            <div className="milestones-preview">
              <img
                src={currentMilestone.previewImage}
                alt={currentMilestone.title}
                className="milestones-preview-img"
              />
            </div>
          </div>

          {/* Right Side - Video */}
          <div className={videoClass}>
            <span className="milestones-number">{currentMilestone.number}.</span>
            <div className="milestones-video-card">
              <img
                src={currentMilestone.videoImage}
                alt={currentMilestone.title}
                className="milestones-video-img"
              />
              <div className="milestones-play-button">
                <svg className="milestones-play-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
