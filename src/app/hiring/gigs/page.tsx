'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import { JOBS, FILTERS, type Job } from './data';
import './gigs.css';

const RobotModel = dynamic(() => import('./RobotModel'), {
    ssr: false,
    loading: () => <div className="robot-model-loading">Loading 3D Model...</div>
});

// Category icons mapping (same as freelancers page)
const getCategoryIcon = (name: string) => {
    const icons: { [key: string]: React.ReactNode } = {
        'Video Editing': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="6" y="10" width="26" height="28" rx="3" />
                <path d="M32 18l10-6v24l-10-6V18z" />
            </svg>
        ),
        'Animation': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="24" cy="24" r="16" />
                <path d="M20 16v16l12-8-12-8z" fill="currentColor" />
            </svg>
        ),
        'Software Development': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M16 14l-10 10 10 10" />
                <path d="M32 14l10 10-10 10" />
                <path d="M28 8l-8 32" />
            </svg>
        ),
        'Product Design': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="6" y="6" width="36" height="36" rx="4" />
                <rect x="12" y="12" width="24" height="8" rx="2" />
                <rect x="12" y="24" width="10" height="12" rx="2" />
                <rect x="26" y="24" width="10" height="12" rx="2" />
            </svg>
        ),
        'Ghost Writing': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M8 40l4-16L36 8l8 8-24 24-16 4z" />
                <path d="M28 12l8 8" />
                <path d="M12 36l4-4" />
            </svg>
        ),
        'Graphics Design': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="8" y="8" width="32" height="32" rx="4" />
                <circle cx="16" cy="16" r="4" fill="currentColor" />
                <circle cx="32" cy="16" r="4" fill="currentColor" />
                <circle cx="16" cy="32" r="4" fill="currentColor" />
                <path d="M24 24l8 8" />
                <rect x="28" y="28" width="8" height="8" rx="1" />
            </svg>
        ),
        'Smart Contract Auditor': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M24 4L6 12v12c0 11 8 21 18 24 10-3 18-13 18-24V12L24 4z" />
                <path d="M16 24l6 6 10-12" />
            </svg>
        ),
        'Sui-Move Dev': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="8" y="8" width="12" height="12" rx="2" />
                <rect x="28" y="8" width="12" height="12" rx="2" />
                <rect x="8" y="28" width="12" height="12" rx="2" />
                <rect x="28" y="28" width="12" height="12" rx="2" />
                <path d="M20 14h8M14 20v8M34 20v8M20 34h8" />
            </svg>
        ),
        'Product Manager': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="8" y="6" width="32" height="36" rx="3" />
                <path d="M16 14h16" />
                <path d="M16 22h16" />
                <path d="M16 30h10" />
                <path d="M14 14h0M14 22h0M14 30h0" />
            </svg>
        ),
        'Social Media Manager': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="18" cy="12" r="5" />
                <circle cx="36" cy="24" r="5" />
                <circle cx="18" cy="36" r="5" />
                <path d="M23 14l8 7" />
                <path d="M23 34l8-7" />
            </svg>
        ),
        'NFT Specialist': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="6" y="6" width="36" height="36" rx="4" />
                <path d="M6 32l10-10 6 6 10-10 10 10" />
                <circle cx="32" cy="16" r="4" />
            </svg>
        ),
        'Community Manager': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="24" cy="14" r="7" />
                <circle cx="10" cy="20" r="5" />
                <circle cx="38" cy="20" r="5" />
                <path d="M12 42c0-6.6 5.4-12 12-12s12 5.4 12 12" />
                <path d="M4 42c0-4 2.7-7 6-7" />
                <path d="M44 42c0-4-2.7-7-6-7" />
            </svg>
        ),
        'Quant/Tokenomics Expert': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M6 38V22l8-8 8 12 8-16 12 8v20" />
                <path d="M6 38h36" />
                <circle cx="14" cy="14" r="3" />
                <circle cx="22" cy="26" r="3" />
                <circle cx="30" cy="10" r="3" />
                <circle cx="42" cy="18" r="3" />
            </svg>
        ),
        'Cyber Security': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M24 4L6 12v12c0 11 8 21 18 24 10-3 18-13 18-24V12L24 4z" />
                <rect x="18" y="20" width="12" height="10" rx="2" />
                <circle cx="24" cy="18" r="4" />
                <path d="M24 24v4" />
            </svg>
        ),
        'AI/ML': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="24" cy="24" r="8" />
                <circle cx="24" cy="24" r="3" fill="currentColor" />
                <path d="M24 8v8M24 32v8M8 24h8M32 24h8" />
                <path d="M12 12l6 6M30 30l6 6M12 36l6-6M30 18l6-6" />
            </svg>
        ),
        'DeFi Developer': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="24" cy="24" r="16" />
                <path d="M18 20h12M18 28h12" />
                <path d="M20 16v16M28 16v16" />
            </svg>
        ),
        'DAO Specialist': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="24" cy="12" r="6" />
                <circle cx="12" cy="34" r="6" />
                <circle cx="36" cy="34" r="6" />
                <path d="M24 18v10M18 31l-3-3M30 31l3-3" />
            </svg>
        ),
        'GameFi/Web3 Gaming': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="6" y="14" width="36" height="20" rx="10" />
                <circle cx="16" cy="24" r="3" />
                <circle cx="32" cy="24" r="2" fill="currentColor" />
                <circle cx="36" cy="20" r="2" fill="currentColor" />
            </svg>
        ),
        'Wallet/Infra Engineer': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <rect x="6" y="12" width="36" height="24" rx="4" />
                <path d="M6 20h36" />
                <circle cx="34" cy="28" r="3" fill="currentColor" />
            </svg>
        ),
        'DevRel/Developer Advocate': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M14 14l-8 10 8 10" />
                <path d="M34 14l8 10-8 10" />
                <circle cx="24" cy="40" r="4" />
                <path d="M24 34v2" />
            </svg>
        ),
        'Blockchain Researcher': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <circle cx="20" cy="20" r="12" />
                <path d="M28 28l12 12" />
                <path d="M16 16h8M16 20h6M16 24h4" />
            </svg>
        ),
        'Growth/BD Manager': (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M8 40V28l8-4 8 8 8-16 8-4v28" />
                <path d="M32 12l8-4" />
                <path d="M36 8l4 4" />
            </svg>
        ),
    };
    return icons[name] || icons['Video Editing'];
};

// Category data (same as freelancers page)
const categories = [
    { id: 1, name: 'Software Development', jobCount: 156 },
    { id: 2, name: 'Sui-Move Dev', jobCount: 67 },
    { id: 3, name: 'DeFi Developer', jobCount: 54 },
    { id: 4, name: 'Smart Contract Auditor', jobCount: 28 },
    { id: 5, name: 'Product Design', jobCount: 42 },
    { id: 6, name: 'DAO Specialist', jobCount: 23 },
    { id: 7, name: 'GameFi/Web3 Gaming', jobCount: 31 },
    { id: 8, name: 'Wallet/Infra Engineer', jobCount: 26 },
    { id: 9, name: 'DevRel/Developer Advocate', jobCount: 35 },
    { id: 10, name: 'Blockchain Researcher', jobCount: 18 },
    { id: 11, name: 'Growth/BD Manager', jobCount: 29 },
    { id: 12, name: 'Community Manager', jobCount: 45 },
    { id: 13, name: 'Product Manager', jobCount: 22 },
    { id: 14, name: 'Social Media Manager', jobCount: 31 },
    { id: 15, name: 'Graphics Design', jobCount: 38 },
    { id: 16, name: 'Video Editing', jobCount: 24 },
    { id: 17, name: 'Animation', jobCount: 18 },
    { id: 18, name: 'Ghost Writing', jobCount: 15 },
    { id: 19, name: 'NFT Specialist', jobCount: 19 },
    { id: 20, name: 'Quant/Tokenomics Expert', jobCount: 12 },
    { id: 21, name: 'Cyber Security', jobCount: 21 },
    { id: 22, name: 'AI/ML', jobCount: 34 },
];

// Job Card Component
const JobCard = ({ job, index }: { job: Job; index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top } = cardRef.current.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        cardRef.current.style.setProperty('--mouse-x', `${x}px`);
        cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    };

    // Tag color mapping
    const getTagColor = (tag: string): string => {
        const colors: { [key: string]: string } = {
            'Rust': 'orange',
            'Blockchain': 'blue',
            'Sui': 'cyan',
            'Move': 'purple',
            'DeFi': 'green',
            'Smart Contracts': 'purple',
            'Community': 'pink',
            'Social Media': 'blue',
            'Marketing': 'orange',
            'React': 'cyan',
            'TypeScript': 'blue',
            'Web3': 'purple',
            'UI/UX': 'pink',
            'Figma': 'purple',
            'Design System': 'green',
            'DevRel': 'orange',
            'Content': 'blue',
            'Growth': 'green',
            'Analytics': 'cyan',
            'Security': 'red',
            'Auditing': 'orange',
        };
        return colors[tag] || 'default';
    };

    return (
        <div
            ref={cardRef}
            className={`gigs-job-card ${job.featured ? 'featured' : ''}`}
            onMouseMove={handleMouseMove}
        >
            {/* Spotlight overlay */}
            <div className="job-card-spotlight" />

            {/* Header with logo and badges */}
            <div className="gigs-job-header">
                <div className="gigs-job-logo">
                    <Image
                        src={job.logo}
                        alt={`${job.company} logo`}
                        width={52}
                        height={52}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="gigs-job-badges">
                    <span className={`gigs-job-type-badge ${job.type.toLowerCase().replace('-', '')}`}>
                        {job.type}
                    </span>
                    {job.featured && (
                        <span className="gigs-job-featured-badge">Featured</span>
                    )}
                </div>
            </div>

            {/* Job info */}
            <div className="gigs-job-info">
                <h3 className="gigs-job-title">{job.title}</h3>
                <p className="gigs-job-company">
                    {job.company}
                    <span className="gigs-job-dot">•</span>
                    {job.location}
                </p>
            </div>

            {/* Description placeholder */}
            <p className="gigs-job-description">
                Join our team to build the future of decentralized applications on Sui Network.
            </p>

            {/* Tags */}
            <div className="gigs-job-tags">
                {job.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={`gigs-job-tag tag-${getTagColor(tag)}`}>
                        {tag}
                    </span>
                ))}
            </div>

            {/* Footer with salary and action */}
            <div className="gigs-job-footer">
                <div className="gigs-job-salary">
                    <span className="salary-amount">{job.salary.replace(/\s*\/(mo|hr|project)\s*$/, '')}</span>
                    <span className="salary-period">
                        {job.salary.includes('/hr') ? '/hour' : job.salary.includes('/mo') ? '/month' : job.salary.includes('/project') ? '/project' : '/month'}
                    </span>
                </div>
                <div className="gigs-job-meta">
                    <span className="gigs-job-posted">{job.postedAt}</span>
                </div>
            </div>

            {/* Apply button */}
            <Link href={`/hiring/gigs/${job.id}`} className="gigs-apply-btn">
                <span>Apply Now</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </Link>
        </div>
    );
};

// Featured Job Card (larger, horizontal on desktop)
const FeaturedJobCard = ({ job }: { job: Job }) => {
    return (
        <motion.div
            className="gigs-featured-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="gigs-featured-content">
                <div className="gigs-featured-header">
                    <div className="gigs-featured-logo">
                        <Image
                            src={job.logo}
                            alt={`${job.company} logo`}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="gigs-featured-badges">
                        <span className="gigs-featured-badge">Mysten Labs</span>
                        <span className="gigs-featured-type">Intern</span>
                    </div>
                </div>

                <div className="gigs-featured-info">
                    <h3 className="gigs-featured-title">{job.title}</h3>
                    <p className="gigs-featured-company">{job.company} • {job.location}</p>
                    <p className="gigs-featured-description">
                        We're looking for talented individuals to join our team and help build the next generation of decentralized applications on the Sui Network. This is an exciting opportunity to work with cutting-edge technology.
                    </p>
                </div>

                <div className="gigs-featured-tags">
                    {job.tags.map((tag) => (
                        <span key={tag} className="gigs-featured-tag">{tag}</span>
                    ))}
                </div>

                <div className="gigs-featured-footer">
                    <Link href={`/hiring/gigs/${job.id}`} className="gigs-featured-apply">
                        <span>View Position</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>

            <div className="gigs-featured-visual">
                <div className="gigs-featured-pattern" />
            </div>
        </motion.div>
    );
};

export default function GigsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedSalary, setSelectedSalary] = useState<string[]>([]);
    const [selectedStars, setSelectedStars] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [openFilterGroups, setOpenFilterGroups] = useState<string[]>(['Type of Employment']);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('relevant');
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [categoryPage, setCategoryPage] = useState(0);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const toggleFilterGroup = (name: string) => {
        setOpenFilterGroups(prev =>
            prev.includes(name) ? prev.filter(f => f !== name) : [...prev, name]
        );
    };

    const sortOptions = [
        { value: 'relevant', label: 'Most Relevant' },
        { value: 'recent', label: 'Most Recent' },
        { value: 'salary', label: 'Highest Salary' },
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

    const JOBS_PER_PAGE = 30;
    const CATEGORIES_PER_PAGE = 8; // 2 rows of 4

    // Category pagination
    const totalCategoryPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
    const categoryStartIndex = categoryPage * CATEGORIES_PER_PAGE;
    const visibleCategories = categories.slice(categoryStartIndex, categoryStartIndex + CATEGORIES_PER_PAGE);

    // Filter jobs based on selections
    const filteredJobs = useMemo(() => {
        return JOBS.filter((job) => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    job.title.toLowerCase().includes(query) ||
                    job.company.toLowerCase().includes(query) ||
                    job.tags.some(tag => tag.toLowerCase().includes(query));
                if (!matchesSearch) return false;
            }

            // Type filter
            if (selectedTypes.length > 0 && !selectedTypes.includes(job.type)) {
                return false;
            }

            // Category filter
            if (selectedCategories.length > 0) {
                const categoryMatch = job.tags.some(tag =>
                    selectedCategories.some(cat =>
                        tag.toLowerCase().includes(cat.toLowerCase()) ||
                        cat.toLowerCase().includes(tag.toLowerCase())
                    )
                );
                if (!categoryMatch) return false;
            }

            // Star rating filter
            if (selectedStars.length > 0) {
                const starMap: Record<string, string> = {
                    '2 Stars': 'Entry',
                    '3 Stars': 'Mid',
                    '4 Stars': 'Senior',
                    'Veteran': 'Lead',
                };
                const matchingLevels = selectedStars.map(s => starMap[s]);
                if (!matchingLevels.includes(job.level)) return false;
            }

            return true;
        });
    }, [searchQuery, selectedTypes, selectedCategories, selectedStars]);

    // Parse "X days ago" to a sortable number (lower = more recent)
    const parsePostedTime = (timeStr: string): number => {
        const match = timeStr.match(/(\d+)\s*(hour|day|week|month)/i);
        if (!match) return 999;
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        const multipliers: { [key: string]: number } = {
            'hour': 1,
            'day': 24,
            'week': 168,
            'month': 720,
        };
        return value * (multipliers[unit] || 1);
    };

    // Parse salary string to a number for comparison
    const parseSalary = (salaryStr: string): number => {
        const match = salaryStr.match(/\$(\d+(?:\.\d+)?)(k)?/i);
        if (!match) return 0;
        let value = parseFloat(match[1]);
        if (match[2]?.toLowerCase() === 'k') value *= 1000;
        return value;
    };

    // Sort jobs (featured always at top)
    const sortedJobs = useMemo(() => {
        const featured = filteredJobs.filter(job => job.featured);
        const regular = filteredJobs.filter(job => !job.featured);

        const sortFn = (a: Job, b: Job) => {
            switch (sortBy) {
                case 'recent':
                    return parsePostedTime(a.postedAt) - parsePostedTime(b.postedAt);
                case 'salary':
                    return parseSalary(b.salary) - parseSalary(a.salary);
                default:
                    return 0;
            }
        };

        return [...featured.sort(sortFn), ...regular.sort(sortFn)];
    }, [filteredJobs, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedJobs.length / JOBS_PER_PAGE);
    const paginatedJobs = sortedJobs.slice(
        (currentPage - 1) * JOBS_PER_PAGE,
        currentPage * JOBS_PER_PAGE
    );

    // Featured jobs (first 3)
    const featuredJobs = JOBS.filter(job => job.featured);

    // Reset page when filters or sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedTypes, selectedCategories, searchQuery, sortBy]);

    const toggleFilter = (option: string, selected: string[], setSelected: (value: string[]) => void) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option));
        } else {
            setSelected([...selected, option]);
        }
    };

    const clearAllFilters = () => {
        setSelectedTypes([]);
        setSelectedCategories([]);
        setSelectedSalary([]);
        setSelectedStars([]);
        setSearchQuery('');
    };

    const hasActiveFilters = selectedTypes.length > 0 ||
        selectedCategories.length > 0 || selectedSalary.length > 0 || selectedStars.length > 0 || searchQuery !== '';

    return (
        <main className="gigs-page">
            <Header showGreenBorder />

            {/* Background Pattern */}
            <div className="gigs-bg-pattern" />

            {/* Hero Section */}
            <section className="gigs-hero">
                <div className="gigs-hero-content">
                    <motion.div
                        className="gigs-hero-text"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="gigs-hero-title">
                            Find Your Next
                            <span className="gigs-hero-highlight"> Web3 </span>
                            Opportunity
                        </h1>
                        <p className="gigs-hero-subtitle">
                            Connect with top protocols and projects building on Sui Network.
                            Discover remote-first roles in DeFi, NFTs, Gaming, and more.
                        </p>

                        {/* Search Bar */}
                        <div className="gigs-search-container">
                            <div className="gigs-search-wrapper">
                                <svg className="gigs-search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                </svg>
                                <input
                                    type="text"
                                    className="gigs-search-input"
                                    placeholder="Search jobs, companies, or skills..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {searchQuery && (
                                    <button
                                        className="gigs-search-clear"
                                        onClick={() => setSearchQuery('')}
                                        aria-label="Clear search"
                                        title="Clear search"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <button className="gigs-search-btn" aria-label="Search jobs">
                                <span>Search</span>
                            </button>
                        </div>

                        {/* Quick stats */}
                        <div className="gigs-hero-stats">
                            <div className="gigs-stat">
                                <span className="gigs-stat-value">{JOBS.length}+</span>
                                <span className="gigs-stat-label">Open Positions</span>
                            </div>
                            <div className="gigs-stat-divider" />
                            <div className="gigs-stat">
                                <span className="gigs-stat-value">50+</span>
                                <span className="gigs-stat-label">Companies</span>
                            </div>
                            <div className="gigs-stat-divider" />
                            <div className="gigs-stat">
                                <span className="gigs-stat-value">Remote</span>
                                <span className="gigs-stat-label">First Culture</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="gigs-hero-visual"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <RobotModel />
                    </motion.div>
                </div>
            </section>

            {/* Categories Section - Matching Freelancers Page */}
            <section className="category-section">
                <h2 className="category-title">Explore by category</h2>
                <div className="category-content">
                    <div className="category-grid">
                        {visibleCategories.map((category) => (
                            <button
                                key={category.id}
                                className={`category-card ${selectedCategories.includes(category.name) ? 'category-card-active' : ''}`}
                                onClick={() => toggleFilter(category.name, selectedCategories, setSelectedCategories)}
                            >
                                <div className="category-icon">
                                    {getCategoryIcon(category.name)}
                                </div>
                                <div className="category-info">
                                    <span className="category-name">{category.name}</span>
                                    <div className="category-count">
                                        <span>{category.jobCount} jobs available</span>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="past-events-nav">
                        <button
                            className={`past-events-nav-btn prev ${categoryPage === 0 ? 'disabled' : ''}`}
                            disabled={categoryPage === 0}
                            onClick={() => setCategoryPage(categoryPage - 1)}
                            aria-label="Show previous categories"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            className={`past-events-nav-btn next ${categoryPage >= totalCategoryPages - 1 ? 'disabled' : ''}`}
                            disabled={categoryPage >= totalCategoryPages - 1}
                            onClick={() => setCategoryPage(categoryPage + 1)}
                            aria-label="Show next categories"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section - 3D Card Stack */}
            {featuredJobs.length > 0 && (
                <section className="gigs-featured-section">
                    <h2 className="gigs-featured-section-title">
                        <span className="title-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFB836">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                            </svg>
                        </span>
                        Sui Ecosystem Jobs
                    </h2>
                    <div className="gigs-featured-list">
                        {featuredJobs.slice(0, 4).map((job, index) => (
                            <div key={job.id}>
                                <FeaturedJobCard job={job} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Main Listing Section */}
            <section className="gigs-listing">
                <h2 className="recorded-title">ALL JOBS</h2>

                {/* Listing Controls Row */}
                <div className="gigs-listing-header">
                    <div className="gigs-controls-left">
                        <div className="gigs-sort-wrapper" ref={sortDropdownRef}>
                            <label>Sort by:</label>
                            <div className="gigs-sort-dropdown">
                                <button
                                    className={`gigs-sort-trigger ${sortDropdownOpen ? 'open' : ''}`}
                                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    aria-label="Sort jobs by"
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
                                            className="gigs-sort-menu"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {sortOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    className={`gigs-sort-option ${sortBy === option.value ? 'active' : ''}`}
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
                        <span className="gigs-listing-count">
                            Showing {paginatedJobs.length} of {filteredJobs.length} results
                        </span>
                    </div>
                    <div className="blog-controls">
                        <button className={`blog-filter-toggle${showFilters ? ' active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M3 4l6 7v5l4 2v-7l6-7" />
                            </svg>
                            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                        </button>
                        <div className="gigs-view-toggle">
                            <button
                                className={`gigs-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
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
                                className={`gigs-view-btn ${viewMode === 'list' ? 'active' : ''}`}
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

                <div className="gigs-listing-content">
                    {/* Jobs Grid/List */}
                    <div className={`gigs-jobs-container ${viewMode}`}>
                        {paginatedJobs.length > 0 ? (
                            <div key={viewMode} className={`gigs-jobs-${viewMode}`}>
                                {paginatedJobs.map((job, index) => (
                                    <JobCard key={job.id} job={job} index={index} />
                                ))}
                            </div>
                        ) : (
                            <div className="gigs-no-results">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                    <path d="M8 8l6 6M14 8l-6 6" strokeLinecap="round" />
                                </svg>
                                <h3>No jobs found</h3>
                                <p>Try adjusting your filters or search query</p>
                                <button className="gigs-reset-btn" onClick={clearAllFilters}>
                                    Reset Filters
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="gigs-pagination">
                                <button
                                    className="gigs-page-btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    aria-label="Previous page"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="gigs-page-numbers">
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
                                                className={`gigs-page-num ${currentPage === pageNum ? 'active' : ''}`}
                                                onClick={() => setCurrentPage(pageNum)}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="gigs-page-ellipsis">...</span>
                                            <button
                                                className="gigs-page-num"
                                                onClick={() => setCurrentPage(totalPages)}
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                <button
                                    className="gigs-page-btn"
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

                    {/* Filter Sidebar - Right Side */}
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

                                    {/* Type of Employment */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Type of Employment') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Type of Employment')}>
                                            <span>Type of Employment</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {FILTERS.types.map((type) => (
                                                <label key={type} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedTypes.includes(type)}
                                                        onChange={() => toggleFilter(type, selectedTypes, setSelectedTypes)}
                                                    />
                                                    <span className="sui-filter-label">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Categories */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Categories') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Categories')}>
                                            <span>Categories</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {FILTERS.categories.map((category) => (
                                                <label key={category} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedCategories.includes(category)}
                                                        onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                                                    />
                                                    <span className="sui-filter-label">{category}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Salary Range */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Salary Range') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Salary Range')}>
                                            <span>Salary Range</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {FILTERS.salary.map((salary) => (
                                                <label key={salary} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedSalary.includes(salary)}
                                                        onChange={() => toggleFilter(salary, selectedSalary, setSelectedSalary)}
                                                    />
                                                    <span className="sui-filter-label">{salary}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Star Rating */}
                                    <div className={`sui-filter-group ${openFilterGroups.includes('Star Rating') ? 'open' : ''}`}>
                                        <button className="sui-filter-header" onClick={() => toggleFilterGroup('Star Rating')}>
                                            <span>Star Rating</span>
                                            <svg className="sui-filter-icon" viewBox="0 0 16 16" fill="none">
                                                <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                        <div className="sui-filter-options">
                                            {['2 Stars', '3 Stars', '4 Stars', 'Veteran'].map((rating) => (
                                                <label key={rating} className="sui-filter-option">
                                                    <input
                                                        type="checkbox"
                                                        className="sui-filter-checkbox"
                                                        checked={selectedStars.includes(rating)}
                                                        onChange={() => toggleFilter(rating, selectedStars, setSelectedStars)}
                                                    />
                                                    <span className="sui-filter-label">{rating}</span>
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
            <section className="gigs-cta-section">
                <div className="gigs-cta-content">
                    <div className="gigs-cta-text">
                        <h2 className="gigs-cta-title">Ready to Hire Top Talent?</h2>
                        <p className="gigs-cta-subtitle">
                            Post your job and reach thousands of skilled Web3 professionals in the Sui ecosystem.
                        </p>
                    </div>
                    <div className="gigs-cta-actions">
                        <Link href="/hiring/freelancers" className="gigs-cta-btn secondary">
                            <span>Browse Freelancers</span>
                        </Link>
                        <Link href="/hiring/post-job" className="gigs-cta-btn primary">
                            <span>Post a Job</span>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
                <div className="gigs-cta-bg" />
            </section>

            {/* Community Newsletter Section */}
            <section className="profile-newsletter-section">
                <div className="profile-newsletter-bg">
                    <Image
                        src="/images/community/bg-1.png"
                        alt="Community Background"
                        fill
                        className="profile-newsletter-bg-image"
                    />
                    <div className="profile-newsletter-overlay"></div>
                </div>

                <h2 className="profile-newsletter-title">KEEP UP WITH THE COMMUNITY</h2>

                <div className="profile-newsletter-posts-wrapper">
                    <div className="profile-newsletter-posts">
                        {/* Original posts */}
                        {[1, 2, 3, 4].map((post) => (
                            <div key={post} className="profile-newsletter-post">
                                <div className="profile-post-header">
                                    <div className="profile-post-avatar">
                                        <Image src="/images/community/bg-1.png" alt="DeLorean Labs" fill className="post-avatar-img" />
                                    </div>
                                    <div className="profile-post-author">
                                        <span className="profile-post-name">DeLorean Labs</span>
                                        <span className="profile-post-handle">soudodamon...</span>
                                    </div>
                                    <span className="profile-post-date">06/20/2025, 00.28</span>
                                </div>
                                <div className="profile-post-image">
                                    <Image src="/images/community/bg-2.png" alt="Post" fill className="post-img" />
                                </div>
                                <p className="profile-post-text">
                                    A brand with legacy, now built for the future. $DMC is not just a token — it&apos;s a movement. Ready to see what happens at 88MPH? @DeLoreanlabs is just getting started.
                                </p>
                                <span className="profile-post-view">View on X</span>
                            </div>
                        ))}
                        {/* Duplicate posts for seamless loop */}
                        {[1, 2, 3, 4].map((post) => (
                            <div key={`dup-${post}`} className="profile-newsletter-post">
                                <div className="profile-post-header">
                                    <div className="profile-post-avatar">
                                        <Image src="/images/community/bg-1.png" alt="DeLorean Labs" fill className="post-avatar-img" />
                                    </div>
                                    <div className="profile-post-author">
                                        <span className="profile-post-name">DeLorean Labs</span>
                                        <span className="profile-post-handle">soudodamon...</span>
                                    </div>
                                    <span className="profile-post-date">06/20/2025, 00.28</span>
                                </div>
                                <div className="profile-post-image">
                                    <Image src="/images/community/bg-2.png" alt="Post" fill className="post-img" />
                                </div>
                                <p className="profile-post-text">
                                    A brand with legacy, now built for the future. $DMC is not just a token — it&apos;s a movement. Ready to see what happens at 88MPH? @DeLoreanlabs is just getting started.
                                </p>
                                <span className="profile-post-view">View on X</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="profile-newsletter-cta">Let&apos;s keep in touch - Be the first to know what&apos;s coming.</p>
            </section>

            <PageProgress />
            <Footer />
        </main>
    );
}
