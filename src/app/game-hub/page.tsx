'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useCurrentAccount, useDisconnectWallet, useConnectWallet, useWallets, ConnectModal, useResolveSuiNSName } from '@mysten/dapp-kit';
import {
  GAMES, COMPETITIONS, STREAMS, GAME_EVENTS, CATEGORIES,
  LEADERBOARD, SPOTLIGHTS, COMMUNITY_FEED, SUIPLAY_FEATURES, SUIPLAY_PARTNERS,
  type Game, type Competition, type LiveStream, type GameEvent, type GameCategory,
  type LeaderboardEntry, type PlayerSpotlight, type CommunityActivity, type SuiPlayFeature
} from './data';
import './game-hub.css';

/* ───────── Animation Config (SuiPlay-style) ───────── */
const EASE_SMOOTH = [0.77, 0, 0.175, 1] as const;

const fadeBlurIn = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE_SMOOTH } },
};

const heroTextStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const heroTextItem = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE_SMOOTH } },
};

const pageLoad = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE_SMOOTH } },
};

/* ───────── Counter Animation Hook ───────── */
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

/* ───────── 3D Tilt Hook ───────── */
function useTilt(intensity = 8) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale3d(1.02, 1.02, 1.02)`;
  }, [intensity]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
  }, []);

  return { ref, handleMouseMove, handleMouseLeave };
}

/* ───────── Marquee Component ───────── */
function Marquee({ children, reverse = false, duration = 30 }: { children: React.ReactNode; reverse?: boolean; duration?: number }) {
  return (
    <div className="gh-marquee" aria-hidden="true">
      <div className={`gh-marquee-track ${reverse ? 'gh-marquee-reverse' : ''}`} style={{ animationDuration: `${duration}s` }}>
        {children}
        {children}
      </div>
    </div>
  );
}

/* ───────── Parallax Scroll Hook ───────── */
function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf: number;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const offset = (rect.top - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}

/* ───────── Inline Sub-Components ───────── */

function WalletButton() {
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();
  const { data: suinsName } = useResolveSuiNSName(account?.address);
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  if (account) {
    const addr = account.address;
    const short = `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    const displayName = suinsName || short;
    return (
      <div className="gh-wallet-wrap">
        <button className="gh-wallet-btn gh-wallet-connected" onClick={() => setShowMenu(!showMenu)}>
          <span className="gh-wallet-dot-green" />
          {displayName}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        {showMenu && (
          <div className="gh-wallet-dropdown">
            <div className="gh-wallet-dropdown-addr">{addr}</div>
            <button className="gh-wallet-dropdown-btn" onClick={() => { navigator.clipboard.writeText(addr); }}>
              Copy Address
            </button>
            <button className="gh-wallet-dropdown-btn gh-wallet-disconnect" onClick={() => { disconnect(); setShowMenu(false); }}>
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <ConnectModal
      trigger={
        <button className="gh-wallet-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          Connect Wallet
        </button>
      }
      open={open}
      onOpenChange={setOpen}
    />
  );
}

function GameHubHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > window.innerHeight * 0.9);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`gh-header ${scrolled ? 'gh-header-scrolled' : ''}`}>
      <div className="gh-container gh-header-inner">
        <Link href="/game-hub" className="gh-header-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <line x1="6" y1="12" x2="6" y2="12" />
            <line x1="10" y1="12" x2="10" y2="12" />
            <circle cx="17" cy="10" r="1" />
            <circle cx="17" cy="14" r="1" />
          </svg>
          <span>Game Hub</span>
        </Link>
        <nav className="gh-header-nav">
          <Link href="/game-hub#browse" className="gh-header-link">Games</Link>
          <Link href="/game-hub#competitions" className="gh-header-link">Competitions</Link>
          <Link href="/game-hub#community" className="gh-header-link">Community</Link>
          <a href="https://suiplay.sui.io" target="_blank" rel="noopener noreferrer" className="gh-header-link">SuiPlay</a>
          <Link href="/game-hub#streams" className="gh-header-link">Streams</Link>
          <a href="https://takibi.network" target="_blank" rel="noopener noreferrer" className="gh-header-link">Takibi</a>
        </nav>
        <div className="gh-header-right">
          <WalletButton />
        </div>
      </div>
    </header>
  );
}

function GameHubFooter() {
  return (
    <footer className="gh-footer">
      <div className="gh-container gh-footer-inner">
        <div className="gh-footer-brand">
          <span className="gh-footer-logo">Game Hub</span>
          <span className="gh-footer-copy">Built on Sui. 2026.</span>
        </div>
        <div className="gh-footer-links">
          <Link href="/">Sui Nigeria</Link>
          <Link href="/game-hub#browse">Games</Link>
          <Link href="/game-hub#competitions">Competitions</Link>
          <Link href="/game-hub#community">Community</Link>
          <a href="https://suiplay.sui.io" target="_blank" rel="noopener noreferrer">SuiPlay</a>
          <a href="https://takibi.network" target="_blank" rel="noopener noreferrer">Takibi</a>
        </div>
      </div>
    </footer>
  );
}

function StarRating({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="gh-game-card-rating">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="gh-star">
          {i < full ? '\u2605' : i === full && half ? '\u2605' : '\u2606'}
        </span>
      ))}
      <span style={{ marginLeft: 4, color: '#94a3b8' }}>{rating}</span>
    </span>
  );
}

function StatusBadge({ status }: { status: Game['status'] }) {
  const cls = status === 'Live' ? 'gh-status-live' : status === 'Beta' ? 'gh-status-beta' : 'gh-status-coming';
  return (
    <span className={`gh-game-card-status ${cls}`}>
      {status === 'Live' && <span className="gh-status-dot" />}
      {status}
    </span>
  );
}

function GameCard({ game }: { game: Game }) {
  const cardVideoRef = useRef<HTMLVideoElement>(null);
  const tilt = useTilt(6);
  const isImagePath = game.image.startsWith('/');

  const handleMouseEnter = () => {
    if (cardVideoRef.current) {
      cardVideoRef.current.currentTime = 0;
      cardVideoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = useCallback(() => {
    if (cardVideoRef.current) cardVideoRef.current.pause();
    tilt.handleMouseLeave();
  }, [tilt]);

  return (
    <motion.div
      ref={tilt.ref}
      className="gh-game-card"
      style={isImagePath ? { backgroundImage: `url(${game.image})`, backgroundSize: 'cover', backgroundPosition: 'center', transformStyle: 'preserve-3d' } : { background: game.image, transformStyle: 'preserve-3d' as const }}
      variants={staggerItem}
      onMouseEnter={handleMouseEnter}
      onMouseMove={tilt.handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {game.cardVideo && (
        <video
          ref={cardVideoRef}
          className="gh-game-card-video"
          src={game.cardVideo}
          muted
          loop
          playsInline
          preload="none"
        />
      )}
      <div className="gh-game-card-overlay">
        <StatusBadge status={game.status} />
        {game.suiplay && <span className="gh-suiplay-badge">SuiPlay</span>}
        <div className="gh-game-card-content">
          <h3 className="gh-game-card-title">{game.title}</h3>
          <p className="gh-game-card-studio">{game.studio}</p>
          <div className="gh-game-card-tags">
            <span className="gh-tag gh-tag-genre">{game.genre}</span>
            {game.tags.slice(0, 2).map(t => <span key={t} className="gh-tag">{t}</span>)}
          </div>
          <div className="gh-game-card-footer">
            <StarRating rating={game.rating} />
            <span className="gh-game-card-players">{game.players}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function CompetitionCard({ comp }: { comp: Competition }) {
  const statusCls =
    comp.status === 'Live' ? 'gh-comp-status-live'
    : comp.status === 'Registration' ? 'gh-comp-status-registration'
    : comp.status === 'Upcoming' ? 'gh-comp-status-upcoming'
    : 'gh-comp-status-ended';

  const btnLabel =
    comp.status === 'Registration' ? 'Register Now'
    : comp.status === 'Live' ? 'Watch Live'
    : comp.status === 'Upcoming' ? 'Notify Me'
    : 'View Results';

  return (
    <motion.div
      className="gh-comp-card"
      style={comp.image.startsWith('/') ? { backgroundImage: `url(${comp.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: comp.image }}
      variants={staggerItem}
    >
      <div className="gh-comp-card-overlay">
        <span className={`gh-comp-status ${statusCls}`}>
          {comp.status === 'Live' && <span className="gh-status-dot" />}
          {comp.status}
        </span>
        <div className="gh-comp-card-content">
          <h3 className="gh-comp-title">{comp.title}</h3>
          <p className="gh-comp-game">{comp.game}</p>
          <div className="gh-comp-meta-row">
            <span className="gh-comp-prize">{comp.prizePool}</span>
            <span className="gh-comp-participants">{comp.participants}/{comp.maxParticipants} players</span>
          </div>
          <div className="gh-comp-bottom-row">
            <span className="gh-comp-dates">
              {new Date(comp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' \u2014 '}
              {new Date(comp.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className={`gh-btn-comp ${comp.status === 'Ended' ? 'gh-btn-comp-disabled' : ''}`}>
              {btnLabel}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FeaturedCompetitionCard({ comp }: { comp: Competition }) {
  const statusCls =
    comp.status === 'Live' ? 'gh-comp-status-live'
    : comp.status === 'Registration' ? 'gh-comp-status-registration'
    : 'gh-comp-status-upcoming';

  const btnLabel = comp.status === 'Registration' ? 'Register Now' : comp.status === 'Live' ? 'Watch Live' : 'Notify Me';

  return (
    <motion.div
      className="gh-comp-featured"
      style={comp.image.startsWith('/') ? { backgroundImage: `url(${comp.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: comp.image }}
      variants={staggerItem}
    >
      <div className="gh-comp-featured-overlay">
        <span className={`gh-comp-status ${statusCls}`}>
          {comp.status === 'Live' && <span className="gh-status-dot" />}
          {comp.status}
        </span>
        <div className="gh-comp-featured-content">
          <h3>{comp.title}</h3>
          <p className="gh-comp-game">{comp.game}</p>
          <div className="gh-comp-meta-row">
            <span className="gh-comp-prize">{comp.prizePool}</span>
            <span className="gh-comp-participants">{comp.participants}/{comp.maxParticipants} players</span>
          </div>
          <div className="gh-comp-bottom-row">
            <span className="gh-comp-dates">
              {new Date(comp.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              {' \u2014 '}
              {new Date(comp.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <button className="gh-btn-comp">{btnLabel}</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StreamCard({ stream }: { stream: LiveStream }) {
  return (
    <motion.div
      className="gh-stream-card"
      style={{ background: stream.thumbnail }}
      variants={staggerItem}
    >
      <div className="gh-stream-badges">
        {stream.isLive && (
          <span className="gh-live-badge">
            <span className="gh-live-dot" />
            LIVE
          </span>
        )}
        <span className="gh-viewer-badge">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          {stream.viewers.toLocaleString()}
        </span>
      </div>
      <div className="gh-stream-card-overlay">
        <div className="gh-stream-play-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        </div>
        <div className="gh-stream-card-content">
          <h4 className="gh-stream-title">{stream.title}</h4>
          <div className="gh-stream-meta">
            <span>{stream.streamer}</span>
            <span className="gh-stream-meta-sep" />
            <span>{stream.game}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EventCard({ event }: { event: GameEvent }) {
  const d = new Date(event.date);
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = d.getDate();
  const typeCls = `gh-event-type-${event.type.toLowerCase()}`;

  return (
    <motion.div
      className="gh-event-card"
      variants={staggerItem}
    >
      <div className="gh-event-date-box">
        <span className="gh-event-date-month">{month}</span>
        <span className="gh-event-date-day">{day}</span>
      </div>
      <div className="gh-event-info">
        <span className={`gh-event-type ${typeCls}`}>{event.type}</span>
        <h4 className="gh-event-title">{event.title}</h4>
        <p className="gh-event-game">{event.game}</p>
        <p className="gh-event-time">{event.time}</p>
      </div>
    </motion.div>
  );
}

function CommunityPulse() {
  const feedIcons: Record<CommunityActivity['type'], string> = {
    win: 'W',
    register: 'R',
    rank: '#',
    milestone: 'M',
    stream: 'S',
  };

  return (
    <section className="gh-section" id="community">
      <div className="gh-container">
        <motion.div className="gh-section-header" variants={fadeBlurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}>
          <h2 className="gh-section-title">Community Pulse</h2>
        </motion.div>

        <div className="gh-community-grid">
          {/* Leaderboard */}
          <div className="gh-community-panel">
            <h3 className="gh-community-panel-title">Leaderboard</h3>
            <div className="gh-lb-list">
              {LEADERBOARD.map(entry => (
                <div key={entry.id} className="gh-lb-row">
                  <span className={`gh-lb-rank ${entry.rank === 1 ? 'gh-lb-rank-gold' : entry.rank === 2 ? 'gh-lb-rank-silver' : entry.rank === 3 ? 'gh-lb-rank-bronze' : ''}`}>
                    {entry.rank}
                  </span>
                  <div className="gh-lb-avatar" style={{ background: entry.avatar }} />
                  <div className="gh-lb-info">
                    <div className="gh-lb-username">{entry.username}</div>
                    <div className="gh-lb-game">{entry.game}</div>
                  </div>
                  <span className="gh-lb-stat">{entry.stat}</span>
                  <span className={`gh-lb-change gh-lb-change-${entry.change}`}>
                    {entry.change === 'up' ? '\u25B2' : entry.change === 'down' ? '\u25BC' : '\u2014'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Player Spotlights */}
          <div className="gh-community-panel">
            <h3 className="gh-community-panel-title">Player Spotlights</h3>
            <div className="gh-spotlight-list">
              {SPOTLIGHTS.map(player => (
                <div key={player.id} className="gh-spotlight-card">
                  <div className="gh-spotlight-top">
                    <div className="gh-spotlight-avatar" style={{ background: player.avatar }} />
                    <div>
                      <div className="gh-spotlight-username">{player.username}</div>
                      <div className="gh-spotlight-title">{player.title}</div>
                    </div>
                  </div>
                  <p className="gh-spotlight-achievement">{player.achievement}</p>
                  <span className="gh-spotlight-game">{player.game}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="gh-community-panel">
            <h3 className="gh-community-panel-title">Activity Feed</h3>
            <div className="gh-feed-list">
              {COMMUNITY_FEED.map(item => (
                <div key={item.id} className="gh-feed-item">
                  <span className={`gh-feed-icon gh-feed-icon-${item.type}`}>
                    {feedIcons[item.type]}
                  </span>
                  <span className="gh-feed-text">{item.text}</span>
                  <span className="gh-feed-time">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SuiPlaySpotlight() {
  return (
    <section className="gh-section" id="suiplay">
      <div className="gh-container">
        <div className="gh-suiplay">
          <div className="gh-suiplay-inner">
            <div className="gh-suiplay-content">
              <h2>SuiPlay</h2>
              <div className="gh-suiplay-features">
                {SUIPLAY_FEATURES.map(feature => (
                  <div key={feature.id} className="gh-suiplay-feature">
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                    <a
                      href={feature.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gh-suiplay-feature-link"
                    >
                      {feature.buttonLabel}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                ))}
              </div>
              <div className="gh-suiplay-partners">
                {SUIPLAY_PARTNERS.map(name => (
                  <span key={name} className="gh-suiplay-partner">{name}</span>
                ))}
              </div>
            </div>
            <div className="gh-suiplay-visual">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <line x1="6" y1="12" x2="6" y2="12" strokeWidth="3" />
                <line x1="10" y1="12" x2="10" y2="12" strokeWidth="3" />
                <circle cx="17" cy="10" r="1.5" />
                <circle cx="17" cy="14" r="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Main Page ───────── */

type CompFilter = 'All' | 'Live' | 'Registration' | 'Upcoming';
const COMP_FILTERS: CompFilter[] = ['All', 'Live', 'Registration', 'Upcoming'];

export default function GameHubPage() {
  const [activeCategory, setActiveCategory] = useState<GameCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllGames, setShowAllGames] = useState(false);
  const [compFilter, setCompFilter] = useState<CompFilter>('All');

  const featuredGames = useMemo(() => GAMES.filter(g => g.featured && g.video), []);
  const comingSoonGames = useMemo(() => GAMES.filter(g => g.status === 'Coming Soon'), []);

  const filteredGames = useMemo(() => {
    let games = GAMES.filter(g => g.status !== 'Coming Soon');
    if (activeCategory !== 'All') {
      games = games.filter(g => g.genre === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      games = games.filter(g =>
        g.title.toLowerCase().includes(q) ||
        g.studio.toLowerCase().includes(q) ||
        g.genre.toLowerCase().includes(q) ||
        g.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return games;
  }, [activeCategory, searchQuery]);

  const displayedGames = showAllGames ? filteredGames : filteredGames.slice(0, 9);

  const activeComps = COMPETITIONS.filter(c => c.status !== 'Ended');
  const filteredComps = compFilter === 'All' ? activeComps : activeComps.filter(c => c.status === compFilter);
  const featuredComp = activeComps.find(c => c.status === 'Live' || c.status === 'Registration');
  const totalPrizePool = activeComps.reduce((sum, c) => {
    const num = parseInt(c.prizePool.replace(/[^0-9]/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  // Slideshow state
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % featuredGames.length);
  }, [featuredGames.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + featuredGames.length) % featuredGames.length);
  }, [featuredGames.length]);

  // Auto-advance slideshow
  useEffect(() => {
    if (featuredGames.length <= 1) return;
    const timer = setInterval(nextSlide, 15000);
    return () => clearInterval(timer);
  }, [nextSlide, featuredGames.length]);

  const currentGame = featuredGames[currentSlide];
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Mute video when hero section scrolls out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setIsMuted(true);
          if (videoRef.current) videoRef.current.muted = true;
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const next = !isMuted;
      videoRef.current.muted = next;
      setIsMuted(next);
    }
  }, [isMuted]);

  const heroParallax = useParallax(0.15);

  // Counter hooks for stats
  const memberCount = useCountUp(89, 1800);
  const suiWonCount = useCountUp(345, 2000);
  const gameCount = useCountUp(GAMES.length, 1200);

  return (
    <main className="gh-page">
      <GameHubHeader />

      {/* === HERO -- Featured Games Slideshow === */}
      <section className="gh-hero" ref={heroRef}>
        <div className="gh-slideshow">
          <AnimatePresence mode="wait">
            {currentGame && (
              <motion.div
                key={currentGame.id}
                className="gh-slide"
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                transition={{ duration: 0.7, ease: [0.77, 0, 0.175, 1] }}
              >
                {currentGame.video ? (
                  <video
                    ref={videoRef}
                    className="gh-slide-video"
                    src={currentGame.video}
                    autoPlay
                    muted={isMuted}
                    loop
                    playsInline
                    onClick={toggleMute}
                  />
                ) : currentGame.image.startsWith('/') ? (
                  <div className="gh-slide-bg gh-slide-img" style={{ backgroundImage: `url(${currentGame.image})` }} />
                ) : (
                  <div className="gh-slide-bg" style={{ background: currentGame.image }} />
                )}
                {currentGame.video && (
                  <button className="gh-slide-mute" onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}>
                    {isMuted ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
                    )}
                  </button>
                )}
                <div className="gh-slide-overlay" />
                <motion.div
                  ref={heroParallax}
                  className="gh-container gh-slide-content"
                  variants={heroTextStagger}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.span className="gh-slide-badge" variants={heroTextItem}>
                    <span className="gh-status-dot" />
                    Featured
                  </motion.span>
                  <motion.h1 className="gh-slide-title" variants={heroTextItem}>{currentGame.title}</motion.h1>
                  <motion.p className="gh-slide-studio" variants={heroTextItem}>{currentGame.studio}</motion.p>
                  <motion.p className="gh-slide-desc" variants={heroTextItem}>{currentGame.description}</motion.p>
                  <motion.div className="gh-slide-meta" variants={heroTextItem}>
                    <StarRating rating={currentGame.rating} />
                    <span style={{ color: '#64748b', fontSize: 13 }}>{currentGame.players}</span>
                    <span className="gh-tag gh-tag-genre">{currentGame.genre}</span>
                  </motion.div>
                  <motion.div className="gh-slide-actions" variants={heroTextItem}>
                    {currentGame.url ? (
                      <a href={currentGame.url} target="_blank" rel="noopener noreferrer" className="gh-btn-primary">
                        Visit Site
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                    ) : (
                      <button className="gh-btn-primary">
                        Play Now
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </button>
                    )}
                    <button className="gh-btn-outline gh-btn-sm">Learn More</button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slideshow controls */}
          <div className="gh-slide-controls">
            <button className="gh-slide-arrow" onClick={prevSlide} aria-label="Previous">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="gh-slide-dots">
              {featuredGames.map((_, i) => (
                <button
                  key={i}
                  className={`gh-slide-dot ${i === currentSlide ? 'gh-slide-dot-active' : ''}`}
                  onClick={() => goToSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span className="gh-slide-dot-num">{i + 1}</span>
                </button>
              ))}
            </div>
            <button className="gh-slide-arrow" onClick={nextSlide} aria-label="Next">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        {/* Stats Bar — inline community metrics */}
        {/* Stats bar removed */}

        {/* Marquee Ticker */}
        <Marquee duration={35}>
          <span className="gh-marquee-item">DARKTIMES</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">XOCIETY</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">Panzerdogs</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">DoubleUp</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">SuiCraft</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">OneFightArena</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">Somnis</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">EVE Frontier</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">ChainCards</span>
          <span className="gh-marquee-sep">/</span>
          <span className="gh-marquee-item">Lineup</span>
          <span className="gh-marquee-sep">/</span>
        </Marquee>
      </section>


      {/* === COMPETITIONS ARENA (promoted) === */}
      <section className="gh-section" id="competitions">
        <div className="gh-container">
          <motion.div className="gh-section-header" variants={fadeBlurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}>
            <h2 className="gh-section-title"><span className="gh-gradient-text">Competitions Arena</span></h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="gh-comp-total-prize">{totalPrizePool.toLocaleString()} SUI in prizes</span>
              <button className="gh-view-all">View All</button>
            </div>
          </motion.div>

          <div className="gh-comp-filter-pills">
            {COMP_FILTERS.map(f => (
              <button
                key={f}
                className={`gh-category-pill ${compFilter === f ? 'gh-category-pill-active' : ''}`}
                onClick={() => setCompFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <motion.div
            className="gh-comp-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {featuredComp && compFilter === 'All' && (
              <FeaturedCompetitionCard comp={featuredComp} />
            )}
            {filteredComps
              .filter(c => !(compFilter === 'All' && featuredComp && c.id === featuredComp.id))
              .map(comp => (
                <CompetitionCard key={comp.id} comp={comp} />
              ))}
          </motion.div>
        </div>
      </section>


      {/* === COMMUNITY PULSE === */}
      <CommunityPulse />


      {/* SuiPlay Spotlight removed */}


      {/* === BROWSE GAMES === */}
      <section className="gh-section" id="browse">
        <div className="gh-container">
          <motion.div className="gh-section-header" variants={fadeBlurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}>
            <h2 className="gh-section-title"><span className="gh-gradient-text">Browse Games</span></h2>
          </motion.div>

          <div className="gh-browse-controls">
            <div className="gh-categories">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`gh-category-pill ${activeCategory === cat ? 'gh-category-pill-active' : ''}`}
                  onClick={() => { setActiveCategory(cat); setShowAllGames(false); }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="gh-search">
              <svg className="gh-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                className="gh-search-input"
                placeholder="Search games..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + searchQuery}
              className="gh-game-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 0.2 } }}
            >
              {displayedGames.length > 0 ? (
                displayedGames.map(game => <GameCard key={game.id} game={game} />)
              ) : (
                <div className="gh-no-results">
                  <p className="gh-no-results-text">No games found</p>
                  <p className="gh-no-results-sub">Try a different category or search term</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {!showAllGames && filteredGames.length > 9 && (
            <div className="gh-show-more-wrap">
              <button className="gh-btn-outline gh-btn-sm" onClick={() => setShowAllGames(true)}>
                Show All ({filteredGames.length} games)
              </button>
            </div>
          )}
        </div>
      </section>


      {/* === COMING SOON === */}
      {comingSoonGames.length > 0 && (
        <section className="gh-section">
          <div className="gh-container">
            <motion.div className="gh-section-header" variants={fadeBlurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}>
              <h2 className="gh-section-title">Coming Soon</h2>
            </motion.div>

            <motion.div className="gh-coming-soon-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
              {comingSoonGames.map((game) => (
                <motion.div
                  key={game.id}
                  className="gh-coming-soon-card"
                  style={game.image.startsWith('/') ? { backgroundImage: `url(${game.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: game.image }}
                  variants={staggerItem}
                >
                  <div className="gh-coming-soon-card-overlay">
                    <span className="gh-coming-soon-label">Coming Soon</span>
                    <div className="gh-coming-soon-content">
                      <h3 className="gh-coming-soon-title">{game.title}</h3>
                      <p className="gh-coming-soon-studio">{game.studio}</p>
                      <div className="gh-game-card-tags">
                        <span className="gh-tag gh-tag-genre">{game.genre}</span>
                        {game.tags.slice(0, 2).map(t => <span key={t} className="gh-tag">{t}</span>)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}


      {/* === GAME EVENTS === */}
      <section className="gh-section" id="events">
        <div className="gh-container">
          <motion.div className="gh-section-header" variants={fadeBlurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}>
            <h2 className="gh-section-title">Game Events</h2>
            <button className="gh-view-all">View Calendar</button>
          </motion.div>

          <motion.div className="gh-events-grid" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            {GAME_EVENTS.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </motion.div>
        </div>
      </section>


      {/* === LIVE STREAMS === */}
      <section className="gh-section" id="streams">
        <div className="gh-container">
          <motion.div className="gh-section-header" variants={fadeBlurIn} initial="hidden" whileInView="visible" viewport={{ once: true }} transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}>
            <h2 className="gh-section-title">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#ef4444' }}>
                <span className="gh-live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', animation: 'gh-pulse 1.5s ease-in-out infinite' }} />
              </span>
              Live Now
            </h2>
            <button className="gh-view-all">View All Streams</button>
          </motion.div>

          <motion.div className="gh-streams-scroll" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
            {STREAMS.map(stream => (
              <StreamCard key={stream.id} stream={stream} />
            ))}
          </motion.div>
        </div>
      </section>


      {/* === CTA / NEWSLETTER === */}
      <section className="gh-cta">
        <div className="gh-cta-bg" />
        <div className="gh-container">
          <div className="gh-cta-content">
            <motion.h2
              className="gh-cta-title"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
            >
              Join the Sui Gaming Community
            </motion.h2>
            <motion.p
              className="gh-cta-subtitle"
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1], delay: 0.1 }}
            >
              Get tournament alerts, community highlights, and SuiPlay drops delivered to your inbox.
            </motion.p>
            <motion.form
              className="gh-cta-form"
              onSubmit={e => e.preventDefault()}
              initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1], delay: 0.2 }}
            >
              <input type="email" className="gh-cta-input" placeholder="Enter your email" />
              <button type="submit" className="gh-btn-primary">Subscribe</button>
            </motion.form>
          </div>
        </div>
      </section>

      <GameHubFooter />
    </main>
  );
}
