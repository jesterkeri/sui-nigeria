'use client';

import { useMemo } from 'react';
import type { ForumComment, CommentTreeNode } from '@/lib/forum-types';
import { CommentItem } from './CommentItem';

interface CommentThreadProps {
  comments: ForumComment[];
  postId: string;
  userVotes: Record<string, number>;
  onVote: (targetId: string, value: number) => void;
  walletAddress: string | undefined;
  onReply: (comment: ForumComment) => void;
}

function buildTree(comments: ForumComment[]): CommentTreeNode[] {
  const map = new Map<string, CommentTreeNode>();
  const roots: CommentTreeNode[] = [];

  for (const c of comments) {
    map.set(c.id, { ...c, children: [] });
  }

  for (const c of comments) {
    const node = map.get(c.id)!;
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}

export function CommentThread({
  comments,
  postId,
  userVotes,
  onVote,
  walletAddress,
  onReply,
}: CommentThreadProps) {
  const tree = useMemo(() => buildTree(comments), [comments]);

  if (tree.length === 0) {
    return (
      <p className="forum-empty-text">
        No comments yet. Be the first to reply!
      </p>
    );
  }

  return (
    <div>
      {tree.map((node) => (
        <CommentItem
          key={node.id}
          comment={node}
          postId={postId}
          userVotes={userVotes}
          onVote={onVote}
          walletAddress={walletAddress}
          onReply={onReply}
        />
      ))}
    </div>
  );
}
