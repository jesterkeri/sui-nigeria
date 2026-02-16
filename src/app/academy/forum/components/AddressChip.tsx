'use client';

// Generate a deterministic color from wallet address
function addressToColor(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    '#EAFF7E', '#97F0E5', '#b8b4f8', '#E4CDFB', '#60a5fa',
    '#fbbf24', '#f472b6', '#34d399', '#f87171', '#a78bfa',
    '#fb923c', '#38bdf8', '#4ade80', '#e879f9', '#facc15',
  ];
  return colors[Math.abs(hash) % colors.length];
}

function addressToInitials(address: string): string {
  if (address.length >= 4) {
    return address.slice(2, 4).toUpperCase();
  }
  return '??';
}

// Mock user profiles — SuiNS names + avatars (using existing project images)
export const MOCK_PROFILES: Record<string, { name?: string; avatar?: string }> = {
  '0xaa11bb22cc33...dd44ee55': { name: 'movedev.sui', avatar: '/images/community/bg-1.png' },
  '0xab12cd34ef56...78901234': { name: 'artisan.sui', avatar: '/images/community/bg-2.png' },
  '0xde4f5a6b7c8d...9e0f1a2b': { name: 'walrusfan.sui', avatar: '/images/community/bg-3.png' },
  '0x1234abcd5678...ef901234': { name: 'lagosbuilder.sui', avatar: '/images/community/bg-4.png' },
  '0x9a8b7c6d5e4f...3a2b1c0d': { name: 'deepbookbot.sui', avatar: '/images/community/bg-5.png' },
  '0x7a16ff827013...3f063afb': { name: 'jesterkeri.sui', avatar: '/images/community/bg-6.png' },
  '0x3e8f1c2d4a5b...6e7f8901': { name: 'suimaxi.sui', avatar: '/images/community/bg-7.png' },
  '0x7a16ff8270133f063af...b3d9e': { name: 'cryptonaut.sui', avatar: '/images/blog/blog-1.png' },
  '0x3e8f1c2d4a5b6e7f8...9c0d1': { name: 'defiking.sui', avatar: '/images/blog/blog-2.png' },
  '0x5f6a7b8c9d0e...1f2a3b4c': { avatar: '/images/blog/blog-3.png' },
  '0xf0e1d2c3b4a5...96877453': { name: 'sealwatcher.sui', avatar: '/images/community/bg-1.png' },
  '0x5566778899aa...bbccddee': { avatar: '/images/community/bg-5.png' },
  '0xffeeddccbbaa...99887766': { name: 'gasoptimizer.sui' },
  '0x1a2b3c4d5e6f...7a8b9c0d': { avatar: '/images/community/bg-3.png' },
};

export function getProfile(address: string) {
  return MOCK_PROFILES[address];
}

interface AddressChipProps {
  address: string;
  showAvatar?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function AddressChip({ address, showAvatar = true, size = 'md' }: AddressChipProps) {
  const profile = MOCK_PROFILES[address];
  const displayName = profile?.name
    ?? (address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address);

  const color = addressToColor(address);
  const initials = addressToInitials(address);
  const sizeClass = size === 'md' ? '' : size;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      {showAvatar && (
        profile?.avatar ? (
          <img
            src={profile.avatar}
            alt=""
            className={`forum-avatar ${sizeClass}`}
            style={{ background: color }}
          />
        ) : (
          <span
            className={`forum-avatar ${sizeClass}`}
            style={{ background: color }}
          >
            {initials}
          </span>
        )
      )}
      <span className="forum-address">{displayName}</span>
    </span>
  );
}
