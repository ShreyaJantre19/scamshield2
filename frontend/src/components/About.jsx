import React from 'react';

export default function About() {
  const pillars = [
    {
      title: 'Real-time AI Detection',
      icon: '🧠',
      description: 'Our system analyzes threat heuristics, common vocabulary patterns, and domain structures to automatically rank and categorize incoming report risks.'
    },
    {
      title: 'Crowdsourced Intelligence',
      icon: '👥',
      description: 'Empowered by thousands of community reports daily. When you submit a report, you contribute directly to shielding others from the same threat.'
    },
    {
      title: 'Privacy Preserved',
      icon: '🔒',
      description: 'Your privacy is paramount. Personal identifiable information (PII) is automatically stripped from description reports before publication.'
    }
  ];

  const techBadgeList = [
    { name: 'React 19', category: 'Library' },
    { name: 'Vite 8', category: 'Build Tool' },
    { name: 'Vanilla CSS', category: 'Styling' },
    { name: 'HTML5 Semantic', category: 'Structure' }
  ];

  return (
    <div className="about-container fade-in">
      <section className="about-hero-section">
        <h1>About ScamShield</h1>
        <p className="about-subtitle">
          ScamShield is an open, community-driven database dedicated to identifying, flagging, and neutralizing fraud in the digital space.
        </p>
      </section>

      {/* Security Principles Pillars */}
      <section className="pillars-grid">
        {pillars.map((pillar, index) => (
          <div key={index} className="pillar-card">
            <span className="pillar-icon">{pillar.icon}</span>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </section>

      {/* Mission statement */}
      <section className="mission-card">
        <h2>Our Mission</h2>
        <p>
          Every year, millions of individuals lose billions of dollars to spoofed caller IDs, misleading sweepstakes messages, and fraudulent online links. ScamShield is designed to lower the barrier to threat prevention. 
        </p>
        <p className="highlight-text">
          By reporting a threat today, you prevent someone else from falling victim tomorrow.
        </p>
      </section>

      {/* Tech details */}
      <section className="tech-section">
        <h2>Tech Stack Overview</h2>
        <div className="tech-badge-container">
          {techBadgeList.map((badge, idx) => (
            <div key={idx} className="tech-badge">
              <span className="tech-badge-category">{badge.category}</span>
              <span className="tech-badge-name">{badge.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
