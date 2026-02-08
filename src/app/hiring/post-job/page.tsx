'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import './post-job.css';

const JOB_TYPES = ['Full-time', 'Internship', 'Contract', 'Gig'];
const JOB_LEVELS = [
    { value: 'Entry', label: '2 Star', stars: 2 },
    { value: 'Mid', label: '3 Star', stars: 3 },
    { value: 'Senior', label: '4 Star', stars: 4 },
    { value: 'Lead', label: 'Veteran', stars: 0 },
];
const SALARY_PERIODS = ['Per Month', 'Per Hour', 'Per Project'];
const CATEGORIES = [
    { name: 'Software Development', desc: 'Frontend, backend, fullstack, and mobile development' },
    { name: 'Product Design', desc: 'UI/UX design, prototyping, and design systems' },
    { name: 'Smart Contract Auditor', desc: 'Security review and auditing of on-chain code' },
    { name: 'Sui-Move Dev', desc: 'Building on Sui using the Move programming language' },
    { name: 'DeFi Developer', desc: 'DEX, lending protocols, yield farming, and liquidity pools' },
    { name: 'DAO Specialist', desc: 'Governance frameworks, treasury management, and DAO tooling' },
    { name: 'GameFi/Web3 Gaming', desc: 'On-chain gaming, play-to-earn, and in-game economies' },
    { name: 'Wallet/Infra Engineer', desc: 'Wallet development, RPC nodes, and blockchain infrastructure' },
    { name: 'DevRel/Developer Advocate', desc: 'SDK documentation, tutorials, and developer onboarding' },
    { name: 'Blockchain Researcher', desc: 'Protocol research, whitepapers, and on-chain analysis' },
    { name: 'Growth/BD Manager', desc: 'Partnerships, ecosystem growth, and business development' },
    { name: 'Product Manager', desc: 'Strategy, roadmapping, and product lifecycle' },
    { name: 'Community Manager', desc: 'Growing and managing Web3 communities' },
    { name: 'Social Media Manager', desc: 'Content planning, engagement, and brand voice' },
    { name: 'Graphics Design', desc: 'Visual assets, branding, and illustration' },
    { name: 'Video Editing', desc: 'Post-production, motion graphics, and effects' },
    { name: 'Animation', desc: '2D/3D animation, character design, and explainers' },
    { name: 'Ghost Writing', desc: 'Articles, whitepapers, and thought leadership content' },
    { name: 'NFT Specialist', desc: 'NFT creation, marketplace strategy, and metadata' },
    { name: 'Quant/Tokenomics Expert', desc: 'Token design, financial modeling, and DeFi mechanics' },
    { name: 'Cyber Security', desc: 'Threat analysis, penetration testing, and incident response' },
    { name: 'AI/ML', desc: 'Machine learning, NLP, and AI-powered solutions' },
];
const SKILL_OPTIONS = [
    // Software Development
    'Rust', 'Move', 'Solidity', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Python',
    'GraphQL', 'Go', 'Java', 'C++', 'Docker', 'AWS', 'Git', 'REST API',
    'Vue.js', 'Angular', 'Svelte', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase',
    'Supabase', 'Prisma', 'tRPC', 'Websockets', 'Microservices', 'System Design',
    // Web3 & Blockchain
    'Web3', 'DeFi', 'Smart Contracts', 'Blockchain', 'Sui', 'NFT', 'dApp', 'Tokenomics',
    'Sui SDK', 'Object Model', 'IPFS', 'Minting', 'Liquidity', 'Staking',
    'Token Standards', 'DEX', 'DAO', 'Wallet Integration', 'On-chain Analytics', 'Bridge Development',
    'ZK Proofs', 'Layer 2', 'Cross-chain', 'MEV', 'Oracle Integration',
    // Product Design
    'UI/UX', 'Figma', 'Adobe XD', 'Sketch', 'Prototyping', 'Wireframing', 'Design Systems', 'User Research',
    'Responsive Design', 'Interaction Design', 'Accessibility',
    // Content Creation
    'Content Creation', 'Video Production', 'Podcast Production', 'Streaming', 'YouTube',
    'TikTok', 'Reels', 'Thumbnail Design', 'Scriptwriting', 'Storyboarding',
    // Security & Auditing
    'Security', 'Auditing', 'Penetration Testing', 'OWASP', 'Encryption', 'Incident Response',
    // Product & Management
    'Agile', 'Scrum', 'Jira', 'Roadmapping', 'Analytics', 'KPIs', 'Product Strategy',
    // Community & Social
    'Discord', 'Telegram', 'Twitter/X', 'Community Building', 'Moderation', 'Events',
    'Content Strategy', 'Copywriting', 'SEO', 'Branding', 'Social Media',
    // Graphics & Video
    'Photoshop', 'Illustrator', 'Canva', 'Brand Identity', 'Typography',
    'Premiere Pro', 'After Effects', 'DaVinci Resolve', 'Final Cut Pro', 'Motion Graphics',
    // Animation
    '2D Animation', '3D Animation', 'Blender', 'Maya', 'Lottie',
    // Writing
    'Technical Writing', 'Blog Writing', 'Whitepaper', 'Documentation', 'Ghost Writing',
    // AI/ML
    'Machine Learning', 'Deep Learning', 'NLP', 'TensorFlow', 'PyTorch', 'Data Science', 'Computer Vision',
    'LLM', 'Prompt Engineering', 'AI Agents', 'RAG',
    // DevOps & Infra
    'DevOps', 'CI/CD', 'Kubernetes', 'Linux', 'Terraform', 'Vercel', 'Netlify',
    // Mobile & Frontend
    'React Native', 'Flutter', 'Swift', 'Kotlin', 'PWA', 'Electron',
    // Testing & QA
    'Unit Testing', 'E2E Testing', 'QA', 'Jest', 'Cypress',
];
const INITIAL_SKILLS_COUNT = 15;

export default function PostJobPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const [formData, setFormData] = useState({
        companyName: '',
        contactEmail: '',
        companyWebsite: '',
        companyDescription: '',
        jobTitle: '',
        jobDescription: '',
        category: '',
        salaryMin: '',
        salaryMax: '',
        salaryPeriod: '',
        description: '',
        responsibilities: '',
        requirements: '',
    });

    const [selectedType, setSelectedType] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [categoryOpen, setCategoryOpen] = useState(false);
    const [categorySearch, setCategorySearch] = useState('');
    const [periodOpen, setPeriodOpen] = useState(false);
    const [skillsExpanded, setSkillsExpanded] = useState(false);
    const [skillSearch, setSkillSearch] = useState('');
    const [responsibilities, setResponsibilities] = useState<string[]>([]);
    const [respInput, setRespInput] = useState('');
    const [requirements, setRequirements] = useState<string[]>([]);
    const [reqInput, setReqInput] = useState('');

    const addListItem = (list: string[], setList: (v: string[]) => void, input: string, setInput: (v: string) => void) => {
        const trimmed = input.trim();
        if (trimmed) {
            setList([...list, trimmed]);
            setInput('');
        }
    };

    const removeListItem = (list: string[], setList: (v: string[]) => void, index: number) => {
        setList(list.filter((_, i) => i !== index));
    };
    const logoInputRef = useRef<HTMLInputElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const periodRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
                setCategoryOpen(false);
            }
            if (periodRef.current && !periodRef.current.contains(e.target as Node)) {
                setPeriodOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setLogoPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else if (selectedTags.length < 6) {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const isStepValid = (step: number) => {
        switch (step) {
            case 1:
                return formData.companyName && formData.contactEmail;
            case 2:
                return formData.jobTitle && formData.category && selectedType && selectedLevel && formData.salaryMin && formData.salaryPeriod;
            case 3:
                return responsibilities.length > 0 || requirements.length > 0;
            default:
                return true;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isSubmitted) {
        return (
            <main className="post-job-page">
                <Header showGreenBorder />
                <div className="register-pattern-wrapper">
                    <div className="register-pattern-bg"></div>
                    <section className="register-hero">
                        <motion.div className="register-hero-content" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <div className="post-job-success-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h1 className="register-hero-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>JOB POSTED</h1>
                            <p className="register-hero-subtitle">
                                Your listing for &ldquo;{formData.jobTitle || 'Untitled Position'}&rdquo; at {formData.companyName || 'your company'} has been submitted. It will be reviewed and published shortly.
                            </p>
                            <div className="post-job-success-actions">
                                <Link href="/hiring/gigs" className="btn-primary">
                                    <span>Browse Jobs</span>
                                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <button className="btn-back" onClick={() => { setIsSubmitted(false); setCurrentStep(1); setFormData({ companyName: '', contactEmail: '', companyWebsite: '', companyDescription: '', jobTitle: '', jobDescription: '', category: '', salaryMin: '', salaryMax: '', salaryPeriod: '', description: '', responsibilities: '', requirements: '' }); setSelectedType(''); setSelectedLevel(''); setSelectedTags([]); setResponsibilities([]); setRequirements([]); setLogoPreview(null); }}>
                                    <span>Post Another</span>
                                </button>
                            </div>
                        </motion.div>
                    </section>
                </div>
                <PageProgress />
                <Footer />
            </main>
        );
    }

    return (
        <main className="post-job-page">
            <Header showGreenBorder />

            <div className="register-pattern-wrapper">
                <div className="register-pattern-bg"></div>

                {/* Hero */}
                <section className="register-hero">
                    <div className="register-hero-content">
                        <Link href="/hiring/gigs" className="register-back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Back to Jobs</span>
                        </Link>
                        <h1 className="register-hero-title">POST A JOB</h1>
                        <p className="register-hero-subtitle">
                            Reach thousands of talented Web3 professionals in the Sui ecosystem. Fill out the details below to list your position.
                        </p>
                    </div>
                </section>

                {/* Progress Steps */}
                <div className="register-progress">
                    <div className="progress-steps">
                        {[1, 2, 3].map((step) => (
                            <div
                                key={step}
                                className={`progress-step ${currentStep >= step ? 'step-active' : ''} ${currentStep > step ? 'step-completed' : ''}`}
                            >
                                <div className="step-number">
                                    {currentStep > step ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 8l3 3 7-7" />
                                        </svg>
                                    ) : (
                                        step
                                    )}
                                </div>
                                <span className="step-label">
                                    {step === 1 && 'Company Info'}
                                    {step === 2 && 'Job Details'}
                                    {step === 3 && 'Requirements'}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
                    </div>
                </div>

                {/* Form */}
                <section className="register-form-section">
                    <form className="register-form" onSubmit={handleSubmit}>
                        {/* Step 1: Company Information */}
                        {currentStep === 1 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="form-step-title">Company Information</h2>
                                <p className="form-step-desc">Tell us about your company so applicants know who&apos;s hiring.</p>

                                {/* Logo Upload */}
                                <div className="avatar-upload">
                                    <div
                                        className="avatar-preview"
                                        onClick={() => logoInputRef.current?.click()}
                                    >
                                        {logoPreview ? (
                                            <Image src={logoPreview} alt="Logo" fill className="avatar-img" />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                                <span>Upload Logo</span>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        ref={logoInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="avatar-input"
                                    />
                                    <p className="avatar-hint">PNG, JPG, or SVG (max 2MB)</p>
                                </div>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label className="form-label">Company Name *</label>
                                        <input
                                            type="text"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Mysten Labs"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Contact Email *</label>
                                        <input
                                            type="email"
                                            name="contactEmail"
                                            value={formData.contactEmail}
                                            onChange={handleInputChange}
                                            placeholder="hiring@company.com"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Company Website</label>
                                    <input
                                        type="url"
                                        name="companyWebsite"
                                        value={formData.companyWebsite}
                                        onChange={handleInputChange}
                                        placeholder="https://company.com"
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-field">
                                    <label className="form-label">Company Description</label>
                                    <textarea
                                        name="companyDescription"
                                        value={formData.companyDescription}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of your company and what you do..."
                                        className="form-textarea"
                                        rows={4}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Job Details */}
                        {currentStep === 2 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="form-step-title">Job Details</h2>
                                <p className="form-step-desc">Define the role, type, and compensation for this position.</p>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Job Title *</label>
                                    <div className="post-job-dropdown" ref={categoryRef}>
                                        <button
                                            type="button"
                                            className={`post-job-dropdown-trigger${categoryOpen ? ' open' : ''}`}
                                            onClick={() => { setCategoryOpen(!categoryOpen); setCategorySearch(''); }}
                                        >
                                            <span className={formData.jobTitle ? '' : 'placeholder'}>{formData.jobTitle || 'Select job title'}</span>
                                            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                <path d="M1 1.5L6 6.5L11 1.5" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        {categoryOpen && (
                                            <div className="post-job-dropdown-menu">
                                                <div className="post-job-dropdown-search">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                                        <circle cx="11" cy="11" r="8" />
                                                        <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                                    </svg>
                                                    <input
                                                        type="text"
                                                        placeholder="Search job titles..."
                                                        value={categorySearch}
                                                        onChange={(e) => setCategorySearch(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="post-job-dropdown-options" data-lenis-prevent style={{ maxHeight: '240px', overflowY: 'scroll' }}>
                                                    {CATEGORIES.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase())).map(c => (
                                                        <button
                                                            key={c.name}
                                                            type="button"
                                                            className={`post-job-dropdown-option has-desc${formData.jobTitle === c.name ? ' selected' : ''}`}
                                                            onClick={() => { setFormData(prev => ({ ...prev, jobTitle: c.name, category: c.name })); setCategoryOpen(false); }}
                                                        >
                                                            <div className="post-job-dropdown-option-content">
                                                                <span className="post-job-dropdown-option-name">{c.name}</span>
                                                                <span className="post-job-dropdown-option-desc">{c.desc}</span>
                                                            </div>
                                                            {formData.jobTitle === c.name && (
                                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2" style={{ flexShrink: 0 }}>
                                                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    ))}
                                                    {CATEGORIES.filter(c => c.name.toLowerCase().includes(categorySearch.toLowerCase())).length === 0 && (
                                                        <span className="post-job-dropdown-empty">No results found</span>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        name="jobDescription"
                                        value={formData.jobDescription}
                                        onChange={handleInputChange}
                                        placeholder="Describe exactly what you're looking for — responsibilities, expectations, and what success looks like in this role..."
                                        className="form-textarea"
                                        rows={5}
                                    />
                                </div>

                                {/* Job Type */}
                                <div className="form-section">
                                    <label className="form-label">Job Type *</label>
                                    <div className="employment-grid">
                                        {JOB_TYPES.map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                className={`employment-option ${selectedType === type ? 'option-selected' : ''}`}
                                                onClick={() => setSelectedType(type)}
                                            >
                                                <span className="option-checkbox">
                                                    {selectedType === type && (
                                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 8l3 3 7-7" />
                                                        </svg>
                                                    )}
                                                </span>
                                                <span>{type}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div className="form-section">
                                    <label className="form-label">Experience Level *</label>
                                    <div className="employment-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        {JOB_LEVELS.map((level) => (
                                            <button
                                                key={level.value}
                                                type="button"
                                                className={`employment-option ${selectedLevel === level.value ? 'option-selected' : ''}`}
                                                onClick={() => setSelectedLevel(level.value)}
                                            >
                                                <span className="option-checkbox">
                                                    {selectedLevel === level.value && (
                                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 8l3 3 7-7" />
                                                        </svg>
                                                    )}
                                                </span>
                                                {level.stars > 0 && (
                                                    <span style={{ display: 'flex', gap: '2px' }}>
                                                        {Array.from({ length: level.stars }, (_, i) => (
                                                            <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                                        ))}
                                                    </span>
                                                )}
                                                <span>{level.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Compensation */}
                                <div className="form-section">
                                    <label className="form-label">Compensation (USDC) *</label>
                                    <div className="post-job-salary-row">
                                        <div className="form-field">
                                            <input
                                                type="text"
                                                name="salaryMin"
                                                value={formData.salaryMin}
                                                onChange={handleInputChange}
                                                placeholder="Min (e.g. 1000)"
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                        <div className="form-field">
                                            <input
                                                type="text"
                                                name="salaryMax"
                                                value={formData.salaryMax}
                                                onChange={handleInputChange}
                                                placeholder="Max (e.g. 3000)"
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="form-field">
                                            <div className="post-job-dropdown" ref={periodRef}>
                                                <button
                                                    type="button"
                                                    className={`post-job-dropdown-trigger${periodOpen ? ' open' : ''}`}
                                                    onClick={() => setPeriodOpen(!periodOpen)}
                                                >
                                                    <span className={formData.salaryPeriod ? '' : 'placeholder'}>{formData.salaryPeriod || 'Period'}</span>
                                                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                                                        <path d="M1 1.5L6 6.5L11 1.5" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                                {periodOpen && (
                                                    <div className="post-job-dropdown-menu">
                                                        <div className="post-job-dropdown-options" style={{ padding: '6px' }}>
                                                            {SALARY_PERIODS.map(p => (
                                                                <button
                                                                    key={p}
                                                                    type="button"
                                                                    className={`post-job-dropdown-option${formData.salaryPeriod === p ? ' selected' : ''}`}
                                                                    onClick={() => { setFormData(prev => ({ ...prev, salaryPeriod: p })); setPeriodOpen(false); }}
                                                                >
                                                                    {p}
                                                                    {formData.salaryPeriod === p && (
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2">
                                                                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="form-section">
                                    <label className="form-label">Skills &amp; Tags (Select up to 6)</label>
                                    <p className="form-hint">Selected: {selectedTags.length}/6</p>

                                    {/* Selected tags */}
                                    {selectedTags.length > 0 && (
                                        <div className="skills-grid" style={{ marginBottom: '12px' }}>
                                            {selectedTags.map((tag) => (
                                                <button
                                                    key={tag}
                                                    type="button"
                                                    className="skill-option skill-selected"
                                                    onClick={() => toggleTag(tag)}
                                                >
                                                    {tag}
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {!skillsExpanded ? (
                                        <>
                                            <div className="skills-grid">
                                                {SKILL_OPTIONS.slice(0, INITIAL_SKILLS_COUNT)
                                                    .filter(tag => !selectedTags.includes(tag))
                                                    .map((tag) => (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            className="skill-option"
                                                            onClick={() => toggleTag(tag)}
                                                            disabled={selectedTags.length >= 6}
                                                        >
                                                            {tag}
                                                        </button>
                                                    ))}
                                            </div>
                                            <button
                                                type="button"
                                                className="post-job-see-more"
                                                onClick={() => setSkillsExpanded(true)}
                                            >
                                                <span>See More Skills</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="post-job-skill-search">
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                                                </svg>
                                                <input
                                                    type="text"
                                                    placeholder="Search skills..."
                                                    value={skillSearch}
                                                    onChange={(e) => setSkillSearch(e.target.value)}
                                                    autoFocus
                                                />
                                                <button
                                                    type="button"
                                                    className="post-job-skill-search-close"
                                                    onClick={() => { setSkillsExpanded(false); setSkillSearch(''); }}
                                                >
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="post-job-skills-expanded" data-lenis-prevent>
                                                <div className="skills-grid">
                                                    {SKILL_OPTIONS
                                                        .filter(tag => !selectedTags.includes(tag))
                                                        .filter(tag => tag.toLowerCase().includes(skillSearch.toLowerCase()))
                                                        .map((tag) => (
                                                            <button
                                                                key={tag}
                                                                type="button"
                                                                className="skill-option"
                                                                onClick={() => toggleTag(tag)}
                                                                disabled={selectedTags.length >= 6}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    {SKILL_OPTIONS
                                                        .filter(tag => !selectedTags.includes(tag))
                                                        .filter(tag => tag.toLowerCase().includes(skillSearch.toLowerCase()))
                                                        .length === 0 && (
                                                        <span className="post-job-dropdown-empty">No skills found</span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                className="post-job-see-more"
                                                onClick={() => { setSkillsExpanded(false); setSkillSearch(''); }}
                                            >
                                                <span>See Less</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Description */}
                        {currentStep === 3 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="form-step-title">Requirements &amp; Responsibilities</h2>
                                <p className="form-step-desc">Define what the role demands and what the candidate will be doing.</p>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Responsibilities</label>
                                    {responsibilities.length > 0 && (
                                        <ul className="post-job-list">
                                            {responsibilities.map((item, i) => (
                                                <li key={i} className="post-job-list-item">
                                                    <span>{item}</span>
                                                    <button type="button" className="post-job-list-remove" onClick={() => removeListItem(responsibilities, setResponsibilities, i)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="post-job-list-add">
                                        <input
                                            type="text"
                                            value={respInput}
                                            onChange={(e) => setRespInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addListItem(responsibilities, setResponsibilities, respInput, setRespInput); } }}
                                            placeholder="Add a responsibility..."
                                            className="form-input"
                                        />
                                        <button
                                            type="button"
                                            className="post-job-list-add-btn"
                                            onClick={() => addListItem(responsibilities, setResponsibilities, respInput, setRespInput)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Requirements</label>
                                    {requirements.length > 0 && (
                                        <ul className="post-job-list">
                                            {requirements.map((item, i) => (
                                                <li key={i} className="post-job-list-item">
                                                    <span>{item}</span>
                                                    <button type="button" className="post-job-list-remove" onClick={() => removeListItem(requirements, setRequirements, i)}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                                        </svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    <div className="post-job-list-add">
                                        <input
                                            type="text"
                                            value={reqInput}
                                            onChange={(e) => setReqInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addListItem(requirements, setRequirements, reqInput, setReqInput); } }}
                                            placeholder="Add a requirement..."
                                            className="form-input"
                                        />
                                        <button
                                            type="button"
                                            className="post-job-list-add-btn"
                                            onClick={() => addListItem(requirements, setRequirements, reqInput, setReqInput)}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Preview Summary */}
                                <div className="post-job-preview-summary">
                                    <label className="form-label">Listing Preview</label>
                                    <div className="post-job-preview-card">
                                        <span className="post-job-preview-company">{formData.companyName || 'Company Name'}</span>
                                        <span className="post-job-preview-title">{formData.jobTitle || 'Job Title'}</span>
                                        <div className="post-job-preview-meta">
                                            {selectedType && <span className="post-job-preview-badge type">{selectedType}</span>}
                                            {selectedLevel && <span className="post-job-preview-badge level">{selectedLevel}</span>}
                                            <span className="post-job-preview-badge location">Remote</span>
                                        </div>
                                        {formData.salaryMin && (
                                            <span className="post-job-preview-salary">
                                                ${formData.salaryMin}{formData.salaryMax ? ` - $${formData.salaryMax}` : '+'}
                                                <span> {formData.salaryPeriod === 'Per Month' ? '/month' : formData.salaryPeriod === 'Per Hour' ? '/hour' : formData.salaryPeriod === 'Per Project' ? '/project' : ''}</span>
                                            </span>
                                        )}
                                        {selectedTags.length > 0 && (
                                            <div className="post-job-preview-tags">
                                                {selectedTags.map(tag => (
                                                    <span key={tag} className="skill-option skill-selected" style={{ padding: '5px 12px', fontSize: '11px', cursor: 'default' }}>{tag}</span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <p className="form-disclaimer">
                                    By posting, you agree that this is a legitimate position and all information provided is accurate. Listings are reviewed before being published.
                                </p>
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className="form-navigation">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    className="btn-back"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    <span>Back</span>
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    className="btn-primary btn-next"
                                    onClick={() => setCurrentStep(currentStep + 1)}
                                    disabled={!isStepValid(currentStep)}
                                >
                                    <span>Continue</span>
                                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="btn-primary btn-submit-register"
                                    disabled={!isStepValid(currentStep) || isSubmitting}
                                >
                                    <span>{isSubmitting ? 'Publishing...' : 'Publish Job Listing'}</span>
                                    {!isSubmitting && (
                                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            )}
                        </div>
                    </form>
                </section>
            </div>

            <PageProgress />
            <Footer />
        </main>
    );
}
