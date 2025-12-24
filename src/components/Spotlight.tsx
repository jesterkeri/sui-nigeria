'use client';

export function Spotlight() {
  return (
    <section id="spotlight" className="spotlight">
      <div className="spotlight-container">
        {/* Section Header */}
        <div className="spotlight-header">
          <p className="spotlight-label">Spotlight</p>
          <h2 className="spotlight-title">
            Showcasing the energy, creativity, and spirit of the giants of Africa.
          </h2>
        </div>

        {/* Spotlight Grid */}
        <div className="spotlight-grid">
          {/* Video/Visual */}
          <div className="spotlight-video-wrapper">
            <div className="spotlight-video">
              <div className="spotlight-play-button">
                <div className="spotlight-play-circle">
                  <svg className="spotlight-play-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* Number badge */}
              <div className="spotlight-number-badge">
                <span className="spotlight-number-text">01.</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="spotlight-content">
            <h3 className="spotlight-content-title">
              Meet LinQ by <span className="spotlight-highlight">suioncampus</span>
            </h3>
            <p className="spotlight-description">
              Bacon ipsum dolor amet meatball tongue prosciutto, pastrami fatback ball tip capicola ham pork loin kevin. Bacon tenderloin bresaola ham hock fatback meatball capicola short loin. Corned beef cow drumstick burgdoggen jerky jowl picanha ground round spare ribs beef pork loin sirloin pig. Flank jerky cow ball tip porchetta.
            </p>
            <button className="btn-white">
              Explore
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="spotlight-progress">
          <div className="spotlight-progress-header">
            <span>PAGE PROGRESS</span>
            <span>10%</span>
          </div>
          <div className="spotlight-progress-bar">
            <div className="spotlight-progress-fill" />
          </div>
          <p className="spotlight-progress-label">Completed</p>
        </div>
      </div>
    </section>
  );
}
