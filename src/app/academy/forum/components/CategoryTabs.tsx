'use client';

import { FORUM_CATEGORIES, type ForumCategory } from '@/lib/forum-types';

interface CategoryTabsProps {
  active: ForumCategory | 'all';
  onChange: (cat: ForumCategory | 'all') => void;
}

export function CategoryTabs({ active, onChange }: CategoryTabsProps) {
  return (
    <div className="forum-categories">
      <button
        type="button"
        className={`forum-category-tab ${active === 'all' ? 'active' : ''}`}
        onClick={() => onChange('all')}
      >
        All
      </button>
      {FORUM_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          type="button"
          className={`forum-category-tab ${active === cat.value ? 'active' : ''}`}
          onClick={() => onChange(cat.value)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
