export interface Job {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: 'Full-time' | 'Internship' | 'Contract' | 'Gig';
    level: 'Entry' | 'Mid' | 'Senior' | 'Lead';
    salary: string;
    tags: string[];
    postedAt: string;
    featured?: boolean;
}

const titles = [
    'Senior Rust Developer', 'Smart Contract Engineer', 'Community Manager', 'Frontend Developer (Next.js)',
    'Product Designer', 'Developer Relations Engineer', 'Marketing Specialist', 'Security Auditor',
    'Backend Engineer', 'Technical Writer', 'Full Stack Developer', 'NFT Artist', 'Protocol Engineer',
    'Growth Lead', 'QA Engineer', 'Data Analyst', 'Mobile Developer', 'Tokenomics Designer',
    'Blockchain Developer', 'DevOps Engineer', 'UI/UX Designer', 'Content Strategist', 'Research Analyst',
    'Project Manager', 'Social Media Manager', 'Video Editor', 'Motion Designer', 'Smart Contract Auditor',
    'DeFi Specialist', 'Web3 Developer', 'Solidity Developer', 'Move Developer', 'Infrastructure Engineer',
    'Solutions Architect', 'Product Manager', 'Business Development Manager', 'Partnerships Lead',
    'Head of Engineering', 'CTO', 'VP of Product', 'AI/ML Engineer', 'Data Scientist', 'Analytics Engineer'
];

const companies = [
    'Mysten Labs', 'Cetus Protocol', 'Scallop', 'Bluefin', 'Sui Foundation', 'Typus Finance',
    'OtterSec', 'Aftermath Finance', 'Turbos Finance', 'Clutchy', 'NAVI Protocol', 'Bucket Protocol',
    'Suiet Wallet', 'Kriya DEX', 'MovEx', 'SuiNS', 'Pyth Network', 'Wormhole', 'LayerZero',
    'Circle', 'Coinbase', 'Binance Labs', 'a]16z Crypto', 'Paradigm', 'Jump Crypto'
];

const logos = [
    '/images/partners/sui-logo.svg', '/images/partners/cetus.svg', '/images/partners/flowxfinance.svg',
    '/images/partners/deepbook.svg', '/images/logos/sui-ng-logo.png'
];

const locations = [
    'Remote', 'Remote (US/EU)', 'Remote (Global)', 'Lagos, Nigeria', 'London, UK', 'Singapore',
    'San Francisco, CA', 'New York, NY', 'Berlin, Germany', 'Dubai, UAE', 'Tokyo, Japan',
    'Hong Kong', 'Austin, TX', 'Miami, FL', 'Lisbon, Portugal', 'Amsterdam, Netherlands'
];

const types: ('Full-time' | 'Internship' | 'Contract' | 'Gig')[] = ['Full-time', 'Internship', 'Contract', 'Gig'];
const levels: ('Entry' | 'Mid' | 'Senior' | 'Lead')[] = ['Entry', 'Mid', 'Senior', 'Lead'];

const tagGroups = [
    ['Rust', 'Blockchain', 'Sui'], ['Move', 'DeFi', 'Smart Contracts'], ['Community', 'Social Media', 'Marketing'],
    ['React', 'TypeScript', 'Web3'], ['UI/UX', 'Figma', 'Design System'], ['DevRel', 'Content', 'Community'],
    ['Marketing', 'Growth', 'Analytics'], ['Security', 'Auditing', 'Rust'], ['Python', 'Data', 'Analytics'],
    ['Node.js', 'GraphQL', 'API'], ['Solidity', 'EVM', 'DeFi'], ['NFT', 'Creative', 'Design'],
    ['Testing', 'Automation', 'Web3'], ['Mobile', 'React Native', 'iOS'], ['DevOps', 'AWS', 'Kubernetes'],
    ['AI/ML', 'Python', 'TensorFlow'], ['Video', 'Motion', 'After Effects'], ['Writing', 'Documentation', 'Technical']
];

const salaries = [
    '$800 - $1.5k', '$1k - $2k', '$1.2k - $2.5k', '$1.5k - $3k', '$2k - $3.5k', '$2.5k - $4k',
    '$3k - $5k', '$3.5k - $6k', '$4k - $7k', '$5k - $8k',
    '$500 - $1k /mo', '$800 - $1.5k /mo', '$1k - $2k /mo', '$1.5k - $3k /mo',
    '$15 - $25 /hr', '$20 - $35 /hr', '$30 - $50 /hr', '$40 - $70 /hr',
    '$500 - $2k /project', '$1k - $3k /project', '$2k - $5k /project'
];

const postedTimes = [
    '1 hour ago', '2 hours ago', '3 hours ago', '5 hours ago', '6 hours ago', '8 hours ago', '12 hours ago',
    '1 day ago', '2 days ago', '3 days ago', '4 days ago', '5 days ago', '6 days ago',
    '1 week ago', '2 weeks ago', '3 weeks ago', '1 month ago'
];

function generateJobs(count: number): Job[] {
    const jobs: Job[] = [];

    for (let i = 1; i <= count; i++) {
        const isFeatured = i <= 8;
        const title = titles[i % titles.length];
        const company = companies[i % companies.length];
        const logo = logos[i % logos.length];
        const location = locations[i % locations.length];
        const type = types[i % types.length];
        const level = levels[i % levels.length];
        const tags = tagGroups[i % tagGroups.length];
        const salary = salaries[i % salaries.length];
        const postedAt = postedTimes[i % postedTimes.length];

        jobs.push({
            id: String(i),
            title,
            company,
            logo,
            location,
            type,
            level,
            salary,
            tags,
            postedAt,
            ...(isFeatured && { featured: true })
        });
    }

    return jobs;
}

export const JOBS: Job[] = generateJobs(200);

export const FILTERS = {
    types: ['Full-time', 'Internship', 'Contract', 'Gig'],
    levels: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'],
    categories: [
        'Software Development',
        'Product Design',
        'Smart Contract Auditor',
        'Sui-Move Dev',
        'DeFi Developer',
        'DAO Specialist',
        'GameFi/Web3 Gaming',
        'Wallet/Infra Engineer',
        'DevRel/Developer Advocate',
        'Blockchain Researcher',
        'Growth/BD Manager',
        'Product Manager',
        'Community Manager',
        'Social Media Manager',
        'Graphics Design',
        'Video Editing',
        'Animation',
        'Ghost Writing',
        'NFT Specialist',
        'Quant/Tokenomics Expert',
        'Cyber Security',
        'AI/ML',
    ],
    salary: ['Per Project', 'Per Month', 'Per Hour'],
};
