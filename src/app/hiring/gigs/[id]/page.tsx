'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import MessagesDrawer from '@/components/MessagesDrawer';
import { JOBS, type Job } from '../data';
import './gig-detail.css';

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

const getJobDescription = (job: Job) =>
    `Join ${job.company} as a ${job.title}. We are looking for a passionate ${job.level}-level professional to help build the future of decentralized applications on Sui Network. This is a ${job.type.toLowerCase()} position based in ${job.location}.\n\nYou will work alongside a team of talented engineers, designers, and product managers to ship products that push the boundaries of what's possible on-chain. Our team values open collaboration, continuous learning, and building with a user-first mindset.\n\nAs part of the Sui ecosystem, ${job.company} is at the forefront of blockchain innovation. We leverage the Move programming language and Sui's object-centric data model to create fast, secure, and scalable decentralized applications. Our mission is to make Web3 accessible to millions of users while maintaining the highest standards of security and performance.\n\nIn this role, you will have the opportunity to contribute to projects that directly impact the growth of the Sui ecosystem. Whether it's building core infrastructure, designing user-facing products, or optimizing protocol performance, your work will be used by thousands of developers and users across the globe.\n\nWe offer a flexible and remote-friendly work environment, competitive compensation, and the chance to work with some of the most talented minds in the blockchain space. If you're excited about decentralized technology and want to be part of a team that's shaping the future of finance, gaming, and digital ownership, we'd love to hear from you.`;

const responsibilities = [
    'Design, develop, and maintain high-quality code for our platform',
    'Collaborate with cross-functional teams to define and ship new features',
    'Participate in code reviews and contribute to engineering best practices',
    'Write technical documentation and contribute to knowledge sharing',
    'Mentor junior team members and contribute to team growth',
    'Stay current with emerging technologies in the Web3 and blockchain space',
];

const getRequirements = (job: Job) => [
    `${job.level === 'Senior' || job.level === 'Lead' ? '5+' : job.level === 'Mid' ? '3+' : '1+'} years of relevant professional experience`,
    `Proficiency in ${job.tags.slice(0, 3).join(', ')}`,
    'Strong problem-solving skills and attention to detail',
    'Excellent communication skills and ability to work in a remote team',
    'Experience with blockchain technologies or strong willingness to learn',
    'Portfolio or GitHub profile demonstrating relevant work',
];

const getSalaryDisplay = (salary: string) => {
    const amount = salary.replace(/\s*\/(mo|hr|project)\s*$/, '');
    const period = salary.includes('/hr') ? '/hour' : salary.includes('/mo') ? '/month' : salary.includes('/project') ? '/project' : '/month';
    return { amount, period };
};

export default function GigDetailPage() {
    const params = useParams();
    const jobId = params.id as string;
    const job = JOBS.find(j => j.id === jobId);

    const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);
    const [activeFreelancer, setActiveFreelancer] = useState<{ id: number; name: string; avatar: string } | null>(null);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        portfolio: '',
        coverLetter: '',
        salaryExpectation: '',
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleMessageEmployer = () => {
        if (!job) return;
        setActiveFreelancer({
            id: Number(job.id),
            name: job.company,
            avatar: job.logo,
        });
        setIsMessageDrawerOpen(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const scrollToApply = () => {
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth' });
    };

    if (!job) {
        return (
            <main className="gig-detail-page">
                <Header showGreenBorder />
                <div className="gig-detail-not-found">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5">
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    </svg>
                    <h2>Job Not Found</h2>
                    <p>This position may have been removed or the link is incorrect.</p>
                    <Link href="/hiring/gigs" className="btn-primary">
                        Browse All Jobs
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    const salary = getSalaryDisplay(job.salary);
    const similarJobs = JOBS.filter(j => j.id !== job.id && (j.type === job.type || j.tags.some(t => job.tags.includes(t)))).slice(0, 3);

    return (
        <>
            <main className="gig-detail-page">
                <Header showGreenBorder />

                <div className="gig-detail-container">
                    {/* Back Navigation */}
                    <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
                        <Link href="/hiring/gigs" className="gig-detail-back">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Back to Jobs
                        </Link>
                    </motion.div>

                    {/* Job Header */}
                    <motion.div className="gig-detail-header" initial="hidden" animate="visible">
                        <motion.div className="gig-detail-header-top" variants={fadeUp} custom={0}>
                            <div className="gig-detail-logo">
                                <Image src={job.logo} alt={job.company} fill className="object-cover" />
                            </div>
                            <div className="gig-detail-header-info">
                                <span className="gig-detail-company">{job.company}</span>
                                <span className="gig-detail-posted">Posted {job.postedAt}</span>
                            </div>
                        </motion.div>

                        <motion.h1 className="gig-detail-title" variants={fadeUp} custom={1}>{job.title}</motion.h1>

                        <motion.div className="gig-detail-meta" variants={fadeUp} custom={2}>
                            <span className={`gig-detail-badge type-${job.type.toLowerCase().replace('-', '')}`}>{job.type}</span>
                            <span className="gig-detail-badge level" style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
                                {job.level === 'Lead' ? 'Veteran' : (
                                    Array.from({ length: job.level === 'Senior' ? 4 : job.level === 'Mid' ? 3 : 2 }, (_, i) => (
                                        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                    ))
                                )}
                            </span>
                            <span className="gig-detail-meta-divider" />
                            <span className="gig-detail-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                Remote
                            </span>
                            <span className="gig-detail-meta-divider" />
                            <span className="gig-detail-meta-item">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                </svg>
                                {salary.amount} {salary.period}
                            </span>
                        </motion.div>

                        <motion.div className="gig-detail-actions" variants={fadeUp} custom={3}>
                            <button className="btn-primary" onClick={scrollToApply}>
                                Apply Now
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="gig-detail-message-icon-btn" onClick={handleMessageEmployer} title="Message Employer">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                </svg>
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Two Column Content */}
                    <div className="gig-detail-content">
                        {/* Main Content */}
                        <div className="gig-detail-main">
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                                <h2 className="gig-detail-section-title">Job Description</h2>
                                <p className="gig-detail-description">{getJobDescription(job)}</p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <h2 className="gig-detail-section-title">Responsibilities</h2>
                                <motion.ul className="gig-detail-list" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    {responsibilities.map((item, i) => (
                                        <motion.li key={i} variants={staggerItem}>{item}</motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }}>
                                <h2 className="gig-detail-section-title">Requirements</h2>
                                <motion.ul className="gig-detail-list" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                                    {getRequirements(job).map((item, i) => (
                                        <motion.li key={i} variants={staggerItem}>{item}</motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        </div>

                        {/* Sidebar */}
                        <div className="gig-detail-sidebar">
                            {/* Job Overview */}
                            <motion.div className="gig-detail-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 }}>
                                <span className="gig-detail-card-title">Job Overview</span>
                                <div>
                                    <span className="gig-detail-salary">{salary.amount}</span>
                                    <span className="gig-detail-salary-period"> {salary.period}</span>
                                </div>
                                <div>
                                    <div className="gig-detail-overview-row">
                                        <span className="gig-detail-overview-label">Job Type</span>
                                        <span className="gig-detail-overview-value">{job.type}</span>
                                    </div>
                                    <div className="gig-detail-overview-row">
                                        <span className="gig-detail-overview-label">Experience</span>
                                        <span className="gig-detail-overview-value" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                            {job.level === 'Lead' ? 'Veteran' : (
                                                Array.from({ length: job.level === 'Senior' ? 4 : job.level === 'Mid' ? 3 : 2 }, (_, i) => (
                                                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                                ))
                                            )}
                                        </span>
                                    </div>
                                    <div className="gig-detail-overview-row">
                                        <span className="gig-detail-overview-label">Location</span>
                                        <span className="gig-detail-overview-value">Remote</span>
                                    </div>
                                    <div className="gig-detail-overview-row">
                                        <span className="gig-detail-overview-label">Posted</span>
                                        <span className="gig-detail-overview-value">{job.postedAt}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className="gig-detail-card-title" style={{ marginBottom: '12px', display: 'block' }}>Skills &amp; Tags</span>
                                    <div className="gig-detail-tags">
                                        {job.tags.map(tag => (
                                            <span key={tag} className="gig-detail-tag">{tag}</span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Company Info */}
                            <motion.div className="gig-detail-company-card" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}>
                                <div className="gig-detail-company-card-logo">
                                    <Image src={job.logo} alt={job.company} fill className="object-cover" />
                                </div>
                                <span className="gig-detail-company-card-name">{job.company}</span>
                                <p className="gig-detail-company-desc">
                                    Building the next generation of decentralized applications on Sui Network. We are a team of passionate builders committed to pushing the boundaries of Web3 technology.
                                </p>
                                <div className="gig-detail-company-socials">
                                    <a href="#" className="gig-detail-social-link" title="X (Twitter)">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                    </a>
                                    <a href="#" className="gig-detail-social-link" title="Discord">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/></svg>
                                    </a>
                                    <a href="#" className="gig-detail-social-link" title="Website">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Application Form */}
                    <motion.div className="gig-detail-apply" id="apply" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                        <h2 className="gig-detail-apply-title">Apply for this Position</h2>

                        {isSubmitted ? (
                            <div className="gig-detail-success">
                                <div className="gig-detail-success-icon">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <h3>Application Submitted</h3>
                                <p>Thank you for applying to {job.title} at {job.company}. We&apos;ll review your application and get back to you soon.</p>
                                <Link href="/hiring/gigs" className="btn-primary">
                                    Browse More Jobs
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Link>
                            </div>
                        ) : (
                            <form className="gig-detail-form" onSubmit={handleSubmit}>
                                <div className="gig-detail-form-grid">
                                    <div className="gig-detail-form-group">
                                        <label className="gig-detail-label">Full Name <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            className="gig-detail-input"
                                            placeholder="Enter your full name"
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="gig-detail-form-group">
                                        <label className="gig-detail-label">Email Address <span className="required">*</span></label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="gig-detail-input"
                                            placeholder="you@example.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="gig-detail-form-group">
                                    <label className="gig-detail-label">Portfolio / Website</label>
                                    <input
                                        type="url"
                                        name="portfolio"
                                        className="gig-detail-input"
                                        placeholder="https://yourportfolio.com"
                                        value={formData.portfolio}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="gig-detail-form-group">
                                    <label className="gig-detail-label">Expected Compensation</label>
                                    <input
                                        type="text"
                                        name="salaryExpectation"
                                        className="gig-detail-input"
                                        placeholder="e.g. $2,000/month or $40/hour"
                                        value={formData.salaryExpectation}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="gig-detail-form-group">
                                    <label className="gig-detail-label">Resume / CV <span className="required">*</span></label>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                    />
                                    <div
                                        className={`gig-detail-file-upload${resumeFile ? ' has-file' : ''}`}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {resumeFile ? (
                                            <>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2">
                                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                    <polyline points="14 2 14 8 20 8" />
                                                    <path d="M9 15l2 2 4-4" />
                                                </svg>
                                                <span className="gig-detail-file-name">{resumeFile.name}</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                                <span className="gig-detail-file-upload-text"><strong>Click to upload</strong> or drag and drop</span>
                                                <span className="gig-detail-file-hint">PDF, DOC, or DOCX (max 10MB)</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="gig-detail-form-group">
                                    <label className="gig-detail-label">Cover Letter <span className="required">*</span></label>
                                    <textarea
                                        name="coverLetter"
                                        className="gig-detail-textarea"
                                        placeholder="Tell us why you're a great fit for this role..."
                                        value={formData.coverLetter}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="gig-detail-form-actions">
                                    <button type="submit" className="btn-primary">
                                        Submit Application
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <button type="button" className="gig-detail-message-icon-btn" onClick={handleMessageEmployer} title="Message Employer">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                                        </svg>
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>

                    {/* Similar Jobs */}
                    {similarJobs.length > 0 && (
                        <motion.div className="gig-detail-similar" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                            <h2 className="gig-detail-similar-title">Similar Positions</h2>
                            <div className="gig-detail-similar-grid">
                                {similarJobs.map((sJob, idx) => {
                                    const sSalary = getSalaryDisplay(sJob.salary);
                                    return (
                                        <motion.div key={sJob.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }}>
                                        <Link href={`/hiring/gigs/${sJob.id}`} className="gig-detail-similar-card">
                                            <div className="gig-detail-similar-card-top">
                                                <div className="gig-detail-similar-logo">
                                                    <Image src={sJob.logo} alt={sJob.company} fill className="object-cover" />
                                                </div>
                                                <div className="gig-detail-similar-card-info">
                                                    <span className="gig-detail-similar-company">{sJob.company}</span>
                                                    <span className="gig-detail-similar-location">
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                                            <circle cx="12" cy="10" r="3" />
                                                        </svg>
                                                        Remote
                                                    </span>
                                                </div>
                                                <span className={`gig-detail-badge type-${sJob.type.toLowerCase().replace('-', '')}`}>{sJob.type}</span>
                                            </div>
                                            <span className="gig-detail-similar-title-text">{sJob.title}</span>
                                            <div className="gig-detail-similar-bottom">
                                                <span className="gig-detail-similar-salary">{sSalary.amount} <span>{sSalary.period}</span></span>
                                                <span className="gig-detail-similar-arrow">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            </div>
                                        </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </div>

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

            <MessagesDrawer
                isOpen={isMessageDrawerOpen}
                onClose={() => setIsMessageDrawerOpen(false)}
                activeFreelancer={activeFreelancer}
            />
        </>
    );
}
