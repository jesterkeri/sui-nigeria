'use client';

export function Spotlight() {
  return (
    <section id="spotlight" className="spotlight-section">
      {/* SVG shape with diagonal cutout at top-left */}
      <svg
        className="spotlight-shape"
        preserveAspectRatio="none"
        viewBox="0 0 1440 800"
        fill="var(--sui-green-dark)"
      >
        <path d="
          M 140 0
          L 1416 0
          Q 1440 0 1440 24
          L 1440 776
          Q 1440 800 1416 800
          L 24 800
          Q 0 800 0 776
          L 0 140
          Q 0 125 10 115
          L 115 10
          Q 125 0 140 0
          Z
        "/>
      </svg>
      {/* Vertical divider line */}
      <div className="spotlight-divider"></div>

      <div className="spotlight-frame">
        {/* Left Side - Green Background */}
        <div className="spotlight-left">
          <div className="spotlight-left-bg"></div>
          <div className="spotlight-left-content">
            <h3 className="spotlight-meet-title">
              01. Meet LinQ by suioncampus
            </h3>
            <p className="spotlight-description">
              Bacon ipsum dolor amet meatball tongue prosciutto, pastrami fatback ball tip capicola ham pork loin kevin. Bacon tenderloin bresaola ham hock fatback meatball capicola short loin. Corned beef cow drumstick burgdoggen jerky jowl picanha ground round spare ribs beef pork loin sirloin pig. Flank jerky cow ball tip porchetta.
            </p>
            <button className="spotlight-explore-btn">
              <span>Explore</span>
              <svg className="spotlight-arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right Side - Dark/Purple Background */}
        <div className="spotlight-right">
          <div className="spotlight-right-bg"></div>
          <div className="spotlight-right-content">
            {/* Header */}
            <div className="spotlight-header">
              <h2 className="spotlight-title">Spotlight</h2>
              <p className="spotlight-subtitle">
                Showcasing the energy, creativity, and spirit of the giants of Africa.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
