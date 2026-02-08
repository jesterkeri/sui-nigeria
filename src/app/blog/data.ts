export interface BlogPost {
    id: number;
    slug: string;
    category: string;
    type: string;
    title: string;
    description: string;
    content: string;
    date: string;
    readTime: string;
    image: string;
    author: string;
}

const basePosts: Omit<BlogPost, 'id' | 'slug'>[] = [
    {
        category: 'Builders',
        type: 'Announcement',
        title: 'Sui Nigeria Builder Competition Launches with $100K Prize Pool',
        description: 'The first builder competition of its kind in West Africa, attracting upcoming talent to build on the Sui Network. Developers, designers, and creators across Nigeria are invited to participate and showcase innovative solutions powered by Sui blockchain technology. With mentorship from industry leaders and substantial rewards, this competition aims to grow the next generation of Web3 builders in the region.',
        content: `The Sui Nigeria Builder Competition is officially live, and we're inviting developers, designers, and creators from across Nigeria to showcase their skills and build innovative solutions on the Sui blockchain.

With a $100,000 prize pool — the largest of its kind in West Africa — this competition aims to accelerate adoption of the Sui ecosystem while empowering the next generation of Web3 builders in the region.

![Builders collaborating at a Sui Nigeria hackathon event](/images/blog/hero-1.png)

## Why This Matters

Nigeria has one of the fastest-growing developer communities in Africa. By bringing the Sui ecosystem directly to Nigerian builders, we're creating opportunities for talented individuals to contribute to a cutting-edge blockchain platform while earning recognition and rewards.

## What You'll Build

Participants can build in any of the following tracks:

- **DeFi**: Decentralized exchanges, lending protocols, yield aggregators
- **Gaming**: On-chain games, NFT gaming assets, play-to-earn mechanics
- **Infrastructure**: Developer tools, SDKs, indexers, and analytics platforms
- **Social**: Decentralized social platforms, identity solutions, community tools

![Sui builder competition tracks overview](/images/community/bg-5.png)

## Timeline

- **Registration**: January 29 – February 15, 2026
- **Building Phase**: February 16 – March 30, 2026
- **Demo Day**: April 5, 2026
- **Winners Announced**: April 10, 2026

## Prizes

- 1st Place: $40,000 USDC
- 2nd Place: $25,000 USDC
- 3rd Place: $15,000 USDC
- Track Winners: $5,000 USDC each

## Mentorship & Support

All participants will have access to dedicated mentors from the Sui ecosystem, weekly office hours, technical documentation, and a private Discord channel for collaboration and support.

![Mentorship session with Sui ecosystem leaders](/images/community/bg-7.png)

Whether you're a seasoned blockchain developer or just getting started with Move, this competition is your chance to make an impact. Register today and start building the future of Web3 in Nigeria.`,
        date: 'Jan 29, 2026',
        readTime: '3 Min Read',
        image: '/images/community/bg-1.png',
        author: 'Sui Nigeria',
    },
    {
        category: 'Community',
        type: 'Update',
        title: 'Sui Basecamp 2025: Global Builders Converge in Paris',
        description: 'Join us for the second annual global conference for the Sui ecosystem, happening in Paris this spring.',
        content: `Sui Basecamp 2025 is set to be the largest gathering of Sui ecosystem builders, developers, and enthusiasts to date. Taking place in Paris this spring, the event will bring together the global community for three days of talks, workshops, and networking.

![The Sui Basecamp 2025 main stage in Paris](/images/blog/hero-2.png)

## What to Expect

Basecamp is more than a conference — it's a convergence point for the people building the future of decentralized technology on Sui. This year's agenda includes:

- **Keynotes** from Mysten Labs co-founders and ecosystem leaders
- **Technical workshops** on Move programming, object-centric design, and DeFi protocols
- **Builder showcases** featuring the most innovative projects in the Sui ecosystem
- **Networking events** connecting developers, investors, and community organizers

## The Nigerian Delegation

Sui Nigeria is proud to send a delegation of 20 builders to represent the Nigerian community at Basecamp. These builders were selected through our community ambassador program and include developers, designers, and community leaders who have made significant contributions to the ecosystem.

![The Sui Nigeria delegation at Basecamp](/images/community/bg-2.png)

## Key Sessions

- "The Future of Object-Centric Programming" — Technical deep dive
- "DeFi on Sui: From Zero to TVL" — Panel discussion
- "Building Global Communities" — Community track featuring Sui Nigeria
- "Move Security Best Practices" — Workshop for smart contract developers

## How to Attend

Early bird registration is now open. Community members can apply for sponsored tickets through the Sui Nigeria ambassador program. Stay tuned to our channels for more details.

Paris awaits. Let's build together.`,
        date: 'Mar 15, 2025',
        readTime: '4 Min Read',
        image: '/images/community/bg-2.png',
        author: 'Sui Nigeria',
    },
    {
        category: 'Ecosystem',
        type: 'Technical',
        title: 'DeepBook V3 Launches with Enhanced Liquidity Features',
        description: 'The next generation of the central limit order book (CLOB) on Sui brings new features for DeFi protocols.',
        content: `DeepBook V3 has officially launched on the Sui mainnet, introducing a suite of new features designed to enhance liquidity and trading efficiency across the ecosystem.

As the native central limit order book (CLOB) for Sui, DeepBook serves as the foundational infrastructure for decentralized trading. V3 represents a significant upgrade in both performance and functionality.

![DeepBook V3 architecture and liquidity flow](/images/blog/hero-3.png)

## What's New in V3

### Enhanced Matching Engine
The new matching engine processes orders up to 10x faster than V2, leveraging Sui's parallel execution model to handle thousands of orders per second without congestion.

### Self-Custodial Pools
V3 introduces self-custodial liquidity pools that allow market makers to retain full control of their assets while providing liquidity. This eliminates the need for trusted intermediaries and reduces counterparty risk.

### Flash Loans
For the first time, DeepBook supports flash loans — enabling developers to borrow assets within a single transaction for arbitrage, liquidations, and other DeFi strategies.

![DeepBook V3 trading interface preview](/images/community/bg-3.png)

### Improved Price Oracle
The new price oracle system aggregates data across multiple trading pairs and time windows, providing more accurate and manipulation-resistant price feeds for DeFi protocols.

## Impact on the Ecosystem

DeepBook V3 is already being integrated by several major DeFi protocols on Sui:

- **Cetus**: Using DeepBook V3 for concentrated liquidity positions
- **Turbos Finance**: Leveraging the new matching engine for their DEX
- **Scallop**: Integrating the price oracle for lending protocol valuations

## For Developers

DeepBook V3's SDK has been completely rewritten with a focus on developer experience. The new API is simpler, better documented, and includes TypeScript bindings for frontend integration.

Check out the documentation at docs.deepbook.tech to get started.`,
        date: 'Feb 28, 2025',
        readTime: '5 Min Read',
        image: '/images/community/bg-3.png',
        author: 'Sui Nigeria',
    },
    {
        category: 'Development',
        type: 'Guide',
        title: 'Move Registry Improves Developer Experience on Sui',
        description: 'Announcing the Move Registry (MVR): Radical interoperability and a better developer experience.',
        content: `The Move Registry (MVR) is now live, bringing a new level of interoperability and developer convenience to the Sui ecosystem.

MVR is a decentralized package registry that allows developers to discover, share, and reuse Move modules across the Sui network. Think of it as npm for Move — but built on-chain with verifiable provenance.

![Move Registry dashboard showing available packages](/images/blog/blog-1.png)

## The Problem

Before MVR, Sui developers had to manually copy Move modules between projects, maintain their own dependency management, and hope that the modules they were using hadn't been modified. This led to code duplication, version conflicts, and a fragmented developer experience.

## How MVR Works

### Publishing
Developers can publish their Move modules to the registry with a single command:

\`\`\`bash
sui mvr publish --name my-module --version 1.0.0
\`\`\`

Each published module is verified on-chain, ensuring that the source code matches the deployed bytecode.

### Discovery
The MVR website and CLI provide search functionality, allowing developers to find modules by name, category, or functionality. Each listing includes documentation, usage examples, and audit status.

![Developer using the MVR CLI to search and install modules](/images/community/bg-4.png)

### Dependency Management
Projects can declare dependencies in their Move.toml file, and the MVR CLI will automatically resolve and download the correct versions.

## Security

All modules in MVR go through an automated security analysis that checks for common vulnerabilities and anti-patterns. Modules that pass the security check receive a "verified" badge.

## Getting Started

1. Install the MVR CLI: \`cargo install mvr-cli\`
2. Browse available modules: \`mvr search defi\`
3. Add a dependency: \`mvr add @sui/coin-flip@1.2.0\`

The Move Registry represents a major step forward for the Sui developer ecosystem. We're excited to see what the community builds with it.`,
        date: 'Apr 3, 2025',
        readTime: '6 Min Read',
        image: '/images/community/bg-4.png',
        author: 'Sui Nigeria',
    },
    {
        category: 'Gaming',
        type: 'Announcement',
        title: 'New Gaming SDK Released for Sui Developers',
        description: 'Build immersive gaming experiences with our new SDK designed specifically for blockchain gaming.',
        content: `We're excited to announce the release of the Sui Gaming SDK — a comprehensive toolkit for building on-chain games and gaming experiences on the Sui blockchain.

The SDK is designed to lower the barrier to entry for game developers who want to leverage blockchain technology without becoming blockchain experts.

![Sui Gaming SDK demo showcasing on-chain game assets](/images/blog/blog-2.png)

## Features

### Asset Management
The SDK provides a high-level API for creating, transferring, and managing in-game assets as Sui objects. Whether you're building an RPG with equipable items or a card game with tradeable cards, the asset management module handles the complexity.

### Player Profiles
Built-in player profile management with on-chain reputation, achievement tracking, and social features. Players own their profiles as Sui objects that persist across games.

### Matchmaking
A decentralized matchmaking system that pairs players based on skill level, preferences, and game mode. The system uses on-chain randomness for fair matching.

![In-game marketplace powered by Sui blockchain](/images/community/bg-6.png)

### Marketplace Integration
Pre-built marketplace components that allow players to buy, sell, and trade in-game assets. The marketplace supports both fixed-price listings and auctions.

## Unity & Unreal Plugins

The SDK ships with plugins for both Unity and Unreal Engine, allowing game developers to integrate Sui blockchain functionality directly into their game engines of choice.

## Sample Games

We've published three sample games to help developers get started:

1. **SuiQuest**: A turn-based RPG with on-chain combat and loot
2. **Chain Racers**: A multiplayer racing game with NFT vehicles
3. **Move Chess**: A chess game with on-chain game state and ELO ratings

![Sample games built with the Sui Gaming SDK](/images/blog/blog-3.png)

## Getting Started

The SDK is available on GitHub and npm. Check out our documentation at gaming.sui.io for tutorials, API reference, and sample code.

Game on.`,
        date: 'Jan 20, 2026',
        readTime: '3 Min Read',
        image: '/images/community/bg-5.png',
        author: 'Sui Nigeria',
    },
    {
        category: 'DeFi',
        type: 'Update',
        title: 'Sui DeFi TVL Reaches New All-Time High',
        description: 'Total Value Locked in Sui DeFi protocols surpasses previous records as adoption accelerates.',
        content: `The Sui DeFi ecosystem has reached a new milestone — Total Value Locked (TVL) across all protocols has surpassed $2 billion for the first time, marking a significant moment for the blockchain's growth.

![Sui DeFi ecosystem growth chart showing TVL milestones](/images/blog/hero-4.jpeg)

## By the Numbers

- **Total TVL**: $2.1 billion
- **Number of DeFi protocols**: 47
- **Daily active users**: 150,000+
- **Daily transaction volume**: $340 million

## Top Protocols by TVL

1. **Cetus Protocol**: $580M — Concentrated liquidity DEX
2. **Scallop Lend**: $420M — Lending and borrowing
3. **Turbos Finance**: $310M — Perpetual DEX
4. **NAVI Protocol**: $280M — Money market
5. **Bucket Protocol**: $190M — Stablecoin and lending

![Top DeFi protocols on Sui by total value locked](/images/community/bg-1.png)

## What's Driving Growth

Several factors have contributed to the surge in TVL:

### Improved Infrastructure
The launch of DeepBook V3, better bridges, and faster finality have made Sui a more attractive platform for DeFi builders and users.

### Institutional Interest
Several institutional players have begun allocating capital to Sui DeFi protocols, attracted by the high throughput and low transaction costs.

### Community Growth
Communities like Sui Nigeria have been instrumental in driving adoption across emerging markets, bringing thousands of new users into the ecosystem.

### Move Language Advantages
The object-centric programming model of Move provides inherent security advantages for DeFi protocols, reducing the risk of exploits that plague other chains.

## Looking Ahead

The Sui DeFi ecosystem is still in its early stages. With new protocols launching weekly and existing protocols expanding their feature sets, the growth trajectory shows no signs of slowing down.

For builders interested in contributing to Sui DeFi, check out the Sui Developer Portal for resources, grants, and community support.`,
        date: 'Jan 15, 2026',
        readTime: '4 Min Read',
        image: '/images/community/bg-6.png',
        author: 'Sui Nigeria',
    },
];

function slugify(title: string): string {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const BLOG_POSTS: BlogPost[] = Array.from({ length: 300 }, (_, i) => {
    const base = basePosts[i % basePosts.length];
    return {
        ...base,
        id: i,
        slug: `${slugify(base.title)}-${i}`,
    };
});

export const HERO_SLIDES = [
    {
        category: 'Infrastructure',
        type: 'Technical',
        title: 'Building Composable, Agent-Ready Applications on Sui',
        description: 'Applications are shifting from isolated products to persistent, composable systems, and Sui\'s stack is designed to support that transition end to end.',
        date: 'Feb 4, 2026',
        readTime: '6 Min Read',
        image: '/images/blog/hero-1.png',
    },
    {
        category: 'Sui Ecosystem',
        type: 'Update',
        title: 'How Alkimi Powers Onchain Advertising with the Sui Stack',
        description: 'A deep dive into how a decentralized ad platform leverages Sui\'s complete stack to move a $750B industry onto the blockchain.',
        date: 'Feb 4, 2026',
        readTime: '5 Min Read',
        image: '/images/blog/hero-2.png',
    },
    {
        category: 'Infrastructure',
        type: 'Technical',
        title: 'Low-Latency Indexing on Sui with gRPC Streaming',
        description: 'Sui\'s indexing stack supports gRPC streaming as a first-class data source, enabling low-latency ingestion without sacrificing correctness or recoverability.',
        date: 'Feb 3, 2026',
        readTime: '7 Min Read',
        image: '/images/blog/hero-3.png',
    },
    {
        category: 'Infrastructure',
        type: 'Technical',
        title: 'Tidehunter: Re-Architecting Storage for Sustained Blockchain Throughput',
        description: 'Exploring the storage innovations necessary to maintain blockchain performance when operating at sustained, real-world scale.',
        date: 'Feb 2, 2026',
        readTime: '8 Min Read',
        image: '/images/blog/hero-4.jpeg',
    },
];

export const FILTER_CATEGORIES = [
    {
        name: 'Solutions',
        options: ['Gaming', 'DeFi', 'NFTs', 'Enterprise', 'Infrastructure'],
    },
    {
        name: 'Categories',
        options: ['Announcement', 'Update', 'Technical', 'Guide', 'Community'],
    },
    {
        name: 'Tags',
        options: ['Builders', 'Ecosystem', 'Development', 'Partnership'],
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find(p => p.slug === slug);
}

export function getPostById(id: number): BlogPost | undefined {
    return BLOG_POSTS.find(p => p.id === id);
}
