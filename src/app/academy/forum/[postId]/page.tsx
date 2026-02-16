'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { AcademyHeader } from '../../AcademyHeader';
import type { ForumComment } from '@/lib/forum-types';
import { VoteButtons } from '../components/VoteButtons';
import { AddressChip } from '../components/AddressChip';
import { TimeAgo } from '../components/TimeAgo';
import { CommentThread } from '../components/CommentThread';
import { ReplyForm } from '../components/ReplyForm';
import { WalletGate } from '../components/WalletGate';
import { useForumTheme } from '../useForumTheme';
import { mockPosts, mockComments } from '../mockData';
import '../../academy.css';
import '../forum.css';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const account = useCurrentAccount();
  const walletAddress = account?.address;
  const { theme } = useForumTheme();

  const post = mockPosts.find((p) => p.id === postId);
  const initialComments = mockComments.filter((c) => c.post_id === postId);

  const [comments, setComments] = useState<ForumComment[]>(initialComments);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});
  const [postScore, setPostScore] = useState(post?.vote_score ?? 0);
  const [showReply, setShowReply] = useState(false);

  const handleVotePost = (value: number) => {
    if (!walletAddress || !post) return;
    const current = userVotes[post.id] || 0;
    const newValue = current === value ? 0 : value;
    const delta = newValue - current;
    setUserVotes((prev) => ({ ...prev, [post.id]: newValue }));
    setPostScore((prev) => prev + delta);
  };

  const handleVoteComment = (targetId: string, value: number) => {
    if (!walletAddress) return;
    const current = userVotes[targetId] || 0;
    const newValue = current === value ? 0 : value;
    const delta = newValue - current;
    setUserVotes((prev) => ({ ...prev, [targetId]: newValue }));
    setComments((prev) =>
      prev.map((c) =>
        c.id === targetId ? { ...c, vote_score: c.vote_score + delta } : c
      )
    );
  };

  const handleAddComment = (newComment: ForumComment) => {
    setComments((prev) => [...prev, newComment]);
  };

  if (!post) {
    return (
      <div className="forum-page" style={theme.vars as React.CSSProperties}>
        <AcademyHeader />
        <div className="forum-container">
          <div className="forum-error">
            <h3 className="forum-error-title">Discussion not found</h3>
            <p className="forum-error-text">This discussion may have been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forum-page" style={theme.vars as React.CSSProperties}>
      <AcademyHeader />
      <div className="forum-container">
        <div className="forum-layout">
          <div className="forum-main">
            {/* Post Detail */}
            <motion.div
              className="forum-detail"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="forum-detail-inner">
                <VoteButtons
                  score={postScore}
                  userVote={userVotes[post.id] || 0}
                  onVote={handleVotePost}
                  disabled={!walletAddress}
                />
                <div className="forum-detail-content">
                  <div className="forum-detail-header">
                    <span className={`forum-badge ${post.category}`}>
                      <span className="forum-badge-text">{post.category}</span>
                    </span>
                    <span className="forum-middot">&middot;</span>
                    <span>Posted by</span>
                    <AddressChip address={post.author_address} size="sm" />
                    <TimeAgo date={post.created_at} />
                  </div>
                  <h1 className="forum-detail-title">{post.title}</h1>
                  <p className="forum-detail-body">{post.body}</p>
                  {post.media && post.media.length > 0 && (
                    <div className="forum-detail-media">
                      {post.media.map((item) => (
                        <div key={item.id} className="forum-detail-media-item">
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.name} />
                          ) : (
                            <video src={item.url} controls muted />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Action bar */}
              <div className="forum-detail-actions">
                <span className="forum-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>{comments.length} Comment{comments.length !== 1 ? 's' : ''}</span>
                </span>
                <button type="button" className="forum-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span>Share</span>
                </button>
                <button type="button" className="forum-action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  <span>Save</span>
                </button>
              </div>
            </motion.div>

            {/* Comments Section */}
            <motion.div
              className="forum-comments-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h2 className="forum-comments-header">
                {comments.length} Comment{comments.length !== 1 ? 's' : ''}
              </h2>

              {walletAddress ? (
                showReply ? (
                  <div className="forum-top-reply">
                    <ReplyForm
                      postId={postId}
                      parentId={null}
                      depth={0}
                      authorAddress={walletAddress}
                      onClose={() => setShowReply(false)}
                      onSubmit={handleAddComment}
                    />
                  </div>
                ) : (
                  <button
                    type="button"
                    className="forum-reply-btn"
                    style={{ marginBottom: '1rem', fontSize: '0.78rem' }}
                    onClick={() => setShowReply(true)}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add a comment
                  </button>
                )
              ) : (
                <WalletGate message="Connect your wallet to comment" />
              )}

              <CommentThread
                comments={comments}
                postId={postId}
                userVotes={userVotes}
                onVote={handleVoteComment}
                walletAddress={walletAddress}
                onReply={handleAddComment}
              />
            </motion.div>
          </div>

          {/* Sidebar */}
          <aside className="forum-sidebar">
            {/* Dev Resources */}
            <div className="forum-sidebar-card">
              <div className="forum-sidebar-rules-title">Dev Resources</div>
              <div className="forum-sidebar-links">
                <a href="https://docs.sui.io" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  Sui Documentation
                </a>
                <a href="https://move-book.com" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                  The Move Book
                </a>
                <a href="https://github.com/MystenLabs/sui" target="_blank" rel="noopener noreferrer" className="forum-sidebar-link">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                  Sui GitHub
                </a>
              </div>
            </div>

            {/* Guidelines */}
            <div className="forum-sidebar-card">
              <div className="forum-sidebar-rules-title">Guidelines</div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">1</span>
                <span>Be respectful and constructive</span>
              </div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">2</span>
                <span>Keep discussions on-topic</span>
              </div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">3</span>
                <span>No spam or scams</span>
              </div>
              <div className="forum-sidebar-rule">
                <span className="forum-sidebar-rule-num">4</span>
                <span>Share code and help others</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
