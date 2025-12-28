'use client';

// Spotlight card data with different colors
const spotlightCards = [
  {
    id: 1,
    number: '01',
    title: 'Meet LinQ by suioncampus',
    description: 'Bacon ipsum dolor amet meatball tongue prosciutto, pastrami fatback ball tip capicola ham pork loin kevin. Bacon tenderloin bresaola ham hock fatback meatball capicola short loin. Corned beef cow drumstick burgdoggen jerky jowl picanha ground round spare ribs beef pork loin sirloin pig. Flank jerky cow ball tip porchetta.',
    bgImage: '/linq-logo.png',
    color: '#005A36', // Original green
  },
  {
    id: 2,
    number: '02',
    title: 'SuiPay - Instant Payments',
    description: 'Send and receive payments instantly with SuiPay. Our payment infrastructure enables merchants and individuals to transact seamlessly using the Sui blockchain with near-zero fees and lightning-fast confirmation times.',
    bgImage: '/linq-logo.png',
    color: '#4F46E5', // Indigo/Purple
  },
  {
    id: 3,
    number: '03',
    title: 'Learn & Earn Program',
    description: 'Join our educational initiative designed to onboard the next million users to Web3. Complete courses, earn certificates, and get rewarded with tokens as you learn blockchain development on Sui.',
    bgImage: '/linq-logo.png',
    color: '#0891B2', // Cyan/Teal
  },
  {
    id: 4,
    number: '04',
    title: 'Community & Governance',
    description: 'Sui Nigeria is more than just a blockchain community. It\'s a global network of builders, creators, and collaborators, all together on a mission to drive the adoption of blockchain technology across Africa.',
    bgImage: '/linq-logo.png',
    color: '#DC2626', // Red
  },
];

export function Spotlight() {
  return (
    <section id="spotlight" className="spotlight-section">
      {spotlightCards.map((card, index) => (
        <div
          key={card.id}
          className="spotlight-card-wrapper"
          style={{
            '--card-index': index,
            '--card-color': card.color,
            '--offset': `${index * 40}px`,
          } as React.CSSProperties}
        >
          <div className="spotlight-frame">
            {/* SVG shape with diagonal cutout at top-left */}
            <svg
              className="spotlight-shape"
              preserveAspectRatio="none"
              viewBox="0 0 1440 800"
              fill={card.color}
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

            {/* Left Side - Green Background */}
            <div className="spotlight-left">
              <div className="spotlight-left-bg"></div>
              <div className="spotlight-left-content">
                <h3 className="spotlight-meet-title">
                  {card.number}. {card.title}
                </h3>
                <p className="spotlight-description">
                  {card.description}
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
              <div className="spotlight-right-bg" style={{ backgroundImage: `url('${card.bgImage}')` }}></div>
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
        </div>
      ))}
    </section>
  );
}
