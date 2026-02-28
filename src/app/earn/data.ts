export type OpportunityType = 'Bounty' | 'Hackathon' | 'Grant';
export type OpportunityStatus = 'Open' | 'In Review' | 'Completed' | 'Expired';
export type SkillCategory = 'Content' | 'Design' | 'Development' | 'Marketing' | 'Community' | 'Research' | 'Security' | 'Data';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Opportunity {
    id: string;
    title: string;
    organization: string;
    orgLogo: string;
    veteran?: boolean;
    type: OpportunityType;
    status: OpportunityStatus;
    description: string;
    prize: string;
    prizeValue: number;
    deadline: string;
    postedAt: string;
    skills: string[];
    categories: SkillCategory[];
    difficulty: DifficultyLevel;
    applicants: number;
    featured?: boolean;
}

const titles = [
    'Build a Sui Move Tutorial Series', 'Design a DeFi Dashboard UI Kit', 'Create Educational Content for Sui',
    'Develop an NFT Marketplace Smart Contract', 'Write a Security Audit Report Template', 'Build a Sui Wallet Integration',
    'Design Sui Brand Guidelines', 'Create a Move Language Cheat Sheet', 'Develop a Token Launchpad on Sui',
    'Write Technical Documentation for Sui SDK', 'Build a Cross-Chain Bridge Interface', 'Create Community Onboarding Guide',
    'Develop a DAO Governance Module', 'Design a Sui Explorer Redesign', 'Build a Decentralized Identity Solution',
    'Create a DeFi Yield Aggregator', 'Write a Sui Network Performance Report', 'Build a Social-Fi Application',
    'Design a Gamified Learning Platform', 'Develop a Real-Time Analytics Dashboard', 'Create a Move Package Registry',
    'Build a Prediction Market on Sui', 'Design a Multi-Sig Wallet Interface', 'Develop a Sui Indexer Service',
    'Create Content Strategy for Sui Nigeria', 'Build a Decentralized Exchange Module', 'Write Sui Move Best Practices Guide',
    'Develop a Staking Rewards Calculator', 'Design a Sui Ecosystem Map', 'Build an Escrow Smart Contract',
    'Create a Community Growth Playbook', 'Develop a Liquidity Pool Monitor', 'Design a Token Vesting Dashboard',
    'Build a Sui Move Testing Framework', 'Write a Sui Governance Proposal', 'Develop a NFT Fractionalization Module',
    'Create a Sui Developer Bootcamp Curriculum', 'Build a Decentralized Lending Protocol', 'Design a Sui Mobile Wallet',
    'Develop a Flash Loan Module', 'Create Sui Ecosystem Research Report', 'Build a DAO Treasury Management Tool',
];

const organizations = [
    'Sui Foundation', 'Mysten Labs', 'Cetus Protocol', 'NAVI Protocol', 'Scallop',
    'Turbos Finance', 'Aftermath Finance', 'Bucket Protocol', 'Bluefin', 'Typus Finance',
    'Kriya DEX', 'SuiNS', 'Clutchy', 'Suiet Wallet', 'MovEx',
    'Sui Nigeria', 'DeepBook', 'FlowX Finance', 'OtterSec', 'Pyth Network',
];

const logos = [
    '/images/partners/sui-logo.svg', '/images/partners/cetus.svg', '/images/partners/flowxfinance.svg',
    '/images/partners/deepbook.svg', '/images/logos/sui-ng-logo.png',
];

const types: OpportunityType[] = ['Bounty', 'Hackathon', 'Grant'];
const statuses: OpportunityStatus[] = ['Open', 'Open', 'Open', 'In Review'];
const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];

const skillGroups = [
    ['Rust', 'Move', 'Smart Contracts'], ['React', 'TypeScript', 'Web3'], ['Figma', 'UI/UX', 'Design System'],
    ['Content Writing', 'Documentation', 'Technical Writing'], ['Marketing', 'Growth', 'Analytics'],
    ['Community', 'Social Media', 'Events'], ['Security', 'Auditing', 'Penetration Testing'],
    ['Python', 'Data Analysis', 'Research'], ['Solidity', 'EVM', 'Cross-Chain'], ['Node.js', 'GraphQL', 'API'],
    ['Move', 'DeFi', 'Tokenomics'], ['Video Production', 'Motion Design', 'Editing'],
    ['DevOps', 'Infrastructure', 'Monitoring'], ['AI/ML', 'Automation', 'Data Science'],
    ['NFT', 'Digital Art', 'Creative'], ['Testing', 'QA', 'CI/CD'],
];

const categoryGroups: SkillCategory[][] = [
    ['Development', 'Security'], ['Development', 'Design'], ['Design', 'Content'],
    ['Content', 'Marketing'], ['Marketing', 'Community'], ['Community', 'Research'],
    ['Security', 'Development'], ['Data', 'Research'], ['Development', 'Data'],
    ['Content', 'Community'], ['Development', 'Research'], ['Design', 'Marketing'],
    ['Security', 'Data'], ['Community', 'Content'], ['Development', 'Community'],
    ['Research', 'Data'],
];

const descriptions = [
    'Contribute to the Sui ecosystem by building tools and resources for developers.',
    'Help grow the Sui community in Nigeria through educational content and outreach.',
    'Design and develop innovative DeFi solutions on the Sui blockchain.',
    'Create comprehensive documentation and tutorials for the Sui developer community.',
    'Build security tools and conduct audits for Sui Move smart contracts.',
    'Develop user-friendly interfaces for decentralized applications on Sui.',
    'Research and analyze the Sui ecosystem landscape and competitive positioning.',
    'Create marketing campaigns and growth strategies for Sui-based projects.',
    'Build data analytics tools and dashboards for Sui network metrics.',
    'Organize community events, hackathons, and educational workshops.',
];

const prizes = [
    '$50', '$100', '$150', '$200', '$250', '$300', '$500', '$750',
    '$1,000', '$1,500', '$2,000', '$2,500', '$3,000', '$5,000',
    '$7,500', '$10,000', '$15,000', '$20,000', '$25,000', '$50,000',
];

const prizeValues = [
    50, 100, 150, 200, 250, 300, 500, 750,
    1000, 1500, 2000, 2500, 3000, 5000,
    7500, 10000, 15000, 20000, 25000, 50000,
];

const deadlines = [
    '2026-03-01', '2026-03-05', '2026-03-10', '2026-03-15', '2026-03-20',
    '2026-03-25', '2026-04-01', '2026-04-10', '2026-04-15', '2026-04-30',
    '2026-05-01', '2026-05-15', '2026-06-01', '2026-02-25', '2026-02-28',
];

const postedTimes = [
    '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago', '8 hours ago', '12 hours ago',
    '1 day ago', '2 days ago', '3 days ago', '4 days ago', '5 days ago',
    '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago',
];

function generateOpportunities(count: number): Opportunity[] {
    const opportunities: Opportunity[] = [];

    for (let i = 1; i <= count; i++) {
        const isFeatured = i <= 6;
        const prizeIdx = i % prizes.length;

        opportunities.push({
            id: String(i),
            title: titles[i % titles.length],
            organization: organizations[i % organizations.length],
            orgLogo: logos[i % logos.length],
            type: types[i % types.length],
            status: statuses[i % statuses.length],
            description: descriptions[i % descriptions.length],
            prize: prizes[prizeIdx],
            prizeValue: prizeValues[prizeIdx],
            deadline: deadlines[i % deadlines.length],
            postedAt: postedTimes[i % postedTimes.length],
            skills: skillGroups[i % skillGroups.length],
            categories: categoryGroups[i % categoryGroups.length],
            difficulty: difficulties[i % difficulties.length],
            applicants: ((i * 7 + 13) % 120) + 3,
            ...(isFeatured && { featured: true }),
            ...(prizeValues[prizeIdx] >= 10000 && { veteran: true }),
        });
    }

    return opportunities;
}

export const OPPORTUNITIES: Opportunity[] = generateOpportunities(120);

export const FILTERS = {
    skillCategories: ['Content', 'Design', 'Development', 'Marketing', 'Community', 'Research', 'Security', 'Data'] as SkillCategory[],
    prizeRanges: [
        { label: 'Under $100', min: 0, max: 100 },
        { label: '$100 - $500', min: 100, max: 500 },
        { label: '$500 - $2,000', min: 500, max: 2000 },
        { label: '$2,000 - $10,000', min: 2000, max: 10000 },
        { label: '$10,000+', min: 10000, max: Infinity },
    ],
    statuses: ['Open', 'In Review'] as OpportunityStatus[],
    difficulties: ['Beginner', 'Intermediate', 'Advanced'] as DifficultyLevel[],
};
