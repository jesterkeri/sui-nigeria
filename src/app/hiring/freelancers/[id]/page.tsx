'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock freelancer data
const freelancerData = {
    id: 1,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-1.png',
    heroImages: [
        '/images/community/bg-1.png',
        '/images/community/bg-2.png',
        '/images/community/bg-3.png',
    ],
    tagline: 'Sui Move dev, designer and video editor, i am currently a content creator on the Sui Network.',
    isVeteran: true,
    rating: 4.5,
    reviewCount: 188,
    employmentTypes: ['Contract', 'Full-Time'],
    veteranQuote: '"After due deliberation, Sui Nigeria officially recognizes Daniel Esosa as a veteran, having successfully completed ten 10 consecutive jobs, each receiving a rating of at least 4 stars."',
    skills: [
        { name: 'Video Editing', color: 'green' },
        { name: 'Programming', color: 'white' },
        { name: 'Animation', color: 'purple' },
        { name: 'Video Editing', color: 'green' },
        { name: 'Video Editing', color: 'green' },
    ],
    about: `I am a Sui Move developer, designer, and video editor actively building and creating within the Sui Network. My work spans smart contract development, product design, and content creation, allowing me to contribute to the ecosystem from both a technical and creative perspective.

As a Move developer on Sui, I focus on building secure, efficient, and scalable on-chain applications. I have participated in and won multiple hackathons within the Sui ecosystem, where I collaborated with teams to design, develop, and ship production-ready prototypes under tight timelines. These experiences strengthened my ability to reason about complex systems, write safe Move code, and deliver practical solutions.

I have worked on several projects across the Sui Network, contributing to smart contracts, frontend integrations, and protocol-level features. Through these projects, I have gained hands-on experience with Sui's object-centric architecture, Move's safety model, and the broader tooling around the ecosystem. I enjoy taking ideas from concept to execution and refining them into usable products.

In addition to development, I am a designer with a strong focus on clarity and usability. I design interfaces, graphics, and brand assets that enhance user experience and communicate technical ideas effectively, particularly within Web3 products.

I am also a video editor and content creator, producing educational and promotional content tailored to the Sui community. My work includes explainer videos, project showcases, and ecosystem updates aimed at making Sui more accessible to both developers and users.

Currently, I am an active creator in the Sui Network, contributing through development, design, and media. I enjoy collaborating with builders, communities, and protocols to bring ideas to life and support the continued growth of the Sui ecosystem.`,
    email: 'jakegyll@email.com',
    phone: '+234 1245 572 135',
    languages: 'English, French, Mandarin',
    portfolio: 'jakegylportfolio.com',
    isOnline: true,
    projects: [
        {
            id: 1,
            name: 'FluxPay',
            image: '/images/community/bg-1.png',
            description: '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        },
        { id: 2, name: 'Project 2', image: '/images/community/bg-2.png' },
        { id: 3, name: 'Project 3', image: '/images/community/bg-3.png' },
        { id: 4, name: 'Project 4', image: '/images/community/bg-4.png' },
        { id: 5, name: 'Project 5', image: '/images/community/bg-5.png' },
        { id: 6, name: 'Project 6', image: '/images/community/bg-6.png' },
        { id: 7, name: 'Project 7', image: '/images/community/bg-7.png' },
        { id: 8, name: 'Project 8', image: '/images/community/bg-1.png' },
        { id: 9, name: 'Project 9', image: '/images/community/bg-2.png' },
        { id: 10, name: 'Project 10', image: '/images/community/bg-3.png' },
        { id: 11, name: 'Project 11', image: '/images/community/bg-4.png' },
        { id: 12, name: 'Project 12', image: '/images/community/bg-5.png' },
        { id: 13, name: 'Project 13', image: '/images/community/bg-6.png' },
        { id: 14, name: 'Project 14', image: '/images/community/bg-7.png' },
        { id: 15, name: 'Project 15', image: '/images/community/bg-1.png' },
        { id: 16, name: 'Project 16', image: '/images/community/bg-2.png' },
    ],
    reviews: [
        { id: 1, name: 'Cappacino', avatar: '/images/community/bg-1.png', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, fermentum id id vitae, integer fermentum tellus. In vitae id nisl quis ornare diam commodo in vel dolor.', rating: 4.5 },
        { id: 2, name: 'Cappacino', avatar: '/images/community/bg-2.png', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, fermentum id id vitae, integer fermentum tellus. In vitae id nisl quis ornare diam commodo in vel dolor.', rating: 4.5 },
        { id: 3, name: 'Cappacino', avatar: '/images/community/bg-3.png', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, fermentum id id vitae, integer fermentum tellus. In vitae id nisl quis ornare diam commodo in vel dolor.', rating: 4.5 },
        { id: 4, name: 'Cappacino', avatar: '/images/community/bg-4.png', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, fermentum id id vitae, integer fermentum tellus. In vitae id nisl quis ornare diam commodo in vel dolor.', rating: 4.5 },
        { id: 5, name: 'Cappacino', avatar: '/images/community/bg-5.png', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, fermentum id id vitae, integer fermentum tellus. In vitae id nisl quis ornare diam commodo in vel dolor.', rating: 4.5 },
        { id: 6, name: 'Cappacino', avatar: '/images/community/bg-6.png', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Massa, fermentum id id vitae, integer fermentum tellus. In vitae id nisl quis ornare diam commodo in vel dolor.', rating: 4.5 },
    ],
    comments: [
        {
            id: 1,
            author: 'Moritz Wallawitsch',
            avatar: '/images/community/bg-1.png',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
            rating: 4.5,
            date: '2 weeks ago',
        },
        {
            id: 2,
            author: 'Moritz Wallawitsch',
            avatar: '/images/community/bg-2.png',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
            rating: 4.5,
            date: '2 weeks ago',
        },
        {
            id: 3,
            author: 'Moritz Wallawitsch',
            avatar: '/images/community/bg-3.png',
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."',
            rating: 4.5,
            date: '2 weeks ago',
        },
    ],
};

// Star Rating Component
const StarRating = ({ rating, size = 24 }: { rating: number; size?: number }) => {
    return (
        <div className="profile-stars">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width={size} height={size} viewBox="0 0 24 24" fill={star <= rating ? '#FFB836' : '#404040'}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            ))}
        </div>
    );
};

export default function FreelancerProfilePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedProject, setSelectedProject] = useState(0);
    const [visibleThumbs, setVisibleThumbs] = useState(1);
    const [thumbWidthAdjusted, setThumbWidthAdjusted] = useState<number | null>(null);
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [popupSelectedProject, setPopupSelectedProject] = useState(0);
    const sectionRef = useRef<HTMLElement>(null);
    const freelancer = freelancerData;

    // Cap portfolio to maximum 20 projects
    const MAX_PORTFOLIO_ITEMS = 20;
    const portfolioProjects = freelancer.projects.slice(0, MAX_PORTFOLIO_ITEMS);

    // Calculate how many thumbnails fit in the container
    useEffect(() => {
        const calculateVisibleThumbs = () => {
            if (!sectionRef.current) return;

            // Get the section's computed style to account for padding
            const sectionStyle = window.getComputedStyle(sectionRef.current);
            const paddingLeft = parseFloat(sectionStyle.paddingLeft) || 0;
            const paddingRight = parseFloat(sectionStyle.paddingRight) || 0;
            const sectionWidth = sectionRef.current.offsetWidth;
            const availableWidth = sectionWidth - paddingLeft - paddingRight;

            if (availableWidth <= 0) return;

            const gap = 12;
            // Check if viewport is >= 768px for larger thumbnails (matches CSS media query)
            const baseThumbWidth = window.innerWidth >= 768 ? 245 : 180;

            const totalProjects = portfolioProjects.length;
            const itemWidth = baseThumbWidth + gap;

            // First check if all thumbnails can fit without "+N" button
            const allFitWidth = (totalProjects * baseThumbWidth) + ((totalProjects - 1) * gap);

            let numVisible: number;
            let showMoreButton: boolean;

            if (allFitWidth <= availableWidth) {
                // All thumbnails fit
                numVisible = totalProjects;
                showMoreButton = false;
            } else {
                // Need "+N" button - calculate how many thumbs fit alongside it
                const maxThumbs = Math.floor((availableWidth - baseThumbWidth) / itemWidth);
                numVisible = Math.max(1, maxThumbs);
                showMoreButton = true;
            }

            setVisibleThumbs(numVisible);

            // Calculate extra space and distribute among all items
            const totalItems = showMoreButton ? numVisible + 1 : numVisible;
            const usedWidth = (totalItems * baseThumbWidth) + ((totalItems - 1) * gap);
            const extraSpace = availableWidth - usedWidth;

            if (extraSpace > 0 && totalItems > 0) {
                // Distribute extra space equally among all items
                const extraPerItem = Math.floor(extraSpace / totalItems);
                setThumbWidthAdjusted(baseThumbWidth + extraPerItem);
            } else {
                setThumbWidthAdjusted(null);
            }
        };

        // Initial calculation
        calculateVisibleThumbs();

        // Recalculate on resize
        window.addEventListener('resize', calculateVisibleThumbs);

        return () => {
            window.removeEventListener('resize', calculateVisibleThumbs);
        };
    }, [portfolioProjects.length]);

    // Lock body scroll when popup is open
    useEffect(() => {
        if (showAllProjects) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.overflow = 'hidden';
        } else {
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.overflow = '';
        };
    }, [showAllProjects]);

    const handlePrevSlide = () => {
        setCurrentSlide((prev) => (prev > 0 ? prev - 1 : freelancer.heroImages.length - 1));
    };

    const handleNextSlide = () => {
        setCurrentSlide((prev) => (prev < freelancer.heroImages.length - 1 ? prev + 1 : 0));
    };

    return (
        <main className="profile-page">
            <Header showGreenBorder />

            {/* Hero Section */}
            <section className="profile-hero">
                <div className="profile-hero-slider">
                    <Image
                        src={freelancer.heroImages[currentSlide]}
                        alt={freelancer.name}
                        fill
                        className="profile-hero-image"
                        priority
                    />
                    <div className="profile-hero-overlay"></div>

                    {/* Navigation Arrows */}
                    <button className="profile-hero-nav profile-hero-nav-prev" onClick={handlePrevSlide} aria-label="Previous slide">
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <circle cx="26" cy="26" r="25" stroke="white" strokeWidth="2" opacity="0.5" />
                            <path d="M30 17L21 26L30 35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    <button className="profile-hero-nav profile-hero-nav-next" onClick={handleNextSlide} aria-label="Next slide">
                        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                            <circle cx="26" cy="26" r="25" stroke="white" strokeWidth="2" />
                            <path d="M22 17L31 26L22 35" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Play Button */}
                    <button className="profile-hero-play" aria-label="Play video">
                        <svg width="50" height="50" viewBox="0 0 50 50" fill="#D9D9D9">
                            <path d="M18 12L38 25L18 38V12Z" />
                        </svg>
                    </button>

                    {/* Back Button */}
                    <Link href="/hiring/freelancers" className="profile-back-btn">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Back</span>
                    </Link>

                    {/* Tagline */}
                    <p className="profile-hero-tagline">{freelancer.tagline}</p>

                    {/* Message Card */}
                    <div className="profile-message-card">
                        <div className="profile-message-avatar">
                            <Image src={freelancer.avatar} alt={freelancer.name} fill className="profile-message-avatar-img" />
                            <span className="profile-online-indicator"></span>
                        </div>
                        <div className="profile-message-info">
                            <span className="profile-message-label">Message {freelancer.name.split(' ')[0]}</span>
                            <span className="profile-message-status">Online</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Profile Info Section */}
            <section className="profile-info-section">
                <div className="profile-info-container">
                    <div className="profile-info-left">
                        <div className="profile-avatar-wrapper">
                            <Image src={freelancer.avatar} alt={freelancer.name} fill className="profile-avatar-img" />
                        </div>
                        <div className="profile-name-details">
                            <div className="profile-name-row">
                                <h1 className="profile-name">{freelancer.name}</h1>
                                {freelancer.isVeteran && (
                                    <span className="freelancer-badge freelancer-badge-veteran">Veteran</span>
                                )}
                            </div>
                            <div className="profile-meta-row">
                                <div className="profile-rating">
                                    <StarRating rating={freelancer.rating} />
                                    <span className="profile-rating-value">{freelancer.rating}</span>
                                </div>
                                <div className="profile-employment-badges">
                                    {freelancer.employmentTypes.map((type) => (
                                        <span key={type} className="profile-employment-badge">{type}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-info-right">
                        <p className="profile-veteran-quote">{freelancer.veteranQuote}</p>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="profile-skills-section">
                    <h3 className="profile-skills-title">Skill Category</h3>
                    <div className="profile-skills-list">
                        {freelancer.skills.map((skill, index) => (
                            <span key={index} className={`profile-skill-tag profile-skill-${skill.color}`}>
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Me Section */}
            <section className="profile-about-section">
                <div className="profile-about-content">
                    <h2 className="profile-section-title">About Me</h2>
                    <div className="profile-about-text">
                        {freelancer.about.split('\n\n').map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </section>

            {/* Additional Details */}
            <section className="profile-details-section">
                <h3 className="profile-details-title">Additional Details</h3>
                <div className="profile-details-cards">
                    <div className="profile-detail-card">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2">
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <path d="M3 7l9 6 9-6" />
                        </svg>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Email</span>
                            <span className="profile-detail-value">{freelancer.email}</span>
                        </div>
                    </div>
                    <div className="profile-detail-card">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                        </svg>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Phone</span>
                            <span className="profile-detail-value">{freelancer.phone}</span>
                        </div>
                    </div>
                    <div className="profile-detail-card">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="2">
                            <path d="M5 8h14M5 12h14M5 16h10" />
                        </svg>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Languages</span>
                            <span className="profile-detail-value">{freelancer.languages}</span>
                        </div>
                    </div>
                    <div className="profile-detail-card">
                        <svg width="22.5" height="22.5" viewBox="0 0 24 24" fill="none" stroke="#008751" strokeWidth="1.5">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                            <path d="M2 12h20" />
                        </svg>
                        <div className="profile-detail-content">
                            <span className="profile-detail-label">Portfolio Website</span>
                            <span className="profile-detail-value">{freelancer.portfolio}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="profile-portfolio-section" ref={sectionRef}>
                <div className="profile-portfolio-divider"></div>
                <h2 className="profile-portfolio-title">My Portfolio</h2>

                <div className="profile-portfolio-content">
                    {/* Featured Project */}
                    <div className="profile-portfolio-featured">
                        <div className="profile-portfolio-featured-image">
                            <Image
                                src={portfolioProjects[selectedProject].image}
                                alt={portfolioProjects[selectedProject].name}
                                fill
                                className="portfolio-image"
                            />
                        </div>
                        <div className="profile-portfolio-featured-details">
                            <h3 className="profile-portfolio-project-name">{portfolioProjects[selectedProject].name}</h3>
                            <div className="profile-portfolio-divider-sm"></div>
                            <p className="profile-portfolio-project-desc">{portfolioProjects[selectedProject].description || 'No description available.'}</p>
                            <Link href="#" className="btn-primary profile-preview-btn">
                                <span>Preview</span>
                                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Portfolio Thumbnails */}
                    <div className="profile-portfolio-thumbnails">
                        {portfolioProjects.slice(0, visibleThumbs).map((project, index) => (
                            <button
                                key={project.id}
                                className={`profile-portfolio-thumb ${selectedProject === index ? 'active' : ''}`}
                                onClick={() => setSelectedProject(index)}
                                aria-label={`View ${project.name}`}
                                title={project.name}
                                style={thumbWidthAdjusted ? { width: thumbWidthAdjusted } : undefined}
                            >
                                <Image src={project.image} alt={project.name} fill className="thumb-image" />
                            </button>
                        ))}
                        {portfolioProjects.length > visibleThumbs && (
                            <button
                                className="profile-portfolio-more"
                                style={thumbWidthAdjusted ? { width: thumbWidthAdjusted } : undefined}
                                onClick={() => setShowAllProjects(true)}
                                aria-label="View all projects"
                            >
                                <span>+{portfolioProjects.length - visibleThumbs}</span>
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* All Projects Popup */}
            <AnimatePresence mode="wait">
                {showAllProjects && (
                    <motion.div
                        className="portfolio-popup-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.35, delay: 0.1 } }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setShowAllProjects(false)}
                    >
                        <motion.div
                            className="portfolio-popup"
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                            }}
                            exit={{
                                opacity: 0,
                                y: 300,
                                scaleY: 0.5,
                                scaleX: 0.6,
                                clipPath: 'polygon(0% 0%, 100% 0%, 85% 100%, 85% 100%)',
                                transition: {
                                    duration: 0.55,
                                    ease: [0.4, 0, 0.2, 1],
                                    clipPath: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                                    y: { duration: 0.55, ease: [0.4, 0, 0.2, 1], delay: 0.1 },
                                    scaleY: { duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.05 },
                                    scaleX: { duration: 0.45, ease: [0.4, 0, 0.2, 1], delay: 0.05 },
                                    opacity: { duration: 0.35, delay: 0.2 }
                                }
                            }}
                            transition={{
                                type: 'spring',
                                damping: 25,
                                stiffness: 300,
                            }}
                            style={{ transformOrigin: 'center bottom' }}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                        >
                        {/* Close Button */}
                        <button
                            className="portfolio-popup-close btn-close-rotate"
                            onClick={() => setShowAllProjects(false)}
                            aria-label="Close popup"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Preview Section */}
                        <div className="portfolio-popup-preview">
                            <div className="portfolio-popup-preview-image">
                                <Image
                                    src={portfolioProjects[popupSelectedProject].image}
                                    alt={portfolioProjects[popupSelectedProject].name}
                                    fill
                                    className="preview-image"
                                />
                            </div>
                            <div className="portfolio-popup-preview-details">
                                <h3 className="portfolio-popup-preview-name">
                                    {portfolioProjects[popupSelectedProject].name}
                                </h3>
                                <div className="portfolio-popup-preview-divider"></div>
                                <p className="portfolio-popup-preview-desc">
                                    {portfolioProjects[popupSelectedProject].description || 'No description available for this project.'}
                                </p>
                                <div className="portfolio-popup-preview-actions">
                                    <Link href="#" className="btn-primary portfolio-popup-preview-btn">
                                        <span>Preview</span>
                                        <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails Grid */}
                        <div className="portfolio-popup-content">
                            <h4 className="portfolio-popup-grid-title">All Projects ({portfolioProjects.length})</h4>
                            <div className="portfolio-popup-grid">
                                {portfolioProjects.map((project, index) => (
                                    <button
                                        key={project.id}
                                        className={`portfolio-popup-thumb ${popupSelectedProject === index ? 'active' : ''}`}
                                        onClick={() => setPopupSelectedProject(index)}
                                        aria-label={`View ${project.name}`}
                                        title={project.name}
                                    >
                                        <Image src={project.image} alt={project.name} fill className="thumb-image" />
                                        <span className="portfolio-popup-thumb-name">{project.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
            </AnimatePresence>

            {/* Reviews Section */}
            <section className="profile-reviews-section">
                <h2 className="profile-reviews-title">Reviews</h2>
                <div className="profile-reviews-carousel">
                    {freelancer.reviews.map((review) => (
                        <div key={review.id} className="profile-review-card">
                            <div className="profile-review-avatar">
                                <Image src={review.avatar} alt={review.name} fill className="review-avatar-img" />
                            </div>
                            <h4 className="profile-review-name">{review.name}</h4>
                            <p className="profile-review-text">{review.text}</p>
                            <div className="profile-review-rating">
                                <StarRating rating={review.rating} size={24} />
                                <span className="profile-review-rating-value">{review.rating}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Comments Section */}
            <section className="profile-comments-section">
                <div className="profile-comments-divider"></div>
                <h2 className="profile-comments-title">Comments</h2>

                <div className="profile-comments-list">
                    {freelancer.comments.map((comment) => (
                        <div key={comment.id} className="profile-comment-card">
                            <div className="profile-comment-header">
                                <div className="profile-comment-avatar">
                                    <Image src={comment.avatar} alt={comment.author} fill className="comment-avatar-img" />
                                </div>
                                <span className="profile-comment-author">{comment.author}</span>
                            </div>
                            <div className="profile-comment-body">
                                <p className="profile-comment-text">{comment.text}</p>
                                <div className="profile-comment-meta">
                                    <div className="profile-comment-rating">
                                        <StarRating rating={comment.rating} size={17} />
                                        <span>{comment.rating}</span>
                                    </div>
                                    <span className="profile-comment-dot">·</span>
                                    <span className="profile-comment-date">{comment.date}</span>
                                </div>
                            </div>
                            <div className="profile-comment-response">
                                <div className="profile-response-header">
                                    <div className="profile-response-avatar">
                                        <Image src={freelancer.avatar} alt={freelancer.name} fill className="response-avatar-img" />
                                    </div>
                                    <span className="profile-response-label">{freelancer.name.split(' ')[0]}&apos;s Response</span>
                                </div>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="profile-response-toggle">
                                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    ))}
                </div>
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
                                A brand with legacy, now built for the future. $DMC is not just a token — it&apos;s a movement. Ready to see what happens at 88MPH? 🏁 @DeLoreanlabs is just getting started.
                            </p>
                            <span className="profile-post-view">View on X</span>
                        </div>
                    ))}
                </div>

                <p className="profile-newsletter-cta">Let&apos;s keep in touch - Be the first to know what&apos;s coming.</p>
            </section>

            <PageProgress />
            <Footer />
        </main>
    );
}
