'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import { BLOG_POSTS, HERO_SLIDES, FILTER_CATEGORIES } from './data';

const blogPosts = BLOG_POSTS;
const filterCategories = FILTER_CATEGORIES;
const heroSlides = HERO_SLIDES;

const POSTS_PER_LOAD = 30;

export default function BlogPage() {
    const [openFilters, setOpenFilters] = useState<string[]>(['Solutions']);
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_LOAD);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [activeSlide, setActiveSlide] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);
    const featuredPost = blogPosts[0];
    const visiblePosts = blogPosts.slice(0, visibleCount);
    const hasMore = visibleCount < blogPosts.length;

    // Infinite scroll
    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setVisibleCount(prev => Math.min(prev + POSTS_PER_LOAD, blogPosts.length));
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(loader);
        return () => observer.disconnect();
    }, [hasMore]);

    // Back to top visibility
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

    const goToSlide = useCallback((index: number) => {
        setActiveSlide(index);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % heroSlides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const toggleFilter = (filterName: string) => {
        setOpenFilters(prev =>
            prev.includes(filterName)
                ? prev.filter(f => f !== filterName)
                : [...prev, filterName]
        );
    };

    return (
        <main className="blog-page">
            <Header />

            {/* Hero Section - News Slideshow */}
            <section className="blog-hero">
                {heroSlides.map((slide, idx) => (
                    <div
                        key={idx}
                        className={`blog-hero-slide${idx === activeSlide ? ' active' : ''}`}
                    >
                        <div className="blog-hero-slide-bg">
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                priority={idx === 0}
                            />
                        </div>
                        <div className="blog-hero-content">
                            <div className="blog-hero-tags">
                                <span className="sui-tag-sui">Sui</span>
                            </div>
                            <h1 className="blog-hero-title">{slide.title}</h1>
                            <div className="blog-hero-meta">
                                <span>{slide.date}</span>
                                <span>By Sui Nigeria</span>
                                <span>{slide.readTime}</span>
                            </div>
                            <p className="blog-hero-desc">{slide.description}</p>
                            <button className="btn-primary">
                                Read Article
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
                <div className="blog-hero-dots">
                    {heroSlides.map((_, idx) => (
                        <button
                            key={idx}
                            className={`blog-hero-dot${idx === activeSlide ? ' active' : ''}`}
                            onClick={() => goToSlide(idx)}
                            aria-label={`Slide ${idx + 1}`}
                        />
                    ))}
                </div>
            </section>

            <div className="blog-page-content">
                {/* Featured Section */}
                <section className="sui-featured-section">
                    <div className="blog-section-inner">
                        <div className="sui-featured-grid">
                            <div className="sui-featured-content">
                                <div className="sui-featured-tags">
                                    <span className="sui-tag-primary">Sui Nigeria</span>
                                </div>
                                <p className="sui-featured-meta">
                                    {featuredPost.date} / By Sui Nigeria / {featuredPost.readTime}
                                </p>
                                <h2 className="sui-featured-title">{featuredPost.title}</h2>
                                <p className="sui-featured-desc">{featuredPost.description}</p>
                                <button className="sui-btn-arrow sui-btn-arrow-green">
                                    Read Article
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                            <div className="sui-featured-image-wrapper">
                                <Image
                                    src={featuredPost.image}
                                    alt={featuredPost.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Content Layout */}
                <section className="sui-main-layout">
                    <div className="blog-section-inner">
                        {/* Content Header */}
                        <div className="sui-content-header">
                            <div className="sui-header-flex">
                                <h2 className="sui-content-title">Latest Articles</h2>
                            </div>
                            <div className="blog-controls">
                                <button
                                    className={`blog-filter-toggle${showFilters ? ' active' : ''}`}
                                    onClick={() => setShowFilters(prev => !prev)}
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 4l6 7v5l4 2v-7l6-7" />
                                    </svg>
                                    <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                                </button>
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

                        {/* Content Body with Sidebar and Grid */}
                        <div className={`sui-content-body${!showFilters ? ' filters-hidden' : ''}`}>
                            {/* Articles */}
                            <div className="sui-articles-wrapper">
                                <div className={viewMode === 'grid' ? 'sui-articles-grid' : 'sui-articles-list'}>
                                    {visiblePosts.map((post, idx) => (
                                        viewMode === 'grid' ? (
                                            <Link key={idx} href={`/blog/${post.slug}`} className="sui-card-v2-link-wrapper">
                                                <article className="sui-card-v2">
                                                    <div className="sui-card-v2-image">
                                                        <Image src={post.image} alt={post.title} fill className="object-cover" />
                                                    </div>
                                                    <div className="sui-card-v2-body">
                                                        <div className="sui-card-v2-tags">
                                                            <span className="sui-tag-primary sui-tag-small">{post.category}</span>
                                                            <span className="sui-tag-secondary sui-tag-small">{post.type}</span>
                                                        </div>
                                                        <p className="sui-card-v2-meta">{post.date} / By Sui Nigeria / {post.readTime}</p>
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
                                            <Link key={idx} href={`/blog/${post.slug}`} className="sui-card-v2-link-wrapper">
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
                                                            <p className="sui-card-v2-meta">{post.date} / By Sui Nigeria / {post.readTime}</p>
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
                                        <span className="blog-loader-text">Loading more articles...</span>
                                    </div>
                                )}
                                {!hasMore && visiblePosts.length > 0 && (
                                    <p className="blog-end-text">You&apos;ve reached the end</p>
                                )}
                            </div>

                            {/* Sidebar Filters */}
                            {showFilters && (
                                <aside className="sui-filter-panel">
                                    <p className="sui-filter-panel-title">Filters</p>

                                    {filterCategories.map((category) => (
                                        <div
                                            key={category.name}
                                            className={`sui-filter-group ${openFilters.includes(category.name) ? 'open' : ''}`}
                                        >
                                            <button
                                                className="sui-filter-header"
                                                onClick={() => toggleFilter(category.name)}
                                            >
                                                <span>{category.name}</span>
                                                <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                            <div className="sui-filter-options">
                                                {category.options.map((option) => (
                                                    <label key={option} className="sui-filter-option">
                                                        <input type="checkbox" className="sui-filter-checkbox" />
                                                        <span className="sui-filter-label">{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Who to follow */}
                                    <div className="sui-follow-section">
                                        <p className="sui-filter-panel-title">Who to follow</p>
                                        {[
                                            { name: 'Sui Network', handle: '@SuiNetwork', desc: 'The official account for updates on the Sui blockchain.', avatar: '/images/community/bg-1.png' },
                                            { name: 'Sui Nigeria', handle: '@Sui_Nigeria', desc: 'The official Sui community hub for Nigeria.', avatar: '/images/community/bg-2.png' },
                                            { name: 'Mysten Labs', handle: '@Mysten_Labs', desc: 'Building critical infrastructure for Web3.', avatar: '/images/community/bg-3.png' },
                                        ].map((account) => (
                                            <div key={account.handle} className="sui-follow-item">
                                                <div className="sui-follow-avatar">
                                                    <Image src={account.avatar} alt={account.name} fill className="object-cover" />
                                                </div>
                                                <div className="sui-follow-info">
                                                    <span className="sui-follow-name">{account.name}</span>
                                                    <span className="sui-follow-desc">{account.desc}</span>
                                                </div>
                                                <button className="sui-follow-btn">Follow</button>
                                            </div>
                                        ))}
                                        <span className="sui-follow-more">See more suggestions</span>
                                    </div>
                                </aside>
                            )}
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
