'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

function useScrambleText(finalText: string, trigger: number, duration: number = 2000) {
  const [displayText, setDisplayText] = useState(finalText);

  useEffect(() => {
    // Don't run on initial mount (trigger = 0)
    if (trigger === 0) return;

    const textLength = finalText.length;
    const intervalTime = 70;
    const totalIterations = duration / intervalTime;
    const revealStep = totalIterations / textLength;

    let iteration = 0;

    // Start with all scrambled
    setDisplayText(
      finalText
        .split('')
        .map((char) => (char === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join('')
    );

    const interval = setInterval(() => {
      iteration++;

      const revealedCount = Math.floor(iteration / revealStep);

      let result = '';
      for (let i = 0; i < textLength; i++) {
        if (finalText[i] === ' ') {
          result += ' ';
        } else if (i < revealedCount) {
          result += finalText[i];
        } else {
          result += CHARS[Math.floor(Math.random() * CHARS.length)];
        }
      }

      setDisplayText(result);

      if (revealedCount >= textLength) {
        clearInterval(interval);
        setDisplayText(finalText);
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [trigger, finalText, duration]);

  return displayText;
}

export function Frontrunning() {
  const [animationTrigger, setAnimationTrigger] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Increment trigger to restart animation
          setAnimationTrigger((prev) => prev + 1);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const text1 = useScrambleText('FRONTRUNNING', animationTrigger, 2000);
  const text2 = useScrambleText('BLOCKCHAIN', animationTrigger, 2000);
  const text3 = useScrambleText('INNOVATION', animationTrigger, 2000);
  const text4 = useScrambleText('IN AFRICA', animationTrigger, 2000);

  return (
    <section className="frontrunning" id="frontrunning" ref={sectionRef}>
      {/* Globe background */}
      <div className="frontrunning-globe">
        <Image
          src="/images/backgrounds/top-globe.png"
          alt="Africa Globe"
          width={700}
          height={500}
          className="frontrunning-globe-image"
        />
      </div>

      <div className="frontrunning-container">
        <div className="frontrunning-content">
          {/* All text content in one container with brackets positioned around first 3 lines */}
          <div className="frontrunning-text">
            <span className="frontrunning-bracket">[</span>
            <div className="frontrunning-words-inner">
              {/* Bracketed lines */}
              <div className="frontrunning-line">
                <span className="frontrunning-white">{text1}</span>
              </div>
              <div className="frontrunning-line frontrunning-line-indent">
                <span className="frontrunning-green">{text2}</span>
              </div>
              <div className="frontrunning-line">
                <span className="frontrunning-white">{text3}</span>
              </div>
              {/* Below brackets */}
              <div className="frontrunning-line frontrunning-line-indent frontrunning-line-below">
                <span className="frontrunning-green">{text4}</span>
                <p className="frontrunning-subtitle">Built on Sui</p>
              </div>
            </div>
            <span className="frontrunning-bracket">]</span>
          </div>
        </div>
      </div>
    </section>
  );
}
