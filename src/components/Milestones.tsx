'use client';

const milestones = [
  {
    number: '01',
    title: '4dummies launches fluxpay',
    description: 'Bacon ipsum dolor amet meatball tongue prosciutto, pastrami fatback ball tip capicola ham pork loin kevin. Bacon tenderloin bresaola ham hock fatback meatball capicola short loin. Corned beef cow drumstick',
  },
  {
    number: '02',
    title: 'Sui Nigeria Community Launch',
    description: 'The official launch of Sui Nigeria community, bringing together developers and blockchain enthusiasts across the nation to explore the Sui ecosystem.',
  },
  {
    number: '03',
    title: 'First Hackathon',
    description: 'Hosting our first hackathon event with over 100 participants building innovative solutions on the Sui blockchain.',
  },
];

export function Milestones() {
  return (
    <section className="milestones">
      <div className="milestones-container">
        {/* Section Header */}
        <div className="milestones-header">
          <p className="milestones-label">MILESTONES</p>
          <h2 className="milestones-title">MILESTONES</h2>
        </div>

        {/* Main Content Grid */}
        <div className="milestones-grid">
          {/* Video Preview */}
          <div className="milestones-video">
            <div className="milestones-video-card">
              <div className="milestones-video-play">
                <div className="milestones-play-button">
                  <svg className="milestones-play-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
              {/* Video thumbnail gradient */}
              <div className="milestones-video-gradient" />
            </div>
          </div>

          {/* Milestones List */}
          <div className="milestones-list">
            {milestones.map((milestone) => (
              <div key={milestone.number} className="milestone-card">
                {/* Number badge */}
                <div className="milestone-badge">
                  <span className="milestone-badge-text">{milestone.number}.</span>
                </div>

                <div className="milestone-content">
                  <h3 className="milestone-title">{milestone.title}</h3>
                  <p className="milestone-description">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
