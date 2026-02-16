'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, RadialBarChart, RadialBar } from 'recharts';
import { useCurrentAccount, useDisconnectWallet, useSuiClient } from '@mysten/dapp-kit';
import { useForumTheme } from '../forum/useForumTheme';
import { useAcademyProgress } from '@/hooks/useAcademyProgress';
import { courses, learningPaths, getAllLessonIds, getCourseLessonIds, getCourseById } from '../data';
import { mockPosts, mockComments } from '../forum/mockData';
import { FORUM_COLORS } from '../forum/themes';
import { AcademyHeader } from '../AcademyHeader';
import { WalletGate } from '../forum/components/WalletGate';
import '../academy.css';
import '../forum/forum.css';
import './profile.css';

/* ──────────────────────────────────────────
   SVG Icons
   ────────────────────────────────────────── */
const Icons = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  ),
  fileText: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  checkCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  messageCircle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  trendingUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  ),
  flame: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  ),
  compass: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  ),
  graduationCap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5" />
    </svg>
  ),
  award: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  flag: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  ),
  map: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
};

/* ──────────────────────────────────────────
   Helpers
   ────────────────────────────────────────── */
function addressToColor(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) hash = address.charCodeAt(i) + ((hash << 5) - hash);
  const colors = ['#EAFF7E', '#97F0E5', '#b8b4f8', '#E4CDFB', '#60a5fa', '#fbbf24', '#f472b6', '#34d399', '#f87171', '#a78bfa', '#fb923c', '#38bdf8', '#4ade80', '#e879f9', '#facc15'];
  return colors[Math.abs(hash) % colors.length];
}
function addressToInitials(address: string): string {
  return address.length >= 4 ? address.slice(2, 4).toUpperCase() : '??';
}
function truncateAddress(address: string): string {
  return address.length <= 10 ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
}
function getColorLuminance(hex: string): number {
  const c = hex.replace('#', '');
  if (c.length < 6) return 1;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}
function isColorDark(hex: string): boolean {
  return getColorLuminance(hex) < 0.55;
}

function getLearnerLevel(count: number) {
  if (count >= 100) return { tag: 'Master', next: 100 };
  if (count >= 50) return { tag: 'Scholar', next: 100 };
  if (count >= 10) return { tag: 'Explorer', next: 50 };
  if (count >= 1) return { tag: 'Starter', next: 10 };
  return { tag: 'Newcomer', next: 1 };
}

/* ──────────────────────────────────────────
   Custom Recharts Tooltip
   ────────────────────────────────────────── */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="profile-chart-tooltip">
      <span className="profile-chart-tooltip-label">{label}</span>
      <span className="profile-chart-tooltip-value">{payload[0].value} lessons</span>
    </div>
  );
}

/* ──────────────────────────────────────────
   NFT type
   ────────────────────────────────────────── */
interface SuiNft { objectId: string; name: string; imageUrl: string | null; type: string; }

/* ──────────────────────────────────────────
   Tech Stack
   ────────────────────────────────────────── */
const SUI_STACK = [
  { name: 'Move', color: '#6FBCF0' },
  { name: 'Sui SDK', color: '#4DA2FF' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'React', color: '#61DAFB' },
  { name: 'Next.js', color: '#c9d1d9' },
  { name: 'Rust', color: '#DEA584' },
  { name: 'Node.js', color: '#68A063' },
  { name: 'Git', color: '#F05032' },
  { name: 'Web3', color: '#E4CDFB' },
  { name: 'DeFi', color: '#EAFF7E' },
];

/* ──────────────────────────────────────────
   Profile Theme Variable Maps
   ────────────────────────────────────────── */
const PROFILE_DARK: Record<string, string> = {
  '--p-bg': '#000',
  '--p-surface': '#121212',
  '--p-text': '#fff',
  '--p-text-muted': 'rgba(255,255,255,0.55)',
  '--p-border': 'rgba(255,255,255,0.04)',
  '--p-hero-bg': '#111',
  '--p-on-accent': '#1a1a2e',
  '--p-overlay': 'rgba(0,0,0,0.45)',
  '--p-track': 'rgba(255,255,255,0.08)',
  '--p-tooltip': '#222',
  '--p-hover': 'rgba(255,255,255,0.06)',
};

const PROFILE_LIGHT: Record<string, string> = {
  '--p-bg': '#f5f5f0',
  '--p-surface': '#ffffff',
  '--p-text': '#1a1a2e',
  '--p-text-muted': 'rgba(0,0,0,0.45)',
  '--p-border': 'rgba(0,0,0,0.08)',
  '--p-hero-bg': '#e8e8e0',
  '--p-on-accent': '#1a1a2e',
  '--p-overlay': 'rgba(0,0,0,0.3)',
  '--p-track': 'rgba(0,0,0,0.08)',
  '--p-tooltip': '#fff',
  '--p-hover': 'rgba(0,0,0,0.04)',
};

/* ──────────────────────────────────────────
   Heatmap builder
   ────────────────────────────────────────── */
function buildActivityData(lessons: Record<string, { completed?: boolean; completedAt?: string }>) {
  const now = new Date();
  const WEEKS = 20;
  const dayMap: Record<string, number> = {};
  let total = 0;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (const lesson of Object.values(lessons)) {
    if (lesson.completedAt) {
      const d = new Date(lesson.completedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      dayMap[key] = (dayMap[key] || 0) + 1;
      total++;
    }
  }

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayDow = today.getDay();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - todayDow - (WEEKS - 1) * 7);

  const weeklyData: { label: string; lessons: number }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    let weekTotal = 0;
    const weekStart = new Date(startDate);
    weekStart.setDate(weekStart.getDate() + w * 7);
    for (let d = 0; d < 7; d++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + w * 7 + d);
      if (date <= today) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        weekTotal += dayMap[key] || 0;
      }
    }
    weeklyData.push({ label: `${months[weekStart.getMonth()]} ${weekStart.getDate()}`, lessons: weekTotal });
  }

  return { total, weeklyData };
}

/* ──────────────────────────────────────────
   Stagger variants
   ────────────────────────────────────────── */
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } };
const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };



/* ══════════════════════════════════════════
   PROFILE PAGE
   ══════════════════════════════════════════ */
const MOCK_ADDRESS = '0x7a3f8b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a';
const MOCK_MODE = true; // Set false to require real wallet

export default function ProfilePage() {
  const account = useCurrentAccount();
  const realAddress = account?.address;
  const walletAddress = realAddress || (MOCK_MODE ? MOCK_ADDRESS : undefined);
  const { mutate: disconnect } = useDisconnectWallet();
  const { theme, colorId, mode, setColor, setThemeMode } = useForumTheme();
  const client = useSuiClient();
  const { progress, getOverallProgress, getCompletedLessonsCount, getCompletedCoursesCount, getCourseProgress } =
    useAcademyProgress(walletAddress ?? null);

  const [suinsName, setSuinsName] = useState<string | null>(MOCK_MODE && !realAddress ? 'satoshi.sui' : null);
  const [suinsChecked, setSuinsChecked] = useState(MOCK_MODE && !realAddress ? true : false);
  const [copied, setCopied] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('profile-image');
    if (saved) {
      setProfileImage(saved);
    } else if (MOCK_MODE && !realAddress) {
      const mockImg = '/images/community/bg-6.png';
      setProfileImage(mockImg);
      localStorage.setItem('profile-image', mockImg);
    }
  }, [realAddress]);

  /* NFT state */
  const [nfts, setNfts] = useState<SuiNft[]>([]);
  const [nftsLoading, setNftsLoading] = useState(false);
  const [showcaseIds, setShowcaseIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try { const s = localStorage.getItem('profile-nft-showcase'); return s ? JSON.parse(s) : []; } catch { return []; }
  });

  /* Slideshow state */
  const [slideIndex, setSlideIndex] = useState(0);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Mounted guard — prevents flash-of-wrong-theme */
  useEffect(() => { setMounted(true); }, []);

  /* SuiNS resolution */
  useEffect(() => {
    if (!walletAddress) { setSuinsName(null); setSuinsChecked(false); return; }
    setSuinsChecked(false);
    client.resolveNameServiceNames({ address: walletAddress, limit: 1 })
      .then((res) => { setSuinsName(res.data?.length ? res.data[0] : null); setSuinsChecked(true); })
      .catch(() => setSuinsChecked(true));
  }, [walletAddress, client]);

  /* Fetch NFTs */
  const fetchNfts = useCallback(async () => {
    if (!walletAddress) { setNfts([]); return; }
    setNftsLoading(true);
    try {
      const all: SuiNft[] = [];
      let cursor: string | null | undefined = undefined;
      let hasMore = true;
      while (hasMore && all.length < 100) {
        const res = await client.getOwnedObjects({ owner: walletAddress, options: { showDisplay: true, showType: true }, limit: 50, ...(cursor ? { cursor } : {}) });
        for (const item of res.data) {
          const display = item.data?.display?.data;
          if (display?.image_url) all.push({ objectId: item.data!.objectId, name: display.name || 'Unnamed NFT', imageUrl: display.image_url, type: item.data?.type ?? '' });
        }
        hasMore = res.hasNextPage; cursor = res.nextCursor;
      }
      setNfts(all);
    } catch { setNfts([]); }
    finally { setNftsLoading(false); }
  }, [walletAddress, client]);

  useEffect(() => { fetchNfts(); }, [fetchNfts]);

  /* Slideshow auto-advance */
  const showcaseNfts = useMemo(() => showcaseIds.map(id => nfts.find(n => n.objectId === id)).filter(Boolean) as SuiNft[], [showcaseIds, nfts]);

  useEffect(() => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    if (showcaseNfts.length > 1) {
      slideTimer.current = setInterval(() => setSlideIndex(i => (i + 1) % showcaseNfts.length), 5000);
    } else {
      setSlideIndex(0);
    }
    return () => { if (slideTimer.current) clearInterval(slideTimer.current); };
  }, [showcaseNfts.length]);

  const toggleShowcase = (objectId: string) => {
    setShowcaseIds(prev => {
      let next: string[];
      if (prev.includes(objectId)) { next = prev.filter(id => id !== objectId); }
      else { if (prev.length >= 5) return prev; next = [...prev, objectId]; }
      localStorage.setItem('profile-nft-showcase', JSON.stringify(next));
      return next;
    });
  };

  const handleCopy = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  /* ── Computed data ── */
  const isMock = MOCK_MODE;
  const allLessonIds = useMemo(() => getAllLessonIds(), []);
  const _overallPct = getOverallProgress(allLessonIds);
  const _completedLessons = getCompletedLessonsCount(allLessonIds);
  const _completedCourses = getCompletedCoursesCount(courses.map(c => ({ lessonIds: getCourseLessonIds(c.id) })));

  const overallPct = isMock ? 42 : _overallPct;
  const completedLessons = isMock ? 24 : _completedLessons;
  const completedCourses = isMock ? 3 : _completedCourses;

  const quizStats = useMemo(() => {
    if (isMock) return { attempted: 8, avg: 78, best: 95 };
    const entries = Object.values(progress.lessons).filter(l => l.quizAttempts && l.quizAttempts > 0);
    const scores = entries.map(l => l.quizScore ?? 0);
    return { attempted: entries.length, avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0, best: scores.length ? Math.max(...scores) : 0 };
  }, [progress, isMock]);

  const forumStats = useMemo(() => {
    if (isMock) return { posts: 12, comments: 34, karma: 89, mostActive: 'Move Development' as string | null, recentPosts: mockPosts.slice(0, 3) };
    if (!walletAddress) return { posts: 0, comments: 0, karma: 0, mostActive: null as string | null, recentPosts: [] as typeof mockPosts };
    const userPosts = mockPosts.filter(p => p.author_address === walletAddress);
    const userComments = mockComments.filter(c => c.author_address === walletAddress);
    const karma = userPosts.reduce((s, p) => s + p.vote_score, 0) + userComments.reduce((s, c) => s + c.vote_score, 0);
    const catCounts: Record<string, number> = {};
    for (const p of userPosts) catCounts[p.category] = (catCounts[p.category] || 0) + 1;
    const mostActive = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
    return { posts: userPosts.length, comments: userComments.length, karma, mostActive, recentPosts: userPosts.slice(0, 3) };
  }, [walletAddress, isMock]);

  const pathProgress = useMemo(() => {
    if (isMock) {
      return learningPaths.map((path, i) => ({
        ...path,
        pct: [72, 45, 100, 18, 60, 30, 0, 85][i % 8],
      }));
    }
    return learningPaths.map(path => {
      const ids = path.courseIds.flatMap(cid => getCourseLessonIds(cid));
      const pct = ids.length ? Math.round(ids.filter(id => progress.lessons[id]?.completed).length / ids.length * 100) : 0;
      return { ...path, pct };
    });
  }, [progress, isMock]);

  const badges = useMemo(() => {
    const completedPaths = pathProgress.filter(p => p.pct === 100).length;
    return [
      { label: 'First Lesson', icon: Icons.target, unlocked: completedLessons >= 1 },
      { label: 'Explorer', icon: Icons.compass, unlocked: completedLessons >= 10 },
      { label: 'Scholar', icon: Icons.graduationCap, unlocked: completedLessons >= 50 },
      { label: 'Master', icon: Icons.award, unlocked: completedLessons >= 100 },
      { label: 'Course Completer', icon: Icons.star, unlocked: completedCourses >= 1 },
      { label: 'Path Pioneer', icon: Icons.flag, unlocked: completedPaths >= 1 },
    ];
  }, [completedLessons, completedCourses, pathProgress]);

  const activityData = useMemo(() => {
    if (isMock) {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const now = new Date();
      return {
        total: 24,
        weeklyData: Array.from({ length: 20 }, (_, i) => {
          const d = new Date(now); d.setDate(d.getDate() - (19 - i) * 7);
          return { label: `${months[d.getMonth()]} ${d.getDate()}`, lessons: Math.floor(Math.random() * 5) };
        }),
      };
    }
    return buildActivityData(progress.lessons);
  }, [progress, isMock]);
  const resumeCourse = isMock ? getCourseById(courses[0]?.id) : (progress.lastAccessedCourse ? getCourseById(progress.lastAccessedCourse) : null);
  const currentSwatch = FORUM_COLORS.find(c => c.id === colorId)?.swatch ?? '#b8b4f8';
  const level = getLearnerLevel(completedLessons);
  const avatarColor = walletAddress ? addressToColor(walletAddress) : '#b8b4f8';
  const activePaths = pathProgress.filter(p => p.pct > 0);
  const currentSlide = showcaseNfts[slideIndex % Math.max(showcaseNfts.length, 1)];

  /* Accent = user's chosen theme color (subtle tint only) */
  const accentColor = currentSwatch;
  const isDark = !mounted || mode === 'dark';
  const accentDark = isColorDark(accentColor);
  const accentInvisible = isDark && getColorLuminance(accentColor) < 0.35;
  const visibleAccent = accentInvisible ? '#fff' : accentColor;
  const profileVars = {
    ...(isDark ? PROFILE_DARK : PROFILE_LIGHT),
    '--p-on-accent': accentDark ? '#fff' : '#1a1a2e',
    '--p-accent-visible': accentInvisible ? '#fff' : accentColor,
  };

  /* Chart data */
  const progressDonut = [{ value: overallPct }, { value: Math.max(0, 100 - overallPct) }];
  const quizRadialData = [
    { name: 'Best', value: quizStats.best, fill: visibleAccent },
    { name: 'Average', value: quizStats.avg, fill: visibleAccent + '80' },
  ];

  /* ══════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════ */
  return (
    <div className={`profile-page ${isDark ? 'profile-dark' : 'profile-light'}`} style={{ ...profileVars, '--profile-accent': accentColor } as React.CSSProperties}>
      <AcademyHeader />

      {!walletAddress ? (
        <div style={{ paddingTop: '10rem', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <WalletGate message="Connect your wallet to view your developer profile" />
        </div>
      ) : (
        <>
          {/* ═══════ HERO ═══════ */}
          <div className="profile-hero">
            <AnimatePresence mode="wait">
              {currentSlide?.imageUrl && (
                <motion.img
                  key={currentSlide.objectId}
                  src={currentSlide.imageUrl}
                  alt={currentSlide.name}
                  className="profile-hero-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isDark ? 0.45 : 0.85 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                />
              )}
            </AnimatePresence>
            <div className="profile-hero-overlay" />

            {/* Cover button */}
            <button type="button" className="profile-hero-cover-btn" onClick={() => setCoverPickerOpen(true)}>
              {Icons.image}
              {showcaseNfts.length > 0 ? `${showcaseNfts.length}/5 NFTs` : 'Showcase NFT'}
            </button>

            {/* Slide dots */}
            {showcaseNfts.length > 1 && (
              <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', zIndex: 3, display: 'flex', gap: 6 }}>
                {showcaseNfts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSlideIndex(i)}
                    style={{
                      width: 8, height: 8, borderRadius: '50%', border: 'none', cursor: 'pointer',
                      background: i === slideIndex % showcaseNfts.length ? '#fff' : 'rgba(255,255,255,0.35)',
                      transition: 'background 0.2s',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Hero content */}
            <div className="profile-hero-content">
              <label className="profile-hero-avatar-wrap">
                {profileImage ? (
                  <img src={profileImage} alt="" className="profile-hero-avatar-img" />
                ) : (
                  <div className="profile-hero-avatar" style={{ background: avatarColor }}>
                    {addressToInitials(walletAddress)}
                  </div>
                )}
                <span className="profile-hero-avatar-edit">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="profile-hero-avatar-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const dataUrl = reader.result as string;
                        setProfileImage(dataUrl);
                        localStorage.setItem('profile-image', dataUrl);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <div className="profile-hero-info">
                <h1 className="profile-hero-name">
                  {suinsName || truncateAddress(walletAddress)}
                </h1>
                <div className="profile-hero-meta">
                  <span className="profile-hero-level" style={{ background: accentColor }}>{level.tag}</span>
                  <span className="profile-hero-address">{truncateAddress(walletAddress)}</span>
                </div>
                <div className="profile-hero-actions">
                  <button type="button" className="profile-hero-btn" onClick={handleCopy}>
                    <span style={{ display: 'flex', width: 13, height: 13 }}>{copied ? Icons.check : Icons.copy}</span>
                    {copied ? 'Copied' : 'Copy Address'}
                  </button>
                  <button type="button" className="profile-hero-btn profile-hero-btn--danger" onClick={() => disconnect()}>
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════ BODY ═══════ */}
          <div className="profile-body">

            {/* ─── SIDEBAR ─── */}
            <aside className="profile-sidebar">
              {/* Level */}
              <div className="profile-sb-section">
                <div className="profile-sb-level">
                  <div className="profile-sb-level-header">
                    <span className="profile-sb-level-tag" style={{ background: accentColor }}>{level.tag}</span>
                    <span className="profile-sb-level-text">{completedLessons}/{level.next}</span>
                  </div>
                  <div className="profile-sb-level-track">
                    <div className="profile-sb-level-fill" style={{ width: `${Math.min(100, Math.round((completedLessons / level.next) * 100))}%`, background: accentColor }} />
                  </div>
                </div>
                {suinsChecked && !suinsName && (
                  <span style={{ fontSize: '0.65rem', fontWeight: 600, color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)', marginTop: '0.5rem', display: 'block' }}>
                    No SuiNS name &mdash; <a href="https://suins.io" target="_blank" rel="noopener noreferrer" style={{ color: visibleAccent, textDecoration: 'none' }}>Get one</a>
                  </span>
                )}
              </div>

              {/* Stats — list with colored icon circles */}
              <div className="profile-sb-section">
                <div className="profile-sb-label"><span style={{ color: visibleAccent }}>{Icons.barChart}</span> Stats</div>
                <div className="profile-sb-stats">
                  {[
                    { icon: Icons.book, label: 'Courses', value: completedCourses },
                    { icon: Icons.fileText, label: 'Lessons', value: completedLessons },
                    { icon: Icons.messageCircle, label: 'Posts', value: forumStats.posts },
                    { icon: Icons.zap, label: 'Karma', value: forumStats.karma },
                  ].map(s => (
                    <div key={s.label} className="profile-sb-stat">
                      <span className="profile-sb-stat-icon" style={{ background: visibleAccent + '15', color: visibleAccent }}>{s.icon}</span>
                      <span className="profile-sb-stat-label">{s.label}</span>
                      <span className="profile-sb-stat-value">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="profile-sb-section">
                <div className="profile-sb-label"><span style={{ color: visibleAccent }}>{Icons.award}</span> Achievements</div>
                <div className="profile-sb-badges">
                  {badges.map(b => (
                    <span key={b.label} className={`profile-sb-badge ${b.unlocked ? '' : 'profile-sb-badge--locked'}`}>
                      {b.unlocked ? b.icon : Icons.lock}
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Theme — accent toggle */}
              <button type="button" className="profile-sb-theme-toggle" onClick={() => setThemeModalOpen(true)}>
                <span className="profile-sb-theme-dot" style={{ background: currentSwatch }} />
                <span style={{ flex: 1, textAlign: 'left' }}>Appearance</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12" r="2.5"/>
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/>
                </svg>
              </button>
            </aside>

            {/* ─── MAIN ─── */}
            <motion.main className="profile-main" variants={stagger} initial="hidden" animate="visible">

              {/* Academy Stats — Ring + stat bars */}
              <motion.section className="profile-card" variants={fadeUp}>
                <div className="profile-card-inner">
                  <h2 className="profile-card-title">
                    <span style={{ color: visibleAccent }}>{Icons.barChart}</span> Cuttlefish Academy
                  </h2>
                  <div className="profile-academy-grid">
                    {/* Overall ring */}
                    <div className="profile-academy-ring">
                      <ResponsiveContainer width={130} height={130}>
                        <PieChart>
                          <Pie
                            data={[{ value: overallPct || 1 }, { value: Math.max(0, 100 - (overallPct || 1)) }]}
                            cx="50%" cy="50%"
                            innerRadius={42} outerRadius={58}
                            startAngle={90} endAngle={-270}
                            dataKey="value" stroke="none"
                          >
                            <Cell fill={visibleAccent} />
                            <Cell fill={isDark ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)'} />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="profile-academy-ring-center">
                        <span className="profile-academy-ring-value">{overallPct}%</span>
                        <span className="profile-academy-ring-label">Complete</span>
                      </div>
                    </div>

                    {/* Stat bars */}
                    <div className="profile-academy-stats">
                      {[
                        { icon: Icons.book, name: 'Courses', value: completedCourses, total: courses.length, color: '#EAFF7E' },
                        { icon: Icons.fileText, name: 'Lessons', value: completedLessons, total: allLessonIds.length, color: '#97F0E5' },
                        { icon: Icons.award, name: 'Quizzes', value: quizStats.attempted, total: Math.max(quizStats.attempted, 1), color: '#b8b4f8' },
                      ].map((s) => {
                        const pct = s.total > 0 ? Math.round((s.value / s.total) * 100) : 0;
                        return (
                          <div key={s.name} className="profile-academy-stat">
                            <span className="profile-academy-stat-icon" style={{ background: s.color + '15', color: s.color }}>{s.icon}</span>
                            <span className="profile-academy-stat-name">{s.name}</span>
                            <div className="profile-academy-stat-bar">
                              <div className="profile-academy-stat-bar-fill" style={{ width: `${Math.max(pct, 2)}%`, background: s.color }} />
                            </div>
                            <span className="profile-academy-stat-value">{s.value}/{s.total}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.section>

              {/* Learning Activity — Area Chart */}
              <motion.section className="profile-card" variants={fadeUp}>
                <div className="profile-card-inner">
                  <h2 className="profile-card-title">
                    <span style={{ color: visibleAccent }}>{Icons.flame}</span> Learning Activity
                    <span className="profile-card-subtitle">{activityData.total} lessons in the last 20 weeks</span>
                  </h2>
                  <div className="profile-area-chart-wrap">
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={activityData.weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={visibleAccent} stopOpacity={0.25} />
                            <stop offset="100%" stopColor={visibleAccent} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="label" tick={{ fontSize: 10, fill: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }} tickLine={false} axisLine={false} interval={3} />
                        <YAxis tick={{ fontSize: 10, fill: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Area type="monotone" dataKey="lessons" stroke={visibleAccent} fill="url(#activityGrad)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: visibleAccent, stroke: 'none' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.section>

              {/* Sui Stack */}
              <motion.section className="profile-card" variants={fadeUp}>
                <div className="profile-card-inner">
                  <h2 className="profile-card-title"><span style={{ color: visibleAccent }}>{Icons.zap}</span> My Sui Stack</h2>
                  <div className="profile-tech-grid">
                    {SUI_STACK.map((tech) => (
                      <span
                        key={tech.name}
                        className="profile-tech-badge"
                        style={{ color: accentDark ? '#fff' : '#1a1a2e', background: accentDark ? '#000' : '#fff', borderColor: accentDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                      >
                        {tech.name}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.section>

              {/* Learning Paths — inline progress bars */}
              <motion.section className="profile-card" variants={fadeUp}>
                <div className="profile-card-inner">
                  <h2 className="profile-card-title"><span style={{ color: visibleAccent }}>{Icons.map}</span> Learning Paths</h2>
                  {pathProgress.length > 0 ? (
                    <div className="profile-paths-list">
                      {pathProgress.slice(0, 8).map((p) => (
                          <div key={p.id} className="profile-path-row">
                            <span className="profile-path-icon" style={{ background: visibleAccent + '15', color: visibleAccent }}>{Icons.compass}</span>
                            <div className="profile-path-bar">
                              <div className="profile-path-bar-fill" style={{ width: `${Math.max(p.pct, 2)}%`, background: visibleAccent }} />
                              <span className="profile-path-name">{p.title}</span>
                              <span className="profile-path-pct">{p.pct}%</span>
                            </div>
                          </div>
                      ))}
                    </div>
                  ) : (
                    <div className="profile-empty">
                      <p>{learningPaths.length} paths waiting for you</p>
                      <Link href="/academy#paths" className="profile-empty-cta">Explore Paths</Link>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Two-col: Quiz + Forum */}
              <div className="profile-two-col">
                <motion.section className="profile-card" variants={fadeUp}>
                  <div className="profile-card-inner">
                    <h2 className="profile-card-title"><span style={{ color: visibleAccent }}>{Icons.target}</span> Quiz Performance</h2>
                    {quizStats.attempted > 0 ? (
                      <>
                        <div className="profile-radial-chart-wrap">
                          <ResponsiveContainer width="100%" height={160}>
                            <RadialBarChart cx="50%" cy="50%" innerRadius="35%" outerRadius="90%" data={quizRadialData} startAngle={180} endAngle={0} barSize={12}>
                              <RadialBar dataKey="value" background={{ fill: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} cornerRadius={6} />
                            </RadialBarChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="profile-radial-legend">
                          <div className="profile-radial-legend-item">
                            <span className="profile-radial-legend-dot" style={{ background: visibleAccent }} />
                            <span>Best: {quizStats.best}%</span>
                          </div>
                          <div className="profile-radial-legend-item">
                            <span className="profile-radial-legend-dot" style={{ background: visibleAccent, opacity: 0.5 }} />
                            <span>Avg: {quizStats.avg}%</span>
                          </div>
                          <div className="profile-radial-legend-item" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                            {quizStats.attempted} attempted
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="profile-empty">
                        <p>Complete quizzes to see your scores</p>
                        <Link href="/academy#courses" className="profile-empty-cta">Start Learning</Link>
                      </div>
                    )}
                  </div>
                </motion.section>

                {/* Forum Activity */}
                <motion.section className="profile-card" variants={fadeUp}>
                <div className="profile-card-inner">
                  <h2 className="profile-card-title"><span style={{ color: visibleAccent }}>{Icons.messageCircle}</span> Forum Activity</h2>
                  <div className="profile-forum-stats">
                    <div className="profile-forum-stat">
                      <div className="profile-forum-stat-value">{forumStats.posts}</div>
                      <div className="profile-forum-stat-label">Posts</div>
                    </div>
                    <div className="profile-forum-stat">
                      <div className="profile-forum-stat-value">{forumStats.comments}</div>
                      <div className="profile-forum-stat-label">Comments</div>
                    </div>
                    <div className="profile-forum-stat">
                      <div className="profile-forum-stat-value">{forumStats.karma}</div>
                      <div className="profile-forum-stat-label">Total Karma</div>
                    </div>
                  </div>
                  {forumStats.mostActive && <div className="profile-most-active">Most active: {forumStats.mostActive}</div>}
                  {forumStats.recentPosts.length > 0 ? (
                    <div className="profile-forum-posts">
                      {forumStats.recentPosts.map(post => (
                        <Link key={post.id} href={`/academy/forum/${post.id}`} className="profile-forum-post">
                          <span className="profile-forum-post-cat">{post.category}</span>
                          <span className="profile-forum-post-title">{post.title}</span>
                          <span className="profile-forum-post-score">+{post.vote_score}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="profile-empty">
                      <p>No forum activity yet.</p>
                      <Link href="/academy/forum" className="profile-empty-cta">Join the Forum</Link>
                    </div>
                  )}
                </div>
              </motion.section>
              </div>

              {/* Resume Learning */}
              {resumeCourse && (
                <motion.div variants={fadeUp}>
                  <Link href={`/academy/${resumeCourse.id}`} className="profile-resume">
                    <div className="profile-resume-info">
                      <div className="profile-resume-label">Continue Learning</div>
                      <div className="profile-resume-title">{resumeCourse.title}</div>
                    </div>
                    <span className="profile-resume-arrow">&rarr;</span>
                  </Link>
                </motion.div>
              )}
            </motion.main>
          </div>

          {/* ═══════ COVER PICKER MODAL ═══════ */}
          <AnimatePresence>
            {coverPickerOpen && (
              <motion.div
                className="profile-cover-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setCoverPickerOpen(false)}
              >
                <motion.div
                  className="profile-cover-modal"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="profile-cover-modal-header">
                    <h3 className="profile-cover-modal-title">Showcase NFT (up to 5)</h3>
                    <button type="button" className="profile-cover-modal-close" onClick={() => setCoverPickerOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </div>

                  {nftsLoading ? (
                    <div className="profile-cover-empty">Loading your NFTs...</div>
                  ) : nfts.length === 0 ? (
                    <div className="profile-cover-empty">No NFTs found in this wallet.</div>
                  ) : (
                    <>
                      <div className="profile-cover-grid">
                        {nfts.map(nft => {
                          const isSelected = showcaseIds.includes(nft.objectId);
                          const isFull = showcaseIds.length >= 5 && !isSelected;
                          return (
                            <button
                              key={nft.objectId}
                              type="button"
                              className={`profile-cover-item ${isSelected ? 'selected' : ''}`}
                              onClick={() => !isFull && toggleShowcase(nft.objectId)}
                              disabled={isFull}
                              title={isFull ? 'Max 5 NFTs' : nft.name}
                              style={{ opacity: isFull ? 0.35 : 1 }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={nft.imageUrl!} alt={nft.name} />
                              {isSelected && (
                                <div className="profile-cover-check">
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round"><path d="M20 6L9 17l-5-5" /></svg>
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        className="profile-cover-confirm"
                        onClick={() => setCoverPickerOpen(false)}
                      >
                        Confirm Selection ({showcaseIds.length}/5)
                      </button>
                      {showcaseIds.length > 0 && (
                        <button
                          type="button"
                          className="profile-cover-remove"
                          onClick={() => { setShowcaseIds([]); localStorage.setItem('profile-nft-showcase', '[]'); }}
                        >
                          Remove All
                        </button>
                      )}
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════ THEME MODAL ═══════ */}
          <AnimatePresence>
            {themeModalOpen && (
              <motion.div
                className="profile-theme-backdrop"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setThemeModalOpen(false)}
              >
                <motion.div
                  className="profile-theme-modal"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.2 }}
                  onClick={e => e.stopPropagation()}
                >
                  <div className="profile-theme-modal-header">
                    <h3 className="profile-theme-modal-title">Appearance</h3>
                    <button type="button" className="profile-theme-modal-close" onClick={() => setThemeModalOpen(false)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="profile-theme-section-label">Mode</div>
                  <div className="profile-mode-toggle">
                    <button
                      type="button"
                      className={`profile-mode-btn ${isDark ? 'active' : ''}`}
                      onClick={() => setThemeMode('dark')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
                      </svg>
                      Dark
                    </button>
                    <button
                      type="button"
                      className={`profile-mode-btn ${!isDark ? 'active' : ''}`}
                      onClick={() => setThemeMode('light')}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                      </svg>
                      Light
                    </button>
                  </div>

                  <div className="profile-theme-section-label" style={{ marginTop: '1rem' }}>Accent Color</div>
                  <div className="profile-accent-grid">
                    {FORUM_COLORS.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        className={`profile-accent-option ${colorId === c.id ? 'active' : ''}`}
                        onClick={() => setColor(c.id)}
                        title={c.label}
                      >
                        <span className="profile-accent-swatch" style={{ background: c.swatch }} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
