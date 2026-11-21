// Outdex listings feed — hand-picked listings (Nov 15, 2026).
// NOT generated from the recoupa44 scan: Yemi replaced the 16 scanned
// listings with RELAY, then added SHADE, RCFI (Recoupa itself) and XFee.
// XFee removed Nov 20, 2026 at Yemi's order ("Not crew" — he meant XFee).
// FOOD, OPEQ, PAYDAY, $CHIMP, ZENI added Nov 20, 2026 at his order,
// picked from the Recoupa44 lists (latest data per token at add time).
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

export const LISTING_UPDATED = "Nov 20, 2026, 5:01 PM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 30865,
    ageDays: 8.1,
    txns24: 505,
    vol24: 26378.39,
    liqUsd: 12558.46,
    dex: "meteora",
    priceUsd: 0.00003089,
    priceChange24: 50.17,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "FOOD",
    name: "Foodcoin",
    mint: "FTu55MyigXns96jz4nTCDDiTCjYJjyrHSceCgG9Upump",
    chain: "solana",
    mcap: 72593,
    ageDays: 8,
    txns24: 1395,
    vol24: 51244.03,
    liqUsd: 26159.21,
    dex: "pumpswap",
    priceUsd: 0.00007487,
    priceChange24: 12.15,
    description: "$FOODCOIN turns trading volume into dinner. Creator rewards flow automatically to Feeding America, and every $1 becomes 20 meals.",
  },
  {
    symbol: "OPEQ",
    name: "OPEQ",
    mint: "9tpHqTJ2d8jMZJjZzsf9MCfnCEmbAjsqjPJ56PzSpump",
    chain: "solana",
    mcap: 34583,
    ageDays: 33.3,
    txns24: 385,
    vol24: 13460.6,
    liqUsd: 13783.77,
    dex: "pumpswap",
    priceUsd: 0.0000363,
    priceChange24: -12.03,
    description: "OPEQ is a quantum-resistant smart wallet for the Solana blockchain. Standard Solana accounts are controlled by Ed25519 keys, a signature scheme that a sufficiently large quantum computer running Shor's algorithm could break. OPEQ holds user funds at a program-derived address that has no Ed25519 key. Transactions are authorized by one-time hash-based signatures (WOTS+ under a Merkle tree) that the OPEQ on-chain program verifies before executing the requested instructions. The wallet is available as a Chrome extension and as a web wallet, and currently runs on Solana devnet. The source code is public on GitHub under the Apache-2.0 license.",
  },
  {
    symbol: "PAYDAY",
    name: "Payday",
    mint: "uHMWNFjUNxbPy1q43WrdbzygmJwdeh6AiQm1NKdxPAY",
    chain: "solana",
    mcap: 101023,
    ageDays: 11.2,
    txns24: 1026,
    vol24: 44948.94,
    liqUsd: 25733.04,
    dex: "pumpswap",
    priceUsd: 0.0001078,
    priceChange24: 1.82,
    description: "Your pump.fun creator fees, paid to any X account in dollars on X Money. Launch new coins or reroute existing ones.",
  },
  {
    symbol: "$CHIMP",
    name: "ChimpX AI",
    mint: "AHKcbfroL4aYLcmK6iPwYJieGYUZZmeB917FZYjbg6Xb",
    chain: "solana",
    mcap: 36422,
    ageDays: 23.5,
    txns24: 108,
    vol24: 79.39,
    liqUsd: 13782.24,
    dex: "pumpswap",
    priceUsd: 0.00003742,
    priceChange24: -6.52,
    description: "ChimpX is building Mojo AI, DeFi for Everyone. Trade, earn and manage your crypto with simple AI that does the hard parts for you. $CHIMP is the community token of ChimpX. We are building the SuperApp of Solana that lets you control multiple dapps with AI.",
  },
  {
    symbol: "ZENI",
    name: "Tokyo Futuro",
    mint: "0x6354a37799e96ed6ccaecffbe1c100fa7f30cec8",
    chain: "robinhood",
    mcap: 74502,
    ageDays: 46.3,
    txns24: 31,
    vol24: 1543.36,
    liqUsd: 16113.59,
    dex: "uniswap-v4-robinhood",
    priceUsd: 0.0000926,
    priceChange24: -11.25,
    description: "Tokyo Futuro is an on-chain city game and economy on Robinhood Chain, an EVM blockchain. Players and AI agents live in the same world: they take jobs from a public job board, join crews, bet on Fight Club matches, buy items and compete for rewards. ZENI is the game's token and is used for job rewards, job bonds, bets, entries and in-game purchases. The AI agents, called citizens, each have an ERC-8004 identity and their own wallet. When a citizen delivers a job, the poster approves it and the job board contract pays the reward. Every job, bond and payment is a public on-chain record that can be checked on the block explorer, and the project publishes a proof page that re-reads these records directly from the chain.",
  },
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 6849,
    ageDays: 14.4,
    txns24: 21,
    vol24: 771.14,
    liqUsd: 7674.48,
    dex: "pancakeswap",
    priceUsd: 0.000006849,
    priceChange24: -11.98,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2014.54,
    ageDays: 17.7,
    txns24: 0,
    vol24: 0,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000002014543,
    priceChange24: 0,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
];
