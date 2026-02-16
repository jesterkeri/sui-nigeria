'use client';

import { useState } from 'react';
import type { CommentTreeNode, ForumComment } from '@/lib/forum-types';
import { MAX_COMMENT_DEPTH } from '@/lib/forum-types';
import { VoteButtons } from './VoteButtons';
import { AddressChip } from './AddressChip';
import { TimeAgo } from './TimeAgo';
import { ReplyForm } from './ReplyForm';

interface CommentItemProps {
  comment: CommentTreeNode;
  postId: string;
  userVotes: Record<string, number>;
  onVote: (targetId: string, value: number) => void;
  walletAddress: string | undefined;
  onReply: (comment: ForumComment) => void;
}

export function CommentItem({
  comment,
  postId,
  userVotes,
  onVote,
  walletAddress,
  onReply,
}: CommentItemProps) {
  const [replying, setReplying] = useState(false);
  const canReply = comment.depth < MAX_COMMENT_DEPTH && !!walletAddress;

  return (
    <div>
      <div className="forum-comment">
        <VoteButtons
          score={comment.vote_score}
          userVote={userVotes[comment.id] || 0}
          onVote={(v) => onVote(comment.id, v)}
          disabled={!walletAddress}
        />
        <div className="forum-comment-content">
          <div className="forum-comment-header">
            <AddressChip address={comment.author_address} size="sm" />
            <span className="forum-middot">&middot;</span>
            <TimeAgo date={comment.created_at} />
          </div>
          <p className="forum-comment-body">{comment.body}</p>
          <div className="forum-comment-actions">
            {canReply && (
              <button
                type="button"
                className="forum-reply-btn"
                onClick={() => setReplying(!replying)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                Reply
              </button>
            )}
            <button type="button" className="forum-reply-btn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>
          {replying && walletAddress && (
            <ReplyForm
              postId={postId}
              parentId={comment.id}
              depth={comment.depth + 1}
              authorAddress={walletAddress}
              onClose={() => setReplying(false)}
              onSubmit={onReply}
            />
          )}
        </div>
      </div>
      {comment.children.length > 0 && (
        <div className="forum-comment-children">
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              postId={postId}
              userVotes={userVotes}
              onVote={onVote}
              walletAddress={walletAddress}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
