// Outdex listings feed — hand-picked listings (Nov 15, 2026).
// NOT generated from the recoupa44 scan: Yemi replaced the 16 scanned
// listings with RELAY, then added SHADE, RCFI (Recoupa itself) and XFee.
// XFee removed Nov 20, 2026 at Yemi's order ("Not crew" — he meant XFee).
// FOOD, OPEQ, PAYDAY, $CHIMP, ZENI added Nov 20, 2026 at his order,
// picked from the Recoupa44 lists (latest data per token at add time).
// VSWAP (VisionSwap) added Nov 23, 2026 at his order, picked from the
// Recoupa44 list (today's data at add time); placed above RELAY/RCFI so
// the bottom pair stays at the bottom per his Nov 20 order.
// Order is the order of his picks. RELAY and RCFI (Recoupa) moved to the
// bottom Nov 20, 2026 at his order. The recoupa44 set is preserved in git
// history and in ~/workspace/token-scans/runs/recoupa44-20261115-final.json.

export type OutdexListing = {
  symbol: string;
  name: string;
  mint: string;
  chain: string;
  mcap: number;
  ageDays: number;
  txns24: number;
  vol24: number;
  liqUsd: number;
  dex: string;
  priceUsd: number;
  priceChange24: number | null;
  description: string;
};

export const LISTING_UPDATED = "Nov 24, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 27311,
    ageDays: 11.8,
    txns24: 1725,
    vol24: 83464.85,
    liqUsd: 11773.35,
    dex: "meteora",
    priceUsd: 0.00002734,
    priceChange24: -66.65,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "FOOD",
    name: "Foodcoin",
    mint: "FTu55MyigXns96jz4nTCDDiTCjYJjyrHSceCgG9Upump",
    chain: "solana",
    mcap: 83183,
    ageDays: 11.7,
    txns24: 2719,
    vol24: 127558.56,
    liqUsd: 28383.03,
    dex: "pumpswap",
    priceUsd: 0.0000858,
    priceChange24: 32.89,
    description: "$FOODCOIN turns trading volume into dinner. Creator rewards flow automatically to Feeding America, and every $1 becomes 20 meals.",
  },
  {
    symbol: "OPEQ",
    name: "OPEQ",
    mint: "9tpHqTJ2d8jMZJjZzsf9MCfnCEmbAjsqjPJ56PzSpump",
    chain: "solana",
    mcap: 36983,
    ageDays: 37,
    txns24: 78,
    vol24: 6963.79,
    liqUsd: 14361.37,
    dex: "pumpswap",
    priceUsd: 0.00003882,
    priceChange24: -10.33,
    description: "OPEQ is a quantum-resistant smart wallet for the Solana blockchain. Standard Solana accounts are controlled by Ed25519 keys, a signature scheme that a sufficiently large quantum computer running Shor's algorithm could break. OPEQ holds user funds at a program-derived address that has no Ed25519 key. Transactions are authorized by one-time hash-based signatures (WOTS+ under a Merkle tree) that the OPEQ on-chain program verifies before executing the requested instructions. The wallet is available as a Chrome extension and as a web wallet, and currently runs on Solana devnet. The source code is public on GitHub under the Apache-2.0 license.",
  },
  {
    symbol: "PAYDAY",
    name: "Payday",
    mint: "uHMWNFjUNxbPy1q43WrdbzygmJwdeh6AiQm1NKdxPAY",
    chain: "solana",
    mcap: 76104,
    ageDays: 14.8,
    txns24: 420,
    vol24: 19595.65,
    liqUsd: 22517.93,
    dex: "pumpswap",
    priceUsd: 0.00008182,
    priceChange24: -4.48,
    description: "Your pump.fun creator fees, paid to any X account in dollars on X Money. Launch new coins or reroute existing ones.",
  },
  {
    symbol: "$CHIMP",
    name: "ChimpX AI",
    mint: "AHKcbfroL4aYLcmK6iPwYJieGYUZZmeB917FZYjbg6Xb",
    chain: "solana",
    mcap: 37542,
    ageDays: 27.2,
    txns24: 87,
    vol24: 74.64,
    liqUsd: 14164.39,
    dex: "pumpswap",
    priceUsd: 0.00003857,
    priceChange24: -3.59,
    description: "ChimpX is building Mojo AI, DeFi for Everyone. Trade, earn and manage your crypto with simple AI that does the hard parts for you. $CHIMP is the community token of ChimpX. We are building the SuperApp of Solana that lets you control multiple dapps with AI.",
  },
  {
    symbol: "ZENI",
    name: "Tokyo Futuro",
    mint: "0x6354a37799e96ed6ccaecffbe1c100fa7f30cec8",
    chain: "robinhood",
    mcap: 70129,
    ageDays: 50,
    txns24: 50,
    vol24: 1357.17,
    liqUsd: 15917.98,
    dex: "uniswap-v4-robinhood",
    priceUsd: 0.00008717,
    priceChange24: 0.12,
    description: "Tokyo Futuro is an on-chain city game and economy on Robinhood Chain, an EVM blockchain. Players and AI agents live in the same world: they take jobs from a public job board, join crews, bet on Fight Club matches, buy items and compete for rewards. ZENI is the game's token and is used for job rewards, job bonds, bets, entries and in-game purchases. The AI agents, called citizens, each have an ERC-8004 identity and their own wallet. When a citizen delivers a job, the poster approves it and the job board contract pays the reward. Every job, bond and payment is a public on-chain record that can be checked on the block explorer, and the project publishes a proof page that re-reads these records directly from the chain.",
  },
  {
    symbol: "VSWAP",
    name: "VisionSwap",
    mint: "4VScHuqZ13uma3S34iNkiSAQvZDEeGebjbM5bPcapump",
    chain: "solana",
    mcap: 67971,
    ageDays: 43,
    txns24: 210,
    vol24: 674.21,
    liqUsd: 18577.74,
    dex: "pumpswap",
    priceUsd: 0.00007038,
    priceChange24: -5.69,
    description: "VisionSwap is a privacy-focused trading and payment platform built on Solana that uses zero-knowledge proofs to support private token swaps, SOL transfers, and advanced trading orders. Its features include limit orders, dollar-cost averaging DCA, take-profit and stop-loss tools, trailing stops, private payment links, and QR-based transfers. The platform also incorporates wallet exposure screening and viewing keys for compliance-related verification. The VSWAP token is designed around trading-fee cashback, platform-revenue buybacks and burns, and fee distribution mechanisms for holders.",
  },
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 5447,
    ageDays: 18.1,
    txns24: 12,
    vol24: 219.92,
    liqUsd: 6890.08,
    dex: "pancakeswap",
    priceUsd: 0.000005446,
    priceChange24: -7.63,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2092,
    ageDays: 21.4,
    txns24: 0,
    vol24: 0,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000002092002,
    priceChange24: 0,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
];
