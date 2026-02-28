'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import type { OpportunityType, SkillCategory } from '../data';
import './submit.css';

const STEP_LABELS = ['Basic Details', 'Description', 'Review'];
const TYPES: OpportunityType[] = ['Bounty', 'Hackathon', 'Grant'];
const CATEGORIES: SkillCategory[] = ['Content', 'Design', 'Development', 'Marketing', 'Community', 'Research', 'Security', 'Data'];

const SKILLS = [
    'Rust', 'Move', 'Smart Contracts', 'React', 'TypeScript', 'Web3',
    'Figma', 'UI/UX', 'Design System', 'Content Writing', 'Documentation',
    'Technical Writing', 'Marketing', 'Growth', 'Analytics', 'Community',
    'Social Media', 'Events', 'Security', 'Auditing', 'Python',
    'Data Analysis', 'Research', 'Solidity', 'EVM', 'Cross-Chain',
    'Node.js', 'GraphQL', 'API', 'DeFi', 'Tokenomics', 'NFT',
    'DevOps', 'Infrastructure', 'AI/ML', 'Testing', 'QA',
];

export default function SubmitOpportunityPage() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Step 1
    const [title, setTitle] = useState('');
    const [organization, setOrganization] = useState('');
    const [type, setType] = useState<OpportunityType | ''>('');
    const [prize, setPrize] = useState('');
    const [deadline, setDeadline] = useState('');
    const [veteran, setVeteran] = useState(false);

    // Step 2
    const [description, setDescription] = useState('');
    const [deliverables, setDeliverables] = useState<string[]>([]);
    const [delInput, setDelInput] = useState('');
    const [requirements, setRequirements] = useState<string[]>([]);
    const [reqInput, setReqInput] = useState('');
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<SkillCategory[]>([]);

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

    const isStepValid = (s: number) => {
        if (s === 1) return !!(title && organization && type && prize && deadline);
        if (s === 2) return !!(description && selectedSkills.length > 0 && selectedCategories.length > 0);
        return true;
    };

    const toggleSkill = (skill: string) => {
        setSelectedSkills(prev =>
            prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
        );
    };

    const toggleCategory = (cat: SkillCategory) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setStep(1);
        setIsSubmitted(false);
        setIsSubmitting(false);
        setTitle('');
        setOrganization('');
        setType('');
        setPrize('');
        setDeadline('');
        setVeteran(false);
        setDescription('');
        setDeliverables([]);
        setDelInput('');
        setRequirements([]);
        setReqInput('');
        setSelectedSkills([]);
        setSelectedCategories([]);
    };

    const formatDate = (d: string) => {
        if (!d) return '';
        const date = new Date(d + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    // Success screen
    if (isSubmitted) {
        return (
            <main className="submit-opp-page">
                <Header showGreenBorder />
                <div className="register-pattern-wrapper">
                    <div className="register-pattern-bg"></div>
                    <section className="register-hero">
                        <motion.div className="register-hero-content" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                            <div className="so-success-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h1 className="register-hero-title" style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>SUBMITTED</h1>
                            <p className="register-hero-subtitle">
                                Your opportunity &ldquo;{title || 'Untitled'}&rdquo; by {organization || 'your organization'} has been submitted for review. It will appear on the Earn page once approved.
                            </p>
                            <div className="so-success-actions">
                                <Link href="/earn" className="btn-primary">
                                    <span>Browse Opportunities</span>
                                    <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                                <button className="btn-back" onClick={resetForm}>
                                    <span>Submit Another</span>
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
        <main className="submit-opp-page">
            <Header showGreenBorder />

            <div className="register-pattern-wrapper">
                <div className="register-pattern-bg"></div>

                {/* Hero */}
                <section className="register-hero">
                    <div className="register-hero-content">
                        <Link href="/earn" className="register-back-link">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                            </svg>
                            <span>Back to Earn</span>
                        </Link>
                        <h1 className="register-hero-title">SUBMIT OPPORTUNITY</h1>
                        <p className="register-hero-subtitle">
                            List your bounty, hackathon, grant, or project and reach hundreds of talented builders in the Sui ecosystem.
                        </p>
                    </div>
                </section>

                {/* Progress Steps */}
                <div className="register-progress">
                    <div className="progress-steps">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`progress-step ${step >= s ? 'step-active' : ''} ${step > s ? 'step-completed' : ''}`}
                            >
                                <div className="step-number">
                                    {step > s ? (
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 8l3 3 7-7" />
                                        </svg>
                                    ) : (
                                        s
                                    )}
                                </div>
                                <span className="step-label">{STEP_LABELS[s - 1]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
                    </div>
                </div>

                {/* Form */}
                <section className="register-form-section">
                    <form className="register-form" onSubmit={handleSubmit}>

                        {/* Step 1: Basic Details */}
                        {step === 1 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="form-step-title">Basic Details</h2>
                                <p className="form-step-desc">Tell us about the opportunity you want to post.</p>

                                <div className="form-row">
                                    <div className="form-field">
                                        <label className="form-label">Opportunity Title *</label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={e => setTitle(e.target.value)}
                                            placeholder="e.g. Build a DeFi Dashboard on Sui"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Organization *</label>
                                        <input
                                            type="text"
                                            value={organization}
                                            onChange={e => setOrganization(e.target.value)}
                                            placeholder="e.g. Sui Foundation"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Type */}
                                <div className="form-section">
                                    <label className="form-label">Type *</label>
                                    <div className="employment-grid">
                                        {TYPES.map(t => (
                                            <button
                                                key={t}
                                                type="button"
                                                className={`employment-option ${type === t ? 'option-selected' : ''}`}
                                                onClick={() => setType(t)}
                                            >
                                                <span className="option-checkbox">
                                                    {type === t && (
                                                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <path d="M3 8l3 3 7-7" />
                                                        </svg>
                                                    )}
                                                </span>
                                                <span>{t}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>


                                {/* Veteran */}
                                <div className="form-section">
                                    <label className="form-label">Veteran Only</label>
                                    <p className="form-hint">Restrict this opportunity to users who have won at least 5 bounties.</p>
                                    <div className="employment-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                        <button
                                            type="button"
                                            className={`employment-option ${veteran ? 'option-selected' : ''}`}
                                            onClick={() => setVeteran(!veteran)}
                                        >
                                            <span className="option-checkbox">
                                                {veteran && (
                                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M3 8l3 3 7-7" />
                                                    </svg>
                                                )}
                                            </span>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                            <span>Veteran</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Prize & Deadline */}
                                <div className="form-row">
                                    <div className="form-field">
                                        <label className="form-label">Prize Amount *</label>
                                        <div className="so-prize-wrap">
                                            <span className="so-prize-prefix">$</span>
                                            <input
                                                type="text"
                                                value={prize}
                                                onChange={e => setPrize(e.target.value)}
                                                placeholder="5,000"
                                                className="form-input"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Deadline *</label>
                                        <input
                                            type="date"
                                            value={deadline}
                                            onChange={e => setDeadline(e.target.value)}
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Description & Skills */}
                        {step === 2 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="form-step-title">Description & Skills</h2>
                                <p className="form-step-desc">Describe the opportunity and select the skills required.</p>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">Description *</label>
                                    <textarea
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        placeholder="Describe the opportunity and any other relevant details..."
                                        className="form-textarea"
                                        rows={6}
                                    />
                                </div>

                                <div className="form-field" style={{ marginBottom: '24px' }}>
                                    <label className="form-label">What You&apos;ll Work On (Deliverables)</label>
                                    {deliverables.length > 0 && (
                                        <ul className="post-job-list">
                                            {deliverables.map((item, i) => (
                                                <li key={i} className="post-job-list-item">
                                                    <span>{item}</span>
                                                    <button type="button" className="post-job-list-remove" onClick={() => removeListItem(deliverables, setDeliverables, i)}>
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
                                            value={delInput}
                                            onChange={(e) => setDelInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addListItem(deliverables, setDeliverables, delInput, setDelInput); } }}
                                            placeholder="Add a deliverable..."
                                            className="form-input"
                                        />
                                        <button
                                            type="button"
                                            className="post-job-list-add-btn"
                                            onClick={() => addListItem(deliverables, setDeliverables, delInput, setDelInput)}
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

                                {/* Skills */}
                                <div className="form-section">
                                    <label className="form-label">Skills Required *</label>
                                    <p className="form-hint">Selected: {selectedSkills.length}</p>

                                    {selectedSkills.length > 0 && (
                                        <div className="skills-grid" style={{ marginBottom: '12px' }}>
                                            {selectedSkills.map(skill => (
                                                <button
                                                    key={skill}
                                                    type="button"
                                                    className="skill-option skill-selected"
                                                    onClick={() => toggleSkill(skill)}
                                                >
                                                    {skill}
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <div className="skills-grid">
                                        {SKILLS.filter(s => !selectedSkills.includes(s)).map(skill => (
                                            <button
                                                key={skill}
                                                type="button"
                                                className="skill-option"
                                                onClick={() => toggleSkill(skill)}
                                            >
                                                {skill}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Categories */}
                                <div className="form-section">
                                    <label className="form-label">Categories *</label>
                                    <p className="form-hint">Selected: {selectedCategories.length}</p>
                                    <div className="skills-grid">
                                        {CATEGORIES.map(cat => (
                                            <button
                                                key={cat}
                                                type="button"
                                                className={`skill-option ${selectedCategories.includes(cat) ? 'skill-selected' : ''}`}
                                                onClick={() => toggleCategory(cat)}
                                            >
                                                {cat}
                                                {selectedCategories.includes(cat) && (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Review & Submit */}
                        {step === 3 && (
                            <motion.div
                                className="form-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="form-step-title">Review & Submit</h2>
                                <p className="form-step-desc">Preview your opportunity before publishing.</p>

                                {/* Preview Card */}
                                <div className="so-review-card">
                                    <div className="so-review-header">
                                        <div>
                                            <div className="so-review-title">{title || 'Opportunity Title'}</div>
                                            <div className="so-review-org">{organization || 'Organization'}</div>
                                        </div>
                                        <span className={`so-review-type ${(type || '').toLowerCase()}`}>
                                            {type || 'Type'}
                                        </span>
                                    </div>

                                    <div className="so-review-meta">
                                        {veteran && (
                                            <span className="so-review-badge veteran">
                                                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFB836"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                                Veteran
                                            </span>
                                        )}
                                        {deadline && <span className="so-review-badge deadline">{formatDate(deadline)}</span>}
                                    </div>

                                    {prize && (
                                        <div className="so-review-prize">
                                            ${prize} <span>Prize</span>
                                        </div>
                                    )}

                                    <div className="so-review-divider" />

                                    <div className="so-review-section-label">Description</div>
                                    <p className="so-review-description">{description}</p>

                                    {deliverables.length > 0 && (
                                        <>
                                            <div className="so-review-divider" />
                                            <div className="so-review-section-label">What You&apos;ll Work On</div>
                                            <ul className="so-review-list">
                                                {deliverables.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    {requirements.length > 0 && (
                                        <>
                                            <div className="so-review-divider" />
                                            <div className="so-review-section-label">Requirements</div>
                                            <ul className="so-review-list">
                                                {requirements.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        </>
                                    )}

                                    <div className="so-review-divider" />

                                    {selectedSkills.length > 0 && (
                                        <>
                                            <div className="so-review-section-label">Skills</div>
                                            <div className="so-review-tags">
                                                {selectedSkills.map(skill => (
                                                    <span key={skill} className="skill-option skill-selected" style={{ cursor: 'default' }}>{skill}</span>
                                                ))}
                                            </div>
                                            <div className="so-review-divider" />
                                        </>
                                    )}

                                    {selectedCategories.length > 0 && (
                                        <>
                                            <div className="so-review-section-label">Categories</div>
                                            <div className="so-review-tags">
                                                {selectedCategories.map(cat => (
                                                    <span key={cat} className="skill-option skill-selected" style={{ cursor: 'default' }}>{cat}</span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Edit shortcuts */}
                                <div className="so-review-edit-row">
                                    <button type="button" className="so-review-edit" onClick={() => setStep(1)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Edit Details
                                    </button>
                                    <button type="button" className="so-review-edit" onClick={() => setStep(2)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        Edit Description & Skills
                                    </button>
                                </div>

                                <p className="form-disclaimer">
                                    By submitting, you confirm this is a legitimate opportunity and all information provided is accurate. Listings are reviewed before being published.
                                </p>
                            </motion.div>
                        )}

                        {/* Navigation */}
                        <div className="form-navigation">
                            {step > 1 && (
                                <button
                                    type="button"
                                    className="btn-back"
                                    onClick={() => setStep(step - 1)}
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
                                    </svg>
                                    <span>Back</span>
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    type="button"
                                    className="btn-primary btn-next"
                                    onClick={() => setStep(step + 1)}
                                    disabled={!isStepValid(step)}
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
                                    disabled={isSubmitting}
                                >
                                    <span>{isSubmitting ? 'Submitting...' : 'Submit Opportunity'}</span>
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
