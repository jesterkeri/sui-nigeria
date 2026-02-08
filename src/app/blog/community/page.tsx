'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';

const communityPosts = [
    {
        id: 0,
        category: 'Community',
        type: 'Update',
        title: 'Sui Nigeria Hits 10,000 Members Across All Platforms',
        description: 'A milestone for the community as we reach 10,000 active members across Discord, Telegram, and Twitter. Here\'s how we got here and what\'s next for the Sui Nigeria community.',
        date: 'Feb 5, 2026',
        readTime: '3 Min Read',
        image: '/images/community/bg-1.png',
        author: 'Sui Nigeria',
    },
    {
        id: 1,
        category: 'Community',
        type: 'Recap',
        title: 'Lagos Sui Meetup #12: Building the Future of DeFi in Nigeria',
        description: 'Over 150 builders gathered in Lagos for our biggest meetup yet. Talks covered DeFi adoption, Move programming, and the growing Sui ecosystem in West Africa.',
        date: 'Jan 28, 2026',
        readTime: '5 Min Read',
        image: '/images/community/bg-2.png',
        author: 'Sui Nigeria',
    },
    {
        id: 2,
        category: 'Community',
        type: 'Spotlight',
        title: 'Builder Spotlight: How Chidi Built a DEX on Sui in 30 Days',
        description: 'Meet Chidi Okonkwo, a Lagos-based developer who went from learning Move to deploying a fully functional decentralized exchange on the Sui Network.',
        date: 'Jan 22, 2026',
        readTime: '6 Min Read',
        image: '/images/community/bg-3.png',
        author: 'Sui Nigeria',
    },
    {
        id: 3,
        category: 'Community',
        type: 'Announcement',
        title: 'Sui Nigeria Builder Competition Launches with $100K Prize Pool',
        description: 'The first builder competition of its kind in West Africa, attracting upcoming talent to build on the Sui Network. Developers, designers, and creators across Nigeria are invited to participate.',
        date: 'Jan 29, 2026',
        readTime: '3 Min Read',
        image: '/images/community/bg-4.png',
        author: 'Sui Nigeria',
    },
    {
        id: 4,
        category: 'Community',
        type: 'Guide',
        title: 'Getting Started with Sui: A Guide for Nigerian Developers',
        description: 'Everything you need to know to start building on the Sui blockchain, from setting up your environment to deploying your first smart contract in Move.',
        date: 'Jan 15, 2026',
        readTime: '8 Min Read',
        image: '/images/community/bg-5.png',
        author: 'Sui Nigeria',
    },
    {
        id: 5,
        category: 'Community',
        type: 'Recap',
        title: 'Abuja Web3 Workshop: Onboarding the Next Wave of Builders',
        description: 'Our first workshop in Abuja brought together 80 aspiring Web3 developers for a hands-on introduction to the Sui ecosystem and Move programming language.',
        date: 'Jan 10, 2026',
        readTime: '4 Min Read',
        image: '/images/community/bg-6.png',
        author: 'Sui Nigeria',
    },
    {
        id: 6,
        category: 'Community',
        type: 'Spotlight',
        title: 'How Sui Nigeria is Bridging the Gap Between Web2 and Web3',
        description: 'From university hackathons to developer bootcamps, here\'s how our community programs are helping traditional developers transition to blockchain development.',
        date: 'Dec 28, 2025',
        readTime: '5 Min Read',
        image: '/images/community/bg-7.png',
        author: 'Sui Nigeria',
    },
    {
        id: 7,
        category: 'Community',
        type: 'Update',
        title: 'Sui Nigeria 2025 Year in Review: Growth, Events, and Impact',
        description: 'Reflecting on a breakout year for the Sui Nigeria community — 24 meetups, 6 hackathons, 500+ builders onboarded, and partnerships with leading Web3 organizations.',
        date: 'Dec 20, 2025',
        readTime: '7 Min Read',
        image: '/images/community/bg-1.png',
        author: 'Sui Nigeria',
    },
    {
        id: 8,
        category: 'Community',
        type: 'Announcement',
        title: 'Sui Nigeria Ambassador Program: Applications Now Open',
        description: 'Become an official Sui Nigeria Ambassador and help grow the blockchain ecosystem in your city. We\'re looking for passionate community leaders across all 36 states.',
        date: 'Dec 15, 2025',
        readTime: '3 Min Read',
        image: '/images/community/bg-2.png',
        author: 'Sui Nigeria',
    },
    {
        id: 9,
        category: 'Community',
        type: 'Recap',
        title: 'Port Harcourt Sui Meetup: Expanding the Ecosystem to the South',
        description: 'Our first meetup in Port Harcourt attracted 60 developers and blockchain enthusiasts, marking the beginning of Sui\'s presence in the Niger Delta region.',
        date: 'Dec 8, 2025',
        readTime: '4 Min Read',
        image: '/images/community/bg-3.png',
        author: 'Sui Nigeria',
    },
    {
        id: 10,
        category: 'Community',
        type: 'Guide',
        title: 'Building NFT Marketplaces on Sui: Lessons from Nigerian Creators',
        description: 'Nigerian digital artists and developers share their experience building NFT platforms on Sui, including tips on object-centric design and marketplace mechanics.',
        date: 'Nov 30, 2025',
        readTime: '6 Min Read',
        image: '/images/community/bg-4.png',
        author: 'Sui Nigeria',
    },
    {
        id: 11,
        category: 'Community',
        type: 'Spotlight',
        title: 'From Freelancer to Founder: Ngozi\'s Journey Building on Sui',
        description: 'Ngozi Eze shares how she went from freelance smart contract work to founding one of the first Sui-native startups in Nigeria, and the community that supported her along the way.',
        date: 'Nov 22, 2025',
        readTime: '5 Min Read',
        image: '/images/community/bg-5.png',
        author: 'Sui Nigeria',
    },
];

function slugify(title: string, id: number): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + `-c${id}`;
}

const POSTS_PER_LOAD = 12;

export default function CommunityBlogPage() {
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_LOAD);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const visiblePosts = communityPosts.slice(0, visibleCount);
    const hasMore = visibleCount < communityPosts.length;

    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setVisibleCount(prev => Math.min(prev + POSTS_PER_LOAD, communityPosts.length));
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(loader);
        return () => observer.disconnect();
    }, [hasMore]);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 800);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <main className="blog-page">
            <Header />

            {/* Community Hero */}
            <section className="community-blog-hero">
                {/* Background layers */}
                <div className="community-hero-bg">
                    <Image src="/images/community/bg-4.png" alt="" fill className="object-cover" priority />
                </div>
                <div className="community-hero-overlay" />
                <div className="community-hero-grid-pattern" />

                <div className="community-blog-hero-inner">
                    <div className="community-hero-top">
                        <span className="community-blog-tag">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Sui Nigeria Community
                        </span>
                    </div>

                    <h1 className="community-blog-hero-title">
                        Stories from the<br />
                        <span className="community-hero-highlight">Sui Nigeria</span> Community
                    </h1>

                    <p className="community-blog-hero-subtitle">
                        Meetup recaps, builder spotlights, tutorials, and updates from Nigeria&apos;s fastest-growing Web3 community.
                    </p>

                    {/* Avatars + join */}
                    <div className="community-hero-social">
                        <div className="community-hero-avatars">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="community-hero-avatar">
                                    <Image src={`/images/community/bg-${i}.png`} alt="" fill className="object-cover" />
                                </div>
                            ))}
                            <span className="community-hero-avatar-more">+10K</span>
                        </div>
                        <span className="community-hero-join-text">members building on Sui</span>
                    </div>

                    {/* Stats */}
                    <div className="community-blog-hero-stats">
                        <div className="community-blog-stat">
                            <span className="community-blog-stat-value">{communityPosts.length}</span>
                            <span className="community-blog-stat-label">Articles</span>
                        </div>
                        <div className="community-blog-stat-divider" />
                        <div className="community-blog-stat">
                            <span className="community-blog-stat-value">24</span>
                            <span className="community-blog-stat-label">Meetups</span>
                        </div>
                        <div className="community-blog-stat-divider" />
                        <div className="community-blog-stat">
                            <span className="community-blog-stat-value">6</span>
                            <span className="community-blog-stat-label">Hackathons</span>
                        </div>
                        <div className="community-blog-stat-divider" />
                        <div className="community-blog-stat">
                            <span className="community-blog-stat-value">36</span>
                            <span className="community-blog-stat-label">States</span>
                        </div>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className="community-hero-bottom-fade" />
            </section>

            <div className="blog-page-content">
                <section className="sui-main-layout">
                    <div className="blog-section-inner">
                        <div className="sui-content-header">
                            <div className="sui-header-flex">
                                <h2 className="sui-content-title">Latest Community Posts</h2>
                            </div>
                            <div className="blog-controls">
                                <div className="blog-view-toggle">
                                    <button
                                        className={`blog-view-btn${viewMode === 'grid' ? ' active' : ''}`}
                                        onClick={() => setViewMode('grid')}
                                        aria-label="Grid view"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="3" width="7" height="7" rx="1" />
                                            <rect x="14" y="3" width="7" height="7" rx="1" />
                                            <rect x="3" y="14" width="7" height="7" rx="1" />
                                            <rect x="14" y="14" width="7" height="7" rx="1" />
                                        </svg>
                                    </button>
                                    <button
                                        className={`blog-view-btn${viewMode === 'list' ? ' active' : ''}`}
                                        onClick={() => setViewMode('list')}
                                        aria-label="List view"
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="sui-content-body filters-hidden">
                            <div className="sui-articles-wrapper">
                                <div className={viewMode === 'grid' ? 'sui-articles-grid' : 'sui-articles-list'}>
                                    {visiblePosts.map((post) => (
                                        viewMode === 'grid' ? (
                                            <Link key={post.id} href={`/blog/${slugify(post.title, post.id)}`} className="sui-card-v2-link-wrapper">
                                                <article className="sui-card-v2">
                                                    <div className="sui-card-v2-image">
                                                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="sui-card-v2-body">
                                                        <div className="sui-card-v2-tags">
                                                            <span className="sui-tag-primary sui-tag-small">{post.category}</span>
                                                            <span className="sui-tag-secondary sui-tag-small">{post.type}</span>
                                                        </div>
                                                        <p className="sui-card-v2-meta">{post.date} / By {post.author} / {post.readTime}</p>
                                                        <h3 className="sui-card-v2-title">{post.title}</h3>
                                                        <p className="sui-card-v2-excerpt">{post.description}</p>
                                                        <div className="sui-card-v2-footer">
                                                            <span className="sui-card-v2-link">
                                                                Read Article
                                                                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                                </svg>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </article>
                                            </Link>
                                        ) : (
                                            <Link key={post.id} href={`/blog/${slugify(post.title, post.id)}`} className="sui-card-v2-link-wrapper">
                                                <article className="sui-card-list">
                                                    <div className="sui-card-list-image">
                                                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="sui-card-list-body">
                                                        <div className="sui-card-list-top">
                                                            <div className="sui-card-v2-tags">
                                                                <span className="sui-tag-primary sui-tag-small">{post.category}</span>
                                                                <span className="sui-tag-secondary sui-tag-small">{post.type}</span>
                                                            </div>
                                                            <p className="sui-card-v2-meta">{post.date} / By {post.author} / {post.readTime}</p>
                                                        </div>
                                                        <h3 className="sui-card-v2-title">{post.title}</h3>
                                                        <p className="sui-card-v2-excerpt">{post.description}</p>
                                                        <span className="sui-card-v2-link">
                                                            Read Article
                                                            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                            </svg>
                                                        </span>
                                                    </div>
                                                </article>
                                            </Link>
                                        )
                                    ))}
                                </div>

                                {hasMore && (
                                    <div ref={loaderRef} className="blog-infinite-loader">
                                        <span className="blog-loader-text">Loading more posts...</span>
                                    </div>
                                )}
                                {!hasMore && visiblePosts.length > 0 && (
                                    <p className="blog-end-text">You&apos;ve reached the end</p>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {showBackToTop && (
                <button className="back-to-top-btn" onClick={scrollToTop} aria-label="Back to top">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            )}

            <PageProgress />
            <Footer />
        </main>
    );
}
