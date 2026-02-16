'use client';

import { useState } from 'react';
import type { ForumComment } from '@/lib/forum-types';

interface ReplyFormProps {
  postId: string;
  parentId: string | null;
  depth: number;
  authorAddress: string;
  onClose: () => void;
  onSubmit: (comment: ForumComment) => void;
}

export function ReplyForm({ postId, parentId, depth, authorAddress, onClose, onSubmit }: ReplyFormProps) {
  const [body, setBody] = useState('');

  const canSubmit = body.trim().length >= 1 && body.trim().length <= 5000;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    const newComment: ForumComment = {
      id: `c-${Date.now()}`,
      post_id: postId,
      parent_id: parentId,
      body: body.trim(),
      author_address: authorAddress,
      vote_score: 1,
      depth,
      created_at: new Date().toISOString(),
    };

    onSubmit(newComment);
    setBody('');
    onClose();
  };

  return (
    <form className="forum-reply-form" onSubmit={handleSubmit}>
      <textarea
        className="forum-textarea"
        placeholder="Write a reply..."
        value={body}
        onChange={(e) => setBody(e.target.value)}
        maxLength={5000}
        autoFocus
      />
      <div className="forum-reply-form-actions">
        <button type="submit" className="forum-reply-submit" disabled={!canSubmit}>
          Reply
        </button>
        <button type="button" className="forum-reply-cancel" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
}
