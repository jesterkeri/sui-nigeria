'use client';

import type { SortMode } from '@/lib/forum-types';

interface SortSelectProps {
  active: SortMode;
  onChange: (sort: SortMode) => void;
}

const SORT_OPTIONS: { value: SortMode; label: string; icon: React.ReactNode }[] = [
  {
    value: 'hot',
    label: 'Hot',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2c1 4-2 7-2 10a4 4 0 1 0 8 0c0-3-3-6-2-10" />
        <path d="M12 22a4 4 0 0 1-4-4c0-2 1-3 2-4" />
      </svg>
    ),
  },
  {
    value: 'new',
    label: 'New',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    value: 'top',
    label: 'Top',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="20" x2="12" y2="10" />
        <polyline points="18 14 12 8 6 14" />
        <line x1="4" y1="4" x2="20" y2="4" />
      </svg>
    ),
  },
];

export function SortSelect({ active, onChange }: SortSelectProps) {
  return (
    <div className="forum-sort-bar">
      {SORT_OPTIONS.map((opt, i) => (
        <div key={opt.value} style={{ display: 'contents' }}>
          {i > 0 && <div className="forum-sort-divider" />}
          <button
            type="button"
            className={`forum-sort-btn ${active === opt.value ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.icon}
            {opt.label}
          </button>
        </div>
      ))}
    </div>
  );
}
