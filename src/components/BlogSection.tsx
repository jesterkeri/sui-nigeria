'use client';

const newsItems = [
  'Move Registry Improves Developer Experience on Sui',
  'Announcing the Move Registry (MVR): Radical interoperability',
];

export function BlogSection() {
  return (
    <section className="blog-section">
      <div className="blog-header">
        <p className="blog-header-text">
          CATCH WHAT&apos;S HAPPENING IN THE SUI COMMUNITY
        </p>
      </div>

      {/* Marquee Container */}
      <div className="blog-marquee-container">
        {/* First Row - Moving Left */}
        <div className="blog-marquee-row">
          <div className="blog-marquee-content">
            {[...newsItems, ...newsItems, ...newsItems, ...newsItems].map((item, index) => (
              <div key={`row1-${index}`} className="blog-card">
                <p className="blog-card-text">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Second Row - Moving Right */}
        <div className="blog-marquee-row">
          <div className="blog-marquee-content blog-marquee-content-reverse">
            {[...newsItems, ...newsItems, ...newsItems, ...newsItems].reverse().map((item, index) => (
              <div key={`row2-${index}`} className="blog-card">
                <p className="blog-card-text">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View More Button */}
      <div className="blog-footer">
        <button className="blog-view-more">
          View More
          <svg className="blog-view-more-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      {/* Blog Label */}
      <div className="blog-label">
        <p className="blog-label-text">BLOG</p>
      </div>
    </section>
  );
}
