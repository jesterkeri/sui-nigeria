export interface Game {
  id: string;
  title: string;
  studio: string;
  genre: string;
  description: string;
  image: string;
  video?: string;
  cardVideo?: string;
  url?: string;
  rating: number;
  players: string;
  status: 'Live' | 'Beta' | 'Coming Soon';
  featured?: boolean;
  suiplay?: boolean;
  tags: string[];
  chain: string;
}

export interface Competition {
  id: string;
  title: string;
  game: string;
  prizePool: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: 'Registration' | 'Live' | 'Upcoming' | 'Ended';
  image: string;
}

export interface LiveStream {
  id: string;
  title: string;
  streamer: string;
  game: string;
  viewers: number;
  thumbnail: string;
  isLive: boolean;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  game: string;
  type: 'Tournament' | 'Update' | 'Launch' | 'AMA' | 'Community' | 'Airdrop';
  date: string;
  time: string;
  image: string;
  link?: string;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  avatar: string;
  game: string;
  stat: string;
  change: 'up' | 'down' | 'same';
}

export interface PlayerSpotlight {
  id: string;
  username: string;
  avatar: string;
  title: string;
  achievement: string;
  game: string;
}

export interface CommunityActivity {
  id: string;
  type: 'win' | 'register' | 'rank' | 'milestone' | 'stream';
  text: string;
  timestamp: string;
}

export interface SuiPlayFeature {
  id: string;
  title: string;
  description: string;
  url: string;
  buttonLabel: string;
}

export type GameCategory = 'All' | 'RPG' | 'Strategy' | 'Card Games' | 'Racing' | 'Adventure' | 'Puzzle' | 'Battle Royale';

export const CATEGORIES: GameCategory[] = [
  'All', 'RPG', 'Strategy', 'Card Games', 'Racing', 'Adventure', 'Puzzle', 'Battle Royale'
];

export const GAMES: Game[] = [
  {
    id: 'doubleup',
    title: 'DoubleUp',
    studio: 'DoubleUp',
    genre: 'Card Games',
    description: 'The ultimate on-chain casino and gaming platform on Sui. Play, wager, and win with provably fair games powered by smart contracts.',
    image: '/images/games/doubleup.jpg',
    video: '/videos/doubleup-showcase.mp4',
    url: 'https://doubleup.io',
    rating: 4.8,
    players: '18.5K playing',
    status: 'Live',
    featured: true,
    suiplay: true,
    tags: ['Casino', 'Provably Fair', 'Sui Native'],
    chain: 'Sui',
  },
  {
    id: 'xociety',
    title: 'XOCIETY',
    studio: 'XOCIETY',
    genre: 'Battle Royale',
    description: 'No Free Lunch. A stylish anime-inspired third-person shooter on Sui with high-stakes PvP, collectible characters, and on-chain rewards.',
    image: '/images/games/xociety.jpg',
    url: 'https://xociety.io',
    rating: 4.7,
    players: '11.3K playing',
    status: 'Live',
    featured: true,
    suiplay: true,
    tags: ['Shooter', 'Anime', 'PvP', 'Sui Native'],
    chain: 'Sui',
  },
  {
    id: 'superb-io',
    title: 'Superb.io',
    studio: 'Superb Studios',
    genre: 'Adventure',
    description: 'A visually stunning on-chain gaming experience on Sui. Explore, collect, and compete in a beautifully crafted world.',
    image: '/images/games/xociety-s2.jpg',
    video: '/videos/superb-showcase.mp4',
    rating: 4.7,
    players: '10.2K playing',
    status: 'Live',
    featured: true,
    tags: ['On-Chain', 'Showcase', 'Sui Native'],
    chain: 'Sui',
  },
  {
    id: 'darktimes',
    title: 'DARKTIMES',
    studio: 'Blowfish Studios x Animoca Brands',
    genre: 'Battle Royale',
    description: 'A free-to-play Nordic-inspired medieval Brawler Royale. Fight to survive with physics-based combat, blood-magic, and high-stakes PvP.',
    image: '/images/games/eve-frontier.jpg',
    video: '/videos/darktimes-trailer.mp4',
    rating: 4.9,
    players: '15.8K playing',
    status: 'Live',
    featured: true,
    suiplay: true,
    tags: ['Brawler Royale', 'Medieval', 'Free-to-Play', 'NFT'],
    chain: 'Sui',
  },
  {
    id: 'suicraft',
    title: 'SuiCraft Online',
    studio: 'MoveForge Studios',
    genre: 'RPG',
    description: 'Build, explore, and conquer in this massive open-world RPG powered by Sui. Own every item, trade freely, and forge your legend.',
    image: '/images/games/suicraft.jpg',
    rating: 4.8,
    players: '12.4K playing',
    status: 'Live',
    featured: true,
    tags: ['Open World', 'NFT', 'PvP'],
    chain: 'Sui',
  },
  {
    id: 'onefightarena',
    title: 'OneFightArena',
    studio: 'Notre Game x Animoca Brands',
    genre: 'Battle Royale',
    description: 'A warrior\'s journey begins in the mind. MMA fighting game powered by Sui featuring ONE Championship fighters.',
    image: '/images/games/onefightarena.jpg',
    url: 'https://onefightarena.com',
    rating: 4.6,
    players: '8.7K playing',
    status: 'Live',
    featured: true,
    tags: ['Fighting', 'MMA', 'Competitive'],
    chain: 'Sui',
  },
  {
    id: 'sui-racers',
    title: 'Sui Racers',
    studio: 'Velocity Labs',
    genre: 'Racing',
    description: 'High-octane racing with on-chain vehicle NFTs. Customize, upgrade, and race for SUI tokens.',
    image: '/images/games/panzerdogs.jpg',
    rating: 4.3,
    players: '3.2K playing',
    status: 'Live',
    featured: false,
    tags: ['Arcade', 'Multiplayer', 'Play-to-Earn'],
    chain: 'Sui',
  },
  {
    id: 'somnis',
    title: 'Somnis: Rumble Rush',
    studio: 'Overtake',
    genre: 'RPG',
    description: 'Fast-paced rumble action RPG on Sui. Collect heroes, battle in real-time, and compete in seasonal events.',
    image: '/images/games/somnis.jpg',
    rating: 4.5,
    players: '5.1K playing',
    status: 'Live',
    featured: true,
    tags: ['Action RPG', 'Collectible', 'PvP'],
    chain: 'Sui',
  },
  {
    id: 'chain-cards',
    title: 'ChainCards',
    studio: 'Deck Protocol',
    genre: 'Card Games',
    description: 'Strategic card battles with fully on-chain mechanics. Build your deck, challenge opponents, climb the ranks.',
    image: '/images/games/chain-cards.jpg',
    rating: 4.7,
    players: '6.8K playing',
    status: 'Live',
    featured: false,
    tags: ['TCG', 'Competitive', 'Deck Builder'],
    chain: 'Sui',
  },
  {
    id: 'puzzle-quest-sui',
    title: 'Puzzle Quest: Sui',
    studio: 'Logic Chain Games',
    genre: 'Puzzle',
    description: 'Solve intricate puzzles to earn rewards. Daily challenges, leaderboards, and seasonal events.',
    image: '/images/games/doubleup.jpg',
    rating: 4.2,
    players: '2.9K playing',
    status: 'Live',
    featured: false,
    tags: ['Casual', 'Daily Rewards', 'Brain Teaser'],
    chain: 'Sui',
  },
  {
    id: 'sui-tactics',
    title: 'Sui Tactics',
    studio: 'Strategos Interactive',
    genre: 'Strategy',
    description: 'Command armies in turn-based tactical warfare. Every unit is an NFT with unique stats and abilities.',
    image: '/images/games/lineup.jpg',
    rating: 4.4,
    players: '4.3K playing',
    status: 'Live',
    featured: false,
    tags: ['Turn-Based', 'Military', 'NFT Units'],
    chain: 'Sui',
  },
  {
    id: 'shadow-warriors',
    title: 'Shadow Warriors',
    studio: 'Phantom Interactive',
    genre: 'Battle Royale',
    description: 'Ninja-themed battle royale with stealth mechanics. Earn rare skins and weapons through gameplay.',
    image: '/images/games/somnis.jpg',
    rating: 4.1,
    players: '3.8K playing',
    status: 'Beta',
    featured: false,
    tags: ['Stealth', 'Action', 'PvP'],
    chain: 'Sui',
  },
  {
    id: 'eve-frontier',
    title: 'EVE Frontier',
    studio: 'CCP Games',
    genre: 'Strategy',
    description: 'The next evolution of EVE Online. Build, trade, and fight in a persistent blockchain-powered universe on Sui.',
    image: '/images/games/eve-frontier.jpg',
    rating: 4.6,
    players: '3.8K playing',
    status: 'Beta',
    featured: false,
    tags: ['Sci-Fi', 'Space', 'Sandbox'],
    chain: 'Sui',
  },
  {
    id: 'arcane-legends',
    title: 'Arcane Legends: Sui',
    studio: 'Mythic Studios',
    genre: 'RPG',
    description: 'Classic ARPG reborn on-chain. Loot, level up, and trade in a persistent world.',
    image: '/images/games/chain-cards.jpg',
    rating: 4.6,
    players: '7.2K playing',
    status: 'Live',
    featured: false,
    tags: ['ARPG', 'Loot', 'Co-op'],
    chain: 'Sui',
  },
  {
    id: 'sui-poker',
    title: 'Sui Poker',
    studio: 'Royal Flush Labs',
    genre: 'Card Games',
    description: 'Texas Hold\'em on the blockchain. Verifiably fair dealing with on-chain SUI pot prizes.',
    image: '/images/games/onefightarena.jpg',
    rating: 4.3,
    players: '4.5K playing',
    status: 'Live',
    featured: false,
    tags: ['Poker', 'Gambling', 'Social'],
    chain: 'Sui',
  },
  {
    id: 'block-breaker',
    title: 'Block Breaker',
    studio: 'Pixel Chain Co',
    genre: 'Puzzle',
    description: 'Break blocks, earn tokens. Simple but addictive puzzle game with daily tournaments.',
    image: '/images/games/suicraft.jpg',
    rating: 3.9,
    players: '2.1K playing',
    status: 'Live',
    featured: false,
    tags: ['Casual', 'Tournament', 'Quick Play'],
    chain: 'Sui',
  },
  {
    id: 'empire-of-moves',
    title: 'Empire of Moves',
    studio: 'Dominion Games',
    genre: 'Strategy',
    description: 'Build your empire from scratch. Manage resources, diplomacy, and warfare in this 4X strategy game.',
    image: '/images/games/xociety.jpg',
    rating: 4.5,
    players: '3.6K playing',
    status: 'Live',
    featured: false,
    tags: ['4X', 'Empire Builder', 'Diplomacy'],
    chain: 'Sui',
  },
  {
    id: 'neon-riders',
    title: 'Neon Riders',
    studio: 'Cyberpunk Labs',
    genre: 'Racing',
    description: 'Cyberpunk motorcycle racing through neon-lit cities. Bet and race for SUI.',
    image: '/images/games/eve-frontier.jpg',
    rating: 4.2,
    players: '2.7K playing',
    status: 'Live',
    featured: false,
    tags: ['Cyberpunk', 'Motorcycles', 'Betting'],
    chain: 'Sui',
  },
  {
    id: 'cryptoquest',
    title: 'CryptoQuest',
    studio: 'Quest Forge',
    genre: 'Adventure',
    description: 'Story-driven adventure where your choices are recorded on-chain. Multiple endings, real consequences.',
    image: '/images/games/panzerdogs.jpg',
    rating: 4.4,
    players: '3.9K playing',
    status: 'Live',
    featured: false,
    tags: ['Story', 'Choice-Based', 'On-Chain'],
    chain: 'Sui',
  },
  {
    id: 'sui-duels',
    title: 'Sui Duels',
    studio: 'Clash Protocol',
    genre: 'Card Games',
    description: '1v1 card dueling with anime-inspired art. Collect, trade, and battle.',
    image: '/images/games/xociety-s2.jpg',
    rating: 4.1,
    players: '2.3K playing',
    status: 'Beta',
    featured: false,
    tags: ['Anime', '1v1', 'Collectible'],
    chain: 'Sui',
  },
  {
    id: 'starfall-strategy',
    title: 'Starfall Strategy',
    studio: 'Cosmos Interactive',
    genre: 'Strategy',
    description: 'Interstellar strategy game. Colonize planets, build fleets, dominate the galaxy.',
    image: '/images/games/doubleup.jpg',
    rating: 4.3,
    players: '2.8K playing',
    status: 'Coming Soon',
    featured: false,
    tags: ['Space', 'RTS', 'Colonization'],
    chain: 'Sui',
  },
  {
    id: 'phantom-chase',
    title: 'Phantom Chase',
    studio: 'Specter Games',
    genre: 'Adventure',
    description: 'Parkour-style adventure through haunted blockchain dungeons. Speedrun for leaderboard glory.',
    image: '/images/games/lineup.jpg',
    rating: 4.0,
    players: '1.5K playing',
    status: 'Beta',
    featured: false,
    tags: ['Parkour', 'Speedrun', 'Horror'],
    chain: 'Sui',
  },
  {
    id: 'mind-grid',
    title: 'Mind Grid',
    studio: 'Neural Play',
    genre: 'Puzzle',
    description: 'AI-generated puzzles that adapt to your skill level. Compete in weekly brain battles.',
    image: '/images/games/somnis.jpg',
    rating: 4.1,
    players: '1.9K playing',
    status: 'Coming Soon',
    featured: false,
    tags: ['AI', 'Adaptive', 'Competition'],
    chain: 'Sui',
  },
  {
    id: 'panzerdogs',
    title: 'Panzerdogs',
    studio: 'Lucky Kat',
    genre: 'Battle Royale',
    description: 'Tank-battling NFT game on Sui. Customize your tank, battle other players, and earn rewards in this action-packed PvP arena.',
    image: '/images/games/panzerdogs.jpg',
    video: '/videos/panzerdogs-trailer.mp4',
    cardVideo: '/videos/game-hover-preview.mp4',
    rating: 4.7,
    players: '9.1K playing',
    status: 'Live',
    featured: true,
    suiplay: true,
    tags: ['Mech', 'Sci-Fi', 'Competitive'],
    chain: 'Sui',
  },
  {
    id: 'lineup',
    title: 'Lineup',
    studio: 'Lineup Games',
    genre: 'Strategy',
    description: 'Striker League and Gold Striker modes. Anime-styled football strategy game on Sui with competitive leagues and collectible players.',
    image: '/images/games/lineup.jpg',
    rating: 4.4,
    players: '4.2K playing',
    status: 'Live',
    featured: false,
    tags: ['Football', 'Anime', 'Competitive'],
    chain: 'Sui',
  },
];

export const COMPETITIONS: Competition[] = [
  {
    id: 'comp-1',
    title: 'OneFightArena World Championship',
    game: 'OneFightArena',
    prizePool: '50,000 SUI',
    startDate: '2026-03-01',
    endDate: '2026-03-15',
    participants: 892,
    maxParticipants: 1024,
    status: 'Registration',
    image: '/images/games/onefightarena.jpg',
  },
  {
    id: 'comp-2',
    title: 'SuiCraft Guild Wars Season 4',
    game: 'SuiCraft Online',
    prizePool: '30,000 SUI',
    startDate: '2026-02-20',
    endDate: '2026-03-20',
    participants: 512,
    maxParticipants: 512,
    status: 'Live',
    image: '/images/games/suicraft.jpg',
  },
  {
    id: 'comp-3',
    title: 'ChainCards Pro League',
    game: 'ChainCards',
    prizePool: '20,000 SUI',
    startDate: '2026-02-15',
    endDate: '2026-03-01',
    participants: 256,
    maxParticipants: 256,
    status: 'Live',
    image: '/images/games/chain-cards.jpg',
  },
  {
    id: 'comp-4',
    title: 'XOCIETY Grand Prix',
    game: 'XOCIETY',
    prizePool: '15,000 SUI',
    startDate: '2026-03-10',
    endDate: '2026-03-12',
    participants: 340,
    maxParticipants: 500,
    status: 'Upcoming',
    image: '/images/games/xociety-s2.jpg',
  },
  {
    id: 'comp-5',
    title: 'Panzerdogs Invitational',
    game: 'Panzerdogs',
    prizePool: '75,000 SUI',
    startDate: '2026-03-20',
    endDate: '2026-03-25',
    participants: 64,
    maxParticipants: 128,
    status: 'Registration',
    image: '/images/games/panzerdogs.jpg',
  },
  {
    id: 'comp-6',
    title: 'Somnis Weekly Showdown',
    game: 'Somnis: Rumble Rush',
    prizePool: '5,000 SUI',
    startDate: '2026-02-21',
    endDate: '2026-02-22',
    participants: 180,
    maxParticipants: 200,
    status: 'Live',
    image: '/images/games/somnis.jpg',
  },
  {
    id: 'comp-7',
    title: 'EVE Frontier Conquest',
    game: 'EVE Frontier',
    prizePool: '25,000 SUI',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
    participants: 0,
    maxParticipants: 1000,
    status: 'Upcoming',
    image: '/images/games/eve-frontier.jpg',
  },
  {
    id: 'comp-8',
    title: 'DoubleUp High Stakes',
    game: 'DoubleUp',
    prizePool: '100,000 SUI',
    startDate: '2026-02-10',
    endDate: '2026-02-20',
    participants: 64,
    maxParticipants: 64,
    status: 'Ended',
    image: '/images/games/doubleup.jpg',
  },
];

export const STREAMS: LiveStream[] = [
  {
    id: 'stream-1',
    title: 'Guild Wars S4 - Final Push!',
    streamer: 'CryptoGamer_NG',
    game: 'SuiCraft Online',
    viewers: 2847,
    thumbnail: '#0f0a1e',
    isLive: true,
  },
  {
    id: 'stream-2',
    title: 'Pro League Semi-Finals',
    streamer: 'DeckMaster',
    game: 'ChainCards',
    viewers: 1523,
    thumbnail: '#1a1408',
    isLive: true,
  },
  {
    id: 'stream-3',
    title: 'Panzerdogs Ranked Grind',
    streamer: 'MechPilot99',
    game: 'Panzerdogs',
    viewers: 3211,
    thumbnail: '#1a0c06',
    isLive: true,
  },
  {
    id: 'stream-4',
    title: 'Move Arena Tournament Practice',
    streamer: 'FragHunter',
    game: 'Move Arena',
    viewers: 987,
    thumbnail: '#1a0a14',
    isLive: true,
  },
  {
    id: 'stream-5',
    title: 'Chill Puzzle Session',
    streamer: 'BrainWave',
    game: 'Puzzle Quest: Sui',
    viewers: 412,
    thumbnail: '#0a1018',
    isLive: true,
  },
  {
    id: 'stream-6',
    title: 'Neon Riders Speed Run Attempts',
    streamer: 'NeonKing',
    game: 'Neon Riders',
    viewers: 756,
    thumbnail: '#1a0608',
    isLive: true,
  },
];

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'event-1',
    title: 'DARKTIMES Alpha Launch Party',
    description: 'Join the official launch celebration with exclusive in-game drops and $TIMES token airdrop for participants.',
    game: 'DARKTIMES',
    type: 'Launch',
    date: '2026-03-05',
    time: '18:00 UTC',
    image: '#1a0a0a',
  },
  {
    id: 'event-2',
    title: 'SuiCraft Developer AMA',
    description: 'Live Q&A with MoveForge Studios devs about Season 5 roadmap, new regions, and crafting overhaul.',
    game: 'SuiCraft Online',
    type: 'AMA',
    date: '2026-02-28',
    time: '15:00 UTC',
    image: '#0f0a1e',
  },
  {
    id: 'event-3',
    title: 'Panzerdogs Mech Airdrop',
    description: 'Limited edition Genesis Mech NFTs airdrop for all active players. Claim your unique mech before they\'re gone.',
    game: 'Panzerdogs',
    type: 'Airdrop',
    date: '2026-03-01',
    time: '12:00 UTC',
    image: '#1a0c06',
  },
  {
    id: 'event-4',
    title: 'Sui Gaming Community Meetup',
    description: 'Monthly community gathering featuring game demos, developer showcases, and networking for Sui gamers in Nigeria.',
    game: 'Multiple Games',
    type: 'Community',
    date: '2026-03-08',
    time: '16:00 WAT',
    image: '#0a1420',
  },
  {
    id: 'event-5',
    title: 'ChainCards v2.0 Major Update',
    description: 'Massive update dropping with 50 new cards, Guild Battles mode, and revamped ranked system.',
    game: 'ChainCards',
    type: 'Update',
    date: '2026-03-12',
    time: '10:00 UTC',
    image: '#1a1408',
  },
  {
    id: 'event-6',
    title: 'Move Arena Invitational Tournament',
    description: 'Top 64 ranked players compete for a 25,000 SUI prize pool. Spectate live with in-game rewards.',
    game: 'Move Arena',
    type: 'Tournament',
    date: '2026-03-15',
    time: '14:00 UTC',
    image: '#1a0a14',
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { id: 'lb-1', rank: 1, username: 'CryptoGamer_NG', avatar: '#f59e0b', game: 'SuiCraft Online', stat: '47 wins', change: 'same' },
  { id: 'lb-2', rank: 2, username: 'FragHunter', avatar: '#ef4444', game: 'Move Arena', stat: '42 wins', change: 'up' },
  { id: 'lb-3', rank: 3, username: 'DeckMaster', avatar: '#8b5cf6', game: 'ChainCards', stat: '39 wins', change: 'up' },
  { id: 'lb-4', rank: 4, username: 'MechPilot99', avatar: '#00f0ff', game: 'Panzerdogs', stat: '36 wins', change: 'down' },
  { id: 'lb-5', rank: 5, username: 'NeonKing', avatar: '#22c55e', game: 'Neon Riders', stat: '34 wins', change: 'up' },
  { id: 'lb-6', rank: 6, username: 'BrainWave', avatar: '#ec4899', game: 'Puzzle Quest: Sui', stat: '31 wins', change: 'same' },
  { id: 'lb-7', rank: 7, username: 'SuiSamurai', avatar: '#3b82f6', game: 'DARKTIMES', stat: '29 wins', change: 'down' },
  { id: 'lb-8', rank: 8, username: 'OnyxBlade', avatar: '#f97316', game: 'XOCIETY', stat: '27 wins', change: 'up' },
  { id: 'lb-9', rank: 9, username: 'PixelQueen', avatar: '#a855f7', game: 'DoubleUp', stat: '25 wins', change: 'same' },
  { id: 'lb-10', rank: 10, username: 'ChainBreaker', avatar: '#14b8a6', game: 'Sui Tactics', stat: '23 wins', change: 'down' },
];

export const SPOTLIGHTS: PlayerSpotlight[] = [
  {
    id: 'spot-1',
    username: 'CryptoGamer_NG',
    avatar: '#f59e0b',
    title: 'Top SuiCraft Player',
    achievement: 'First player to reach Level 100 in Guild Wars Season 4. Earned 12,000 SUI in tournament winnings this month.',
    game: 'SuiCraft Online',
  },
  {
    id: 'spot-2',
    username: 'FragHunter',
    avatar: '#ef4444',
    title: 'Move Arena Champion',
    achievement: 'Undefeated in 28 consecutive ranked matches. Qualified for the World Championship with the highest seed.',
    game: 'Move Arena',
  },
  {
    id: 'spot-3',
    username: 'DeckMaster',
    avatar: '#8b5cf6',
    title: 'ChainCards Legend',
    achievement: 'Built the #1 ranked deck in Pro League history. Won 3 consecutive weekly tournaments.',
    game: 'ChainCards',
  },
];

export const COMMUNITY_FEED: CommunityActivity[] = [
  { id: 'feed-1', type: 'win', text: 'CryptoGamer_NG won the SuiCraft Guild Wars S4 qualifier', timestamp: '2h ago' },
  { id: 'feed-2', type: 'register', text: 'FragHunter registered for Move Arena Championship', timestamp: '3h ago' },
  { id: 'feed-3', type: 'milestone', text: 'Panzerdogs crossed 10,000 active players', timestamp: '5h ago' },
  { id: 'feed-4', type: 'rank', text: 'DeckMaster reached #1 on ChainCards Pro League', timestamp: '6h ago' },
  { id: 'feed-5', type: 'stream', text: 'MechPilot99 started streaming Panzerdogs ranked', timestamp: '8h ago' },
  { id: 'feed-6', type: 'win', text: 'NeonKing set a new speed record on Neon Riders', timestamp: '12h ago' },
];

export const SUIPLAY_FEATURES: SuiPlayFeature[] = [
  {
    id: 'sp-1',
    title: 'SuiPlay Portal',
    description: 'Discover and play Sui games with zkLogin authentication and seamless NFT portability across titles.',
    url: 'https://suiplay.sui.io',
    buttonLabel: 'Explore Portal',
  },
  {
    id: 'sp-2',
    title: 'SuiPlay0X1',
    description: '$599 handheld gaming console powered by AMD Ryzen 7 with a 7" display — built for Web3 gaming.',
    url: 'https://suiplay.sui.io',
    buttonLabel: 'Learn More',
  },
];

export const SUIPLAY_PARTNERS: string[] = [
  'Team Liquid',
  'Animoca Brands',
  'Sega',
  'SNK',
];
