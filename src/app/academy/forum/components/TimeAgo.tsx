'use client';

export function TimeAgo({ date }: { date: string }) {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );

  let label: string;
  if (seconds < 60) label = 'just now';
  else if (seconds < 3600) label = `${Math.floor(seconds / 60)}m ago`;
  else if (seconds < 86400) label = `${Math.floor(seconds / 3600)}h ago`;
  else if (seconds < 2592000) label = `${Math.floor(seconds / 86400)}d ago`;
  else label = `${Math.floor(seconds / 2592000)}mo ago`;

  return <span className="forum-time">{label}</span>;
}
