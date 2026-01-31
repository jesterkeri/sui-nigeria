export interface Job {
    id: string;
    title: string;
    company: string;
    logo: string;
    location: string;
    type: 'Full-time' | 'Contract' | 'Freelance';
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

const types: ('Full-time' | 'Contract' | 'Freelance')[] = ['Full-time', 'Contract', 'Freelance'];
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
    '$40k - $60k', '$50k - $80k', '$60k - $90k', '$70k - $100k', '$80k - $120k', '$90k - $140k',
    '$100k - $150k', '$120k - $180k', '$140k - $220k', '$150k - $250k', '$180k - $300k', '$200k - $350k',
    '$1.5k - $3k /mo', '$2k - $4k /mo', '$3k - $6k /mo', '$4k - $8k /mo',
    '$50 - $80 /hr', '$80 - $120 /hr', '$100 - $150 /hr', '$120 - $200 /hr',
    '$3k - $10k /project', '$5k - $15k /project', '$10k - $30k /project'
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
    types: ['Full-time', 'Contract', 'Freelance', 'Internship'],
    levels: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead', 'Executive'],
    categories: [
        'Video Editing',
        'Animation',
        'Software Development',
        'Product Design',
        'Ghost Writing',
        'Graphics Design',
        'Smart Contract Auditor',
        'Sui-Move Dev',
        'Product Manager',
        'Social Media Manager',
        'NFT Specialist',
        'Community Manager',
        'Quant/Tokenomics Expert',
        'Cyber Security',
        'AI/ML',
    ],
    salary: ['$0 - $50k', '$50k - $100k', '$100k - $150k', '$150k+', 'Hourly'],
};
