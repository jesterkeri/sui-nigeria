'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAcademyProgress } from '@/hooks/useAcademyProgress';
import { courses, getAllLessonIds, getCourseLessonIds, learningPaths } from './data';
import './academy.css';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1 },
};

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const PATH_HOVER_COLORS = [
  { bg: '#c6f7d5', dark: false },
  { bg: '#e0f2fe', dark: false },
  { bg: '#e8f5a3', dark: false },
  { bg: '#fff9e6', dark: false },
  { bg: '#f5f5dc', dark: false },
  { bg: '#008751', dark: true },
];

function LetterFade({ text, baseDelay = 0 }: { text: string; baseDelay?: number }) {
  let charIndex = 0;
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="lf-word">
          {word.split('').map((char) => {
            const i = charIndex++;
            return (
              <span
                key={i}
                className="lf-char"
                style={{ animationDelay: `${baseDelay + i * 20}ms` }}
              >
                {char}
              </span>
            );
          })}
          {wi < words.length - 1 && <span className="lf-char">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

function ScrollLetterFade({ text }: { text: string }) {
  const words = text.split(' ');
  let charIndex = 0;
  return (
    <motion.h2
      className="scroll-lf"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.5 }}
    >
      {words.map((word, wi) => (
        <span key={wi} className="scroll-lf-word">
          {word.split('').map((char) => {
            const i = charIndex++;
            return (
              <motion.span
                key={i}
                className="scroll-lf-char"
                variants={{
                  hidden: { opacity: 0, y: 8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.25, delay: i * 0.02 }}
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="scroll-lf-char">&nbsp;</span>}
        </span>
      ))}
    </motion.h2>
  );
}

function Ring({
  size,
  stroke,
  progress,
}: {
  size: number;
  stroke: number;
  progress: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <svg width={size} height={size}>
      <circle
        className="academy-ring-bg"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
      />
      <circle
        className="academy-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

function CardRing({
  size,
  stroke,
  progress,
}: {
  size: number;
  stroke: number;
  progress: number;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (progress / 100) * c;

  return (
    <svg width={size} height={size}>
      <circle
        className="academy-card-ring-bg"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
      />
      <circle
        className="academy-card-ring-fill"
        cx={size / 2}
        cy={size / 2}
        r={r}
        strokeWidth={stroke}
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}

/* ── Wally Floating AI Assistant ── */
function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top ${show ? 'back-to-top-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}

function Wally() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setMounted(true));
    } else {
      setMounted(false);
    }
  }, [open]);

  return (
    <div className="wally-wrap">
      {open && (
        <div className={`wally-panel ${mounted ? 'wally-panel-open' : ''}`}>
          <div className="wally-panel-header">
            <div className="wally-panel-avatar">
              {/* placeholder – swap for walrus image */}
              <span className="wally-placeholder-img">🐘</span>
            </div>
            <div className="wally-panel-title">
              <span className="wally-name">Wally</span>
              <span className="wally-subtitle">Sui Academy AI</span>
            </div>
            <button type="button" className="wally-close" onClick={() => setOpen(false)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="wally-panel-body">
            <div className="wally-greeting">
              <p>Hey! I&apos;m <strong>Wally</strong>, your Sui Academy assistant.</p>
              <p>Ask me anything about Sui, Move, Walrus, Seal, or any course topic.</p>
            </div>
            <div className="wally-input-wrap">
              <input
                type="text"
                className="wally-input"
                placeholder="Ask Wally something..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // TODO: hook up AI response
                  }
                }}
              />
              <button type="button" className="wally-send">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        className="wally-fab"
        onClick={() => setOpen(!open)}
        aria-label="Ask Wally"
      >
        <span className="wally-fab-img">
          {/* placeholder – swap for walrus image */}
          <span className="wally-placeholder-img">🐘</span>
        </span>
        <span className="wally-fab-label">Ask Wally</span>
      </button>
    </div>
  );
}

export default function AcademyPage() {
  const [activeFilter, setActiveFilter] = useState<DifficultyFilter>('All');
  const [activePathFilter, setActivePathFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const {
    isLoaded,
    getCourseProgress,
    getOverallProgress,
    getCompletedLessonsCount,
    getCompletedCoursesCount,
  } = useAcademyProgress();

  const allLessonIds = useMemo(() => getAllLessonIds(), []);
  const overallProgress = useMemo(
    () => getOverallProgress(allLessonIds),
    [getOverallProgress, allLessonIds]
  );
  const totalLessons = allLessonIds.length;

  const coursesWithProgress = useMemo(
    () =>
      courses.map((course) => {
        const lessonIds = getCourseLessonIds(course.id);
        return {
          ...course,
          lessonIds,
          progress: getCourseProgress(lessonIds),
          completedLessons: getCompletedLessonsCount(lessonIds),
          totalLessons: lessonIds.length,
        };
      }),
    [getCourseProgress, getCompletedLessonsCount]
  );

  const completedCourses = useMemo(
    () =>
      getCompletedCoursesCount(
        coursesWithProgress.map((c) => ({ lessonIds: c.lessonIds }))
      ),
    [getCompletedCoursesCount, coursesWithProgress]
  );

  const filteredCourses = useMemo(() => {
    let filtered = coursesWithProgress;
    if (activeFilter !== 'All') {
      filtered = filtered.filter((c) => c.difficulty === activeFilter);
    }
    if (activePathFilter) {
      filtered = filtered.filter((c) => c.path === activePathFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.modules.some((m) =>
            m.title.toLowerCase().includes(q) ||
            m.lessons.some((l) => l.title.toLowerCase().includes(q))
          )
      );
    }
    return filtered;
  }, [coursesWithProgress, activeFilter, activePathFilter, searchQuery]);

  const pathsWithProgress = useMemo(
    () =>
      learningPaths.map((path) => {
        const pathCourses = coursesWithProgress.filter((c) =>
          path.courseIds.includes(c.id)
        );
        const pathLessonIds = pathCourses.flatMap((c) => c.lessonIds);
        const completed = getCompletedLessonsCount(pathLessonIds);
        return {
          ...path,
          totalLessons: pathLessonIds.length,
          completedLessons: completed,
          progress:
            pathLessonIds.length > 0
              ? Math.round((completed / pathLessonIds.length) * 100)
              : 0,
          courseCount: pathCourses.length,
        };
      }),
    [coursesWithProgress, getCompletedLessonsCount]
  );

  const hasStarted = isLoaded && overallProgress > 0;
  const completedPercent = isLoaded ? overallProgress : 0;
  const courseDoneCount = isLoaded ? completedCourses : 0;

  return (
    <>
      <Header solidBackground />
      <div className="academy-page">
        {/* Decorative crosshairs */}
        <span className="academy-crosshair academy-crosshair--tl">+</span>
        <span className="academy-crosshair academy-crosshair--tr">+</span>
        <span className="academy-crosshair academy-crosshair--bl">+</span>
        <span className="academy-crosshair academy-crosshair--br">+</span>

        {/* Hero */}
        <motion.section
          className="academy-hero"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="academy-hero-eyebrow" variants={fadeUp} transition={{ duration: 0.6 }}>Seal Academy</motion.div>
          <motion.h1 variants={fadeUp} transition={{ duration: 0.7 }}>
            LEARN. BUILD.
            <br />
            SHIP ON SUI.
          </motion.h1>
          <motion.p className="academy-hero-sub" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            Interactive lessons, quizzes, and hands-on learning paths for
            mastering the Sui blockchain from fundamentals to advanced
            applications.
          </motion.p>
          <motion.div className="academy-hero-actions" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.65 }}>
            <a href="#courses" className="academy-hero-cta">
              {'( '}<span className="academy-dot" />{' '}
              {hasStarted ? 'CONTINUE LEARNING' : 'START LEARNING'}
              {' )'}
            </a>
            <a href="#paths" className="academy-hero-cta">
              ( EXPLORE PATHS )
            </a>
          </motion.div>
        </motion.section>


        {/* Stats & Features */}
        <div className="academy-stats-features">
        <motion.div
          className="academy-stats"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="academy-stat" variants={scaleIn} transition={{ duration: 0.5 }}>
            <div className="academy-stat-number">{courses.length}</div>
            <div className="academy-stat-label">Courses</div>
            <div className="academy-stat-desc">Explore structured courses covering Move, DeFi, NFTs, and more on Sui.</div>
          </motion.div>
          <motion.div className="academy-stat" variants={scaleIn} transition={{ duration: 0.5 }}>
            <div className="academy-stat-number">{totalLessons}</div>
            <div className="academy-stat-label">Lessons</div>
            <div className="academy-stat-desc">Bite-sized interactive lessons with quizzes to reinforce your learning.</div>
          </motion.div>
          <motion.div className="academy-stat" variants={scaleIn} transition={{ duration: 0.5 }}>
            <div className="academy-stat-number">{completedPercent}%</div>
            <div className="academy-stat-label">Complete</div>
            <div className="academy-stat-desc">Track your overall progress across all courses and learning paths.</div>
          </motion.div>
          <motion.div className="academy-stat" variants={scaleIn} transition={{ duration: 0.5 }}>
            <div className="academy-stat-number">
              {courseDoneCount}/{courses.length}
            </div>
            <div className="academy-stat-label">Courses Done</div>
            <div className="academy-stat-desc">Finish courses to earn completion badges and unlock new paths.</div>
          </motion.div>
        </motion.div>

        {/* Feature Cards (Seal-style) */}
        <motion.div
          className="academy-features"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.2 }}
          variants={staggerContainer}
        >
          <motion.div className="academy-feature-card" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="academy-feature-card-header">
              <div className="academy-feature-card-title">
                Master the Sui ecosystem from the ground up
              </div>
              <div className="academy-feature-card-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
            <div className="academy-feature-card-desc">
              From Move language fundamentals to advanced DeFi protocols, follow
              structured learning paths designed for every skill level.
            </div>
          </motion.div>
          <motion.div className="academy-feature-card" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="academy-feature-card-header">
              <div className="academy-feature-card-title">
                Test your knowledge with built-in quizzes
              </div>
              <div className="academy-feature-card-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
            <div className="academy-feature-card-desc">
              Every lesson includes interactive quizzes to reinforce what you
              learn. Score 70% or higher to mark lessons complete and track
              your progress.
            </div>
          </motion.div>
          <motion.div className="academy-feature-card" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="academy-feature-card-header">
              <div className="academy-feature-card-title">
                Fifteen curated paths from beginner to expert
              </div>
              <div className="academy-feature-card-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
            <div className="academy-feature-card-desc">
              From Sui Fundamentals to Gaming, Walrus Storage to Seal
              Encryption — each path guides you through related courses in
              the right order.
            </div>
          </motion.div>
          <motion.div className="academy-feature-card" variants={fadeUp} transition={{ duration: 0.5 }}>
            <div className="academy-feature-card-header">
              <div className="academy-feature-card-title">
                Your progress is saved automatically
              </div>
              <div className="academy-feature-card-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </div>
            </div>
            <div className="academy-feature-card-desc">
              Pick up where you left off anytime. Your completed lessons, quiz
              scores, and course progress are stored locally and persist across
              sessions.
            </div>
          </motion.div>
        </motion.div>
        </div>


        {/* Statement Section */}
        <section className="academy-statement">
          <div className="academy-statement-divider academy-statement-divider-top">
            <svg className="academy-statement-divider-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
            <div className="academy-statement-divider-line" />
            <svg className="academy-statement-divider-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
          </div>
          <div className="academy-statement-divider academy-statement-divider-bottom">
            <svg className="academy-statement-divider-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
            <div className="academy-statement-divider-line" />
            <svg className="academy-statement-divider-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
          </div>
          <ScrollLetterFade text="The entire Sui stack directly in one platform." />
        </section>


        {/* Stack Cards */}
        <section className="academy-stack">
          <div className="academy-stack-divider academy-stack-divider-top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
            <div className="academy-stack-divider-line" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
          </div>
          <div className="academy-stack-divider academy-stack-divider-bottom">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
            <div className="academy-stack-divider-line" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
          </div>
          <motion.h2
            className="academy-stack-heading"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.5 }}
          >
            Move. Walrus. Seal. DeepBook. IKA. Nautilus. Consensus. All covered.
          </motion.h2>
          <motion.div
            className="academy-stack-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.15 }}
            variants={staggerContainer}
          >
            {[
              { name: 'Move', desc: 'The smart contract language powering Sui — resource-oriented, safe by design, and built for digital assets.', color: '#1a1a2e' },
              { name: 'Walrus', desc: 'Decentralized storage with erasure coding. Store blobs, host sites, and serve data at scale without centralized servers.', color: '#b8b4f8' },
              { name: 'Seal', desc: 'Programmable encryption and on-chain access control. Token-gate content, time-lock data, and manage secrets.', color: '#c6f7d5' },
              { name: 'DeepBook', desc: 'Sui\'s native on-chain order book. A fully decentralized CLOB with sub-second settlement and flash loans.', color: '#e8f5a3' },
              { name: 'IKA', desc: 'Zero-trust cross-chain signatures via 2PC-MPC. Control assets on any blockchain directly from Sui smart contracts.', color: '#fff9e6' },
              { name: 'Nautilus', desc: 'Verifiable off-chain computation using Trusted Execution Environments with on-chain proof verification.', color: '#f5f5dc' },
              { name: 'zkLogin', desc: 'Sign in with Google, Apple, or Twitch — zero-knowledge proofs create Sui wallets without seed phrases.', color: '#121212' },
              { name: 'Kiosk', desc: 'Decentralized commerce framework with creator-enforced royalties, transfer policies, and marketplace rules.', color: '#1a1a2e' },
              { name: 'SuiNS', desc: 'Human-readable .sui and .move domain names for wallets, dApps, and on-chain identity.', color: '#b8b4f8' },
              { name: 'Consensus', desc: 'From Narwhal to Mysticeti — Sui\'s consensus evolution delivers sub-second finality at the BFT minimum.', color: '#c6f7d5' },
            ].map((item, i) => {
              const isDark = item.color === '#1a1a2e' || item.color === '#121212';
              return (
                <motion.div
                  key={item.name}
                  className="academy-stack-card"
                  style={{ background: item.color, color: isDark ? '#fff' : '#000' }}
                  variants={scaleIn}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.5) }}
                >
                  <div className={`academy-stack-card-dot ${isDark ? 'dot-light' : 'dot-dark'}`} />
                  <div className="academy-stack-card-name">{item.name}</div>
                  <div className="academy-stack-card-desc">{item.desc}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* 01 — Learning Paths */}
        <motion.section
          className="academy-numbered-section"
          id="paths"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.15 }}
          variants={staggerContainer}
        >
          <motion.div className="academy-numbered-heading" variants={fadeUp} transition={{ duration: 0.5 }}>
            <span className="academy-numbered-n">01</span>
            <span className="academy-numbered-title">Choose Your Path</span>
          </motion.div>
          <div className="academy-paths-grid">
            {pathsWithProgress.map((path, pi) => {
              const pathCourses = coursesWithProgress.filter((c) =>
                path.courseIds.includes(c.id)
              );
              const hoverBg = PATH_HOVER_COLORS[pi % PATH_HOVER_COLORS.length];
              const isDark = hoverBg.dark;
              return (
                <button
                  key={path.id}
                  type="button"
                  className={`academy-path-card ${activePathFilter === path.id ? 'active' : ''} ${isDark ? 'path-dark' : 'path-light'}`}
                  style={{ '--path-hover-bg': hoverBg.bg, '--path-hover-color': hoverBg.dark ? '#fff' : '#000' } as React.CSSProperties}
                  onClick={() =>
                    setActivePathFilter(
                      activePathFilter === path.id ? null : path.id
                    )
                  }
                >
                  <div className="academy-path-card-header">
                    <div className="academy-path-card-name">{path.title}</div>
                    <div className="academy-path-card-tag">
                      {path.courseCount} courses
                    </div>
                  </div>
                  <div className="academy-path-card-desc">{path.description}</div>
                  <div className="academy-path-card-courses">
                    {pathCourses.map((course, ci) => (
                      <div key={course.id} className="academy-path-course-item">
                        <span className="academy-path-course-dot" />
                        <span className="academy-path-course-name">
                          <LetterFade text={course.title} baseDelay={ci * 80} />
                        </span>
                        <span className="academy-path-course-lessons">{course.totalLessons} lessons</span>
                      </div>
                    ))}
                  </div>
                  <div className="academy-path-card-footer">
                    <div className="academy-path-card-meta">
                      {isLoaded ? path.completedLessons : 0}/{path.totalLessons}{' '}
                      lessons done
                    </div>
                    <div className="academy-ring-wrap">
                      <Ring
                        size={36}
                        stroke={3.5}
                        progress={isLoaded ? path.progress : 0}
                      />
                      <div className="academy-ring-text">
                        {isLoaded ? path.progress : 0}%
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.section>


        {/* 02 — Courses */}
        <section
          className="academy-courses-section"
          id="courses"
        >
          <motion.div
            className="academy-courses-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <span className="academy-courses-n">02</span>
            <span className="academy-courses-title">Browse Courses</span>
            <span className="academy-courses-count">
              {filteredCourses.length} course
              {filteredCourses.length !== 1 ? 's' : ''}
            </span>
          </motion.div>

          <div className="academy-search">
            <svg className="academy-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              className="academy-search-input"
              placeholder="Search courses, topics, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="academy-search-clear"
                onClick={() => setSearchQuery('')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="academy-filters">
            {(
              ['All', 'Beginner', 'Intermediate', 'Advanced'] as DifficultyFilter[]
            ).map((f) => (
              <button
                key={f}
                type="button"
                className={`academy-filter ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="academy-grid">
            <AnimatePresence mode="popLayout">
            {filteredCourses.map((course, index) => {
              const actionText =
                course.progress === 100
                  ? '( COMPLETED )'
                  : course.progress > 0
                    ? '( CONTINUE )'
                    : '( START )';
              const actionClass = course.progress === 100 ? 'done' : '';

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3) }}
                  layout
                >
                <Link
                  href={`/academy/${course.id}`}
                  className="academy-card"
                >
                  <div className="academy-card-top">
                    <span
                      className={`academy-card-badge ${course.difficulty.toLowerCase()}`}
                    >
                      {course.difficulty}
                    </span>
                    <div className="academy-card-ring">
                      <CardRing
                        size={40}
                        stroke={3.5}
                        progress={isLoaded ? course.progress : 0}
                      />
                      <div className="academy-card-ring-text">
                        {isLoaded ? course.progress : 0}%
                      </div>
                    </div>
                  </div>
                  <div className="academy-card-title">{course.title}</div>
                  <div className="academy-card-desc">{course.description}</div>
                  <div className="academy-card-modules">
                    {course.modules.map((mod) => (
                      <div key={mod.id} className="academy-card-module">
                        <span className="academy-card-module-name">{mod.title}</span>
                        <span className="academy-card-module-count">{mod.lessons.length}</span>
                      </div>
                    ))}
                  </div>
                  <div className="academy-card-tags">
                    {course.tags.map((tag) => (
                      <span key={tag} className="academy-card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="academy-card-footer">
                    <span className="academy-card-meta">
                      {course.completedLessons}/{course.totalLessons} lessons
                    </span>
                    <span className={`academy-card-action ${actionClass}`}>
                      {isLoaded ? actionText : '( START )'}
                    </span>
                  </div>
                </Link>
                </motion.div>
              );
            })}

            </AnimatePresence>
            {filteredCourses.length === 0 && (
              <div className="academy-empty">
                No courses match the selected filters.
              </div>
            )}
          </div>
        </section>
      </div>
      <BackToTop />
      <Wally />
      <Footer />
    </>
  );
}
