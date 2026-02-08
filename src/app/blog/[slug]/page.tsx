'use client';

import { useParams } from 'next/navigation';
import { useState, useMemo, useRef, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageProgress } from '@/components/PageProgress';
import Image from 'next/image';
import Link from 'next/link';
import { getPostBySlug, BLOG_POSTS, type BlogPost } from '../data';

interface Comment {
    id: number;
    name: string;
    avatar: string;
    text: string;
    date: string;
    likes: number;
}

const initialComments: Comment[] = [
    { id: 1, name: 'Adebayo Okafor', avatar: '/images/community/bg-1.png', text: 'Great article! Really helpful for understanding the Sui ecosystem.', date: '2 hours ago', likes: 12 },
    { id: 2, name: 'Ngozi Eze', avatar: '/images/community/bg-3.png', text: 'This is exactly what I needed. The technical breakdown is very clear.', date: '5 hours ago', likes: 8 },
    { id: 3, name: 'Emeka Balogun', avatar: '/images/community/bg-5.png', text: 'Would love to see a follow-up diving deeper into the Move programming aspects.', date: '1 day ago', likes: 5 },
];

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;
    const post = useMemo(() => getPostBySlug(slug), [slug]);

    const [claps, setClaps] = useState(Math.floor(Math.random() * 5000) + 500);
    const [hasClapped, setHasClapped] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [showShareToast, setShowShareToast] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [followPub, setFollowPub] = useState(false);
    const [followAuthor, setFollowAuthor] = useState(false);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const responsesRef = useRef<HTMLDivElement>(null);

    const handleClap = () => {
        if (!hasClapped) {
            setClaps(prev => prev + 1);
            setHasClapped(true);
        }
    };

    const scrollToResponses = useCallback(() => {
        responsesRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => commentInputRef.current?.focus(), 500);
    }, []);

    const handleBookmark = useCallback(() => {
        setIsBookmarked(prev => !prev);
    }, []);

    const handleShare = useCallback(async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({ title: post?.title, url });
            } catch { /* user cancelled */ }
        } else {
            await navigator.clipboard.writeText(url);
            setShowShareToast(true);
            setTimeout(() => setShowShareToast(false), 2000);
        }
    }, [post?.title]);

    const handleAddComment = useCallback(() => {
        if (!commentText.trim()) return;
        const newComment: Comment = {
            id: Date.now(),
            name: 'You',
            avatar: '/images/community/bg-2.png',
            text: commentText.trim(),
            date: 'Just now',
            likes: 0,
        };
        setComments(prev => [newComment, ...prev]);
        setCommentText('');
        if (commentInputRef.current) {
            commentInputRef.current.style.height = 'auto';
        }
    }, [commentText]);

    const handleLikeComment = useCallback((commentId: number) => {
        setLikedComments(prev => {
            const next = new Set(prev);
            if (next.has(commentId)) {
                next.delete(commentId);
            } else {
                next.add(commentId);
            }
            return next;
        });
        setComments(prev => prev.map(c =>
            c.id === commentId
                ? { ...c, likes: likedComments.has(commentId) ? c.likes - 1 : c.likes + 1 }
                : c
        ));
    }, [likedComments]);

    const handleReply = useCallback((name: string) => {
        setCommentText(`@${name} `);
        commentInputRef.current?.focus();
        commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, []);

    const relatedPosts = useMemo(() => {
        if (!post) return [];
        return BLOG_POSTS
            .filter(p => p.id !== post.id && p.category === post.category)
            .slice(0, 3);
    }, [post]);

    if (!post) {
        return (
            <main className="blog-page">
                <Header />
                <div className="article-not-found">
                    <h1>Article not found</h1>
                    <p>The article you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/blog" className="article-back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Blog
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="blog-page">
            <Header />

            {/* Article Hero */}
            <section className="article-hero">
                <div className="article-hero-bg">
                    <Image src={post.image} alt={post.title} fill className="object-cover" priority />
                </div>
                <div className="article-hero-overlay" />
                <div className="article-hero-content">
                    <Link href="/blog" className="article-back-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Back to Blog
                    </Link>
                    <div className="article-hero-tags">
                        <span className="sui-tag-primary sui-tag-small">{post.category}</span>
                        <span className="sui-tag-secondary sui-tag-small">{post.type}</span>
                    </div>
                    <h1 className="article-hero-title">{post.title}</h1>
                    <div className="article-hero-meta">
                        <div className="article-author">
                            <div className="article-author-avatar">
                                <Image src="/images/community/bg-2.png" alt={post.author} fill className="object-cover" />
                            </div>
                            <span className="article-author-name">{post.author}</span>
                        </div>
                        <span className="article-meta-dot" />
                        <span>{post.date}</span>
                        <span className="article-meta-dot" />
                        <span>{post.readTime}</span>
                    </div>
                </div>
            </section>

            {/* Article Body */}
            <article className="article-body">
                <div className="article-body-inner">
                    {/* Lead paragraph */}
                    <p className="article-lead">{post.description}</p>

                    {/* Content */}
                    <div className="article-content">
                        {post.content.split('\n\n').map((block, i) => {
                            if (block.startsWith('## ')) {
                                return <h2 key={i} className="article-h2">{block.replace('## ', '')}</h2>;
                            }
                            if (block.startsWith('### ')) {
                                return <h3 key={i} className="article-h3">{block.replace('### ', '')}</h3>;
                            }
                            const imgMatch = block.match(/^!\[(.+?)\]\((.+?)\)$/);
                            if (imgMatch) {
                                return (
                                    <figure key={i} className="article-figure">
                                        <div className="article-figure-image">
                                            <Image src={imgMatch[2]} alt={imgMatch[1]} fill className="object-cover" />
                                        </div>
                                        <figcaption className="article-figure-caption">{imgMatch[1]}</figcaption>
                                    </figure>
                                );
                            }
                            if (block.startsWith('```')) {
                                const lines = block.split('\n');
                                const code = lines.slice(1, -1).join('\n');
                                return <pre key={i} className="article-code"><code>{code}</code></pre>;
                            }
                            if (block.startsWith('- ')) {
                                const items = block.split('\n').filter(l => l.startsWith('- '));
                                return (
                                    <ul key={i} className="article-list">
                                        {items.map((item, j) => {
                                            const text = item.replace(/^- /, '');
                                            const boldMatch = text.match(/^\*\*(.+?)\*\*:?\s*(.*)/);
                                            if (boldMatch) {
                                                return (
                                                    <li key={j}>
                                                        <strong>{boldMatch[1]}</strong>{boldMatch[2] ? `: ${boldMatch[2]}` : ''}
                                                    </li>
                                                );
                                            }
                                            return <li key={j}>{text}</li>;
                                        })}
                                    </ul>
                                );
                            }
                            if (block.startsWith('1. ')) {
                                const items = block.split('\n').filter(l => /^\d+\. /.test(l));
                                return (
                                    <ol key={i} className="article-list article-list-ordered">
                                        {items.map((item, j) => {
                                            const text = item.replace(/^\d+\.\s/, '');
                                            const codeMatch = text.match(/`(.+?)`/g);
                                            if (codeMatch) {
                                                const parts = text.split(/`(.+?)`/);
                                                return (
                                                    <li key={j}>
                                                        {parts.map((part, k) =>
                                                            k % 2 === 1
                                                                ? <code key={k} className="article-inline-code">{part}</code>
                                                                : <span key={k}>{part}</span>
                                                        )}
                                                    </li>
                                                );
                                            }
                                            return <li key={j}>{text}</li>;
                                        })}
                                    </ol>
                                );
                            }
                            return <p key={i} className="article-paragraph">{block}</p>;
                        })}
                    </div>

                    {/* Tags */}
                    <div className="article-footer-bar">
                        <div className="article-tags-row">
                            <span className="article-tag">{post.category}</span>
                            <span className="article-tag">{post.type}</span>
                            <span className="article-tag">Sui</span>
                            <span className="article-tag">Web3</span>
                        </div>
                    </div>

                    {/* Engagement Bar */}
                    <div className="article-engagement">
                        <div className="article-engagement-left">
                            <button className={`article-clap-btn ${hasClapped ? 'clapped' : ''}`} onClick={handleClap}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={hasClapped ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{claps >= 1000 ? `${(claps / 1000).toFixed(1)}K` : claps}</span>
                            </button>
                            <button className="article-engage-btn" onClick={scrollToResponses}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span>{comments.length}</span>
                            </button>
                        </div>
                        <div className="article-engagement-right">
                            <button className={`article-engage-btn ${isBookmarked ? 'active' : ''}`} title="Bookmark" onClick={handleBookmark}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill={isBookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                    <path d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="article-engage-btn" title="Share" onClick={handleShare}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="article-more-wrapper">
                                <button className="article-engage-btn" title="More" onClick={() => setShowMoreMenu(prev => !prev)}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="12" cy="5" r="1.5" />
                                        <circle cx="12" cy="12" r="1.5" />
                                        <circle cx="12" cy="19" r="1.5" />
                                    </svg>
                                </button>
                                {showMoreMenu && (
                                    <div className="article-more-menu">
                                        <button onClick={() => { handleShare(); setShowMoreMenu(false); }}>Copy link</button>
                                        <button onClick={() => { window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank'); setShowMoreMenu(false); }}>Share on X</button>
                                        <button onClick={() => setShowMoreMenu(false)}>Report article</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {showShareToast && (
                            <div className="article-share-toast">Link copied to clipboard</div>
                        )}
                    </div>

                    {/* Published In */}
                    <div className="article-published-in">
                        <div className="article-pub-left">
                            <div className="article-pub-avatar">
                                <Image src="/images/logos/sui-ng-logo.png" alt="Sui Nigeria" fill className="object-cover" />
                            </div>
                            <div className="article-pub-info">
                                <h3 className="article-pub-title">Published in <strong>Sui Nigeria</strong></h3>
                                <span className="article-pub-meta">10K followers · Last published {post.date}</span>
                                <p className="article-pub-desc">The official community hub for Sui blockchain in Nigeria. News, tutorials, events, and builder spotlights.</p>
                            </div>
                        </div>
                        <button className={`article-follow-btn ${followPub ? 'following' : ''}`} onClick={() => setFollowPub(prev => !prev)}>
                            {followPub ? 'Following' : 'Follow'}
                        </button>
                    </div>

                    {/* Written By */}
                    <div className="article-written-by">
                        <div className="article-pub-left">
                            <div className="article-pub-avatar">
                                <Image src="/images/community/bg-2.png" alt={post.author} fill className="object-cover" />
                            </div>
                            <div className="article-pub-info">
                                <h3 className="article-pub-title">Written by <strong>{post.author}</strong></h3>
                                <span className="article-pub-meta">2.4K followers · 128 following</span>
                                <p className="article-pub-desc">Building the Sui ecosystem in Nigeria. Sharing insights on Web3 development, community growth, and the future of decentralized technology.</p>
                            </div>
                        </div>
                        <button className={`article-follow-btn ${followAuthor ? 'following' : ''}`} onClick={() => setFollowAuthor(prev => !prev)}>
                            {followAuthor ? 'Following' : 'Follow'}
                        </button>
                    </div>

                    {/* Responses */}
                    <div className="article-responses" ref={responsesRef}>
                        <div className="article-responses-header">
                            <h2 className="article-responses-title">Responses ({comments.length})</h2>
                        </div>

                        <div className="article-comment-input">
                            <div className="article-comment-avatar">
                                <Image src="/images/community/bg-2.png" alt="You" fill className="object-cover" />
                            </div>
                            <div className="article-comment-field">
                                <textarea
                                    ref={commentInputRef}
                                    placeholder="What are your thoughts?"
                                    value={commentText}
                                    onChange={(e) => {
                                        setCommentText(e.target.value);
                                        e.target.style.height = 'auto';
                                        e.target.style.height = `${e.target.scrollHeight}px`;
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                                            handleAddComment();
                                        }
                                    }}
                                    rows={3}
                                />
                                {commentText.trim() && (
                                    <div className="article-comment-actions-bar">
                                        <button className="article-comment-submit" onClick={handleAddComment}>
                                            Respond
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="article-comments-list">
                            {comments.map(comment => (
                                <div key={comment.id} className="article-comment">
                                    <div className="article-comment-top">
                                        <div className="article-comment-avatar">
                                            <Image src={comment.avatar} alt={comment.name} fill className="object-cover" />
                                        </div>
                                        <div className="article-comment-meta">
                                            <span className="article-comment-name">{comment.name}</span>
                                            <span className="article-comment-date">{comment.date}</span>
                                        </div>
                                    </div>
                                    <p className="article-comment-text">{comment.text}</p>
                                    <div className="article-comment-actions">
                                        <button className={`article-comment-like ${likedComments.has(comment.id) ? 'liked' : ''}`} onClick={() => handleLikeComment(comment.id)}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill={likedComments.has(comment.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
                                                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>{comment.likes}</span>
                                        </button>
                                        <button className="article-comment-reply" onClick={() => handleReply(comment.name)}>Reply</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </article>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
                <section className="article-related">
                    <div className="article-related-inner">
                        <h2 className="article-related-title">Related Articles</h2>
                        <div className="article-related-grid">
                            {relatedPosts.map(related => (
                                <Link key={related.id} href={`/blog/${related.slug}`} className="article-related-card">
                                    <div className="article-related-image">
                                        <Image src={related.image} alt={related.title} fill className="object-cover" />
                                    </div>
                                    <div className="article-related-body">
                                        <div className="sui-card-v2-tags">
                                            <span className="sui-tag-primary sui-tag-small">{related.category}</span>
                                        </div>
                                        <h3 className="article-related-card-title">{related.title}</h3>
                                        <span className="article-related-meta">{related.date} / {related.readTime}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

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
    );
}
