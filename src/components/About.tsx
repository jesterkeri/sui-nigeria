'use client';

export function About() {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-grid">
          {/* Left side - Logo/Visual */}
          <div className="about-visual">
            <div className="about-logo-wrapper">
              {/* Main logo container */}
              <div className="about-logo-card">
                <div className="about-logo-content">
                  <div className="about-logo-circle">
                    <span className="about-logo-letter">S</span>
                  </div>
                  <p className="about-logo-label">GiveRep</p>
                </div>
              </div>
              {/* Decorative circles */}
              <div className="about-decoration-1" />
              <div className="about-decoration-2" />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="about-content">
            <p className="about-label">About</p>
            <h2 className="about-title">SUI NIGERIA</h2>
            <div className="about-paragraphs">
              <p className="about-paragraph">
                The Sui Nigeria Community is a grassroots hub of developers, creators, and blockchain enthusiasts working to expand the reach of the Sui ecosystem in Nigeria. It serves as a platform where people can explore the possibilities of blockchain technology and learn how to build meaningful solutions on Sui.
              </p>
              <p className="about-paragraph">
                Through meetups, workshops, hackathons, and training programs, the community provides education and hands-on experience with tools like the Move language and other Sui innovations. These events help members gain practical skills, connect with mentors, and collaborate on impactful projects.
              </p>
              <p className="about-paragraph">
                By fostering knowledge-sharing and supporting locally relevant applications, Sui Nigeria bridges the gap between local innovation and global blockchain opportunities. The community&apos;s goal is to drive adoption, empower builders, and create solutions that address real challenges in Nigeria and beyond.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
