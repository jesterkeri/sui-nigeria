export interface QuizQuestion {
	id: string
	question: string
	options: { id: string; text: string }[]
	correctId: string
	explanation: string
}

export interface Lesson {
	id: string
	title: string
	duration: string
	content: string
	quiz: QuizQuestion[]
}

export interface Module {
	id: string
	title: string
	lessons: Lesson[]
}

export interface Course {
	id: string
	title: string
	description: string
	difficulty: "Beginner" | "Intermediate" | "Advanced"
	icon: string
	tags: string[]
	path: string
	modules: Module[]
}

export interface LearningPath {
	id: string
	title: string
	description: string
	icon: string
	courseIds: string[]
}

// ============================================================
// Helper to generate placeholder lessons
// ============================================================
function makeLessons(courseId: string, titles: string[]): Lesson[] {
	return titles.map((t, i) => ({
		id: `${courseId}-l${i + 1}`,
		title: t,
		duration: `${5 + Math.floor(Math.random() * 10)} min`,
		content: "",
		quiz: [],
	}))
}

function makeModule(courseId: string, modId: string, modTitle: string, lessonTitles: string[]): Module {
	return {
		id: `${courseId}-${modId}`,
		title: modTitle,
		lessons: makeLessons(`${courseId}-${modId}`, lessonTitles),
	}
}

// ============================================================
// Learning Paths (15)
// ============================================================
export const learningPaths: LearningPath[] = [
	{
		id: "sui-fundamentals",
		title: "Sui Stack (S1): Core Foundation",
		description: "Understand the core architecture and economics of the Sui blockchain.",
		icon: "📘",
		courseIds: ["intro-to-sui", "sui-architecture", "sui-tokenomics"],
	},
	{
		id: "consensus",
		title: "Sui Consensus & Protocols",
		description: "Deep dive into Narwhal, Bullshark, Mysticeti, and the evolution of Sui's consensus mechanisms.",
		icon: "🔗",
		courseIds: ["sui-consensus", "narwhal-mempool", "bullshark-protocol", "mysticeti-deep-dive"],
	},
	{
		id: "move-programming",
		title: "Move Programming",
		description: "Learn the smart contract language powering Sui — from basics to advanced patterns.",
		icon: "💻",
		courseIds: ["move-basics", "sui-object-model", "move-packages", "advanced-move", "move-testing", "sui-framework-stdlib"],
	},
	{
		id: "dapp-development",
		title: "dApp Development",
		description: "Build full-stack decentralized applications with SDKs, wallets, and gasless UX.",
		icon: "🛠️",
		courseIds: ["dev-setup", "transactions-ptbs", "typescript-sdk", "rust-sdk", "frontend-integration", "sponsored-transactions", "zklogin", "gas-optimization"],
	},
	{
		id: "tokens-nfts",
		title: "Tokens, NFTs & Digital Assets",
		description: "Create and manage fungible tokens, NFTs, domains, and on-chain commerce.",
		icon: "🎨",
		courseIds: ["coin-standard", "closed-loop-tokens", "nfts-on-sui", "kiosk-framework", "suins"],
	},
	{
		id: "defi",
		title: "DeFi on Sui",
		description: "Understand decentralized finance primitives — order books, AMMs, bridges, and oracles.",
		icon: "📊",
		courseIds: ["defi-fundamentals", "building-dex", "liquid-staking", "perpetuals-derivatives", "sui-bridge"],
	},
	{
		id: "deepbook",
		title: "DeepBook: On-Chain Order Book",
		description: "Sui's native CLOB protocol — pool design, order types, DEEP tokenomics, governance, flash loans, the SDK, and the indexer.",
		icon: "📊",
		courseIds: ["deepbook-fundamentals", "deepbook-trading", "deepbook-governance", "deepbook-sdk", "deepbook-indexer"],
	},
	{
		id: "walrus-storage",
		title: "Walrus Decentralized Storage",
		description: "Store and serve data on Walrus — blobs, erasure coding, and decentralized websites.",
		icon: "🐘",
		courseIds: ["intro-walrus", "walrus-dev-guide", "walrus-sites", "walrus-tokenomics"],
	},
	{
		id: "seal-encryption",
		title: "Seal Encryption & Access Control",
		description: "Secure data with programmable encryption, threshold keys, and on-chain access policies.",
		icon: "🔐",
		courseIds: ["intro-seal", "seal-dev-guide", "access-control-policies", "seal-walrus-integration"],
	},
	{
		id: "gaming",
		title: "Gaming on Sui",
		description: "Build Web3 games with dynamic NFTs, on-chain randomness, and game economies.",
		icon: "🎮",
		courseIds: ["gaming-fundamentals", "dynamic-nfts", "onchain-randomness", "game-economy", "game-tooling"],
	},
	{
		id: "advanced-infra",
		title: "Advanced Sui Infrastructure",
		description: "Deep protocol knowledge — cryptography, off-chain compute, indexing, and node operations.",
		icon: "⚡",
		courseIds: ["sui-cryptography", "nautilus", "indexing-data", "running-infrastructure"],
	},
	{
		id: "sui-stack",
		title: "Sui Stack (S2) & Security",
		description: "The unified Sui developer platform, Enoki tools, formal verification, and smart contract security.",
		icon: "🧱",
		courseIds: ["sui-stack-overview", "enoki-platform", "move-prover", "smart-contract-security"],
	},
	{
		id: "ika-network",
		title: "IKA: Cross-Chain with dWallets",
		description: "Zero-trust multi-chain interoperability — 2PC-MPC cryptography, dWallets, DKG, presigning, the SDK, and Move integration.",
		icon: "🔗",
		courseIds: ["ika-fundamentals", "ika-cryptography", "ika-sdk", "ika-move-integration", "ika-use-cases"],
	},
	{
		id: "sui-stack-s3",
		title: "Sui Stack (S3): Full Integration",
		description: "Combine Move, Walrus, Seal, DeepBook, zkLogin, IKA, and Nautilus into full-stack applications.",
		icon: "🔧",
		courseIds: ["s3-walrus-seal", "s3-deepbook-move", "s3-zklogin-enoki", "s3-ika-nautilus", "s3-fullstack"],
	},
	{
		id: "projects",
		title: "Real-World Projects",
		description: "Build complete applications — NFT marketplaces, DeFi apps, decentralized websites, and on-chain games.",
		icon: "🚀",
		courseIds: ["build-nft-marketplace", "build-defi-app", "build-decentralized-app", "build-onchain-game"],
	},
]

// ============================================================
// Courses (71)
// ============================================================
export const courses: Course[] = [
	// ─── PATH 1: Sui Fundamentals ───────────────────────────
	{
		id: "intro-to-sui",
		title: "Introduction to Sui",
		description: "What is Sui, object-centric model vs account-based blockchains, parallel execution, sub-second finality, and the SUI token.",
		difficulty: "Beginner",
		icon: "📘",
		tags: ["Sui", "Blockchain", "Fundamentals"],
		path: "sui-fundamentals",
		modules: [
			makeModule("intro-to-sui", "m1", "What is Sui?", [
				"The Sui Vision",
				"Object-Centric vs Account-Based Models",
				"How Sui Differs from Ethereum & Aptos",
			]),
			makeModule("intro-to-sui", "m2", "Core Architecture", [
				"Parallel Transaction Execution",
				"Sub-Second Finality",
				"The SUI Token & Gas",
				"Networks: Mainnet, Testnet, Devnet",
				"Sui Ecosystem Overview",
			]),
		],
	},
	{
		id: "sui-architecture",
		title: "Sui Architecture Deep Dive",
		description: "Networks, storage model, epochs and reconfiguration, protocol upgrades, and how Sui scales horizontally.",
		difficulty: "Intermediate",
		icon: "🏗️",
		tags: ["Architecture", "Storage", "Epochs"],
		path: "sui-fundamentals",
		modules: [
			makeModule("sui-architecture", "m1", "Network Architecture", [
				"Full Nodes vs Validators",
				"State Sync & Checkpoints",
				"Storage Model & Object Versioning",
			]),
			makeModule("sui-architecture", "m2", "Epochs & Governance", [
				"Epoch Lifecycle",
				"Reconfiguration Process",
				"Protocol Upgrades",
				"Validator Set Management",
			]),
			makeModule("sui-architecture", "m3", "Scaling", [
				"Horizontal Scalability",
				"Fast Path vs Consensus Path",
				"Performance Benchmarks",
			]),
		],
	},
	{
		id: "sui-tokenomics",
		title: "Sui Tokenomics & Staking",
		description: "SUI token distribution, gas fee mechanics, staking and delegation, validator economics, and the storage fund.",
		difficulty: "Beginner",
		icon: "💰",
		tags: ["Tokenomics", "Staking", "Gas"],
		path: "sui-fundamentals",
		modules: [
			makeModule("sui-tokenomics", "m1", "SUI Token", [
				"Token Supply & Distribution",
				"Gas Fee Mechanics",
				"Reference Gas Price",
			]),
			makeModule("sui-tokenomics", "m2", "Staking & Rewards", [
				"Delegated Proof of Stake",
				"Staking & Unstaking",
				"Validator Economics & Commission",
			]),
		],
	},
	{
		id: "sui-consensus",
		title: "Consensus Fundamentals",
		description: "Byzantine fault tolerance, the two-path transaction model, and why Sui separates data availability from ordering.",
		difficulty: "Intermediate",
		icon: "🔗",
		tags: ["Consensus", "BFT", "Fundamentals"],
		path: "consensus",
		modules: [
			makeModule("sui-consensus", "m1", "Foundations", [
				"What is Byzantine Fault Tolerance?",
				"Why Blockchains Need Consensus",
				"Total Ordering vs Causal Ordering",
			]),
			makeModule("sui-consensus", "m2", "Sui's Two Paths", [
				"Fast Path: Byzantine Consistent Broadcast",
				"Consensus Path: Shared Object Ordering",
				"Separating Data Availability from Ordering",
				"Performance Implications",
			]),
		],
	},
	{
		id: "narwhal-mempool",
		title: "Narwhal: DAG-Based Mempool",
		description: "The high-throughput mempool protocol: DAG construction, certified blocks, primary-worker architecture, and 160K+ TPS.",
		difficulty: "Advanced",
		icon: "🐋",
		tags: ["Narwhal", "Mempool", "DAG"],
		path: "consensus",
		modules: [
			makeModule("narwhal-mempool", "m1", "Architecture", [
				"What is Narwhal?",
				"DAG Construction & Rounds",
				"Certified Blocks & 2f+1 Signatures",
				"Primary-Worker Architecture",
			]),
			makeModule("narwhal-mempool", "m2", "Data Availability", [
				"Reliable Transaction Dissemination",
				"Scaling with Multiple Workers",
				"160,000+ TPS Benchmarks",
			]),
		],
	},
	{
		id: "bullshark-protocol",
		title: "Bullshark & Tusk Consensus",
		description: "DAG-based ordering protocols: Tusk (asynchronous), Bullshark (partially synchronous), anchor-based commits, and zero-message overhead.",
		difficulty: "Advanced",
		icon: "🦈",
		tags: ["Bullshark", "Tusk", "DAG Ordering"],
		path: "consensus",
		modules: [
			makeModule("bullshark-protocol", "m1", "Tusk", [
				"Asynchronous Consensus",
				"Zero-Message Overhead",
				"Retroactive Anchor Commit",
			]),
			makeModule("bullshark-protocol", "m2", "Bullshark", [
				"Partially Synchronous Design",
				"Rotating Leader Mechanism",
				"4-5 Round Commit Latency",
				"Improvements Over Tusk",
			]),
		],
	},
	{
		id: "mysticeti-deep-dive",
		title: "Mysticeti: Next-Gen Consensus",
		description: "Uncertified DAGs, 3-round commit (theoretical minimum), Mysticeti v2 with 35% latency reduction, and unified validation.",
		difficulty: "Advanced",
		icon: "⚡",
		tags: ["Mysticeti", "Low Latency", "Consensus"],
		path: "consensus",
		modules: [
			makeModule("mysticeti-deep-dive", "m1", "Mysticeti v1", [
				"Uncertified DAG Innovation",
				"3-Round Commit (BFT Minimum)",
				"Parallel Block Proposals",
				"Implicit Commitment",
			]),
			makeModule("mysticeti-deep-dive", "m2", "Mysticeti v2", [
				"Unified Validation & Consensus",
				"Transaction Driver Architecture",
				"Batched Signatures in Consensus Blocks",
				"35% Latency Reduction",
				"Sub-Second Finality at Scale",
			]),
		],
	},

	// ─── PATH 2: Move Programming ───────────────────────────
	{
		id: "move-basics",
		title: "Move Language Basics",
		description: "Rust-like syntax, modules, functions, structs, abilities (key, store, copy, drop), init functions, and your first Move package.",
		difficulty: "Beginner",
		icon: "📝",
		tags: ["Move", "Language", "Basics"],
		path: "move-programming",
		modules: [
			makeModule("move-basics", "m1", "Language Fundamentals", [
				"Move Overview & Philosophy",
				"Modules & Package Structure",
				"Primitive Types & Variables",
				"Functions & Visibility",
			]),
			makeModule("move-basics", "m2", "Structs & Abilities", [
				"Defining Structs",
				"The Four Abilities: key, store, copy, drop",
				"References & Ownership",
				"Control Flow & Error Handling",
			]),
			makeModule("move-basics", "m3", "Getting Started", [
				"Your First Move Package",
				"The init Function",
				"Publishing to Devnet",
				"Move.toml Configuration",
			]),
		],
	},
	{
		id: "sui-object-model",
		title: "Sui Object Model",
		description: "UIDs, owned vs shared vs immutable objects, object wrapping, dynamic fields, nested ownership, and Transfer to Object.",
		difficulty: "Intermediate",
		icon: "📦",
		tags: ["Objects", "Ownership", "Dynamic Fields"],
		path: "move-programming",
		modules: [
			makeModule("sui-object-model", "m1", "Object Fundamentals", [
				"Everything is an Object",
				"Object IDs & Versioning",
				"Address-Owned Objects",
				"Shared Objects & Consensus",
			]),
			makeModule("sui-object-model", "m2", "Advanced Ownership", [
				"Immutable Objects",
				"Object Wrapping & Child Objects",
				"Dynamic Fields",
				"Dynamic Object Fields",
				"Tables, Bags & Collections",
				"Transfer to Object (Receiving)",
			]),
		],
	},
	{
		id: "move-packages",
		title: "Move Packages & Upgrades",
		description: "Publishing packages, immutability guarantees, upgrade policies (compatible, additive), versioning, and dependencies.",
		difficulty: "Intermediate",
		icon: "📦",
		tags: ["Packages", "Upgrades", "Versioning"],
		path: "move-programming",
		modules: [
			makeModule("move-packages", "m1", "Package Basics", [
				"What Are Move Packages?",
				"Publishing & Immutability",
				"Package Dependencies",
			]),
			makeModule("move-packages", "m2", "Upgrading Packages", [
				"UpgradeCap & Policies",
				"Compatible vs Additive Upgrades",
				"Custom Upgrade Policies",
			]),
		],
	},
	{
		id: "advanced-move",
		title: "Advanced Move Patterns",
		description: "Generics, witness pattern, one-time witness, capability pattern, hot potato, publisher object, and Move 2024 features.",
		difficulty: "Advanced",
		icon: "🧠",
		tags: ["Patterns", "Generics", "Advanced"],
		path: "move-programming",
		modules: [
			makeModule("advanced-move", "m1", "Type System", [
				"Generics & Phantom Types",
				"Type Abilities & Constraints",
				"Type Reflection",
			]),
			makeModule("advanced-move", "m2", "Design Patterns", [
				"Witness Pattern",
				"One-Time Witness (OTW)",
				"Capability Pattern",
				"Hot Potato Pattern",
				"Publisher Object",
			]),
			makeModule("advanced-move", "m3", "Move 2024 Edition", [
				"Enums & Pattern Matching",
				"Method Syntax & Macros",
			]),
		],
	},
	{
		id: "move-testing",
		title: "Move Testing & Debugging",
		description: "Unit tests, test_scenario for multi-transaction testing, expected failures, gas profiling, and debugging tools.",
		difficulty: "Intermediate",
		icon: "🧪",
		tags: ["Testing", "Debugging", "Quality"],
		path: "move-programming",
		modules: [
			makeModule("move-testing", "m1", "Testing", [
				"Unit Tests with #[test]",
				"Test Scenario Module",
				"Expected Failures",
			]),
			makeModule("move-testing", "m2", "Debugging & Profiling", [
				"std::debug & Logging",
				"Sentio Debugger",
				"Gas Profiling & Optimization",
			]),
		],
	},

	{
		id: "sui-framework-stdlib",
		title: "Sui Framework Standard Library",
		description: "Deep dive into the core framework modules every Move developer uses: sui::object, sui::transfer, sui::event, sui::clock, sui::table, sui::vec_map, and more.",
		difficulty: "Intermediate",
		icon: "📚",
		tags: ["Framework", "Standard Library", "Modules"],
		path: "move-programming",
		modules: [
			makeModule("sui-framework-stdlib", "m1", "Core Modules", [
				"sui::object — Object Creation & IDs",
				"sui::transfer — Ownership & Sharing",
				"sui::tx_context — Transaction Context",
				"sui::event — Emitting Events",
				"sui::clock — On-Chain Timestamps",
			]),
			makeModule("sui-framework-stdlib", "m2", "Collections & Utilities", [
				"sui::table — Key-Value Storage",
				"sui::vec_map — Ordered Maps",
				"sui::vec_set — Unique Sets",
				"sui::bag — Heterogeneous Collections",
				"sui::linked_table — Ordered Iteration",
			]),
			makeModule("sui-framework-stdlib", "m3", "Advanced Framework", [
				"sui::dynamic_field & sui::dynamic_object_field",
				"sui::package — Upgrade Utilities",
				"sui::display — Display Standard",
				"sui::coin & sui::balance — Token Internals",
				"sui::bcs — Binary Canonical Serialization",
			]),
		],
	},

	// ─── PATH 3: dApp Development ───────────────────────────
	{
		id: "dev-setup",
		title: "Sui Developer Setup",
		description: "Installing Sui CLI, configuring the client, creating your first address, getting testnet SUI, and deploying Hello World.",
		difficulty: "Beginner",
		icon: "⚙️",
		tags: ["Setup", "CLI", "Getting Started"],
		path: "dapp-development",
		modules: [
			makeModule("dev-setup", "m1", "Environment Setup", [
				"Installing the Sui CLI",
				"Configuring Your Client",
				"Creating a Sui Address",
				"Getting SUI from Faucet",
				"Hello World on Sui",
			]),
		],
	},
	{
		id: "transactions-ptbs",
		title: "Transactions & PTBs",
		description: "Transaction lifecycle, Programmable Transaction Blocks with up to 1024 operations, atomic execution, and gas smashing.",
		difficulty: "Intermediate",
		icon: "🔄",
		tags: ["Transactions", "PTBs", "Atomic"],
		path: "dapp-development",
		modules: [
			makeModule("transactions-ptbs", "m1", "Transaction Basics", [
				"Transaction Lifecycle",
				"Transaction Authentication & Signing",
				"Gas Budgets & Smashing",
			]),
			makeModule("transactions-ptbs", "m2", "Programmable Transaction Blocks", [
				"What Are PTBs?",
				"Composing Commands",
				"Passing Results Between Commands",
				"1024 Operations in One Transaction",
				"PTB vs Smart Contract Composition",
			]),
		],
	},
	{
		id: "typescript-sdk",
		title: "Sui TypeScript SDK",
		description: "Using @mysten/sui to build transactions, read objects, subscribe to events, and interact with the Sui network.",
		difficulty: "Intermediate",
		icon: "🟦",
		tags: ["TypeScript", "SDK", "API"],
		path: "dapp-development",
		modules: [
			makeModule("typescript-sdk", "m1", "SDK Basics", [
				"Installation & SuiClient",
				"Reading Objects & Balances",
				"Querying Events",
			]),
			makeModule("typescript-sdk", "m2", "Building Transactions", [
				"Transaction Class",
				"MoveCall, SplitCoins, TransferObjects",
				"Signing & Executing",
				"BCS Serialization",
				"Dry Run & Gas Estimation",
			]),
		],
	},
	{
		id: "rust-sdk",
		title: "Sui Rust SDK",
		description: "Build backend services, bots, and infrastructure using the official sui-sdk Rust crate — queries, transaction building, signing, and event subscriptions.",
		difficulty: "Intermediate",
		icon: "🦀",
		tags: ["Rust", "SDK", "Backend"],
		path: "dapp-development",
		modules: [
			makeModule("rust-sdk", "m1", "SDK Basics", [
				"Installing sui-sdk Crate",
				"SuiClientBuilder & Network Config",
				"Reading Objects & Balances",
				"Querying Events & Transactions",
			]),
			makeModule("rust-sdk", "m2", "Building Transactions", [
				"ProgrammableTransactionBuilder",
				"MoveCall, SplitCoins, TransferObjects",
				"Signing with Keystore",
				"Executing & Awaiting Finality",
			]),
			makeModule("rust-sdk", "m3", "Advanced Usage", [
				"Event Subscriptions (WebSocket)",
				"Custom Indexer Pipelines",
				"Bot & Automation Patterns",
				"Error Handling & Retries",
			]),
		],
	},
	{
		id: "frontend-integration",
		title: "Frontend Integration",
		description: "@mysten/create-dapp, dApp Kit React components, wallet connection, signing transactions, and building Sui-powered UIs.",
		difficulty: "Intermediate",
		icon: "🖥️",
		tags: ["React", "dApp Kit", "Frontend"],
		path: "dapp-development",
		modules: [
			makeModule("frontend-integration", "m1", "dApp Kit", [
				"Scaffolding with create-dapp",
				"SuiClientProvider & WalletProvider",
				"ConnectButton Component",
				"useCurrentAccount Hook",
			]),
			makeModule("frontend-integration", "m2", "Building UIs", [
				"useSuiClientQuery for Data",
				"useSignAndExecuteTransaction",
				"Displaying Objects & Balances",
				"Handling Transaction Results",
			]),
		],
	},
	{
		id: "sponsored-transactions",
		title: "Sponsored Transactions & Enoki",
		description: "Gas sponsorship, Enoki developer platform, gasless user experience, budget management, and onboarding patterns.",
		difficulty: "Intermediate",
		icon: "🎁",
		tags: ["Sponsored", "Enoki", "Gasless"],
		path: "dapp-development",
		modules: [
			makeModule("sponsored-transactions", "m1", "Gas Sponsorship", [
				"What Are Sponsored Transactions?",
				"Dual Signing Architecture",
				"Use Cases: Onboarding & Gasless UX",
			]),
			makeModule("sponsored-transactions", "m2", "Enoki Platform", [
				"Enoki Overview & APIs",
				"Setting Up Sponsorship",
				"Budget Management with Credit Card",
			]),
		],
	},
	{
		id: "zklogin",
		title: "zkLogin Authentication",
		description: "Zero-knowledge proofs, JWT flow, ephemeral keys, OAuth providers (Google, Apple, Facebook, Twitch), and self-custody without seed phrases.",
		difficulty: "Advanced",
		icon: "🔑",
		tags: ["zkLogin", "ZK Proofs", "OAuth"],
		path: "dapp-development",
		modules: [
			makeModule("zklogin", "m1", "How zkLogin Works", [
				"The Problem: Seed Phrase UX",
				"Zero-Knowledge Proofs Overview",
				"JWT + ZK Proof Flow",
				"Ephemeral Keys & Salt",
			]),
			makeModule("zklogin", "m2", "Integration", [
				"Supported OAuth Providers",
				"Frontend Integration Guide",
				"Address Derivation",
				"Security Model & Ceremony",
			]),
		],
	},

	{
		id: "gas-optimization",
		title: "Gas Optimization & DevInspect",
		description: "Minimize transaction costs with gas profiling, DevInspect dry-runs, PTB batching strategies, storage rebates, and Sui Explorer debugging.",
		difficulty: "Intermediate",
		icon: "⛽",
		tags: ["Gas", "Optimization", "DevInspect"],
		path: "dapp-development",
		modules: [
			makeModule("gas-optimization", "m1", "Understanding Gas on Sui", [
				"Gas Metering Model",
				"Computation vs Storage vs Non-Refundable Fees",
				"Storage Rebates & Object Deletion",
				"Reference Gas Price & Tip",
			]),
			makeModule("gas-optimization", "m2", "Optimization Techniques", [
				"DevInspect: Dry-Run Transactions",
				"Gas Estimation & Budgeting",
				"Batching Operations with PTBs",
				"Minimizing Object Mutations",
				"Shared Object Contention Avoidance",
			]),
			makeModule("gas-optimization", "m3", "Debugging Tools", [
				"Sui Explorer Transaction Analysis",
				"Gas Profiler Output",
				"Identifying Expensive Operations",
				"Common Gas Anti-Patterns",
			]),
		],
	},

	// ─── PATH 4: Tokens, NFTs & Digital Assets ──────────────
	{
		id: "coin-standard",
		title: "Sui Coin Standard",
		description: "Creating fungible tokens with sui::coin, TreasuryCap, minting, burning, CoinMetadata, and regulated coins with DenyList.",
		difficulty: "Beginner",
		icon: "🪙",
		tags: ["Coins", "Fungible Tokens", "TreasuryCap"],
		path: "tokens-nfts",
		modules: [
			makeModule("coin-standard", "m1", "Creating Coins", [
				"The sui::coin Module",
				"One-Time Witness for Coins",
				"TreasuryCap & CoinMetadata",
			]),
			makeModule("coin-standard", "m2", "Coin Operations", [
				"Minting & Burning",
				"Split, Merge & Transfer",
				"Regulated Coins & DenyList",
			]),
		],
	},
	{
		id: "closed-loop-tokens",
		title: "Closed-Loop Tokens",
		description: "TokenPolicy, custom transfer/spend/conversion rules, loyalty tokens, in-game currencies, and gated access tokens.",
		difficulty: "Intermediate",
		icon: "🔒",
		tags: ["Closed-Loop", "TokenPolicy", "Loyalty"],
		path: "tokens-nfts",
		modules: [
			makeModule("closed-loop-tokens", "m1", "Token vs Coin", [
				"Open-Loop vs Closed-Loop",
				"The sui::token Module",
				"TokenPolicy & Action Requests",
			]),
			makeModule("closed-loop-tokens", "m2", "Building Policies", [
				"Transfer Rules",
				"Spend Rules",
				"Loyalty Points Example",
				"In-Game Currency Example",
			]),
		],
	},
	{
		id: "nfts-on-sui",
		title: "NFTs on Sui",
		description: "Creating NFTs as objects, Display standard, collections, dynamic NFTs that evolve based on actions, and composable assets.",
		difficulty: "Beginner",
		icon: "🖼️",
		tags: ["NFTs", "Display", "Dynamic"],
		path: "tokens-nfts",
		modules: [
			makeModule("nfts-on-sui", "m1", "NFT Basics", [
				"Objects as NFTs",
				"Display Standard",
				"Creating a Collection",
			]),
			makeModule("nfts-on-sui", "m2", "Advanced NFTs", [
				"Dynamic NFTs",
				"Composable Assets & Nested Ownership",
				"Evolving NFTs Based on Actions",
				"SuiFrens Reference",
				"Fractional NFTs",
			]),
		],
	},
	{
		id: "kiosk-framework",
		title: "Kiosk Framework",
		description: "Decentralized commerce, royalty enforcement, transfer policies, marketplace building, trading rules, and Kiosk extensions.",
		difficulty: "Intermediate",
		icon: "🏪",
		tags: ["Kiosk", "Commerce", "Royalties"],
		path: "tokens-nfts",
		modules: [
			makeModule("kiosk-framework", "m1", "Kiosk Basics", [
				"What is Sui Kiosk?",
				"Creating a Kiosk",
				"Listing & Purchasing",
			]),
			makeModule("kiosk-framework", "m2", "Transfer Policies", [
				"Royalty Rule",
				"Kiosk Lock Rule",
				"Floor Price Rule",
				"Custom Rules",
				"Kiosk Extensions",
			]),
		],
	},
	{
		id: "suins",
		title: "SuiNS Domain Names",
		description: ".sui and .move domains, registration, subdomains, on-chain identity, and SDK integration.",
		difficulty: "Beginner",
		icon: "🌐",
		tags: ["SuiNS", "Domains", "Identity"],
		path: "tokens-nfts",
		modules: [
			makeModule("suins", "m1", "SuiNS", [
				"What is SuiNS?",
				"Registering a .sui Domain",
				"Subdomains & Resolution",
				"Integration with dApps & Wallets",
			]),
		],
	},

	// ─── PATH 5: DeFi on Sui ────────────────────────────────
	{
		id: "defi-fundamentals",
		title: "DeFi Fundamentals on Sui",
		description: "AMMs, liquidity pools, yield farming, lending protocols, and the Sui DeFi landscape.",
		difficulty: "Intermediate",
		icon: "📈",
		tags: ["DeFi", "AMM", "Liquidity"],
		path: "defi",
		modules: [
			makeModule("defi-fundamentals", "m1", "DeFi Primitives", [
				"What is DeFi?",
				"AMMs & Constant Product Formula",
				"Liquidity Pools & LP Tokens",
			]),
			makeModule("defi-fundamentals", "m2", "Sui DeFi Ecosystem", [
				"Lending & Borrowing (NAVI, Scallop)",
				"Liquid Staking (afSUI, haSUI)",
				"Stablecoins on Sui (Bucket Protocol)",
			]),
		],
	},
	// ─── DeepBook: On-Chain Order Book ─────────────────────
	{
		id: "deepbook-fundamentals",
		title: "DeepBook Fundamentals",
		description: "What is DeepBook, CLOB vs AMM, the Pool-Book-State-Vault architecture, shared objects, PoolRegistry, and BalanceManager.",
		difficulty: "Intermediate",
		icon: "📊",
		tags: ["DeepBook", "CLOB", "Architecture"],
		path: "deepbook",
		modules: [
			makeModule("deepbook-fundamentals", "m1", "What is DeepBook?", [
				"Decentralized Central Limit Order Book (CLOB)",
				"CLOB vs AMM Tradeoffs",
				"Why DeepBook on Sui (Parallel Execution, Low Fees)",
				"DeepBook v2 vs v3 Evolution",
			]),
			makeModule("deepbook-fundamentals", "m2", "Core Architecture", [
				"Pool Shared Object (One Market Per Pool)",
				"Book Module: BigVector Bids & Asks",
				"State Module: Governance, History, Account",
				"Vault Module: Balance Settlement",
				"PoolRegistry: Preventing Duplicate Pools",
				"BalanceManager: Cross-Pool Fund Sourcing",
			]),
		],
	},
	{
		id: "deepbook-trading",
		title: "DeepBook Trading & Orders",
		description: "Order placement flow, limit and market orders, order modification and cancellation, self-matching options, and the Fill/OrderInfo lifecycle.",
		difficulty: "Intermediate",
		icon: "📈",
		tags: ["Orders", "Trading", "Market Making"],
		path: "deepbook",
		modules: [
			makeModule("deepbook-trading", "m1", "Order Types & Options", [
				"Limit Orders & Market Orders",
				"Four Order Options",
				"Three Self-Matching Options",
				"Bid & Ask Mechanics",
			]),
			makeModule("deepbook-trading", "m2", "Order Lifecycle", [
				"Order Placement Flow (Pool → Book → State → Vault)",
				"OrderInfo & Fill Objects",
				"Modifying Orders (Quantity Reduction)",
				"Canceling Orders (Atomic Batch Cancel)",
				"Querying the Pool & Level 2 Data",
			]),
			makeModule("deepbook-trading", "m3", "Fees & Flash Loans", [
				"Taker Fee Calculation (Stake & Volume Based)",
				"Maker Fee & Rebate Mechanics",
				"DEEP Token vs Input Token Fee Discount (20%)",
				"Flash Loans: Borrow & Return in One PTB",
			]),
		],
	},
	{
		id: "deepbook-governance",
		title: "DeepBook Governance & Staking",
		description: "DEEP token staking, governance proposals, voting power formula, epoch-based parameter updates, maker rebates, and fee burning.",
		difficulty: "Advanced",
		icon: "🗳️",
		tags: ["DEEP Token", "Governance", "Staking"],
		path: "deepbook",
		modules: [
			makeModule("deepbook-governance", "m1", "DEEP Tokenomics", [
				"DEEP Token Overview",
				"Staking DEEP for Fee Reduction",
				"Taker & Maker Staking Incentives",
				"Fee Bounds: Volatile vs Stable Pools",
			]),
			makeModule("deepbook-governance", "m2", "Governance Mechanics", [
				"Submitting Proposals (Taker/Maker Fee, Stake Required)",
				"Voting Power Formula: min(S, Vc) + max(√S - √Vc, 0)",
				"Quorum Requirements",
				"Epoch-Based Parameter Resets",
				"History: Volume Tracking & 28-Day Median",
				"Maker Rebate Distribution & DEEP Burning",
			]),
		],
	},
	{
		id: "deepbook-sdk",
		title: "DeepBook SDK",
		description: "The TypeScript SDK for DeepBook — pool interactions, placing orders, flash loans, staking, governance proposals, and balance management.",
		difficulty: "Intermediate",
		icon: "🧑‍💻",
		tags: ["SDK", "TypeScript", "Integration"],
		path: "deepbook",
		modules: [
			makeModule("deepbook-sdk", "m1", "SDK Setup & Pools", [
				"Installing the DeepBook SDK",
				"Pool Queries: Level 2 Data, Locked Balance",
				"getQuoteQuantityOut & getBaseQuantityOut",
				"Account Open Orders",
			]),
			makeModule("deepbook-sdk", "m2", "Trading via SDK", [
				"Placing Limit & Market Orders",
				"Modifying & Canceling Orders",
				"Flash Loan Functions (borrowBaseAsset, returnBaseAsset)",
			]),
			makeModule("deepbook-sdk", "m3", "Governance via SDK", [
				"Staking DEEP into Pools",
				"Submitting Proposals",
				"Voting on Proposals",
				"Claiming Rebates",
			]),
		],
	},
	{
		id: "deepbook-indexer",
		title: "DeepBook Indexer",
		description: "Real-time access to order book and trading data — setting up the indexer, querying historical trades, and building trading interfaces.",
		difficulty: "Advanced",
		icon: "🗂️",
		tags: ["Indexer", "Data", "Real-Time"],
		path: "deepbook",
		modules: [
			makeModule("deepbook-indexer", "m1", "Indexer Overview", [
				"What is the DeepBook Indexer?",
				"Aggregating Order Book & Trade Data",
				"Public Endpoints & Configuration",
			]),
			makeModule("deepbook-indexer", "m2", "Using the Indexer", [
				"Querying Historical Trades",
				"Real-Time Order Book Snapshots",
				"Building Trading UIs with Indexer Data",
			]),
		],
	},
	{
		id: "building-dex",
		title: "Building a DEX on Sui",
		description: "Implementing swap logic, integrating price oracles (Pyth, Supra, Switchboard), liquidity management, and DEX aggregation.",
		difficulty: "Advanced",
		icon: "🔀",
		tags: ["DEX", "Oracles", "Swap"],
		path: "defi",
		modules: [
			makeModule("building-dex", "m1", "DEX Architecture", [
				"Swap Logic Implementation",
				"Pool Design Patterns",
				"Fee Structures",
			]),
			makeModule("building-dex", "m2", "Oracle Integration", [
				"Pyth Network",
				"Supra Oracles",
				"Switchboard",
			]),
			makeModule("building-dex", "m3", "Advanced Features", [
				"Concentrated Liquidity (Cetus-style)",
				"DEX Aggregation (FlowX, 7k)",
				"Flash Loan Patterns",
				"Routing & Path Finding",
			]),
		],
	},
	{
		id: "liquid-staking",
		title: "Liquid Staking on Sui",
		description: "Stake SUI while maintaining liquidity — afSUI, haSUI, SpringSUI, validator selection, yield strategies, and LST integration in DeFi.",
		difficulty: "Intermediate",
		icon: "💧",
		tags: ["Liquid Staking", "LST", "Yield"],
		path: "defi",
		modules: [
			makeModule("liquid-staking", "m1", "Liquid Staking Basics", [
				"What is Liquid Staking?",
				"Staking vs Liquid Staking Tradeoffs",
				"How LSTs Accrue Value",
			]),
			makeModule("liquid-staking", "m2", "Sui LST Protocols", [
				"Aftermath Finance (afSUI)",
				"Haedal Protocol (haSUI)",
				"Spring Sui (springSUI)",
				"Validator Selection & Delegation",
			]),
			makeModule("liquid-staking", "m3", "LST DeFi Strategies", [
				"LST as Collateral in Lending",
				"LST Liquidity Pools",
				"Yield Stacking Strategies",
				"Risks: Depeg, Slashing, Smart Contract",
			]),
		],
	},
	{
		id: "perpetuals-derivatives",
		title: "Perpetuals & Derivatives on Sui",
		description: "On-chain perpetual futures, options vaults, margin trading, funding rates, and how Sui's speed enables real-time derivatives.",
		difficulty: "Advanced",
		icon: "📉",
		tags: ["Perpetuals", "Derivatives", "Options"],
		path: "defi",
		modules: [
			makeModule("perpetuals-derivatives", "m1", "Perpetual Futures", [
				"What Are Perpetual Contracts?",
				"Funding Rate Mechanics",
				"Margin & Liquidation",
				"BlueFin: On-Chain Perps on Sui",
			]),
			makeModule("perpetuals-derivatives", "m2", "Options & Vaults", [
				"On-Chain Options Basics",
				"Typus Finance: Option Vaults",
				"Structured Products on Sui",
				"Risk Management & Greeks",
			]),
			makeModule("perpetuals-derivatives", "m3", "Why Sui for Derivatives", [
				"Sub-Second Settlement for Trading",
				"DeepBook Integration for Order Matching",
				"Shared Object Design for Orderbooks",
				"Building a Derivatives Protocol",
			]),
		],
	},
	{
		id: "sui-bridge",
		title: "Sui Bridge & Cross-Chain",
		description: "Native Sui Bridge, IKA cross-chain protocol, Wormhole integration, and bridging assets between Sui and Ethereum.",
		difficulty: "Intermediate",
		icon: "🌉",
		tags: ["Bridge", "Cross-Chain", "IKA"],
		path: "defi",
		modules: [
			makeModule("sui-bridge", "m1", "Sui Bridge", [
				"Bridge Architecture",
				"Sui to Ethereum Flow",
				"Ethereum to Sui Flow",
			]),
			makeModule("sui-bridge", "m2", "Cross-Chain Ecosystem", [
				"IKA: Cross-Chain Infrastructure",
				"Wormhole Integration",
				"Bridge Security Models",
			]),
		],
	},

	// ─── PATH 6: Walrus Decentralized Storage ───────────────
	{
		id: "intro-walrus",
		title: "Introduction to Walrus",
		description: "What is Walrus, RedStuff erasure coding, 4.5x replication factor, blob storage lifecycle, and fault tolerance.",
		difficulty: "Beginner",
		icon: "🐘",
		tags: ["Walrus", "Storage", "Erasure Coding"],
		path: "walrus-storage",
		modules: [
			makeModule("intro-walrus", "m1", "What is Walrus?", [
				"Decentralized Storage Overview",
				"Walrus vs IPFS vs Arweave vs Filecoin",
				"RedStuff Erasure Coding",
			]),
			makeModule("intro-walrus", "m2", "How It Works", [
				"Blob Storage Lifecycle",
				"Slivers & Shards",
				"Availability Certificates on Sui",
			]),
		],
	},
	{
		id: "walrus-dev-guide",
		title: "Walrus Developer Guide",
		description: "CLI operations, TypeScript and Rust SDKs, HTTP publisher API, storing and retrieving blobs, and content addressing.",
		difficulty: "Intermediate",
		icon: "🔧",
		tags: ["Walrus CLI", "SDK", "HTTP API"],
		path: "walrus-storage",
		modules: [
			makeModule("walrus-dev-guide", "m1", "CLI & SDK", [
				"Walrus CLI Setup",
				"Storing Blobs",
				"Retrieving Blobs",
				"TypeScript SDK",
			]),
			makeModule("walrus-dev-guide", "m2", "APIs & Integration", [
				"HTTP Publisher API",
				"Aggregator API",
				"Content Addressing & Deduplication",
				"Sui Smart Contract Integration",
			]),
		],
	},
	{
		id: "walrus-sites",
		title: "Walrus Sites",
		description: "Hosting fully decentralized websites, static site deployment, SuiNS integration, and service-worker portals.",
		difficulty: "Intermediate",
		icon: "🌍",
		tags: ["Walrus Sites", "Hosting", "Decentralized Web"],
		path: "walrus-storage",
		modules: [
			makeModule("walrus-sites", "m1", "Building Sites", [
				"What Are Walrus Sites?",
				"Site Builder CLI",
				"Site Objects on Sui",
			]),
			makeModule("walrus-sites", "m2", "Deployment & Portals", [
				"Deploying Your First Site",
				"SuiNS Domain Integration",
				"Server-Side vs Service-Worker Portals",
			]),
		],
	},
	{
		id: "walrus-tokenomics",
		title: "Walrus Tokenomics & Node Operations",
		description: "WAL and FROST tokens, staking, storage epochs, delegated proof of stake, and running a storage node.",
		difficulty: "Advanced",
		icon: "🏗️",
		tags: ["WAL Token", "Staking", "Node Operations"],
		path: "walrus-storage",
		modules: [
			makeModule("walrus-tokenomics", "m1", "WAL Token Economics", [
				"WAL & FROST Denominations",
				"Storage Pricing",
				"Staking & Delegation",
			]),
			makeModule("walrus-tokenomics", "m2", "Running a Node", [
				"Storage Node Setup",
				"Epoch Transitions & Shard Migration",
			]),
		],
	},

	// ─── PATH 7: Seal Encryption & Access Control ───────────
	{
		id: "intro-seal",
		title: "Introduction to Seal",
		description: "What is Seal, identity-based encryption, threshold cryptography, client-side encryption, and decentralized key servers.",
		difficulty: "Beginner",
		icon: "🔐",
		tags: ["Seal", "Encryption", "Privacy"],
		path: "seal-encryption",
		modules: [
			makeModule("intro-seal", "m1", "What is Seal?", [
				"Decentralized Secrets Management",
				"Identity-Based Encryption (IBE)",
				"Threshold Cryptography",
			]),
			makeModule("intro-seal", "m2", "Architecture", [
				"Key Server Network",
				"Client-Side Encryption",
			]),
		],
	},
	{
		id: "seal-dev-guide",
		title: "Seal Developer Guide",
		description: "TypeScript SDK, encrypting and decrypting data, choosing key server providers, and threshold configuration.",
		difficulty: "Intermediate",
		icon: "🛡️",
		tags: ["Seal SDK", "Encryption", "Developer"],
		path: "seal-encryption",
		modules: [
			makeModule("seal-dev-guide", "m1", "Getting Started", [
				"Seal TypeScript SDK",
				"Encrypting Data",
				"Decrypting Data",
			]),
			makeModule("seal-dev-guide", "m2", "Configuration", [
				"Choosing Key Server Providers",
				"Threshold Configuration (t-of-n)",
				"Key Server Providers (Ruby, Enoki, etc.)",
				"Error Handling & Best Practices",
				"Security Considerations",
			]),
		],
	},
	{
		id: "access-control-policies",
		title: "Access Control Policies",
		description: "Writing Move policies for token-gating, time-locks, allowlists, role-based access, and subscription models.",
		difficulty: "Advanced",
		icon: "🚪",
		tags: ["Access Control", "Move Policies", "Token-Gating"],
		path: "seal-encryption",
		modules: [
			makeModule("access-control-policies", "m1", "Policy Basics", [
				"On-Chain Access Control with Move",
				"Encrypt Against a Policy, Not a Person",
				"Allowlist & Membership Policies",
			]),
			makeModule("access-control-policies", "m2", "Advanced Policies", [
				"Time-Lock Access",
				"Token-Gating (NFT Ownership)",
				"Role-Based Access Control",
				"Subscription & Licensing Models",
				"Combining Multiple Rules",
			]),
		],
	},
	{
		id: "seal-walrus-integration",
		title: "Seal + Walrus Integration",
		description: "Encrypting blobs before storage on Walrus, decentralized content access, and building premium content systems.",
		difficulty: "Advanced",
		icon: "🔗",
		tags: ["Seal", "Walrus", "Premium Content"],
		path: "seal-encryption",
		modules: [
			makeModule("seal-walrus-integration", "m1", "Integration Patterns", [
				"Encrypt-Then-Store on Walrus",
				"Access-Controlled Blob Retrieval",
				"Premium Content Patterns",
			]),
			makeModule("seal-walrus-integration", "m2", "Real-World Examples", [
				"Token-Gated Vaults (Tusky)",
				"Private AI Data (Lockin Bot)",
			]),
		],
	},

	// ─── PATH 8: Gaming on Sui ──────────────────────────────
	{
		id: "gaming-fundamentals",
		title: "Gaming Fundamentals on Sui",
		description: "Why Sui for gaming, sub-second finality for real-time gameplay, parallel execution, gasless transactions, and the SuiPlay ecosystem.",
		difficulty: "Beginner",
		icon: "🎮",
		tags: ["Gaming", "SuiPlay", "Real-Time"],
		path: "gaming",
		modules: [
			makeModule("gaming-fundamentals", "m1", "Why Sui for Gaming?", [
				"Sub-Second Finality for Gameplay",
				"Parallel Execution for Scale",
				"Gasless Transactions for Players",
			]),
			makeModule("gaming-fundamentals", "m2", "Gaming Ecosystem", [
				"SuiPlay0X1 Handheld Console",
				"Game Dollar Stablecoin",
				"Notable Games on Sui",
			]),
		],
	},
	{
		id: "dynamic-nfts",
		title: "Dynamic NFTs & Game Assets",
		description: "Evolving in-game items, nested ownership (characters own weapons), cross-game composability, and soulbound assets.",
		difficulty: "Intermediate",
		icon: "⚔️",
		tags: ["Dynamic NFTs", "Game Assets", "Composability"],
		path: "gaming",
		modules: [
			makeModule("dynamic-nfts", "m1", "Dynamic Assets", [
				"Evolving Items with Dynamic Fields",
				"Experience Points & Leveling",
				"Appearance Changes Over Time",
			]),
			makeModule("dynamic-nfts", "m2", "Composability", [
				"Nested Ownership (Characters Own Weapons)",
				"Cross-Game Asset Sharing",
				"Soulbound Assets & Achievements",
				"Equipment Systems",
				"Crafting & Combining",
			]),
		],
	},
	{
		id: "onchain-randomness",
		title: "On-Chain Randomness",
		description: "Sui's randomness beacon, Verifiable Delay Functions, Distributed Key Generation, fair loot drops, and provably fair gaming.",
		difficulty: "Intermediate",
		icon: "🎲",
		tags: ["Randomness", "VDF", "Fair Gaming"],
		path: "gaming",
		modules: [
			makeModule("onchain-randomness", "m1", "How It Works", [
				"The sui::random Module",
				"Threshold BLS Randomness",
				"Verifiable Delay Functions (VDF)",
			]),
			makeModule("onchain-randomness", "m2", "Applications", [
				"Fair Loot Drops",
				"Provably Fair Gaming",
			]),
		],
	},
	{
		id: "game-economy",
		title: "Game Economy Design",
		description: "Closed-loop tokens for in-game currency, Kiosk for item trading, sponsored transactions for players, and reward systems.",
		difficulty: "Intermediate",
		icon: "💎",
		tags: ["Game Economy", "In-Game Currency", "Rewards"],
		path: "gaming",
		modules: [
			makeModule("game-economy", "m1", "In-Game Currency", [
				"Closed-Loop Tokens for Games",
				"Minting & Burning Mechanics",
				"Spending Rules & Restrictions",
			]),
			makeModule("game-economy", "m2", "Trading & Rewards", [
				"Kiosk for Item Trading",
				"Sponsored Transactions for Players",
				"Loyalty & Achievement Rewards",
			]),
		],
	},

	{
		id: "game-tooling",
		title: "Sui Game Development Tooling",
		description: "Officially endorsed tools for building games on Sui — Beamable for Unity/Unreal, Venly for Web3 integration, loyalty platforms, payments, and on-chain analytics.",
		difficulty: "Intermediate",
		icon: "🧰",
		tags: ["Beamable", "Venly", "Game Tools"],
		path: "gaming",
		modules: [
			makeModule("game-tooling", "m1", "Beamable: Full-Stack Game Backend", [
				"What is Beamable?",
				"Unity SDK Setup & Configuration",
				"Unreal Engine SDK Setup",
				"Minting & Managing On-Chain Assets",
				"Player Accounts & Game State on Sui",
			]),
			makeModule("game-tooling", "m2", "Venly & Web3 Integration", [
				"Venly Platform Overview",
				"Integrating with Existing Game Backends (PlayFab)",
				"Wallet & Tokenization Services",
				"Crossmint: Credit Card NFT Purchases",
			]),
			makeModule("game-tooling", "m3", "Loyalty, Questing & Analytics", [
				"Forge.gg: On-Chain Loyalty Programs",
				"Snag: Reward & Loyalty Systems",
				"Galxe: Quest & Achievement Tracking",
				"Sentio & Footprint: Player Analytics",
				"Goldsky: Real-Time Data Indexing",
			]),
		],
	},

	// ─── PATH 9: Advanced Sui Infrastructure ────────────────
	{
		id: "sui-cryptography",
		title: "Sui Cryptography",
		description: "Supported signature schemes (Ed25519, ECDSA, BLS), multisig, passkeys/WebAuthn, on-chain ZK verification, and checkpoint verification.",
		difficulty: "Advanced",
		icon: "🔏",
		tags: ["Cryptography", "Multisig", "Passkeys"],
		path: "advanced-infra",
		modules: [
			makeModule("sui-cryptography", "m1", "Signature Schemes", [
				"Ed25519, Secp256k1, Secp256r1",
				"Multisig Accounts (Weighted, Mixed Keys)",
				"Passkeys & WebAuthn",
			]),
			makeModule("sui-cryptography", "m2", "On-Chain Cryptography", [
				"BLS12-381 Group Operations",
				"Groth16 ZK Proof Verification",
				"Poseidon Hash Function",
				"ECDSA & Ed25519 Signature Verification",
				"Checkpoint Verification",
			]),
		],
	},
	{
		id: "nautilus",
		title: "Nautilus: Off-Chain Compute",
		description: "Verifiable off-chain computation, Trusted Execution Environments (TEEs), on-chain verification, and secure data processing.",
		difficulty: "Advanced",
		icon: "🧮",
		tags: ["Nautilus", "Off-Chain", "TEE"],
		path: "advanced-infra",
		modules: [
			makeModule("nautilus", "m1", "Nautilus Overview", [
				"What is Nautilus?",
				"Trusted Execution Environments",
				"Off-Chain Compute with On-Chain Verification",
			]),
			makeModule("nautilus", "m2", "Building with Nautilus", [
				"Setting Up Nautilus",
				"Verifying Computations On-Chain",
			]),
		],
	},
	{
		id: "indexing-data",
		title: "Indexing & Data Access",
		description: "GraphQL RPC, custom indexers, JSON-RPC API, ZettaBlock, Sentio, event subscriptions, and checkpoint-based data.",
		difficulty: "Advanced",
		icon: "🗂️",
		tags: ["Indexing", "GraphQL", "Data"],
		path: "advanced-infra",
		modules: [
			makeModule("indexing-data", "m1", "Data Access", [
				"JSON-RPC API",
				"GraphQL RPC (Beta)",
				"Event Subscriptions",
			]),
			makeModule("indexing-data", "m2", "Indexing", [
				"Sui Indexer Architecture",
				"Custom Indexers",
				"ZettaBlock & Sentio",
			]),
		],
	},
	{
		id: "running-infrastructure",
		title: "Running Sui Infrastructure",
		description: "Full node setup, validator configuration, RPC providers, monitoring with Prometheus/Grafana, and data management.",
		difficulty: "Advanced",
		icon: "🖧",
		tags: ["Full Node", "Validator", "Operations"],
		path: "advanced-infra",
		modules: [
			makeModule("running-infrastructure", "m1", "Node Operations", [
				"Running a Full Node",
				"Validator Setup & Configuration",
				"RPC Provider Setup",
			]),
			makeModule("running-infrastructure", "m2", "Maintenance", [
				"Monitoring (Prometheus & Grafana)",
				"Data Pruning & Snapshots",
				"Troubleshooting",
			]),
		],
	},

	// ─── PATH 10: Sui Stack (S2) ────────────────────────────
	{
		id: "sui-stack-overview",
		title: "The Sui Stack (S2)",
		description: "The unified developer platform: Mysticeti consensus, Walrus storage, Seal encryption, Nautilus compute, and SuiNS identity — how they work together.",
		difficulty: "Intermediate",
		icon: "🧱",
		tags: ["S2", "Sui Stack", "Unified Platform"],
		path: "sui-stack",
		modules: [
			makeModule("sui-stack-overview", "m1", "The Sui Stack Vision", [
				"From L1 to Unified Platform",
				"The Five Pillars: Consensus, Storage, Encryption, Compute, Identity",
				"How the Components Integrate",
			]),
			makeModule("sui-stack-overview", "m2", "Building Full-Stack on Sui", [
				"Architecture Patterns",
				"Choosing the Right Components",
				"Real-World Application Examples",
			]),
		],
	},
	{
		id: "enoki-platform",
		title: "Enoki Developer Platform",
		description: "Mysten Labs' developer infrastructure: zkLogin as a service, sponsored transactions API, gas station, and simplified onboarding.",
		difficulty: "Intermediate",
		icon: "🔌",
		tags: ["Enoki", "Developer Tools", "API"],
		path: "sui-stack",
		modules: [
			makeModule("enoki-platform", "m1", "Enoki Overview", [
				"What is Enoki?",
				"zkLogin as a Service",
				"Gas Station API",
			]),
			makeModule("enoki-platform", "m2", "Integration", [
				"API Keys & Setup",
				"Sponsoring Transactions with Credit Card",
				"Building Gasless dApps with Enoki",
			]),
		],
	},
	{
		id: "move-prover",
		title: "Formal Verification with Move Prover",
		description: "Write specifications for Move modules, prove correctness using the Move Prover, and understand formal verification concepts.",
		difficulty: "Advanced",
		icon: "✅",
		tags: ["Move Prover", "Formal Verification", "Security"],
		path: "sui-stack",
		modules: [
			makeModule("move-prover", "m1", "Formal Verification", [
				"Why Formal Verification?",
				"Writing Specifications",
				"Running the Move Prover",
			]),
			makeModule("move-prover", "m2", "Advanced Verification", [
				"Invariants & Preconditions",
				"Loop Invariants",
				"Proving Safety Properties",
			]),
		],
	},
	{
		id: "smart-contract-security",
		title: "Smart Contract Security on Sui",
		description: "Common vulnerability patterns, how Move prevents reentrancy, capability-based access control, auditing techniques, and security best practices.",
		difficulty: "Advanced",
		icon: "🛡️",
		tags: ["Security", "Auditing", "Best Practices"],
		path: "sui-stack",
		modules: [
			makeModule("smart-contract-security", "m1", "Move Safety", [
				"Move Bytecode Verifier",
				"Linear Types Prevent Reentrancy",
				"Object Safety Guarantees",
			]),
			makeModule("smart-contract-security", "m2", "Auditing & Best Practices", [
				"Common Vulnerability Patterns",
				"Capability-Based Access Control",
				"Package Upgrade Safety",
				"Auditing Move Code",
				"Security Checklist",
			]),
		],
	},

	{
		id: "s3-walrus-seal",
		title: "Walrus + Seal: Encrypted Storage",
		description: "Encrypt data with Seal before storing on Walrus — token-gated content, time-locked decryption, and private file sharing.",
		difficulty: "Advanced",
		icon: "🔐",
		tags: ["Walrus", "Seal", "Encryption"],
		path: "sui-stack-s3",
		modules: [
			makeModule("s3-walrus-seal", "m1", "Encryption Before Storage", [
				"Encrypting Data with Seal Before Storing on Walrus",
				"Seal Access Policies for Walrus Blobs",
				"Key Management & User Share Encryption",
			]),
			makeModule("s3-walrus-seal", "m2", "Access-Controlled Content", [
				"Token-Gated Content Delivery",
				"Time-Locked Decryption Policies",
				"NFT-Based Access to Encrypted Files",
			]),
			makeModule("s3-walrus-seal", "m3", "Build: Private File Sharing dApp", [
				"Architecture: Move + Seal + Walrus + dApp Kit",
				"Upload, Encrypt & Store Flow",
				"Share & Decrypt Flow",
				"Frontend Integration",
			]),
		],
	},
	{
		id: "s3-deepbook-move",
		title: "DeepBook + Move: Custom Trading",
		description: "Write Move contracts that interact with DeepBook pools — automated strategies, SDK integration, and flash loan patterns.",
		difficulty: "Advanced",
		icon: "📈",
		tags: ["DeepBook", "Move", "Trading"],
		path: "sui-stack-s3",
		modules: [
			makeModule("s3-deepbook-move", "m1", "Move ↔ DeepBook", [
				"Writing Move Contracts That Interact with DeepBook Pools",
				"Placing Orders from Smart Contracts",
				"Reading Pool State On-Chain",
			]),
			makeModule("s3-deepbook-move", "m2", "Trading Strategies", [
				"Automated Trading Strategies in Move",
				"Market Making Bot Architecture",
				"Flash Loan Arbitrage Patterns",
			]),
			makeModule("s3-deepbook-move", "m3", "Frontend Integration", [
				"Integrating DeepBook SDK with dApp Kit",
				"Real-Time Order Book UI",
				"Transaction Building with PTBs",
			]),
		],
	},
	{
		id: "s3-zklogin-enoki",
		title: "zkLogin + Enoki: Seamless Onboarding",
		description: "Zero-friction user onboarding — social login to Sui wallet, gas-free transactions, and session keys for seamless UX.",
		difficulty: "Intermediate",
		icon: "🪪",
		tags: ["zkLogin", "Enoki", "UX"],
		path: "sui-stack-s3",
		modules: [
			makeModule("s3-zklogin-enoki", "m1", "Social Login Flow", [
				"Zero-Friction User Onboarding Flow",
				"Social Login to Sui Wallet in One Click",
				"OAuth Providers: Google, Apple, Twitch",
			]),
			makeModule("s3-zklogin-enoki", "m2", "Sponsored Transactions", [
				"Gas-Free Transactions with Enoki Sponsorship",
				"Setting Up a Sponsored Transaction Pipeline",
				"Cost Management & Rate Limiting",
			]),
			makeModule("s3-zklogin-enoki", "m3", "Session Keys & UX", [
				"Session Keys for Seamless UX",
				"Eliminating Signature Popups",
				"Building a Web2-Like Experience on Sui",
			]),
		],
	},
	{
		id: "s3-ika-nautilus",
		title: "IKA + Nautilus: Cross-Chain Compute",
		description: "Control assets on any blockchain from Sui via IKA, run verifiable off-chain compute with Nautilus, and build multi-chain applications.",
		difficulty: "Advanced",
		icon: "🌐",
		tags: ["IKA", "Nautilus", "Cross-Chain"],
		path: "sui-stack-s3",
		modules: [
			makeModule("s3-ika-nautilus", "m1", "Cross-Chain Control", [
				"Controlling Bitcoin from a Sui Smart Contract via IKA",
				"dWallet Signing Flows",
				"Cross-Chain Data Feeds with dWallets",
			]),
			makeModule("s3-ika-nautilus", "m2", "Off-Chain Compute", [
				"Off-Chain Computation with Nautilus",
				"On-Chain Proof Verification",
				"TEE Attestation & Trust Model",
			]),
			makeModule("s3-ika-nautilus", "m3", "Build: Multi-Chain Portfolio Manager", [
				"Architecture: Move + IKA + Nautilus",
				"Managing Assets Across Bitcoin, Ethereum & Sui",
				"Automated Rebalancing Strategies",
			]),
		],
	},
	{
		id: "s3-fullstack",
		title: "Full-Stack Sui Architecture",
		description: "Choose the right stack components, understand architecture patterns, and build a complete application combining 4+ Sui technologies.",
		difficulty: "Advanced",
		icon: "🏗️",
		tags: ["Architecture", "Full Stack", "Capstone"],
		path: "sui-stack-s3",
		modules: [
			makeModule("s3-fullstack", "m1", "Architecture Decisions", [
				"Choosing the Right Stack Components for Your dApp",
				"Architecture Patterns: When to Use What",
				"Performance, Cost & Security Tradeoffs",
			]),
			makeModule("s3-fullstack", "m2", "Combining the Stack", [
				"Combining 4+ Stack Components in One Application",
				"Data Flow: Move → Walrus → Seal → Frontend",
				"Cross-Component Error Handling",
			]),
			makeModule("s3-fullstack", "m3", "Capstone: Encrypted Marketplace", [
				"End-to-End Project: Encrypted Marketplace",
				"Cross-Chain Payments via IKA",
				"Decentralized Storage via Walrus",
				"Access Control via Seal",
				"User Onboarding via zkLogin + Enoki",
			]),
		],
	},

	// ─── IKA: Cross-Chain with dWallets ─────────────────────
	{
		id: "ika-fundamentals",
		title: "Introduction to IKA",
		description: "What is IKA, dWallets as a primitive, multi-chain vs cross-chain, zero-trust security, and how IKA extends Sui to every blockchain.",
		difficulty: "Intermediate",
		icon: "🔗",
		tags: ["IKA", "dWallet", "Multi-Chain"],
		path: "ika-network",
		modules: [
			makeModule("ika-fundamentals", "m1", "What is IKA?", [
				"The Fastest Parallel MPC Network on Sui",
				"dWallets: A New Cryptographic Primitive",
				"Multi-Chain vs Cross-Chain (No Bridges, No Wrapping)",
				"Zero-Trust Security & Decentralization",
			]),
			makeModule("ika-fundamentals", "m2", "Architecture", [
				"Forked from Sui: Shared Consensus Model",
				"DWalletCap Objects on Sui",
				"Native Coordination on Sui",
				"IKA Token: Gas, Staking & Epoch Reconfiguration",
				"Sub-Second MPC with Mysticeti Consensus",
			]),
			makeModule("ika-fundamentals", "m3", "The Four Properties of dWallets", [
				"Noncollusive: User Must Participate in Signing",
				"Massively Decentralized: 2/3 Threshold from Hundreds of Nodes",
				"Multi-Chain Native: Universal Blockchain Signatures",
				"Cryptographically Secure: Math, Not Hardware",
			]),
		],
	},
	{
		id: "ika-cryptography",
		title: "IKA Cryptography: 2PC-MPC",
		description: "The novel two-party computation protocol where the second party is an entire network — ECDSA, Schnorr, EdDSA, DKG, and scaling to 10,000 signatures/second.",
		difficulty: "Advanced",
		icon: "🔏",
		tags: ["2PC-MPC", "Cryptography", "Threshold Signatures"],
		path: "ika-network",
		modules: [
			makeModule("ika-cryptography", "m1", "MPC Foundations", [
				"What is Multi-Party Computation (MPC)?",
				"Threshold Signatures Overview",
				"Why Traditional MPC Doesn't Scale",
			]),
			makeModule("ika-cryptography", "m2", "2PC-MPC Protocol", [
				"Two-Party ECDSA with Network Emulation",
				"Linear O(n) Communication Scaling",
				"Practically O(1) Network Computation",
				"Asymptotically O(1) User Impact",
			]),
			makeModule("ika-cryptography", "m3", "2PC-MPC v2 Improvements", [
				"Schnorr & EdDSA Support (Beyond ECDSA)",
				"Asynchronous Broadcast Networks",
				"Dynamic Participant Quorums",
				"Non-Interactive O(1) Presign Generation",
				"Reconfiguration Without Resharing",
				"Weighted Threshold for PoS Systems",
				"HD Wallet (BIP32) Compatibility",
			]),
		],
	},
	{
		id: "ika-sdk",
		title: "IKA TypeScript SDK",
		description: "Build dWallet applications — creating clients, zero-trust dWallets, shared dWallets, presigning, imported key dWallets, and cryptographic primitives.",
		difficulty: "Intermediate",
		icon: "🧑‍💻",
		tags: ["SDK", "TypeScript", "dWallet"],
		path: "ika-network",
		modules: [
			makeModule("ika-sdk", "m1", "Getting Started", [
				"Installing @ika.xyz/sdk",
				"Setting Up IKA Localnet",
				"Creating an IKA Client",
				"Querying the Network",
			]),
			makeModule("ika-sdk", "m2", "dWallet Operations", [
				"dWallet Types Overview",
				"Creating a Zero-Trust dWallet",
				"Presigning Transactions",
				"Shared dWallet Management",
				"Imported Key dWallets",
			]),
			makeModule("ika-sdk", "m3", "Cryptographic Primitives", [
				"User Share Encryption Keys",
				"Cryptography Functions Reference",
				"Signing Flows & Verification",
			]),
		],
	},
	{
		id: "ika-move-integration",
		title: "IKA Move Contract Integration",
		description: "Integrate dWallets into Sui smart contracts — coordinator architecture, capabilities, session management, DKG, presigning, and signing protocols.",
		difficulty: "Advanced",
		icon: "📝",
		tags: ["Move", "Smart Contracts", "Integration"],
		path: "ika-network",
		modules: [
			makeModule("ika-move-integration", "m1", "Core Concepts", [
				"Coordinator Architecture",
				"Capabilities & Approvals",
				"Session Management",
				"Payment Handling",
			]),
			makeModule("ika-move-integration", "m2", "Protocols", [
				"DKG: Distributed Key Generation",
				"Presigning Protocol",
				"Signing Protocol",
				"Future Signing",
				"Key Importing",
				"Converting to Shared dWallet",
			]),
			makeModule("ika-move-integration", "m3", "Integration Patterns", [
				"Shared dWallet Contracts",
				"Presign Pool Management",
				"Bitcoin Multisig Example",
			]),
		],
	},
	{
		id: "ika-use-cases",
		title: "IKA Use Cases & Applications",
		description: "Real-world applications — programmable Bitcoin (BTC-Fi), decentralized custody, cross-chain DeFi, and controlling $2T+ in Bitcoin from Sui.",
		difficulty: "Intermediate",
		icon: "💡",
		tags: ["BTC-Fi", "Cross-Chain DeFi", "Custody"],
		path: "ika-network",
		modules: [
			makeModule("ika-use-cases", "m1", "BTC-Fi on Sui", [
				"Programmable Bitcoin via dWallets",
				"Controlling Native BTC from Sui Smart Contracts",
				"Bitcoin Multisig with IKA",
				"No Wrapping, No Bridges, No Custodians",
			]),
			makeModule("ika-use-cases", "m2", "Cross-Chain Applications", [
				"Decentralized Custody Solutions",
				"Cross-Chain DeFi Composability",
				"Multi-Chain Asset Management from Sui",
				"10,000 Signatures/Second at Scale",
			]),
		],
	},

	// ─── PATH 11: Real-World Projects ───────────────────────
	{
		id: "build-nft-marketplace",
		title: "Build an NFT Marketplace",
		description: "End-to-end project: create NFT collections, build a marketplace with Kiosk, enforce royalties, and connect a React frontend.",
		difficulty: "Intermediate",
		icon: "🛒",
		tags: ["Project", "NFT", "Marketplace"],
		path: "projects",
		modules: [
			makeModule("build-nft-marketplace", "m1", "Smart Contracts", [
				"Designing the NFT Collection",
				"Setting Up Kiosk & Transfer Policies",
				"Royalty Enforcement",
			]),
			makeModule("build-nft-marketplace", "m2", "Frontend", [
				"Listing & Browsing NFTs",
				"Purchase Flow with dApp Kit",
				"Displaying Collection Stats",
			]),
		],
	},
	{
		id: "build-defi-app",
		title: "Build a DeFi Application",
		description: "End-to-end project: implement a token swap, integrate DeepBook, add oracle price feeds, and build a trading UI.",
		difficulty: "Advanced",
		icon: "💹",
		tags: ["Project", "DeFi", "Swap"],
		path: "projects",
		modules: [
			makeModule("build-defi-app", "m1", "Smart Contracts", [
				"Token Swap Contract",
				"Integrating DeepBook",
				"Oracle Price Feeds (Pyth)",
			]),
			makeModule("build-defi-app", "m2", "Frontend", [
				"Trading Interface",
				"Order Book Display",
				"Portfolio Tracking",
			]),
		],
	},
	{
		id: "build-decentralized-app",
		title: "Build a Decentralized Web App",
		description: "End-to-end project: deploy a dApp frontend on Walrus Sites, use Seal for premium content, integrate zkLogin for passwordless auth.",
		difficulty: "Advanced",
		icon: "🌐",
		tags: ["Project", "Walrus Sites", "Full-Stack"],
		path: "projects",
		modules: [
			makeModule("build-decentralized-app", "m1", "Backend", [
				"Move Smart Contracts",
				"Seal Access Policies",
				"Storing Data on Walrus",
			]),
			makeModule("build-decentralized-app", "m2", "Frontend & Deployment", [
				"zkLogin Integration",
				"Sponsored Transactions",
				"Deploying to Walrus Sites",
			]),
		],
	},
	{
		id: "build-onchain-game",
		title: "Build an On-Chain Game",
		description: "End-to-end project: create a game with dynamic NFT characters, on-chain randomness for battles, and a closed-loop token economy.",
		difficulty: "Advanced",
		icon: "🕹️",
		tags: ["Project", "Gaming", "Full-Stack"],
		path: "projects",
		modules: [
			makeModule("build-onchain-game", "m1", "Game Logic", [
				"Character NFTs with Dynamic Fields",
				"Battle System with Randomness",
				"In-Game Currency (Closed-Loop Token)",
			]),
			makeModule("build-onchain-game", "m2", "Player Experience", [
				"Gasless Gameplay (Sponsored Transactions)",
				"Item Trading via Kiosk",
				"Leaderboards & Achievements",
			]),
		],
	},
]

// --- Helpers ---

export function getCourseById(id: string): Course | undefined {
	return courses.find((c) => c.id === id)
}

export function getAllLessonIds(): string[] {
	return courses.flatMap((c) => c.modules.flatMap((m) => m.lessons.map((l) => l.id)))
}

export function getCourseLessonIds(courseId: string): string[] {
	const course = getCourseById(courseId)
	if (!course) return []
	return course.modules.flatMap((m) => m.lessons.map((l) => l.id))
}

export function getLessonById(courseId: string, lessonId: string): Lesson | undefined {
	const course = getCourseById(courseId)
	if (!course) return undefined
	for (const mod of course.modules) {
		const lesson = mod.lessons.find((l) => l.id === lessonId)
		if (lesson) return lesson
	}
	return undefined
}

export function getAdjacentLessons(courseId: string, lessonId: string): { prev: Lesson | null; next: Lesson | null } {
	const course = getCourseById(courseId)
	if (!course) return { prev: null, next: null }
	const allLessons = course.modules.flatMap((m) => m.lessons)
	const idx = allLessons.findIndex((l) => l.id === lessonId)
	return {
		prev: idx > 0 ? allLessons[idx - 1] : null,
		next: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
	}
}

export function getTotalLessonsCount(): number {
	return courses.reduce((acc, c) => acc + c.modules.reduce((a, m) => a + m.lessons.length, 0), 0)
}
