'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import { OPPORTUNITIES, type Opportunity } from '../data';
import './opportunity-detail.css';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as const },
    }),
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

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

const getDeliverables = (opp: Opportunity): string[] => {
    const base = [
        `Complete ${opp.title.toLowerCase()} as described in the opportunity brief`,
        `Submit all deliverables before the deadline (${opp.deadline})`,
        'Provide documentation for your submission',
    ];
    if (opp.categories.includes('Development')) {
        base.push('Include source code with clear README and setup instructions');
        base.push('Write unit tests for core functionality');
    }
    if (opp.categories.includes('Design')) {
        base.push('Deliver design files in Figma or equivalent format');
        base.push('Include responsive mockups for mobile and desktop');
    }
    if (opp.categories.includes('Content')) {
        base.push('Write original, well-researched content');
        base.push('Follow Sui brand voice and style guidelines');
    }
    if (opp.categories.includes('Research')) {
        base.push('Compile findings into a structured report');
        base.push('Include data sources and methodology');
    }
    return base;
};

const getRequirements = (opp: Opportunity): string[] => {
    const reqs: string[] = [];
    if (opp.difficulty === 'Beginner') {
        reqs.push('Basic understanding of blockchain concepts');
        reqs.push('Willingness to learn and engage with the Sui ecosystem');
    } else if (opp.difficulty === 'Intermediate') {
        reqs.push('1-2 years of experience in relevant skills');
        reqs.push('Familiarity with blockchain technology and Web3 concepts');
    } else {
        reqs.push('3+ years of professional experience in relevant domain');
        reqs.push('Deep understanding of blockchain architecture and DeFi protocols');
    }
    reqs.push(`Proficiency in ${opp.skills.join(', ')}`);
    reqs.push('Strong communication skills and ability to meet deadlines');
    reqs.push('Portfolio or GitHub profile demonstrating relevant work');
    return reqs;
};

export default function OpportunityDetailPage() {
    const params = useParams();
    const oppId = params.id as string;
    const opportunity = OPPORTUNITIES.find(o => o.id === oppId);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        portfolio: '',
        coverLetter: '',
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const scrollToApply = () => {
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({ title: opportunity?.title, url: window.location.href });
        } else {
            await navigator.clipboard.writeText(window.location.href);
        }
    };

    if (!opportunity) {
        return (
            <main className="opp-detail-page">
                <Header showGreenBorder />
                <div className="opp-detail-not-found">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <h2>Opportunity Not Found</h2>
                    <p>This opportunity may have been removed or the link is incorrect.</p>
                    <Link href="/earn" className="btn-primary">
                        Browse Opportunities
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const similarOpportunities = OPPORTUNITIES.filter(
        o => o.id !== opportunity.id && (o.type === opportunity.type || o.skills.some(s => opportunity.skills.includes(s)))
    ).slice(0, 3);

    return (
        <main className="opp-detail-page">
            <Header showGreenBorder />

            <div className="opp-detail-container">
                {/* Back Navigation */}
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                    <Link href="/earn" className="opp-detail-back">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Opportunities
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.div className="opp-detail-header" initial="hidden" animate="visible">
                    <motion.div className="opp-detail-header-top" variants={fadeUp} custom={0}>
                        <div className="opp-detail-logo">
                            <Image src={opportunity.orgLogo} alt={opportunity.organization} fill className="object-cover" />
                        </div>
                        <div className="opp-detail-header-info">
                            <span className="opp-detail-org">{opportunity.organization}</span>
                            <span className="opp-detail-posted">Posted {opportunity.postedAt}</span>
                        </div>
                    </motion.div>

                    <motion.h1 className="opp-detail-title" variants={fadeUp} custom={1}>{opportunity.title}</motion.h1>

                    <motion.div className="opp-detail-badges" variants={fadeUp} custom={2}>
                        <span className={`opp-detail-badge type-${opportunity.type.toLowerCase()}`}>{opportunity.type}</span>
                        {opportunity.veteran && (
                            <span className="opp-detail-badge veteran">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                Veteran
                            </span>
                        )}
                        <span className="opp-detail-badge status">
                            <span className={`status-dot ${opportunity.status.toLowerCase().replace(' ', '-')}`} />
                            {opportunity.status}
                        </span>
                    </motion.div>

                    <motion.div className="opp-detail-meta" variants={fadeUp} custom={2}>
                        <span className="opp-detail-meta-item prize">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                            {opportunity.prize}
                        </span>
                        <span className="opp-detail-meta-divider" />
                        <span className="opp-detail-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            {getDaysLeft(opportunity.deadline)}
                        </span>
                        <span className="opp-detail-meta-divider" />
                        <span className="opp-detail-meta-item">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {opportunity.applicants} applicants
                        </span>
                    </motion.div>

                    <motion.div className="opp-detail-actions" variants={fadeUp} custom={3}>
                        <button className="btn-primary" onClick={scrollToApply}>
                            Apply Now
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        <button className="opp-detail-share-btn" onClick={handleShare} title="Share Opportunity">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="18" cy="5" r="3" />
                                <circle cx="6" cy="12" r="3" />
                                <circle cx="18" cy="19" r="3" />
                                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                            </svg>
                        </button>
                    </motion.div>
                </motion.div>

                {/* Two Column Content */}
                <div className="opp-detail-content">
                    {/* Main Content */}
                    <div className="opp-detail-main">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <h2 className="opp-detail-section-title">About This Opportunity</h2>
                            <p className="opp-detail-description">{opportunity.description}{`\n\nThis ${opportunity.type.toLowerCase()} is brought to you by ${opportunity.organization}, a key contributor to the Sui ecosystem. By participating, you'll gain hands-on experience working with cutting-edge blockchain technology while earning rewards for your contributions.\n\nWhether you're a seasoned Web3 professional or just starting your journey in the Sui ecosystem, this opportunity offers a chance to make a meaningful impact. ${opportunity.organization} values quality, creativity, and commitment to advancing decentralized technology.\n\nAll submissions will be reviewed by the ${opportunity.organization} team. Selected participants will receive their rewards directly upon successful completion and approval of their deliverables.`}</p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <h2 className="opp-detail-section-title">What You&apos;ll Work On</h2>
                            <motion.ul className="opp-detail-list" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                {getDeliverables(opportunity).map((item, i) => (
                                    <motion.li key={i} variants={staggerItem}>{item}</motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                            <h2 className="opp-detail-section-title">Requirements</h2>
                            <motion.ul className="opp-detail-list" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                {getRequirements(opportunity).map((item, i) => (
                                    <motion.li key={i} variants={staggerItem}>{item}</motion.li>
                                ))}
                            </motion.ul>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="opp-detail-sidebar">
                        {/* Overview Card */}
                        <motion.div className="opp-detail-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                            <span className="opp-detail-card-title">Overview</span>
                            <div>
                                <span className="opp-detail-prize-large">{opportunity.prize}</span>
                            </div>
                            <div>
                                <div className="opp-detail-overview-row">
                                    <span className="opp-detail-overview-label">Type</span>
                                    <span className="opp-detail-overview-value">{opportunity.type}</span>
                                </div>
                                <div className="opp-detail-overview-row">
                                    <span className="opp-detail-overview-label">Difficulty</span>
                                    <span className="opp-detail-overview-value">{opportunity.difficulty}</span>
                                </div>
                                <div className="opp-detail-overview-row">
                                    <span className="opp-detail-overview-label">Deadline</span>
                                    <span className="opp-detail-overview-value">{getDaysLeft(opportunity.deadline)}</span>
                                </div>
                                <div className="opp-detail-overview-row">
                                    <span className="opp-detail-overview-label">Applicants</span>
                                    <span className="opp-detail-overview-value">{opportunity.applicants}</span>
                                </div>
                            </div>
                            <div>
                                <span className="opp-detail-card-title" style={{ marginBottom: '12px', display: 'block' }}>Categories</span>
                                <div className="opp-detail-categories">
                                    {opportunity.categories.map(cat => (
                                        <span key={cat} className="opp-detail-category">{cat}</span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="opp-detail-card-title" style={{ marginBottom: '12px', display: 'block' }}>Skills</span>
                                <div className="opp-detail-tags">
                                    {opportunity.skills.map(skill => (
                                        <span key={skill} className="opp-detail-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Organization Card */}
                        <motion.div className="opp-detail-org-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
                            <div className="opp-detail-org-card-logo">
                                <Image src={opportunity.orgLogo} alt={opportunity.organization} fill className="object-cover" />
                            </div>
                            <span className="opp-detail-org-card-name">{opportunity.organization}</span>
                            <p className="opp-detail-org-desc">
                                Building the next generation of decentralized applications on Sui Network. A team of passionate builders committed to pushing the boundaries of Web3 technology.
                            </p>
                            <div className="opp-detail-org-socials">
                                <a href="#" className="opp-detail-social-link" title="X (Twitter)">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                <a href="#" className="opp-detail-social-link" title="Discord">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" /></svg>
                                </a>
                                <a href="#" className="opp-detail-social-link" title="Website">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Application Form */}
                <motion.div className="opp-detail-apply" id="apply" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                    <h2 className="opp-detail-apply-title">Apply for this Opportunity</h2>

                    {isSubmitted ? (
                        <div className="opp-detail-success">
                            <div className="opp-detail-success-icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h3>Application Submitted</h3>
                            <p>Thank you for applying to {opportunity.title} by {opportunity.organization}. We&apos;ll review your application and get back to you soon.</p>
                            <Link href="/earn" className="btn-primary">
                                Browse More Opportunities
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Link>
                        </div>
                    ) : (
                        <form className="opp-detail-form" onSubmit={handleSubmit}>
                            <div className="opp-detail-form-grid">
                                <div className="opp-detail-form-group">
                                    <label className="opp-detail-label">Full Name <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        className="opp-detail-input"
                                        placeholder="Enter your full name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="opp-detail-form-group">
                                    <label className="opp-detail-label">Email Address <span className="required">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="opp-detail-input"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="opp-detail-form-group">
                                <label className="opp-detail-label">Submission Link <span className="required">*</span></label>
                                <input
                                    type="url"
                                    name="portfolio"
                                    className="opp-detail-input"
                                    placeholder="Link to your work — e.g. GitHub repo, X post, Figma file..."
                                    value={formData.portfolio}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="opp-detail-form-group">
                                <label className="opp-detail-label">Cover Letter <span className="required">*</span></label>
                                <textarea
                                    name="coverLetter"
                                    className="opp-detail-textarea"
                                    placeholder="Tell us why you're a great fit for this opportunity..."
                                    value={formData.coverLetter}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="opp-detail-form-actions">
                                <button type="submit" className="btn-primary">
                                    Submit Application
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>

                {/* Similar Opportunities */}
                {similarOpportunities.length > 0 && (
                    <motion.div className="opp-detail-similar" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="opp-detail-similar-title">Similar Opportunities</h2>
                        <div className="opp-detail-similar-grid">
                            {similarOpportunities.map((sOpp, idx) => (
                                <motion.div key={sOpp.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }}>
                                    <Link href={`/earn/${sOpp.id}`} className="opp-detail-similar-card">
                                        <div className="opp-detail-similar-card-top">
                                            <div className="opp-detail-similar-logo">
                                                <Image src={sOpp.orgLogo} alt={sOpp.organization} fill className="object-cover" />
                                            </div>
                                            <div className="opp-detail-similar-card-info">
                                                <span className="opp-detail-similar-org">{sOpp.organization}</span>
                                            </div>
                                            <span className={`opp-detail-badge type-${sOpp.type.toLowerCase()}`}>{sOpp.type}</span>
                                        </div>
                                        <span className="opp-detail-similar-title-text">{sOpp.title}</span>
                                        <div className="opp-detail-similar-bottom">
                                            <span className="opp-detail-similar-prize">{sOpp.prize}</span>
                                            <span className="opp-detail-similar-arrow">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Newsletter Section */}
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
