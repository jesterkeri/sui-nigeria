'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import { OPPORTUNITIES, FILTERS, type Opportunity, type OpportunityType } from './data';
import './earn.css';

// Tag color mapping
const getTagColor = (tag: string): string => {
    const colors: { [key: string]: string } = {
        'Rust': 'orange', 'Move': 'purple', 'Smart Contracts': 'purple',
        'React': 'cyan', 'TypeScript': 'blue', 'Web3': 'purple',
        'Figma': 'purple', 'UI/UX': 'pink', 'Design System': 'green',
        'Content Writing': 'blue', 'Documentation': 'cyan', 'Technical Writing': 'orange',
        'Marketing': 'orange', 'Growth': 'green', 'Analytics': 'cyan',
        'Community': 'pink', 'Social Media': 'blue', 'Events': 'green',
        'Security': 'red', 'Auditing': 'orange', 'Penetration Testing': 'red',
        'Python': 'blue', 'Data Analysis': 'cyan', 'Research': 'purple',
        'Solidity': 'blue', 'EVM': 'orange', 'Cross-Chain': 'purple',
        'Node.js': 'green', 'GraphQL': 'pink', 'API': 'blue',
        'DeFi': 'green', 'Tokenomics': 'orange', 'NFT': 'purple',
        'Digital Art': 'pink', 'Creative': 'pink',
        'DevOps': 'orange', 'Infrastructure': 'blue', 'Monitoring': 'cyan',
        'AI/ML': 'purple', 'Automation': 'green', 'Data Science': 'cyan',
        'Video Production': 'orange', 'Motion Design': 'pink', 'Editing': 'blue',
        'Testing': 'green', 'QA': 'blue', 'CI/CD': 'orange',
    };
    return colors[tag] || 'default';
};

// Calculate days left from deadline
const getDaysLeft = (deadline: string): string => {
    const now = new Date('2026-02-21');
    const deadlineDate = new Date(deadline);
    const diff = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return 'Expired';
    if (diff === 0) return 'Today';
    if (diff === 1) return '1 day left';
    if (diff < 7) return `${diff} days left`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks left`;
    return `${Math.floor(diff / 30)} months left`;
};

// Opportunity Card Component
const OpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <div
            ref={cardRef}
            className={`earn-card ${opportunity.featured ? 'featured' : ''}`}
            onMouseMove={handleMouseMove}
        >
            <div className="earn-card-spotlight" />

            {/* Header with logo and badges */}
            <div className="earn-card-header">
                <div className="earn-card-logo">
                    <Image
                        src={opportunity.orgLogo}
                        alt={`${opportunity.organization} logo`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="earn-card-badges">
                    <span className={`earn-type-badge ${opportunity.type.toLowerCase()}`}>
                        {opportunity.type}
                    </span>
                    {opportunity.veteran && (
                        <span className="earn-veteran-badge">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                            Veteran
                        </span>
                    )}
                    <span className="earn-status-badge">
                        <span className={`status-dot ${opportunity.status.toLowerCase().replace(' ', '-')}`} />
                        {opportunity.status}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="earn-card-info">
                <h3 className="earn-card-title">{opportunity.title}</h3>
                <p className="earn-card-org">
                    {opportunity.organization}
                </p>
                <p className="earn-card-description">{opportunity.description}</p>
            </div>

            {/* Skills */}
            <div className="earn-card-skills">
                {opportunity.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className={`earn-card-skill tag-${getTagColor(skill)}`}>
                        {skill}
                    </span>
                ))}
            </div>

            {/* Footer */}
            <div className="earn-card-footer">
                <div className="earn-card-prize">
                    <span className="earn-prize-amount">{opportunity.prize}</span>
                    <span className="earn-prize-label">Prize</span>
                </div>
                <div className="earn-card-meta">
                    <span>{getDaysLeft(opportunity.deadline)}</span>
                    <span>{opportunity.applicants} applied</span>
                </div>
            </div>

            {/* Action Button */}
            <Link href={`/earn/${opportunity.id}`} className="earn-card-btn">
                <span>View Details</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
};

// Featured Opportunity Card
const FeaturedOpportunityCard = ({ opportunity }: { opportunity: Opportunity }) => {
    return (
        <motion.div
            className="earn-featured-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="earn-featured-content">
                <div className="earn-featured-header">
                    <div className="earn-featured-logo">
                        <Image
                            src={opportunity.orgLogo}
                            alt={`${opportunity.organization} logo`}
                            width={56}
                            height={56}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="earn-featured-badges">
                        <span className={`earn-type-badge ${opportunity.type.toLowerCase()}`}>
                            {opportunity.type}
                        </span>
                        {opportunity.veteran && (
                            <span className="earn-veteran-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                Veteran
                            </span>
                        )}
                        <span className="earn-status-badge">
                            <span className={`status-dot ${opportunity.status.toLowerCase().replace(' ', '-')}`} />
                            {opportunity.status}
                        </span>
                    </div>
                </div>

                <div className="earn-featured-info">
                    <h3 className="earn-featured-title">{opportunity.title}</h3>
                    <p className="earn-featured-org">{opportunity.organization}</p>
                    <p className="earn-featured-description">{opportunity.description}</p>
                </div>

                <div className="earn-featured-skills">
                    {opportunity.skills.map((skill) => (
                        <span key={skill} className="earn-featured-skill">{skill}</span>
                    ))}
                </div>

                <div className="earn-featured-footer">
                    <div className="earn-featured-prize">
                        <span className="earn-featured-prize-value">{opportunity.prize}</span>
                        <span className="earn-featured-prize-label">Prize</span>
                    </div>
                    <div className="earn-featured-meta">
                        <span>{getDaysLeft(opportunity.deadline)}</span>
                        <span>&middot;</span>
                        <span>{opportunity.applicants} applied</span>
                    </div>
                    <Link href={`/earn/${opportunity.id}`} className="earn-featured-apply">
                        <span>View Details</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>

        </motion.div>
    );
};

export default function EarnPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'All' | OpportunityType>('All');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedPrizeRanges, setSelectedPrizeRanges] = useState<string[]>([]);
    const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [openFilterGroups, setOpenFilterGroups] = useState<string[]>(['Skill Categories']);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('relevant');
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 30;

    const tabs: ('All' | OpportunityType)[] = ['All', 'Bounty', 'Hackathon', 'Grant'];

    const toggleFilterGroup = (name: string) => {
        setOpenFilterGroups(prev =>
            prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
        );
    };

    const sortOptions = [
        { value: 'relevant', label: 'Most Relevant' },
        { value: 'recent', label: 'Most Recent' },
        { value: 'prize-high', label: 'Highest Prize' },
        { value: 'prize-low', label: 'Lowest Prize' },
        { value: 'deadline', label: 'Ending Soon' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Tab counts
    const tabCounts = useMemo(() => {
        const counts: Record<string, number> = { All: OPPORTUNITIES.length };
        for (const type of ['Bounty', 'Hackathon', 'Grant'] as OpportunityType[]) {
            counts[type] = OPPORTUNITIES.filter(o => o.type === type).length;
        }
        return counts;
    }, []);

    // Filter opportunities
    const filteredOpportunities = useMemo(() => {
        return OPPORTUNITIES.filter((opp) => {
            // Tab filter
            if (activeTab !== 'All' && opp.type !== activeTab) return false;

            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    opp.title.toLowerCase().includes(query) ||
                    opp.organization.toLowerCase().includes(query) ||
                    opp.skills.some(s => s.toLowerCase().includes(query)) ||
                    opp.description.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Category filter
            if (selectedCategories.length > 0) {
                const hasCategory = opp.categories.some(c => selectedCategories.includes(c));
                if (!hasCategory) return false;
            }

            // Prize range filter
            if (selectedPrizeRanges.length > 0) {
                const matchesPrize = selectedPrizeRanges.some(label => {
                    const range = FILTERS.prizeRanges.find(r => r.label === label);
                    if (!range) return false;
                    return opp.prizeValue >= range.min && opp.prizeValue < range.max;
                });
                if (!matchesPrize) return false;
            }

            // Status filter
            if (selectedStatuses.length > 0 && !selectedStatuses.includes(opp.status)) {
                return false;
            }

            return true;
        });
    }, [searchQuery, activeTab, selectedCategories, selectedPrizeRanges, selectedStatuses]);

    // Parse "X days ago" to sortable number
    const parsePostedTime = (timeStr: string): number => {
        const match = timeStr.match(/(\d+)\s*(hour|day|week|month)/i);
        if (!match) return 999;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const multipliers: { [key: string]: number } = { 'hour': 1, 'day': 24, 'week': 168, 'month': 720 };
        return value * (multipliers[unit] || 1);
    };

    // Sort opportunities
    const sortedOpportunities = useMemo(() => {
        const featured = filteredOpportunities.filter(o => o.featured);
        const regular = filteredOpportunities.filter(o => !o.featured);

        const sortFn = (a: Opportunity, b: Opportunity) => {
            switch (sortBy) {
                case 'recent':
                    return parsePostedTime(a.postedAt) - parsePostedTime(b.postedAt);
                case 'prize-high':
                    return b.prizeValue - a.prizeValue;
                case 'prize-low':
                    return a.prizeValue - b.prizeValue;
                case 'deadline':
                    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
                default:
                    return 0;
            }
        };

        return [...featured.sort(sortFn), ...regular.sort(sortFn)];
    }, [filteredOpportunities, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedOpportunities.length / ITEMS_PER_PAGE);
    const paginatedOpportunities = sortedOpportunities.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Featured opportunities
    const featuredOpportunities = OPPORTUNITIES.filter(o => o.featured);

    // Reset page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeTab, selectedCategories, selectedPrizeRanges, selectedStatuses, searchQuery, sortBy]);

    const toggleFilter = (option: string, selected: string[], setSelected: (value: string[]) => void) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option));
        } else {
            setSelected([...selected, option]);
        }
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedPrizeRanges([]);
        setSelectedStatuses([]);
        setSearchQuery('');
        setActiveTab('All');
    };

    // Stats
    const totalRewards = useMemo(() => {
        const total = OPPORTUNITIES.reduce((sum, o) => sum + o.prizeValue, 0);
        if (total >= 1000000) return `$${(total / 1000000).toFixed(1)}M`;
        if (total >= 1000) return `$${(total / 1000).toFixed(0)}K`;
        return `$${total}`;
    }, []);

    const uniqueOrgs = useMemo(() => {
        return new Set(OPPORTUNITIES.map(o => o.organization)).size;
    }, []);

    return (
        <main className="earn-page">
            <Header showGreenBorder />

            {/* Hero Section */}
            <section className="earn-hero">
                <motion.div
                    className="earn-hero-content"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="earn-hero-title">
                        Earn in the <span className="earn-hero-highlight">Sui</span> Ecosystem
                    </h1>
                    <p className="earn-hero-subtitle">
                        Discover bounties, hackathons, grants, and projects.
                        Get paid to contribute to the Sui ecosystem.
                    </p>

                    {/* Search Bar */}
                    <div className="earn-search-container">
                        <div className="earn-search-wrapper">
                            <svg className="earn-search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8" />
                                <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                            </svg>
                            <input
                                type="text"
                                className="earn-search-input"
                                placeholder="Search opportunities, organizations, or skills..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            {searchQuery && (
                                <button
                                    className="earn-search-clear"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <button className="earn-search-btn" aria-label="Search opportunities">
                            <span>Search</span>
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="earn-hero-stats">
                        <div className="earn-stat">
                            <span className="earn-stat-value">{OPPORTUNITIES.length}+</span>
                            <span className="earn-stat-label">Opportunities</span>
                        </div>
                        <div className="earn-stat-divider" />
                        <div className="earn-stat">
                            <span className="earn-stat-value">{totalRewards}+</span>
                            <span className="earn-stat-label">Total Rewards</span>
                        </div>
                        <div className="earn-stat-divider" />
                        <div className="earn-stat">
                            <span className="earn-stat-value">{uniqueOrgs}+</span>
                            <span className="earn-stat-label">Organizations</span>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Featured Opportunities */}
            {featuredOpportunities.length > 0 && activeTab === 'All' && (
                <section className="earn-featured-section">
                    <h2 className="earn-featured-section-title">
                        <span className="earn-title-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFB836">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </span>
                        Featured Opportunities
                    </h2>
                    <div className="earn-featured-list">
                        {featuredOpportunities.slice(0, 4).map((opp) => (
                            <div key={opp.id}>
                                <FeaturedOpportunityCard opportunity={opp} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Main Listing */}
            <section className="earn-listing">
                {/* Tab Navigation */}
                <div className="earn-tabs-container">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`earn-tab ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                            <span className="earn-tab-count">{tabCounts[tab]}</span>
                        </button>
                    ))}
                </div>

                {/* Controls */}
                <div className="earn-listing-header">
                    <div className="earn-controls-left">
                        <div className="earn-sort-wrapper" ref={sortDropdownRef}>
                            <label>Sort by:</label>
                            <div className="earn-sort-dropdown">
                                <button
                                    className={`earn-sort-trigger ${sortDropdownOpen ? 'open' : ''}`}
                                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    aria-label="Sort opportunities by"
                                    aria-expanded={sortDropdownOpen}
                                >
                                    <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {sortDropdownOpen && (
                                        <motion.div
                                            className="earn-sort-menu"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    className={`earn-sort-option ${sortBy === option.value ? 'active' : ''}`}
                                                    onClick={() => {
                                                        setSortBy(option.value);
                                                        setSortDropdownOpen(false);
                                                    }}
                                                >
                                                    {option.label}
                                                    {sortBy === option.value && (
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    )}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <span className="earn-listing-count">
                            Showing {paginatedOpportunities.length} of {filteredOpportunities.length} results
                        </span>
                    </div>
                    <div className="blog-controls">
                        <button className={`blog-filter-toggle${showFilters ? ' active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 4l6 7v5l4 2v-7l6-7" />
                            </svg>
                            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        </button>
                        <div className="earn-view-toggle">
                            <button
                                className={`earn-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}
                                aria-label="Grid view"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                            </button>
                            <button
                                className={`earn-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}
                                aria-label="List view"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <rect x="3" y="4" width="18" height="4" rx="1" />
                                    <rect x="3" y="10" width="18" height="4" rx="1" />
                                    <rect x="3" y="16" width="18" height="4" rx="1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="earn-listing-content">
                    {/* Cards */}
                    <div className={`earn-opp-container ${viewMode}`}>
                        {paginatedOpportunities.length > 0 ? (
                            <div key={viewMode} className={`earn-opp-${viewMode}`}>
                                {paginatedOpportunities.map((opp) => (
                                    <OpportunityCard key={opp.id} opportunity={opp} />
                                ))}
                            </div>
                        ) : (
                            <div className="earn-no-results">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                    <path d="M8 8l6 6M14 8l-6 6" strokeLinecap="round" />
                                </svg>
                                <h3>No opportunities found</h3>
                                <p>Try adjusting your filters or search query</p>
                                <button className="earn-reset-btn" onClick={clearAllFilters}>
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="earn-pagination">
                                <button
                                    className="earn-page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    aria-label="Previous page"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="earn-page-numbers">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }
                                        return (
                                            <button
                                                key={pageNum}
                                                className={`earn-page-num ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="earn-page-ellipsis">...</span>
                                            <button
                                                className="earn-page-num"
                                                onClick={() => setCurrentPage(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button
                                    className="earn-page-btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    aria-label="Next page"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Filter Sidebar */}
                    <motion.aside
                        className={`filter-sidebar ${showFilters ? 'sidebar-open' : 'sidebar-closed'}`}
                        initial={false}
                        animate={{ width: showFilters ? 324 : 0 }}
                        transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
                        style={{ width: showFilters ? 324 : 0 }}
                    >
                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    className="sui-filter-panel"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <p className="sui-filter-panel-title">Filters</p>

                                    {/* Skill Categories */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Skill Categories') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Skill Categories')}>
                                            <span>Skill Categories</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {FILTERS.skillCategories.map((cat) => (
                                                <label key={cat} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedCategories.includes(cat)}
                                                        onChange={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}
                                                    />
                                                    <span className="sui-filter-label">{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Prize Range */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Prize Range') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Prize Range')}>
                                            <span>Prize Range</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {FILTERS.prizeRanges.map((range) => (
                                                <label key={range.label} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedPrizeRanges.includes(range.label)}
                                                        onChange={() => toggleFilter(range.label, selectedPrizeRanges, setSelectedPrizeRanges)}
                                                    />
                                                    <span className="sui-filter-label">{range.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Status') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Status')}>
                                            <span>Status</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {FILTERS.statuses.map((status) => (
                                                <label key={status} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedStatuses.includes(status)}
                                                        onChange={() => toggleFilter(status, selectedStatuses, setSelectedStatuses)}
                                                    />
                                                    <span className="sui-filter-label">{status}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.aside>
                </div>
            </section>

            {/* CTA Section */}
            <section className="earn-cta-section">
                <div className="earn-cta-content">
                    <div className="earn-cta-text">
                        <h2 className="earn-cta-title">Have a Bounty to Post?</h2>
                        <p className="earn-cta-subtitle">
                            List your bounty, hackathon, or grant and reach hundreds of talented builders in the Sui ecosystem.
                        </p>
                    </div>
                    <div className="earn-cta-actions">
                        <button className="earn-cta-btn secondary">
                            <span>Learn More</span>
                        </button>
                        <Link href="/earn/submit" className="earn-cta-btn primary">
                            <span>Submit Opportunity</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="earn-cta-bg" />
            </section>

            <PageProgress />
            <Footer />
        </main>
    );
}
