'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { AcademyHeader } from '../AcademyHeader';
import type { ForumCategory, SortMode, ForumPost } from '@/lib/forum-types';
import { CategoryTabs } from './components/CategoryTabs';
import { SortSelect } from './components/SortSelect';
import { ForumSearch } from './components/ForumSearch';
import { ForumPostCard } from './components/ForumPostCard';
import { CreatePostForm } from './components/CreatePostForm';
import { WalletGate } from './components/WalletGate';
import { useForumTheme } from './useForumTheme';
import { mockPosts } from './mockData';
import '../academy.css';
import './forum.css';

const POPULAR_TOPICS = [
  { name: 'Move Development', members: '4.2k' },
  { name: 'DeFi & DEXs', members: '3.8k' },
  { name: 'NFTs & Digital Art', members: '2.9k' },
  { name: 'Walrus Storage', members: '1.6k' },
  { name: 'Seal Protocol', members: '1.2k' },
];


export default function ForumPage() {
  const account = useCurrentAccount();
  const walletAddress = account?.address;
  const { theme, mode } = useForumTheme();

  const [category, setCategory] = useState<ForumCategory | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('hot');
  const [search, setSearch] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (category !== 'all') {
      result = result.filter((p) => p.category === category);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q)
      );
    }

    if (sort === 'new') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'top') {
      result.sort((a, b) => b.vote_score - a.vote_score);
    } else {
      result.sort((a, b) => {
        const ageA = (Date.now() - new Date(a.created_at).getTime()) / 3600000;
        const ageB = (Date.now() - new Date(b.created_at).getTime()) / 3600000;
        const hotA = a.vote_score / Math.pow(ageA + 2, 1.5);
        const hotB = b.vote_score / Math.pow(ageB + 2, 1.5);
        return hotB - hotA;
      });
    }

    return result;
  }, [posts, category, sort, search]);

  const handleVote = (postId: string, value: number) => {
    if (!walletAddress) return;
    const currentVote = userVotes[postId] || 0;
    const newValue = currentVote === value ? 0 : value;
    const scoreDelta = newValue - currentVote;
    setUserVotes((prev) => ({ ...prev, [postId]: newValue }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, vote_score: p.vote_score + scoreDelta } : p
      )
    );
  };

  const handleCreatePost = (newPost: ForumPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setShowCreateForm(false);
  };

  return (
    <div className={`forum-page forum-${mode}`} style={theme.vars as React.CSSProperties}>
      <AcademyHeader />
      <div className="forum-container">
        {/* Two-Column Layout */}
        <div className="forum-layout">
          {/* Main Feed */}
          <div className="forum-main">
            {/* Top Bar: Create Post + Filters */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <AnimatePresence mode="wait">
                {showCreateForm && walletAddress ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CreatePostForm
                      authorAddress={walletAddress}
                      onClose={() => setShowCreateForm(false)}
                      onSubmit={handleCreatePost}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="bar"
                    className="forum-top-bar"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {walletAddress ? (
                      <div
                        className="forum-create-prompt"
                        onClick={() => setShowCreateForm(true)}
                      >
                        <div className="forum-create-prompt-input">
                          Start a Discussion...
                        </div>
                        <div className="forum-create-prompt-actions">
                          <button type="button" className="forum-create-prompt-action">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <polyline points="21 15 16 10 5 21" />
                            </svg>
                          </button>
                          <button type="button" className="forum-create-prompt-action">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <WalletGate message="Connect your Sui wallet to start discussions and vote" />
                    )}
                    <div className="forum-filter-wrapper">
                      <button
                        type="button"
                        className={`forum-filter-toggle ${showFilters ? 'active' : ''}`}
                        onClick={() => setShowFilters((prev) => !prev)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Filter
                      </button>
                      <AnimatePresence>
                        {showFilters && (
                          <motion.div
                            className="forum-filter-dropdown"
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="forum-filter-section">
                              <span className="forum-filter-label">Sort by</span>
                              <SortSelect active={sort} onChange={setSort} />
                            </div>
                            <div className="forum-filter-section">
                              <span className="forum-filter-label">Category</span>
                              <CategoryTabs active={category} onChange={setCategory} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Posts List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <ForumPostCard
                      post={post}
                      userVote={userVotes[post.id] || 0}
                      onVote={(v) => handleVote(post.id, v)}
                      walletConnected={!!walletAddress}
                    />
                  </motion.div>
                ))
              ) : (
                <div className="forum-empty">
                  <div className="forum-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <h3 className="forum-empty-title">No Discussions Found</h3>
                  <p className="forum-empty-text">
                    {search
                      ? 'No discussions match your search. Try different keywords.'
                      : 'Be the first to start a discussion!'}
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="forum-sidebar">
            {/* Search */}
            <ForumSearch value={search} onChange={setSearch} />

            {/* Popular Topics */}
            <div className="forum-sidebar-card">
              <div className="forum-sidebar-rules-title">Popular Topics</div>
              {POPULAR_TOPICS.map((topic, i) => (
                <button
                  key={topic.name}
                  type="button"
                  className="forum-sidebar-topic"
                  onClick={() => {
                    const cat = topic.name.toLowerCase().split(' ')[0] as ForumCategory | 'all';
                    setCategory(cat === 'move' || cat === 'defi' || cat === 'nfts' || cat === 'walrus' || cat === 'seal' ? cat : 'all');
                  }}
                >
                  <span className="forum-sidebar-topic-icon">
                    {topic.name.charAt(0)}
                  </span>
                  <span className="forum-sidebar-topic-info">
                    <span className="forum-sidebar-topic-name">{topic.name}</span>
                    <span className="forum-sidebar-topic-members">{topic.members} members</span>
                  </span>
                </button>
              ))}
              <button type="button" className="forum-sidebar-see-more" onClick={() => setCategory('all')}>
                See all topics
              </button>
            </div>

            {/* Dev Resources */}
            <div className="forum-sidebar-card">
              <div className="forum-sidebar-rules-title">Dev Resources</div>
              <div className="forum-sidebar-links">
                <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Sui Documentation
                </a>
                <a href="https://move-book.com" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  The Move Book
                </a>
                <a href="https://sui.io/developers" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                  Developer Portal
                </a>
                <a href="https://github.com/MystenLabs/sui" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  Sui GitHub
                </a>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="forum-sidebar-card">
              <div className="forum-sidebar-rules-title">Guidelines</div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">1</span>
                <span>Be respectful and constructive</span>
              </div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">2</span>
                <span>Keep discussions on-topic</span>
              </div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">3</span>
                <span>No spam or scams</span>
              </div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">4</span>
                <span>Share code and help others</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
