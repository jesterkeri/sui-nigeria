'use client';

import Link from 'next/link';
import type { ForumPost } from '@/lib/forum-types';
import { VoteButtons } from './VoteButtons';
import { AddressChip } from './AddressChip';
import { TimeAgo } from './TimeAgo';

interface ForumPostCardProps {
  post: ForumPost;
  userVote: number;
  onVote: (value: number) => void;
  walletConnected: boolean;
}

export function ForumPostCard({ post, userVote, onVote, walletConnected }: ForumPostCardProps) {
  return (
    <div className="forum-post-card">
      <VoteButtons
        score={post.vote_score}
        userVote={userVote}
        onVote={onVote}
        disabled={!walletConnected}
      />
      <div className="forum-post-card-body">
        <Link href={`/academy/forum/${post.id}`} className="forum-post-card-content">
          <div className="forum-post-card-header">
            <span className={`forum-badge ${post.category}`}>
              <span className="forum-badge-text">{post.category}</span>
            </span>
            <span className="forum-middot">&middot;</span>
            <span>Posted by</span>
            <AddressChip address={post.author_address} size="sm" />
            <TimeAgo date={post.created_at} />
          </div>

          <h3 className="forum-post-card-title">{post.title}</h3>
          <p className="forum-post-card-preview">{post.body}</p>
        </Link>

        {/* Media thumbnails */}
        {post.media && post.media.length > 0 && (
          <div className="forum-post-media">
            {post.media.slice(0, 4).map((item) => (
              <div key={item.id} className="forum-post-media-item">
                {item.type === 'image' ? (
                  <img src={item.url} alt={item.name} />
                ) : (
                  <>
                    <video src={item.url} muted />
                    <div className="forum-media-play-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </>
                )}
              </div>
            ))}
            {post.media.length > 4 && (
              <div className="forum-post-media-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--forum-border-subtle)', fontSize: '0.75rem', color: 'var(--forum-text-muted)' }}>
                +{post.media.length - 4}
              </div>
            )}
          </div>
        )}

        {/* Action bar */}
        <div className="forum-post-actions">
          <Link href={`/academy/forum/${post.id}`} className="forum-action-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{post.comment_count} Comment{post.comment_count !== 1 ? 's' : ''}</span>
          </Link>

          <button type="button" className="forum-action-btn" onClick={(e) => e.stopPropagation()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            <span>Share</span>
          </button>

          <button type="button" className="forum-action-btn" onClick={(e) => e.stopPropagation()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
}
