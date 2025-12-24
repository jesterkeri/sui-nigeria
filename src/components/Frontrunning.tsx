'use client';

import Image from 'next/image';

export function Frontrunning() {
  return (
    <section className="frontrunning" id="frontrunning">
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
                <span className="frontrunning-white">FRONTRUNNING</span>
              </div>
              <div className="frontrunning-line frontrunning-line-indent">
                <span className="frontrunning-green">BLOCKCHAIN</span>
              </div>
              <div className="frontrunning-line">
                <span className="frontrunning-white">INNOVATION</span>
              </div>
              {/* Below brackets */}
              <div className="frontrunning-line frontrunning-line-indent frontrunning-line-below">
                <span className="frontrunning-green">IN AFRICA</span>
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
