'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import MessagesDrawer from '@/components/MessagesDrawer';
import { JOBS } from '../gigs/data';
import './applications.css';

// ─── Types ───────────────────────────────────────────
type ApplicationStatus = 'pending' | 'reviewed' | 'shortlisted' | 'accepted' | 'rejected';

interface Applicant {
    name: string;
    email: string;
    avatar: string;
    title: string;
    portfolio: string;
    resumeFileName: string;
    coverLetter: string;
    expectedCompensation: string;
    skills: string[];
}

interface Application {
    id: string;
    applicant: Applicant;
    jobId: string;
    jobTitle: string;
    jobCompany: string;
    appliedAt: string;
    status: ApplicationStatus;
}

// ─── Mock Data ───────────────────────────────────────
const firstNames = [
    'Adebayo', 'Chioma', 'Emeka', 'Funke', 'Ibrahim', 'Ngozi', 'Oluwaseun', 'Patience',
    'Rasheed', 'Tunde', 'Yemi', 'Zainab', 'Chidi', 'Aisha', 'Obinna', 'Halima',
    'Kelechi', 'Amara', 'Damilola', 'Sade', 'Uche', 'Binta', 'Ifeanyi', 'Nneka',
];
const lastNames = [
    'Okafor', 'Adeyemi', 'Ibrahim', 'Ogundimu', 'Abubakar', 'Eze', 'Balogun', 'Nnamdi',
    'Olayinka', 'Mohammed', 'Chukwu', 'Abdullahi', 'Okonkwo', 'Yusuf', 'Adeleke', 'Musa',
];
const applicantTitles = [
    'Senior Move Developer', 'Frontend Engineer', 'Smart Contract Auditor', 'Product Designer',
    'Community Manager', 'Full Stack Developer', 'Blockchain Researcher', 'DevRel Engineer',
    'UI/UX Designer', 'DeFi Specialist', 'Backend Engineer', 'Security Engineer',
    'Technical Writer', 'Growth Lead', 'NFT Artist', 'Data Analyst',
];
const coverLetters = [
    'I am deeply passionate about building decentralized applications on the Sui Network. With over 3 years of experience in blockchain development, I bring both technical depth and creative problem-solving to every project I take on.',
    'My background in Move programming and DeFi protocols positions me well for this role. I have contributed to multiple open-source projects in the Sui ecosystem and am eager to bring my expertise to your team.',
    'As a dedicated Web3 professional, I have spent the last two years building smart contracts and dApps. I am particularly excited about the Sui blockchain\'s unique approach to object-centric design.',
    'I bring a strong blend of technical skills and community engagement experience. Having managed communities of 10,000+ members, I understand what it takes to grow and nurture a vibrant ecosystem.',
    'With a design background spanning both Web2 and Web3, I create intuitive user experiences for complex blockchain applications. My portfolio includes work for several top DeFi protocols.',
    'I have extensive experience in security auditing, having identified critical vulnerabilities in multiple smart contracts. I follow a rigorous methodology to ensure code safety and reliability.',
];
const compensations = [
    '$1,500 USDC/mo', '$2,000 USDC/mo', '$2,500 USDC/mo', '$3,000 USDC/mo',
    '$3,500 USDC/mo', '$4,000 USDC/mo', '$5,000 USDC/mo', '$30 USDC/hr', '$45 USDC/hr', '$60 USDC/hr',
];
const skillSets = [
    ['Rust', 'Move', 'Sui SDK'], ['React', 'TypeScript', 'Next.js'], ['Solidity', 'DeFi', 'Smart Contracts'],
    ['Figma', 'UI/UX', 'Design Systems'], ['Discord', 'Community', 'Social Media'],
    ['Python', 'TensorFlow', 'AI/ML'], ['Security', 'Auditing', 'OWASP'], ['DevRel', 'Documentation', 'Content'],
    ['Node.js', 'GraphQL', 'REST API'], ['React Native', 'Flutter', 'Mobile'],
];
const appliedTimes = [
    '1 hour ago', '3 hours ago', '5 hours ago', '12 hours ago',
    '1 day ago', '2 days ago', '3 days ago', '5 days ago',
    '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago',
];
const statuses: ApplicationStatus[] = ['pending', 'pending', 'pending', 'pending', 'shortlisted', 'shortlisted', 'accepted', 'rejected'];
const avatars = ['/images/community/bg-1.png', '/images/community/bg-2.png', '/images/community/bg-3.png', '/images/community/bg-4.png', '/images/community/bg-5.png', '/images/community/bg-6.png', '/images/community/bg-7.png'];

function generateApplications(count: number): Application[] {
    const apps: Application[] = [];
    for (let i = 0; i < count; i++) {
        const job = JOBS[i % JOBS.length];
        const fn = firstNames[i % firstNames.length];
        const ln = lastNames[(i * 3) % lastNames.length];
        apps.push({
            id: String(i + 1),
            applicant: {
                name: `${fn} ${ln}`,
                email: `${fn.toLowerCase()}.${ln.toLowerCase()}@mail.com`,
                avatar: avatars[i % avatars.length],
                title: applicantTitles[i % applicantTitles.length],
                portfolio: `https://${fn.toLowerCase()}${ln.toLowerCase()}.dev`,
                resumeFileName: `${fn}_${ln}_Resume.pdf`,
                coverLetter: coverLetters[i % coverLetters.length],
                expectedCompensation: compensations[i % compensations.length],
                skills: skillSets[i % skillSets.length],
            },
            jobId: job.id,
            jobTitle: job.title,
            jobCompany: job.company,
            appliedAt: appliedTimes[i % appliedTimes.length],
            status: statuses[i % statuses.length],
        });
    }
    return apps;
}

const APPLICATIONS = generateApplications(75);

const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Alphabetical' },
    { value: 'status', label: 'By Status' },
];

const STATUS_ORDER: Record<ApplicationStatus, number> = { pending: 0, reviewed: 1, shortlisted: 2, accepted: 3, rejected: 4 };

// ─── Application Card ────────────────────────────────
const ApplicationCard = ({
    application,
    currentStatus,
    activeTab,
    onView,
    onMessage,
    onShortlist,
    onAccept,
    onReject,
    onRestore,
}: {
    application: Application;
    currentStatus: ApplicationStatus;
    activeTab: string;
    onView: () => void;
    onMessage: () => void;
    onShortlist: () => void;
    onAccept: () => void;
    onReject: () => void;
    onRestore: () => void;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        cardRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };

    return (
        <div ref={cardRef} className={`apps-card apps-card--${activeTab}`} onMouseMove={handleMouseMove}>
            <div className="apps-card-header">
                <div className="apps-card-avatar">
                    <Image src={application.applicant.avatar} alt={application.applicant.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="apps-card-badges">
                    <span className={`apps-status-badge status-${currentStatus}`}>
                        {currentStatus}
                    </span>
                </div>
            </div>

            <div className="apps-card-info">
                <h3 className="apps-card-name">{application.applicant.name}</h3>
                <p className="apps-card-title">{application.applicant.title}</p>
                <p className="apps-card-email">{application.applicant.email}</p>
            </div>

            <div className="apps-card-job">
                <span className="apps-card-job-label">Applied for</span>
                <span className="apps-card-job-title">{application.jobTitle}</span>
            </div>

            <div className="apps-card-skills">
                {application.applicant.skills.slice(0, 3).map(s => (
                    <span key={s} className="apps-card-skill">{s}</span>
                ))}
            </div>

            <div className="apps-card-footer">
                <span className="apps-card-date">{application.appliedAt}</span>
                <span className="apps-card-compensation">{application.applicant.expectedCompensation}</span>
            </div>

            <div className="apps-card-actions">
                {activeTab === 'pending' && (
                    <>
                        <button className="apps-action-btn view" onClick={onView}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                        </button>
                        <button className="apps-action-btn message" onClick={onMessage}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            <span>Message</span>
                        </button>
                        <button className="apps-action-btn accept" onClick={onShortlist} title="Shortlist">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="apps-action-btn reject" onClick={onReject} title="Reject">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                )}
                {activeTab === 'shortlisted' && (
                    <>
                        <button className="apps-action-btn view" onClick={onView}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                        </button>
                        <button className="apps-action-btn message" onClick={onMessage}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            <span>Message</span>
                        </button>
                        <button className="apps-action-btn accept-full" onClick={onAccept} title="Accept">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Accept</span>
                        </button>
                        <button className="apps-action-btn reject" onClick={onReject} title="Reject">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                )}
                {activeTab === 'accepted' && (
                    <>
                        <button className="apps-action-btn view" onClick={onView}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                        </button>
                        <button className="apps-action-btn message" onClick={onMessage}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                            </svg>
                            <span>Message</span>
                        </button>
                    </>
                )}
                {activeTab === 'rejected' && (
                    <>
                        <button className="apps-action-btn view" onClick={onView}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                            <span>View</span>
                        </button>
                        <button className="apps-action-btn restore" onClick={onRestore} title="Restore to Pending">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12a9 9 0 119 9" strokeLinecap="round" />
                                <path d="M3 7v5h5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Restore</span>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// ─── Application Detail Drawer ───────────────────────
const ApplicationDetailDrawer = ({
    application,
    currentStatus,
    isOpen,
    onClose,
    onMessage,
    onAccept,
    onReject,
}: {
    application: Application | null;
    currentStatus: ApplicationStatus;
    isOpen: boolean;
    onClose: () => void;
    onMessage: () => void;
    onAccept: () => void;
    onReject: () => void;
}) => {
    if (!application) return null;
    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <>
                    <motion.div className="app-drawer-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
                    <motion.div
                        className="app-drawer"
                        data-lenis-prevent
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                    >
                        <button className="app-drawer-close" onClick={onClose}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        <div className="app-drawer-profile">
                            <div className="app-drawer-avatar">
                                <Image src={application.applicant.avatar} alt={application.applicant.name} fill style={{ objectFit: 'cover' }} />
                            </div>
                            <h2 className="app-drawer-name">{application.applicant.name}</h2>
                            <p className="app-drawer-title">{application.applicant.title}</p>
                            <p className="app-drawer-email">{application.applicant.email}</p>
                            <span className={`apps-status-badge status-${currentStatus}`}>{currentStatus}</span>
                        </div>

                        <div className="app-drawer-section">
                            <h3 className="app-drawer-section-title">Applied For</h3>
                            <div className="app-drawer-job-card">
                                <span className="app-drawer-job-title">{application.jobTitle}</span>
                                <span className="app-drawer-job-company">{application.jobCompany}</span>
                                <span className="app-drawer-job-date">Applied {application.appliedAt}</span>
                            </div>
                        </div>

                        <div className="app-drawer-section">
                            <h3 className="app-drawer-section-title">Cover Letter</h3>
                            <p className="app-drawer-text">{application.applicant.coverLetter}</p>
                        </div>

                        <div className="app-drawer-section">
                            <h3 className="app-drawer-section-title">Portfolio</h3>
                            <a href={application.applicant.portfolio} target="_blank" rel="noopener noreferrer" className="app-drawer-link">
                                {application.applicant.portfolio}
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </a>
                        </div>

                        <div className="app-drawer-section">
                            <h3 className="app-drawer-section-title">Resume</h3>
                            <div className="app-drawer-file">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                <span>{application.applicant.resumeFileName}</span>
                                <button className="app-drawer-download">Download</button>
                            </div>
                        </div>

                        <div className="app-drawer-section">
                            <h3 className="app-drawer-section-title">Expected Compensation</h3>
                            <span className="app-drawer-compensation">{application.applicant.expectedCompensation}</span>
                        </div>

                        <div className="app-drawer-section">
                            <h3 className="app-drawer-section-title">Skills</h3>
                            <div className="app-drawer-skills">
                                {application.applicant.skills.map(skill => (
                                    <span key={skill} className="app-drawer-skill">{skill}</span>
                                ))}
                            </div>
                        </div>

                        <div className="app-drawer-actions">
                            <button className="btn-primary" onClick={onAccept} style={{ borderRadius: '12px', padding: '12px 20px', fontSize: '14px' }}>
                                <span>Accept</span>
                                <svg className="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="app-drawer-reject-btn" onClick={onReject}>Reject</button>
                            <button className="app-drawer-message-btn" onClick={onMessage}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                                </svg>
                                Message
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// ─── Main Page ───────────────────────────────────────
export default function ApplicationsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<string>('pending');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('recent');
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
    const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
    const [applicationStatuses, setApplicationStatuses] = useState<Record<string, ApplicationStatus>>({});

    const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
    const [activeFreelancer, setActiveFreelancer] = useState<{ id: number; name: string; avatar: string } | null>(null);

    const APPS_PER_PAGE = 12;

    // Click outside sort dropdown
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target as Node)) {
                setSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const tabs = [
        { key: 'pending', label: 'Pending' },
        { key: 'shortlisted', label: 'Shortlisted' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'rejected', label: 'Rejected' },
    ];

    // Track when applications were rejected (id -> timestamp)
    const [rejectedAt, setRejectedAt] = useState<Record<string, number>>({});

    const getStatus = (app: Application): ApplicationStatus => applicationStatuses[app.id] || app.status;

    const updateStatus = (id: string, status: ApplicationStatus) => {
        setApplicationStatuses(prev => ({ ...prev, [id]: status }));
        if (status === 'rejected') {
            setRejectedAt(prev => ({ ...prev, [id]: Date.now() }));
        }
    };

    const handleMessage = (app: Application) => {
        setActiveFreelancer({ id: Number(app.id), name: app.applicant.name, avatar: app.applicant.avatar });
        setIsMessageDrawerOpen(true);
    };

    const handleView = (app: Application) => {
        setSelectedApplication(app);
        setDetailDrawerOpen(true);
    };

    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

    const filteredApps = useMemo(() => {
        const now = Date.now();
        return APPLICATIONS.filter(app => {
            const status = getStatus(app);

            // Only show apps matching the active tab
            if (status !== activeTab) return false;

            // Rejected apps expire after 7 days
            if (status === 'rejected') {
                const rejectedTime = rejectedAt[app.id];
                if (rejectedTime && now - rejectedTime > SEVEN_DAYS) return false;
            }

            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                if (
                    !app.applicant.name.toLowerCase().includes(q) &&
                    !app.applicant.email.toLowerCase().includes(q) &&
                    !app.jobTitle.toLowerCase().includes(q) &&
                    !app.applicant.title.toLowerCase().includes(q)
                ) return false;
            }
            return true;
        });
    }, [searchQuery, activeTab, applicationStatuses, rejectedAt]);

    const sortedApps = useMemo(() => {
        const sorted = [...filteredApps];
        switch (sortBy) {
            case 'name': return sorted.sort((a, b) => a.applicant.name.localeCompare(b.applicant.name));
            case 'status': return sorted.sort((a, b) => STATUS_ORDER[getStatus(a)] - STATUS_ORDER[getStatus(b)]);
            default: return sorted;
        }
    }, [filteredApps, sortBy, applicationStatuses]);

    const totalPages = Math.ceil(sortedApps.length / APPS_PER_PAGE);
    const paginatedApps = sortedApps.slice((currentPage - 1) * APPS_PER_PAGE, currentPage * APPS_PER_PAGE);

    const statusCounts = useMemo(() => {
        const now = Date.now();
        const counts: Record<ApplicationStatus, number> = { pending: 0, reviewed: 0, shortlisted: 0, accepted: 0, rejected: 0 };
        APPLICATIONS.forEach(app => {
            const status = getStatus(app);
            if (status === 'rejected') {
                const rejectedTime = rejectedAt[app.id];
                if (rejectedTime && now - rejectedTime > SEVEN_DAYS) return;
            }
            counts[status]++;
        });
        return counts;
    }, [applicationStatuses, rejectedAt]);

    const clearAllFilters = () => {
        setSearchQuery('');
        setCurrentPage(1);
    };

    const hasActiveFilters = !!searchQuery;

    return (
        <>
            <main className="apps-page">
                <Header showGreenBorder />

                {/* Listing */}
                <section className="apps-listing">
                    <div className="apps-listing-top">
                        <h1 className="apps-listing-title">Applications</h1>
                        <div className="apps-search-container">
                            <div className="apps-search-wrapper">
                                <svg className="apps-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                </svg>
                                <input
                                    className="apps-search-input"
                                    placeholder="Search by name, email, or job title..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                />
                                {searchQuery && (
                                    <button className="apps-search-clear" onClick={() => { setSearchQuery(''); setCurrentPage(1); }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="apps-tabs">
                        {tabs.map(tab => {
                            const count = statusCounts[tab.key as ApplicationStatus] || 0;
                            return (
                                <button
                                    key={tab.key}
                                    className={`apps-tab ${activeTab === tab.key ? 'active' : ''}`}
                                    onClick={() => { setActiveTab(tab.key); setCurrentPage(1); }}
                                >
                                    <span className="apps-tab-label">{tab.label}</span>
                                    <span className={`apps-tab-count ${tab.key !== 'all' ? `tab-${tab.key}` : ''}`}>{count}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="apps-listing-header">
                        <span className="apps-listing-count">
                            Showing {paginatedApps.length} of {sortedApps.length} results
                        </span>
                        <div className="apps-controls-right">
                            <div className="apps-sort-wrapper" ref={sortDropdownRef}>
                                <label>Sort by:</label>
                                <div className="apps-sort-dropdown">
                                    <button className={`apps-sort-trigger ${sortDropdownOpen ? 'open' : ''}`} onClick={() => setSortDropdownOpen(!sortDropdownOpen)}>
                                        <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 1.5L6 6.5L11 1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <AnimatePresence>
                                        {sortDropdownOpen && (
                                            <motion.div className="apps-sort-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                                                {sortOptions.map(o => (
                                                    <button key={o.value} className={`apps-sort-option ${sortBy === o.value ? 'active' : ''}`} onClick={() => { setSortBy(o.value); setSortDropdownOpen(false); }}>
                                                        {o.label}
                                                        {sortBy === o.value && (
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
                        </div>
                    </div>

                    <div className={`apps-container ${viewMode}`}>
                        {paginatedApps.length > 0 ? (
                            <div key={`${viewMode}-${activeTab}`} className={`apps-${viewMode}`}>
                                {paginatedApps.map(app => (
                                    <ApplicationCard
                                        key={app.id}
                                        application={app}
                                        currentStatus={getStatus(app)}
                                        activeTab={activeTab}
                                        onView={() => handleView(app)}
                                        onMessage={() => handleMessage(app)}
                                        onShortlist={() => updateStatus(app.id, 'shortlisted')}
                                        onAccept={() => updateStatus(app.id, 'accepted')}
                                        onReject={() => updateStatus(app.id, 'rejected')}
                                        onRestore={() => updateStatus(app.id, 'pending')}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="apps-no-results">
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                    <path d="M8 8l6 6M14 8l-6 6" strokeLinecap="round" />
                                </svg>
                                <h3>No applications found</h3>
                                <p>Try adjusting your search or switching tabs</p>
                                {hasActiveFilters && (
                                    <button className="apps-reset-btn" onClick={clearAllFilters}>Reset All</button>
                                )}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="apps-pagination">
                                <button className="apps-page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <div className="apps-page-numbers">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;
                                        return (
                                            <button key={pageNum} className={`apps-page-num ${currentPage === pageNum ? 'active' : ''}`} onClick={() => setCurrentPage(pageNum)}>
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    {totalPages > 5 && currentPage < totalPages - 2 && (
                                        <>
                                            <span className="apps-page-ellipsis">...</span>
                                            <button className="apps-page-num" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
                                        </>
                                    )}
                                </div>
                                <button className="apps-page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="apps-cta-section">
                    <div className="apps-cta-content">
                        <h2 className="apps-cta-title">Need More Candidates?</h2>
                        <p className="apps-cta-subtitle">
                            Post a new job to attract more qualified applicants from the Sui ecosystem.
                        </p>
                        <div className="apps-cta-actions">
                            <Link href="/hiring/gigs" className="apps-cta-btn secondary">Browse Jobs</Link>
                            <Link href="/hiring/post-job" className="apps-cta-btn primary">
                                <span>Post a Job</span>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                    <div className="apps-cta-bg" />
                </section>

                <PageProgress />
                <Footer />
            </main>

            {/* Detail Drawer */}
            <ApplicationDetailDrawer
                application={selectedApplication}
                currentStatus={selectedApplication ? getStatus(selectedApplication) : 'pending'}
                isOpen={detailDrawerOpen}
                onClose={() => setDetailDrawerOpen(false)}
                onMessage={() => { if (selectedApplication) handleMessage(selectedApplication); }}
                onAccept={() => { if (selectedApplication) { updateStatus(selectedApplication.id, 'accepted'); setDetailDrawerOpen(false); } }}
                onReject={() => { if (selectedApplication) { updateStatus(selectedApplication.id, 'rejected'); setDetailDrawerOpen(false); } }}
            />

            {/* Messages Drawer */}
            <MessagesDrawer
                isOpen={isMessageDrawerOpen}
                onClose={() => setIsMessageDrawerOpen(false)}
                activeFreelancer={activeFreelancer}
            />
        </>
    );
}
