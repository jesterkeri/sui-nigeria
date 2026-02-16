'use client';

interface VoteButtonsProps {
  score: number;
  userVote: number; // -1, 0, or 1
  onVote: (value: number) => void;
  disabled?: boolean;
}

export function VoteButtons({ score, userVote, onVote, disabled }: VoteButtonsProps) {
  const scoreClass = userVote === 1 ? 'upvoted' : userVote === -1 ? 'downvoted' : '';

  return (
    <div className="forum-votes">
      <button
        type="button"
        className={`forum-vote-btn ${userVote === 1 ? 'upvoted' : ''}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote(1); }}
        disabled={disabled}
        aria-label="Upvote"
      >
        {userVote === 1 ? (
          // Filled up arrow
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
        ) : (
          // Outline up arrow
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5l-7 7h4v7h6v-7h4z" />
          </svg>
        )}
      </button>
      <span className={`forum-vote-score ${scoreClass}`}>{score}</span>
      <button
        type="button"
        className={`forum-vote-btn down-hover ${userVote === -1 ? 'downvoted' : ''}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onVote(-1); }}
        disabled={disabled}
        aria-label="Downvote"
      >
        {userVote === -1 ? (
          // Filled down arrow
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="none">
            <path d="M12 20l8-8h-5V4H9v8H4z" />
          </svg>
        ) : (
          // Outline down arrow
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19l7-7h-4V5H9v7H5z" />
          </svg>
        )}
      </button>
    </div>
  );
}
