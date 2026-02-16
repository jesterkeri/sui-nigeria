'use client';

import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AcademyHeader } from './AcademyHeader';
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

const ecosystemProjects = [
  { name: 'Cetus', description: 'One of the earliest DEXes on Sui, Cetus pioneered concentrated liquidity pools that let LPs focus capital in specific price ranges for maximum efficiency. A cornerstone of Sui DeFi since day one.', category: 'DeFi', url: 'https://www.cetus.zone', color: '#EAFF7E' },
  { name: 'FlowX', description: 'FlowX routes trades across every major Sui DEX to find the best price. Its smart liquidity aggregation has made it the go-to swap router for traders seeking optimal execution since mainnet launch.', category: 'DeFi', url: 'https://flowx.finance', color: '#97F0E5' },
  { name: 'NAVI Protocol', description: 'The first lending and borrowing protocol built on Sui. NAVI lets users supply assets to earn yield or borrow against their holdings, forming the backbone of Sui\'s money market infrastructure.', category: 'DeFi', url: 'https://www.naviprotocol.io', color: '#E4CDFB' },
  { name: 'Scallop', description: 'A battle-tested money market that has processed billions in lending volume. Scallop\'s institutional-grade risk framework and multi-asset support make it one of Sui\'s most trusted DeFi protocols.', category: 'DeFi', url: 'https://www.scallop.io', color: '#e8f5a3' },
  { name: 'Aftermath Finance', description: 'Aftermath brought liquid staking to Sui with afSUI, letting users earn staking rewards while keeping their capital active across DeFi. Their suite also includes a DEX, farms, and portfolio tools.', category: 'DeFi', url: 'https://aftermath.finance', color: '#f5f5dc' },
  { name: 'Bucket Protocol', description: 'Bucket mints $BUCK, an over-collateralized stablecoin backed by SUI and other Sui-native assets. An early Sui DeFi primitive, it gives the ecosystem a decentralized, stable unit of account.', category: 'DeFi', url: 'https://www.bucketprotocol.io', color: '#b8b4f8' },
  { name: 'Turbos Finance', description: 'A concentrated liquidity DEX that launched alongside Sui mainnet. Turbos offers tight spreads and efficient capital deployment through customizable tick ranges and an intuitive trading interface.', category: 'DeFi', url: 'https://www.turbos.finance', color: '#FFD6E0' },
  { name: 'DeepBook', description: 'Sui\'s native on-chain central limit order book, built directly into the protocol layer. DeepBook provides shared liquidity infrastructure that any dApp can plug into for transparent, decentralized trading.', category: 'DeFi', url: 'https://deepbook.tech', color: '#e0f2fe' },
  { name: 'BlueFin', description: 'A fully on-chain perpetuals exchange offering leveraged trading with sub-second settlement. BlueFin has been operating since the early days of Sui, bringing derivatives to the ecosystem.', category: 'DeFi', url: 'https://bluefin.io', color: '#EAFF7E' },
  { name: 'TradePort', description: 'A multi-chain NFT marketplace and aggregator with deep Sui support. TradePort lets collectors discover, trade, and manage NFTs across Sui with real-time analytics and portfolio tracking.', category: 'NFTs', url: 'https://tradeport.xyz', color: '#97F0E5' },
  { name: 'Mysten Labs', description: 'The core team behind Sui. Founded by former Meta engineers, Mysten Labs designed the Move-based architecture, object-centric model, and consensus innovations that make Sui uniquely performant.', category: 'Infrastructure', url: 'https://mystenlabs.com', color: '#fff9e6' },
  { name: 'Walrus', description: 'Decentralized blob storage powered by erasure coding and built by Mysten Labs. Walrus lets developers store large files, host frontends, and serve media without relying on centralized cloud providers.', category: 'Infrastructure', url: 'https://www.walrus.xyz', color: '#E4CDFB' },
  { name: 'SuiNS', description: 'The official naming service for Sui, turning long hex addresses into readable .sui domains. SuiNS has been live since launch, providing on-chain identity for wallets, dApps, and profiles.', category: 'Infrastructure', url: 'https://suins.io', color: '#e8f5a3' },
  { name: 'Pyth Network', description: 'High-fidelity oracle price feeds integrated into Sui from day one. Pyth pulls real-time data from institutional trading firms and exchanges, giving Sui DeFi protocols reliable, low-latency pricing.', category: 'Infrastructure', url: 'https://pyth.network', color: '#b8b4f8' },
  { name: 'Wormhole', description: 'The leading cross-chain messaging protocol, Wormhole was one of the first bridges to support Sui. It enables seamless asset and data transfers between Sui and 30+ other blockchains.', category: 'Infrastructure', url: 'https://wormhole.com', color: '#f5f5dc' },
  { name: 'Studio Mirai', description: 'A product studio crafting polished consumer apps and developer tools on Sui. Studio Mirai focuses on bridging the gap between blockchain infrastructure and delightful end-user experiences.', category: 'Infrastructure', url: 'https://studiomirai.io', color: '#FFD6E0' },
  { name: 'GiveRep', description: 'An on-chain reputation protocol where users can give and receive attestations on Sui. GiveRep is building the social trust layer — portable reputation scores that follow you across the ecosystem.', category: 'Social', url: 'https://giverep.xyz', color: '#e0f2fe' },
];

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';

const PATH_HOVER_COLORS = [
  { bg: '#EAFF7E', dark: false },
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
              <span className="wally-subtitle">Cuttlefish AI</span>
            </div>
            <button type="button" className="wally-close" onClick={() => setOpen(false)} aria-label="Close Wally">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="wally-panel-body">
            <div className="wally-greeting">
              <p>Hey! I&apos;m <strong>Wally</strong>, your Cuttlefish assistant.</p>
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
              <button type="button" className="wally-send" aria-label="Send message">
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
  const account = useCurrentAccount();
  const walletAddress = account?.address ?? null;
  const {
    isLoaded,
    getCourseProgress,
    getOverallProgress,
    getCompletedLessonsCount,
    getCompletedCoursesCount,
  } = useAcademyProgress(walletAddress);

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
      <AcademyHeader />
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
          <motion.div className="academy-hero-eyebrow" variants={fadeUp} transition={{ duration: 0.6 }}>Cuttlefish</motion.div>
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
          <motion.img
            src="https://cdn.prod.website-files.com/687615731a76518b8c27cf39/68761ce22a49c0f7365165e8_Group%202147263312%20(1).svg"
            alt=""
            className="academy-hero-sticker-right"
            initial={{ opacity: 0, scale: 0.6, rotate: 35 }}
            animate={{ opacity: 1, scale: 1, rotate: 20 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          />
          <motion.svg
            className="academy-hero-sticker-blob"
            viewBox="0 0 120 110"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.1, ease: 'easeOut' }}
          >
            <g clipPath="url(#clip0_3542_1039)">
              <path fillRule="evenodd" clipRule="evenodd" d="M119 36.9192V51.4517L118.898 52.1681L118.796 52.9868L118.591 53.8056L118.387 54.6243L118.182 55.3407L117.875 56.1594L117.466 56.9782L117.057 57.7969L116.546 58.5133L115.933 59.332L89.1431 95.7657L88.5296 96.4821L87.8139 97.3008L87.2004 98.0172L86.4846 98.6313L85.6666 99.3477L84.9509 99.9617L84.0306 100.576L83.2126 101.19L82.2924 101.702L81.4744 102.213L80.4519 102.725L79.5316 103.134L78.5091 103.646L77.5889 103.953L76.5664 104.362L75.5439 104.669L74.5214 104.976L73.3967 105.283L72.3742 105.488L71.2494 105.693L70.2269 105.795L69.1022 105.898L68.0797 106H66.9549H65.9324H64.8077L63.7852 105.898L62.6604 105.795L61.638 105.59L60.6155 105.386L59.593 105.181L58.5705 104.874L12.1491 90.3416L11.1266 90.0346L10.2064 89.7275L9.38838 89.3182L8.46813 88.9088L7.65013 88.3971L6.93439 87.8854L6.21864 87.3737L5.50289 86.862L4.88939 86.2479L4.2759 85.7362L3.76465 85.0198L3.2534 84.4058L2.8444 83.7917L2.4354 83.0753L2.12865 82.3589L1.8219 81.6425L1.51515 80.9261L1.31066 80.2097L1.20841 79.4934L1.10616 78.6746L1.00391 77.9582V63.4257L1.10616 64.1421L1.20841 64.9608L1.31066 65.6772L1.51515 66.3936L1.8219 67.11L2.12865 67.8264L2.4354 68.5428L2.8444 69.2592L3.2534 69.8732L3.76465 70.4873L4.2759 71.1013L4.88939 71.7154L5.50289 72.3294L6.21864 72.8411L6.93439 73.3528L7.65013 73.8646L8.46813 74.3763L9.38838 74.7856L10.2064 75.195L11.1266 75.502L12.1491 75.8091L58.5705 90.3416L59.593 90.6486L60.6155 90.8533L61.638 91.058L62.6604 91.2627L63.7852 91.365L64.8077 91.4673H65.9324H66.9549H68.0797L69.1022 91.365L70.2269 91.2627L71.2494 91.058L72.3742 90.9556L73.3967 90.6486L74.5214 90.4439L75.5439 90.1369L76.5664 89.8299L77.5889 89.4205L78.5091 89.1135L79.5316 88.6018L80.4519 88.1924L81.4744 87.6807L82.2924 87.169L83.2126 86.6573L84.0306 86.0432L84.9509 85.4292L85.6666 84.8151L86.4846 84.0987L87.2004 83.4847L87.8139 82.7683L88.5296 81.9496L89.1431 81.2332L115.933 44.7995L116.546 43.9808L117.057 43.2644L117.466 42.4456L117.875 41.6269L118.182 40.8082L118.387 40.0918L118.591 39.273L118.796 38.4543L118.898 37.6356L119 36.9192Z" fill="#0C0F1D" stroke="#0C0F1D" strokeWidth="2.05" strokeLinejoin="bevel" />
              <path fillRule="evenodd" clipRule="evenodd" d="M87.7116 97.4032L87.2004 98.0173L86.4846 98.6313L85.6666 99.3477L84.9509 99.9618L84.0306 100.576L83.2126 101.19L82.2924 101.702L81.4744 102.213L80.4519 102.725L79.5316 103.134L78.5091 103.646L77.5889 103.953L76.5664 104.362L75.5439 104.669L74.5214 104.977L73.3967 105.284L72.3742 105.488L71.2494 105.693L70.2269 105.795L69.1022 105.898L68.0797 106H66.9549H65.9324H64.8077L63.7852 105.898L62.6604 105.795L61.638 105.591L60.6155 105.386L59.593 105.181L58.5705 104.874L12.1491 90.3417L11.1266 90.0346L10.2064 89.7276L9.38838 89.3182L8.46813 88.9089L7.65013 88.3972L6.93439 87.8855L6.21864 87.3737L5.50289 86.862L4.88939 86.248L4.2759 85.7363L3.76465 85.0199L3.2534 84.4058L2.8444 83.7918L2.4354 83.0754L2.12865 82.359L1.8219 81.6426L1.51515 80.9262L1.31066 80.2098L1.20841 79.4934L1.10616 78.6747L1.00391 77.9583V63.4258L1.10616 64.1422L1.20841 64.9609L1.31066 65.6773L1.51515 66.3937L1.8219 67.1101L2.12865 67.8265L2.4354 68.5429L2.8444 69.2593L3.2534 69.8733L3.76465 70.4874L4.2759 71.1014L4.88939 71.7155L5.50289 72.3295L6.21864 72.8412L6.93439 73.3529L7.65013 73.8646L8.46813 74.3763L9.38838 74.7857L10.2064 75.1951L11.1266 75.5021L12.1491 75.8091L58.5705 90.3417L59.593 90.6487L60.6155 90.8534L61.638 91.0581L62.6604 91.2627L63.7852 91.3651L64.8077 91.4674H65.9324H66.9549H68.0797L69.1022 91.3651L70.2269 91.2627L71.2494 91.0581L72.3742 90.9557L73.3967 90.6487L74.5214 90.444L75.5439 90.137L76.5664 89.8299L77.5889 89.4206L78.5091 89.1136L79.5316 88.6018L80.4519 88.1925L81.4744 87.6808L82.2924 87.1691L83.2126 86.6574L84.0306 86.0433L84.9509 85.4293L85.6666 84.8152L86.4846 84.0988L87.2004 83.4848L87.7116 82.8707V97.4032Z" fill="#97F0E5" stroke="#0C0F1D" strokeWidth="2.05" />
              <path fillRule="evenodd" clipRule="evenodd" d="M61.434 9.18459L107.855 23.6148C118.489 26.8897 122.17 36.5098 115.933 44.7995L89.1437 81.2332C82.9065 89.5229 69.205 93.6165 58.571 90.3416L12.1497 75.8091C1.51573 72.5341 -2.16525 63.0163 3.96973 54.6243L30.8614 18.293C37.0986 9.90099 50.8001 5.80732 61.434 9.18459Z" fill="#97F0E5" stroke="#0C0F1D" strokeWidth="2.05" />
              <path d="M34.643 58.6156L38.9375 52.7821L56.32 58.2062L52.0255 64.0397L56.9335 65.5748L61.228 59.7413L58.774 58.9226L63.0685 53.0891L60.6145 52.3727L64.9089 46.5392L62.455 45.7205L66.7494 39.887L64.2954 39.0683L67.1584 35.1793L59.6942 32.8254L56.8312 36.7144L54.3772 35.998L50.0827 41.8315L47.5265 41.1151L43.232 46.9486L40.778 46.1299L36.4835 51.9633L34.0295 51.247L29.6328 57.0804L34.643 58.6156ZM44.2545 49.7118L45.686 47.665L48.2423 48.4837L52.5367 42.6502L54.9907 43.3666L57.8537 39.4777L60.41 40.2964L57.4447 44.1854L59.8987 45.0041L55.6042 50.8376L58.1605 51.554L56.729 53.4985L44.2545 49.7118ZM66.8517 68.645L86.9949 41.4221L82.0869 39.887L61.9437 67.1099L66.8517 68.645Z" fill="#0C0F1D" />
              <path fillRule="evenodd" clipRule="evenodd" d="M105.707 62.6069V70.1802L105.604 70.8966L105.502 71.613L105.4 72.2271L105.298 72.9434V73.6598L105.195 74.3762V75.0926V75.809V68.2357V67.5193V66.8029L105.298 66.0866V65.3702L105.4 64.7561L105.502 64.0397L105.604 63.3233L105.707 62.6069Z" fill="#F6F6F6" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M114.196 83.6895V91.1604V91.5698L113.991 91.9791L113.787 92.3885L113.48 92.6955L113.173 93.0026L112.662 93.2072L112.151 93.4119L111.537 93.6166L110.924 93.7189L110.208 93.8213H109.492V86.248H110.208L110.924 86.1457L111.537 86.0433L112.151 85.8386L112.662 85.6339L113.173 85.4293L113.48 85.1222L113.787 84.8152L113.991 84.4058L114.196 83.9965V83.6895Z" fill="#0C0F1D" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M109.491 86.2476V93.8208H108.979H108.57H108.161H107.752H107.241L106.832 93.9232H106.423H106.014H105.503H105.094L104.685 94.0255H104.174H103.765L103.356 94.1279H102.844H102.435L102.026 94.2302H101.617L101.106 94.3326H100.697L100.288 94.4349H99.8791L99.3679 94.5372L98.9589 94.6396H98.5499L98.1409 94.7419L97.7319 94.8443L97.2206 94.9466L96.8116 95.0489L96.4026 95.1513L95.9936 95.2536L95.5846 95.356L94.7666 95.663L93.8464 95.97L93.0284 96.277L92.2104 96.5841L91.3924 96.8911L90.5744 97.3005L89.7564 97.7098L88.9384 98.1192L88.1204 98.5286L87.3024 98.9379L86.5867 99.3473L85.7687 99.859L85.0529 100.268L84.2349 100.78L83.5192 101.189L82.7012 101.701V94.1279L83.5192 93.6162L84.2349 93.2068L85.0529 92.6951L85.7687 92.2857L86.5867 91.774L87.3024 91.3646L88.1204 90.9553L88.9384 90.5459L89.7564 90.1365L90.5744 89.7272L91.3924 89.3178L92.2104 89.0108L93.0284 88.7038L93.8464 88.3967L94.7666 88.0897L95.5846 87.7827L95.9936 87.6803L96.4026 87.578L96.8116 87.4757L97.2206 87.3733L97.7319 87.271L98.1409 87.1686L98.5499 87.0663H98.9589L99.3679 86.964L99.8791 86.8616H100.288L100.697 86.7593H101.106L101.617 86.6569H102.026L102.435 86.5546H102.844H103.356L103.765 86.4522H104.174H104.685L105.094 86.3499H105.503H106.014H106.423H106.832L107.241 86.2476H107.752H108.161H108.57H108.979H109.491Z" fill="#E4CDFB" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M76.9766 86.964V94.5373V93.9233V93.2069L76.8744 92.5928L76.7721 91.9788L76.6699 91.3647L76.5676 90.7507L76.3631 90.1366L76.1586 89.6249L75.9541 89.0109L75.6474 88.3968L75.3406 87.8851L75.0339 87.2711L74.6249 86.7594L74.2159 86.2477L73.8069 85.7359L73.3979 85.2242L72.8866 84.7125L72.3754 84.2008L71.9664 83.6891L71.4551 83.1774L70.9439 82.768L70.4327 82.2563L69.9214 81.7446L69.4102 81.3353V73.762L69.9214 74.2737L70.4327 74.683L70.9439 75.1947L71.4551 75.6041L71.9664 76.1158L72.3754 76.6275L72.8866 77.1392L73.3979 77.6509L73.8069 78.1627L74.2159 78.6744L74.6249 79.1861L75.0339 79.8001L75.3406 80.3118L75.6474 80.8235L75.9541 81.4376L76.1586 82.0516L76.3631 82.5634L76.5676 83.1774L76.6699 83.7915L76.7721 84.4055L76.8744 85.0196L76.9766 85.7359V86.35V86.964Z" fill="#0C0F1D" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M82.7021 94.1283V101.702L82.1908 102.009L81.5773 102.316L80.9638 102.623L80.3503 102.725L79.7368 102.827H79.2256L78.7143 102.725L78.2031 102.623L77.6918 102.418L77.2828 102.213L76.9761 101.906L76.7716 101.599L76.5671 101.19L76.4648 100.781V100.269V92.6956V93.2073L76.5671 93.6166L76.7716 94.026L76.9761 94.333L77.2828 94.64L77.6918 94.8447L78.2031 95.0494L78.7143 95.1518L79.2256 95.2541H79.7368L80.3503 95.1518L80.9638 95.0494L81.5773 94.8447L82.1908 94.5377L82.7021 94.1283Z" fill="#E4CDFB" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M69.4079 73.7621V81.3354L68.8967 80.926L68.59 80.619L68.3855 80.2096L68.2832 79.8003V79.3909V71.8176V72.227L68.3855 72.6364L68.59 73.0457L68.8967 73.3528L69.4079 73.7621Z" fill="#F6F6F6" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M105.811 61.5835V69.0544V69.5662L105.709 70.1802V62.6069L105.811 62.0952V61.5835Z" fill="#F6F6F6" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path fillRule="evenodd" clipRule="evenodd" d="M105.706 62.6073C105.194 66.2916 104.785 70.1806 106.115 73.5578C107.342 76.6281 110.205 79.1866 112.863 81.5405C115.828 83.6897 113.579 86.4529 109.489 86.2482C104.888 86.3506 99.9796 86.5552 95.5828 87.7833C90.8793 89.1138 86.6871 91.6723 82.6994 94.1285C79.6319 96.3801 75.7464 95.0496 76.5644 92.184C76.9734 88.7044 77.3824 85.1225 76.1554 82.0522C74.9284 78.8796 72.0654 76.2187 69.4069 73.7625C66.7484 71.9204 69.2024 68.7478 72.8834 69.0548C77.8936 68.8501 83.2106 68.5431 88.0163 67.008C92.4131 65.6775 96.2986 63.119 99.9796 60.7651C103.354 58.4113 106.524 59.4347 105.706 62.6073Z" fill="#F6F6F6" stroke="#0C0F1D" strokeWidth="2.05" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M61.6387 91.0579V105.59" stroke="#0C0F1D" strokeWidth="2.05" />
            </g>
          </motion.svg>
          <motion.img
            src="https://cdn.prod.website-files.com/6864f039b26f4afedada6bc5/6864f039b26f4afedada6bf4_footer-img.svg"
            alt=""
            className="academy-hero-sticker-footer"
            initial={{ opacity: 0, y: 30, rotate: 45 }}
            animate={{ opacity: 1, y: 0, rotate: 30 }}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          />
          <motion.img
            src="https://cdn.prod.website-files.com/6864f039b26f4afedada6bc5/68b56b16fd3c36b689ce5044_walrus.svg"
            alt=""
            className="academy-hero-sticker"
            initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          />
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
          <motion.div className="academy-stat academy-stat-alt" variants={scaleIn} transition={{ duration: 0.5 }}>
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
          <div className="academy-statement-row">
            <ScrollLetterFade text="The entire Sui stack directly in one platform." />
            <motion.img
              src="https://cdn.prod.website-files.com/687615731a76518b8c27cf39/6942de7013b2ca1bc0490ede_WordMark_Sunlight.svg"
              alt=""
              className="academy-statement-logo"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            />
          </div>
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
              { name: 'Seal', desc: 'Programmable encryption and on-chain access control. Token-gate content, time-lock data, and manage secrets.', color: '#EAFF7E' },
              { name: 'DeepBook', desc: 'Sui\'s native on-chain order book. A fully decentralized CLOB with sub-second settlement and flash loans.', color: '#e8f5a3' },
              { name: 'IKA', desc: 'Zero-trust cross-chain signatures via 2PC-MPC. Control assets on any blockchain directly from Sui smart contracts.', color: '#fff9e6' },
              { name: 'Nautilus', desc: 'Verifiable off-chain computation using Trusted Execution Environments with on-chain proof verification.', color: '#f5f5dc' },
              { name: 'zkLogin', desc: 'Sign in with Google, Apple, or Twitch — zero-knowledge proofs create Sui wallets without seed phrases.', color: '#121212' },
              { name: 'Kiosk', desc: 'Decentralized commerce framework with creator-enforced royalties, transfer policies, and marketplace rules.', color: '#1a1a2e' },
              { name: 'SuiNS', desc: 'Human-readable .sui and .move domain names for wallets, dApps, and on-chain identity.', color: '#b8b4f8' },
              { name: 'Consensus', desc: 'From Narwhal to Mysticeti — Sui\'s consensus evolution delivers sub-second finality at the BFT minimum.', color: '#EAFF7E' },
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
                aria-label="Clear search"
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

        {/* 03 — Ecosystem */}
        <section className="academy-ecosystem-section" id="ecosystem">
          <div className="academy-ecosystem-divider academy-ecosystem-divider-top">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
            <div className="academy-ecosystem-divider-line" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
          </div>

          <motion.div
            className="academy-ecosystem-heading"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={fadeUp}
            transition={{ duration: 0.5 }}
          >
            <span className="academy-ecosystem-n">03</span>
            <span className="academy-ecosystem-title">Ecosystem</span>
          </motion.div>

          <div className="academy-ecosystem-slider">
            <div className="academy-ecosystem-track">
              {[...ecosystemProjects, ...ecosystemProjects].map((project, i) => (
                <a
                  key={`${project.name}-${i}`}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academy-ecosystem-card"
                  style={{ background: project.color }}
                >
                  {/* Top: logo mark + dot */}
                  <div className="academy-ecosystem-card-header">
                    <span className="academy-ecosystem-card-logo">{project.name.split(' ')[0]}</span>
                    <span className="academy-ecosystem-card-dot" />
                  </div>

                  {/* Middle: divider */}
                  <div className="academy-ecosystem-card-divider">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
                    </svg>
                    <div className="academy-ecosystem-card-divider-line" />
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
                    </svg>
                  </div>

                  {/* Bottom: category + name + description */}
                  <div className="academy-ecosystem-card-body">
                    <div className="academy-ecosystem-card-category">{project.category}</div>
                    <div className="academy-ecosystem-card-name"><strong>{project.name}</strong></div>
                    <div className="academy-ecosystem-card-desc">{project.description}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="academy-ecosystem-divider academy-ecosystem-divider-bottom">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
            <div className="academy-ecosystem-divider-line" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12.226 0.44V23.147M0.873 11.794H23.58M18.42 11.793C18.42 15.213 15.647 17.986 12.226 17.986C8.806 17.986 6.034 15.213 6.034 11.793C6.034 8.373 8.806 5.6 12.226 5.6C15.647 5.6 18.42 8.373 18.42 11.793Z" stroke="currentColor" strokeWidth="1.03" />
            </svg>
          </div>
        </section>
      </div>
      <BackToTop />
      <Wally />
    </>
  );
}
