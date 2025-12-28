'use client';

// Partner logos data
const partners = [
  {
    id: 1,
    name: 'Sui',
    logo: '/images/partners/sui-logo.svg',
  },
  {
    id: 2,
    name: 'Cetus',
    logo: '/images/partners/cetus.svg',
  },
  {
    id: 3,
    name: 'DeepBook',
    logo: '/images/partners/deepbook.svg',
  },
  {
    id: 4,
    name: 'GiveRep',
    logo: '/images/partners/GiveRep.svg',
  },
  {
    id: 5,
    name: 'FlowX Finance',
    logo: '/images/partners/flowxfinance.svg',
  },
];

export function Partners() {
  return (
    <section id="partners" className="partners-section">
      <div className="partners-slider">
        {/* Track with scrolling logos */}
        <div className="partners-track">
          {/* First set of logos */}
          {partners.map((partner) => (
            <div key={partner.id} className="partner-card">
              <img
                src={partner.logo}
                alt={partner.name}
                className="partner-logo"
              />
            </div>
          ))}
          {/* Duplicate for seamless loop */}
          {partners.map((partner) => (
            <div key={`dup-${partner.id}`} className="partner-card">
              <img
                src={partner.logo}
                alt={partner.name}
                className="partner-logo"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
