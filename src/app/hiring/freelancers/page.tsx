'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Category icons mapping
const getCategoryIcon = (name: string) => {
  const icons: { [key: string]: React.ReactNode } = {
    'All': (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3">
        <rect x="6" y="6" width="14" height="14" rx="2" />
        <rect x="28" y="6" width="14" height="14" rx="2" />
        <rect x="6" y="28" width="14" height="14" rx="2" />
        <rect x="28" y="28" width="14" height="14" rx="2" />
      </svg>
    ),
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
    'Programming': (
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
  };
  return icons[name] || icons['All'];
};

// Category data
const categories = [
  { id: 1, name: 'All', freelancerCount: 235, isAll: true },
  { id: 2, name: 'Video Editing', freelancerCount: 235 },
  { id: 3, name: 'Animation', freelancerCount: 235 },
  { id: 4, name: 'Programming', freelancerCount: 235 },
  { id: 5, name: 'Product Design', freelancerCount: 235 },
  { id: 6, name: 'Ghost Writing', freelancerCount: 235 },
  { id: 7, name: 'Graphics Design', freelancerCount: 235 },
  { id: 8, name: 'Smart Contract Auditor', freelancerCount: 120 },
  { id: 9, name: 'Sui-Move Dev', freelancerCount: 180 },
  { id: 10, name: 'Product Manager', freelancerCount: 95 },
  { id: 11, name: 'Social Media Manager', freelancerCount: 150 },
  { id: 12, name: 'NFT Specialist', freelancerCount: 110 },
  { id: 13, name: 'Community Manager', freelancerCount: 140 },
  { id: 14, name: 'Quant/Tokenomics Expert', freelancerCount: 75 },
];


// Freelancer data
const freelancers = [
  {
    id: 1,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-1.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
    featured: true,
  },
  {
    id: 2,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-2.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 3,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-3.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 4,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-4.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 5,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-5.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 6,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-6.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 7,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-7.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 8,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-1.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
  {
    id: 9,
    name: 'Daniel Esoesa',
    avatar: '/images/community/bg-2.png',
    description: 'Sui Move dev, designer and video editors, i am currently a content creator on the Sui Network.',
    employmentTypes: ['Contract', 'Full-Time'],
    skills: [
      { name: 'Video Editing', color: 'green' },
      { name: 'Programming', color: 'white' },
      { name: 'Animation', color: 'purple' },
    ],
    rating: 4.5,
    reviewCount: 188,
  },
];

// Filter options
const employmentTypes = ['Full-time', 'Internship', 'Contract', 'Gig'];
const categoryFilters = [
  'UI/UX design',
  'Video Editing',
  'Animation',
  'Programming',
  '3d Artist',
  'Content Creation',
  'Motion Designer',
  'Smart Contract Auditor',
  'Sui-Move Dev',
  'Product Manager',
  'Social Media Manager',
  'NFT Specialist',
  'Community Manager',
  'Quant/Tokenomics Expert',
];
const starRatings = ['2 stars', '3 stars', '4 stars', 'Veteran'];

export default function FreelancersPage() {
  const [activeCategory, setActiveCategory] = useState(1);
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['Programming', 'Content Creation']);
  const [selectedRatings, setSelectedRatings] = useState<string[]>(['3 stars', '4 stars', 'Veteran']);
  const [showFilters, setShowFilters] = useState(true);
  const [categoryPage, setCategoryPage] = useState(0);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setSubtitleVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (subtitleRef.current) {
      observer.observe(subtitleRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const ITEMS_PER_PAGE = 8; // 2 rows of 4
  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const startIndex = categoryPage * ITEMS_PER_PAGE;
  const visibleCategories = categories.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    if (categoryPage > 0) setCategoryPage(categoryPage - 1);
  };

  const handleNextPage = () => {
    if (categoryPage < totalPages - 1) setCategoryPage(categoryPage + 1);
  };

  const toggleFilter = (filter: string, list: string[], setList: (value: string[]) => void) => {
    if (list.includes(filter)) {
      setList(list.filter(f => f !== filter));
    } else {
      setList([...list, filter]);
    }
  };

  return (
    <main className="freelancers-page">
      <Header showGreenBorder />

      {/* Pattern Background Wrapper */}
      <div className="freelancers-pattern-wrapper">
        <div className="freelancers-pattern-bg"></div>

        {/* Hero Section */}
        <section className="freelancers-hero">
          <div className="freelancers-hero-content">
            <div className="freelancers-hero-text">
              <h1 className="freelancers-hero-title">FREELANCERS</h1>
              <p
                ref={subtitleRef}
                className={`freelancers-hero-subtitle ${subtitleVisible ? 'animate-typewriter' : ''}`}
              >
                Get the perfect pro for every project right here in Sui Nigeria.
              </p>
              <Link href="/hiring/register" className="btn-primary">
                <span>Register as a Freelancer</span>
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
            <div className="freelancers-hero-illustration">
              <Image
                src="/images/guy-sitting.svg"
                alt="Person sitting at desk illustration"
                width={580}
                height={392}
                className="illustration-image"
                priority
              />
            </div>
          </div>
        </section>

        {/* Category Section */}
        <section className="category-section">
          <h2 className="category-title">Explore by category</h2>
          <div className="category-content">
            <div className="category-grid" key={categoryPage}>
              {visibleCategories.map((category) => (
                <button
                  key={category.id}
                  className={`category-card ${activeCategory === category.id ? 'category-card-active' : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <div className="category-icon">
                    {getCategoryIcon(category.name)}
                  </div>
                  <div className="category-info">
                    <span className="category-name">{category.name}</span>
                    <div className="category-count">
                      <span>{category.freelancerCount} freelancers available</span>
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
                onClick={handlePrevPage}
                aria-label="Show previous categories"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className={`past-events-nav-btn next ${categoryPage >= totalPages - 1 ? 'disabled' : ''}`}
                disabled={categoryPage >= totalPages - 1}
                onClick={handleNextPage}
                aria-label="Show next categories"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Divider */}
      <div className="freelancers-divider"></div>

      {/* Freelancers Listing Section */}
      <section className="freelancers-listing">
        <div className="freelancers-listing-content">
          {/* Freelancer Grid */}
          <div className="freelancers-grid">
            {freelancers.map((freelancer) => (
              <div key={freelancer.id} className={`freelancer-card ${freelancer.featured ? 'freelancer-card-featured' : ''}`}>
                <div className="freelancer-card-pattern"></div>

                {/* Header */}
                <div className="freelancer-header">
                  <div className="freelancer-avatar">
                    <Image
                      src={freelancer.avatar}
                      alt={freelancer.name}
                      fill
                      className="freelancer-avatar-img"
                    />
                  </div>
                  <div className="freelancer-badges">
                    {freelancer.employmentTypes.map((type) => (
                      <span key={type} className="freelancer-badge">{type}</span>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <div className="freelancer-info">
                  <h3 className="freelancer-name">{freelancer.name}</h3>
                  <p className="freelancer-description">{freelancer.description}</p>
                </div>

                {/* Skills */}
                <div className="freelancer-skills">
                  {freelancer.skills.map((skill) => (
                    <span key={skill.name} className={`skill-tag skill-tag-${skill.color}`}>
                      {skill.name}
                    </span>
                  ))}
                  <span className="skill-more">+2</span>
                </div>

                {/* Rating */}
                <div className="freelancer-rating">
                  <span className="rating-label">Rating</span>
                  <div className="rating-value">
                    <div className="rating-star">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFB836">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                      <span>{freelancer.rating}</span>
                    </div>
                    <span className="rating-count">({freelancer.reviewCount})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="freelancer-actions">
                  <Link href={`/hiring/freelancers/${freelancer.id}`} className="btn-view-profile">
                    View Profile
                  </Link>
                  <button className="btn-message" aria-label="Send Message">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Filter Sidebar */}
          <motion.aside
            className={`filter-sidebar ${showFilters ? 'sidebar-open' : 'sidebar-closed'}`}
            initial={false}
            animate={{ width: showFilters ? 324 : 0 }}
            transition={{ duration: 0.3, type: "tween", ease: "easeInOut" }}
            style={{ width: showFilters ? 324 : 0 }} // Force width to match animation state for Grid flow
          >
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="filter-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Type of Employment */}
                  <div className="filter-section">
                    <div className="filter-section-header">
                      <span className="filter-section-title">Type of Employment</span>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                    </div>
                    <div className="filter-options">
                      {employmentTypes.map((type) => (
                        <label key={type} className="filter-checkbox">
                          <span>{type}</span>
                          <input
                            type="checkbox"
                            checked={selectedEmployment.includes(type)}
                            onChange={() => toggleFilter(type, selectedEmployment, setSelectedEmployment)}
                          />
                          <span className={`checkbox-custom ${selectedEmployment.includes(type) ? 'checkbox-checked' : ''}`}>
                            {selectedEmployment.includes(type) && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2">
                                <path d="M3 8l3 3 7-7" />
                              </svg>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="filter-section">
                    <div className="filter-section-header">
                      <span className="filter-section-title">Categories</span>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                    </div>
                    <div className="filter-options">
                      {categoryFilters.map((category) => (
                        <label key={category} className="filter-checkbox">
                          <span>{category}</span>
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                          />
                          <span className={`checkbox-custom ${selectedCategories.includes(category) ? 'checkbox-checked' : ''}`}>
                            {selectedCategories.includes(category) && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2">
                                <path d="M3 8l3 3 7-7" />
                              </svg>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="filter-section">
                    <div className="filter-section-header">
                      <span className="filter-section-title">Star Rating</span>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 8l5 5 5-5" />
                      </svg>
                    </div>
                    <div className="filter-options">
                      {starRatings.map((rating) => (
                        <label key={rating} className="filter-checkbox">
                          <span>{rating}</span>
                          <input
                            type="checkbox"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => toggleFilter(rating, selectedRatings, setSelectedRatings)}
                          />
                          <span className={`checkbox-custom ${selectedRatings.includes(rating) ? 'checkbox-checked' : ''}`}>
                            {selectedRatings.includes(rating) && (
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2">
                                <path d="M3 8l3 3 7-7" />
                              </svg>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <button className="filter-toggle" onClick={() => setShowFilters(!showFilters)}>
              <span>Filter</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </button>
          </motion.aside>
        </div>
      </section>

      {/* Community Signup Section */}
      <section className="community-section">
        <div className="community-bg">
          <Image
            src="/images/community/bg-1.png"
            alt="Community Background"
            fill
            className="community-bg-image"
          />
          <div className="community-overlay"></div>
        </div>

        <h2 className="community-title">JOIN THE COMMUNITY OF BUILDERS AND CREATIVES</h2>

        <div className="community-content">
          <form className="community-form">
            <div className="form-field">
              <input type="text" placeholder="NAME" className="form-input" />
            </div>
            <div className="form-field">
              <input type="email" placeholder="EMAIL" className="form-input" />
            </div>
            <div className="form-field">
              <input type="tel" placeholder="PHONE" className="form-input" />
            </div>
            <p className="form-disclaimer">
              By Clicking this you agree to be onboarded into the Sui Nigeria Community and subscribe to our newsletter (No spam).
            </p>
            <button type="submit" className="btn-submit">
              <span>Submit</span>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
        </div>

        {/* Arrow decoration */}
        <div className="community-arrow">
          <Image
            src="/blog-arrow.svg"
            alt="Arrow"
            width={120}
            height={120}
            className="community-arrow-img"
          />
        </div>

        <p className="community-cta-text">Let's keep in touch - Be the first to know what's coming.</p>
      </section>

      <PageProgress />
      <Footer />
    </main>
  );
}
