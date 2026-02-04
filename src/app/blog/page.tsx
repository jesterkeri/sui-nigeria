'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Image from 'next/image';

const blogPosts = [
    {
        category: 'Builders',
        type: 'Announcement',
        title: 'Avalanche Launches $1,000,000 Builder Competition, Build Games',
        description: 'The first competition of its kind in crypto, attracting upcoming talent to build in Avalanche\'s growing ecosystem.',
        date: 'Jan 29, 2026',
        readTime: '3 Min Read',
        image: '/images/blog/blog-1.png',
    },
    {
        category: 'Community',
        type: 'Update',
        title: 'Sui Basecamp 2025: Global Builders Converge in Paris',
        description: 'Join us for the second annual global conference for the Sui ecosystem, happening in Paris this spring.',
        date: 'Mar 15, 2025',
        readTime: '4 Min Read',
        image: '/images/blog/blog-2.png',
    },
    {
        category: 'Ecosystem',
        type: 'Technical',
        title: 'DeepBook V3 Launches with Enhanced Liquidity Features',
        description: 'The next generation of the central limit order book (CLOB) on Sui brings new features for DeFi protocols.',
        date: 'Feb 28, 2025',
        readTime: '5 Min Read',
        image: '/images/blog/blog-3.png',
    },
    {
        category: 'Development',
        type: 'Guide',
        title: 'Move Registry Improves Developer Experience on Sui',
        description: 'Announcing the Move Registry (MVR): Radical interoperability and a better developer experience.',
        date: 'Apr 3, 2025',
        readTime: '6 Min Read',
        image: '/images/blog/blog-1.png',
    },
    {
        category: 'Gaming',
        type: 'Announcement',
        title: 'New Gaming SDK Released for Sui Developers',
        description: 'Build immersive gaming experiences with our new SDK designed specifically for blockchain gaming.',
        date: 'Jan 20, 2026',
        readTime: '3 Min Read',
        image: '/images/blog/blog-2.png',
    },
    {
        category: 'DeFi',
        type: 'Update',
        title: 'Sui DeFi TVL Reaches New All-Time High',
        description: 'Total Value Locked in Sui DeFi protocols surpasses previous records as adoption accelerates.',
        date: 'Jan 15, 2026',
        readTime: '4 Min Read',
        image: '/images/blog/blog-3.png',
    },
];

const filterCategories = [
    {
        name: 'Solutions',
        options: ['Gaming', 'DeFi', 'NFTs', 'Enterprise', 'Infrastructure'],
    },
    {
        name: 'Categories',
        options: ['Announcement', 'Update', 'Technical', 'Guide', 'Community'],
    },
    {
        name: 'Tags',
        options: ['Builders', 'Ecosystem', 'Development', 'Partnership'],
    },
];

export default function BlogPage() {
    const [openFilters, setOpenFilters] = useState<string[]>(['Solutions']);
    const featuredPost = blogPosts[0];

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

            {/* Hero Section - Featured Article Carousel */}
            <section className="blog-hero">
                <div className="blog-hero-content">
                    <h1 className="blog-hero-title">Sui Nigeria Weekly Recap</h1>
                    <div className="blog-hero-meta">
                        <span>Sept 26, 2025</span>
                        <span>By Community</span>
                        <span>3 Minute Read</span>
                    </div>
                    <p className="blog-hero-desc">
                        Who can Attend: Developers, Designers, Content Creators, Entrepreneurs, Students. Announcing the latest updates from the Sui Nigeria ecosystem...
                    </p>
                    <button className="blog-hero-btn">
                        Read Article
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="blog-hero-image">
                    <Image
                        src="/images/sui-coin.png"
                        alt="Featured article"
                        fill
                        style={{ objectFit: 'contain', objectPosition: 'center right' }}
                        priority
                    />
                </div>
                <div className="blog-hero-dots">
                    <button className="blog-hero-dot active" aria-label="Slide 1"></button>
                    <button className="blog-hero-dot" aria-label="Slide 2"></button>
                    <button className="blog-hero-dot" aria-label="Slide 3"></button>
                    <button className="blog-hero-dot" aria-label="Slide 4"></button>
                </div>
            </section>

            <div className="blog-page-content">
                {/* Featured Section */}
                <section className="avax-featured-section">
                    <div className="blog-section-inner">
                        <div className="avax-featured-grid">
                            <div className="avax-featured-content">
                                <div className="avax-featured-tags">
                                    <span className="avax-tag-primary">{featuredPost.category}</span>
                                    <span className="avax-tag-secondary">{featuredPost.type}</span>
                                </div>
                                <p className="avax-featured-meta">
                                    {featuredPost.date} / By Sui Nigeria / {featuredPost.readTime}
                                </p>
                                <h2 className="avax-featured-title">{featuredPost.title}</h2>
                                <p className="avax-featured-desc">{featuredPost.description}</p>
                                <button className="avax-btn-arrow avax-btn-arrow-green">
                                    Read Article
                                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </button>
                            </div>
                            <div className="avax-featured-image-wrapper">
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
                <section className="avax-main-layout">
                    <div className="blog-section-inner">
                        {/* Content Header */}
                        <div className="avax-content-header">
                            <div className="avax-header-flex">
                                <svg viewBox="0 0 120 120" fill="none" className="avax-content-arrow avax-content-arrow-green">
                                    <path d="M6 6L59.6641 60.5L6 114M114 6L75.875 44.125M114 114L75.875 76.875" stroke="currentColor" strokeWidth="10" />
                                </svg>
                                <h2 className="avax-content-title">Latest Articles</h2>
                            </div>
                        </div>

                        {/* Content Body with Sidebar and Grid */}
                        <div className="avax-content-body">
                            {/* Sidebar Filters */}
                            <aside className="avax-sidebar">
                                <p className="avax-sidebar-title">Filters</p>

                                {filterCategories.map((category) => (
                                    <div
                                        key={category.name}
                                        className={`avax-filter-group ${openFilters.includes(category.name) ? 'open' : ''}`}
                                    >
                                        <button
                                            className="avax-filter-header"
                                            onClick={() => toggleFilter(category.name)}
                                        >
                                            <span>{category.name}</span>
                                            <svg className="avax-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="avax-filter-options">
                                            {category.options.map((option) => (
                                                <label key={option} className="avax-filter-option">
                                                    <input type="checkbox" className="avax-filter-checkbox" />
                                                    <span className="avax-filter-label">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </aside>

                            {/* Articles Grid */}
                            <div className="avax-articles-wrapper">
                                <div className="avax-articles-grid">
                                    {blogPosts.map((post, idx) => (
                                        <article key={idx} className="avax-card-v2">
                                            <div className="avax-card-v2-image">
                                                <Image
                                                    src={post.image}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="avax-card-v2-body">
                                                <div className="avax-card-v2-tags">
                                                    <span className="avax-tag-primary avax-tag-small">
                                                        {post.category}
                                                    </span>
                                                    <span className="avax-tag-secondary avax-tag-small">
                                                        {post.type}
                                                    </span>
                                                </div>
                                                <p className="avax-card-v2-meta">
                                                    {post.date} / By Sui Nigeria / {post.readTime}
                                                </p>
                                                <h3 className="avax-card-v2-title">{post.title}</h3>
                                                <p className="avax-card-v2-excerpt">{post.description}</p>
                                                <div className="avax-card-v2-footer">
                                                    <span className="avax-card-v2-link">
                                                        Read More
                                                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>

                                {/* Load More */}
                                <div className="avax-load-more">
                                    <button className="avax-load-more-btn">
                                        <span>Load More Stories</span>
                                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <Footer />
        </main>
    );
}
