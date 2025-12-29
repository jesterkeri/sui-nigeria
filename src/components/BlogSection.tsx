'use client';

import Image from 'next/image';

const blogPosts = [
  {
    title: 'Move Registry Improves Developer Experience on Sui',
    description: 'Announcing the Move Registry (MVR): Radical interoperability',
  },
  {
    title: 'Move Registry Improves Developer Experience on Sui',
    description: 'Announcing the Move Registry (MVR): Radical interoperability',
  },
  {
    title: 'Move Registry Improves Developer Experience on Sui',
    description: 'Announcing the Move Registry (MVR): Radical interoperability',
  },
  {
    title: 'Move Registry Improves Developer Experience on Sui',
    description: 'Announcing the Move Registry (MVR): Radical interoperability',
  },
  {
    title: 'Move Registry Improves Developer Experience on Sui',
    description: 'Announcing the Move Registry (MVR): Radical interoperability',
  },
];

export function BlogSection() {
  return (
    <section className="blog-section">
      {/* Background Image */}
      <div className="blog-bg-image" />

      {/* Header */}
      <div className="blog-header">
        <h2 className="blog-header-text">
          CATCH WHAT&apos;S HAPPENING IN THE SUI COMMUNITY
        </h2>
      </div>

      {/* Blog Cards Marquee */}
      <div className="blog-cards-wrapper">
        <div className="blog-cards-marquee">
          {/* First set of cards */}
          {blogPosts.map((post, index) => (
            <div key={`a-${index}`} className="blog-card">
              <div className="blog-card-content">
                <div className="blog-card-heading">
                  <h3 className="blog-card-title">{post.title}</h3>
                </div>
                <div className="blog-card-footer">
                  <p className="blog-card-description">{post.description}</p>
                  <div className="blog-card-arrow">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="3">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {blogPosts.map((post, index) => (
            <div key={`b-${index}`} className="blog-card">
              <div className="blog-card-content">
                <div className="blog-card-heading">
                  <h3 className="blog-card-title">{post.title}</h3>
                </div>
                <div className="blog-card-footer">
                  <p className="blog-card-description">{post.description}</p>
                  <div className="blog-card-arrow">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="3">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View More Button */}
      <div className="blog-view-more-container">
        <button className="blog-view-more">
          <span>View More</span>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 17L17 7M17 7H7M17 7V17" />
          </svg>
        </button>
      </div>

      {/* Blog Label with Arrow */}
      <div className="blog-label">
        <span className="blog-label-text">BLOG</span>
        <div className="blog-label-arrow">
          <Image src="/blog-arrow.svg" alt="Arrow" width={120} height={120} />
        </div>
      </div>
    </section>
  );
}
