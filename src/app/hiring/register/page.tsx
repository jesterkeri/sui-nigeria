'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';


// Available skills for selection
const availableSkills = [
  'Video Editing',
  'Sui-Move Dev',
  'Animation',
  'NFT Specialist',
  'Smart Contracts',
  'Programming',
  'Product Design',
  'Graphics Design',
  'Community Manager',
  'Social Media',
  'Ghost Writing',
  'Cyber Security',
  'Quant/Tokenomics',
  'Product Manager',
  '3D Artist',
  'UI/UX Design',
  'Content Creation',
  'Motion Designer',
  'Smart Contract Auditor',
  'Software Development',
];

// Employment type options
const employmentOptions = ['Full-Time', 'Contract', 'Internship', 'Gig'];

export default function FreelancerRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: '',
    about: '',
    languages: '',
    portfolioUrl: '',
    publicEmail: '',
    twitterUrl: '',
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>([]);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleEmployment = (type: string) => {
    if (selectedEmployment.includes(type)) {
      setSelectedEmployment(selectedEmployment.filter(t => t !== type));
    } else if (selectedEmployment.length < 2) {
      setSelectedEmployment([...selectedEmployment, type]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Form submitted:', {
      ...formData,
      skills: selectedSkills,
      employmentTypes: selectedEmployment,
      avatar: avatarPreview,
    });

    setIsSubmitting(false);
    // TODO: Handle actual submission
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email;
      case 2:
        return selectedSkills.length > 0 && selectedEmployment.length > 0;
      case 3:
        const bioValid = formData.bio.length > 0 && formData.bio.length <= 100;
        const aboutWordCount = formData.about.trim().split(/\s+/).filter(Boolean).length;
        return bioValid && aboutWordCount <= 500;
      default:
        return true;
    }
  };

  return (
    <main className="register-page">
      <Header showGreenBorder />

      {/* Pattern Background Wrapper */}
      <div className="register-pattern-wrapper">
        <div className="register-pattern-bg"></div>


        {/* Hero Section */}
        <section className="register-hero">
          <div className="register-hero-content">
            <Link href="/hiring/freelancers" className="register-back-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <span>Back to Freelancers</span>
            </Link>
            <h1 className="register-hero-title">REGISTER AS A FREELANCER</h1>
            <p className="register-hero-subtitle">
              Join the Sui Nigeria community of talented freelancers and connect with amazing opportunities.
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
                  {step === 1 && 'Personal Info'}
                  {step === 2 && 'Skills & Work'}
                  {step === 3 && 'Profile Details'}
                </span>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${((currentStep - 1) / 2) * 100}%` }}></div>
          </div>
        </div>

        {/* Registration Form */}
        <section className="register-form-section">
          <form className="register-form" onSubmit={handleSubmit}>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                className="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="form-step-title">Personal Information</h2>
                <p className="form-step-desc">Tell us about yourself so clients can find you.</p>

                {/* Avatar Upload */}
                <div className="avatar-upload">
                  <div
                    className="avatar-preview"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="Avatar preview" fill className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>Upload Photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="avatar-input"
                  />
                  <p className="avatar-hint">Click to upload your profile picture</p>
                </div>

                {/* Name Fields */}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                      className="form-input"
                      required
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="form-input"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Skills & Employment */}
            {currentStep === 2 && (
              <motion.div
                className="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="form-step-title">Skills & Work Preferences</h2>
                <p className="form-step-desc">Select your skills and preferred work arrangements.</p>

                {/* Employment Types */}
                <div className="form-section">
                  <label className="form-label">Employment Type * (Select up to 2)</label>
                  <div className="employment-grid">
                    {employmentOptions.map((type) => (
                      <button
                        key={type}
                        type="button"
                        className={`employment-option ${selectedEmployment.includes(type) ? 'option-selected' : ''}`}
                        onClick={() => toggleEmployment(type)}
                      >
                        <span className="option-checkbox">
                          {selectedEmployment.includes(type) && (
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

                {/* Skills Selection */}
                <div className="form-section">
                  <label className="form-label">Skills * (Select up to 5)</label>
                  <p className="form-hint">Selected: {selectedSkills.length}/5</p>
                  <div className="skills-grid">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        className={`skill-option ${selectedSkills.includes(skill) ? 'skill-selected' : ''}`}
                        onClick={() => toggleSkill(skill)}
                        disabled={!selectedSkills.includes(skill) && selectedSkills.length >= 5}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Profile Details */}
            {currentStep === 3 && (
              <motion.div
                className="form-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="form-step-title">Profile Details</h2>
                <p className="form-step-desc">Add more details to make your profile stand out.</p>

                {/* Bio */}
                <div className="form-field">
                  <label className="form-label">Bio / Description * (max. 100 characters)</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell clients about your experience, skills, and what makes you unique..."
                    className="form-textarea"
                    rows={5}
                    maxLength={100}
                    required
                  />
                  <p className="form-hint">{formData.bio.length}/100 characters</p>
                </div>

                {/* About */}
                <div className="form-field">
                  <label className="form-label">About (max. 500 words)</label>
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    placeholder="Write a detailed professional summary..."
                    className="form-textarea"
                    rows={8}
                  />
                  <p className="form-hint">
                    {formData.about.trim().split(/\s+/).filter(Boolean).length}/500 words
                  </p>
                </div>

                {/* Languages */}
                <div className="form-field">
                  <label className="form-label">Languages Spoken</label>
                  <input
                    type="text"
                    name="languages"
                    value={formData.languages}
                    onChange={handleInputChange}
                    placeholder="e.g. English, French, Mandarin"
                    className="form-input"
                  />
                </div>

                {/* Links */}
                <div className="form-section">
                  <label className="form-label">Portfolio & Social Links</label>
                  <div className="links-grid">
                    <div className="form-field link-field">
                      <div className="link-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="portfolioUrl"
                        value={formData.portfolioUrl}
                        onChange={handleInputChange}
                        placeholder="Portfolio website URL"
                        className="form-input"
                      />
                    </div>
                    <div className="form-field link-field">
                      <div className="link-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        type="email"
                        name="publicEmail"
                        value={formData.publicEmail}
                        onChange={handleInputChange}
                        placeholder="Public Contact Email"
                        className="form-input"
                      />
                    </div>
                    <div className="form-field link-field">
                      <div className="link-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      </div>
                      <input
                        type="url"
                        name="twitterUrl"
                        value={formData.twitterUrl}
                        onChange={handleInputChange}
                        placeholder="X (Twitter) profile URL"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Terms */}
                <p className="form-disclaimer">
                  By registering, you agree to our Terms of Service and Privacy Policy. Your profile will be visible to potential clients on the Sui Nigeria platform.
                </p>
              </motion.div>
            )}

            {/* Form Navigation */}
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
                  <span>{isSubmitting ? 'Registering...' : 'Complete Registration'}</span>
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
