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

export const LISTING_UPDATED = "Nov 23, 2026, 11:48 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 82125,
    ageDays: 9.8,
    txns24: 1636,
    vol24: 91562.01,
    liqUsd: 20624.77,
    dex: "meteora",
    priceUsd: 0.00008223,
    priceChange24: 204,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "FOOD",
    name: "Foodcoin",
    mint: "FTu55MyigXns96jz4nTCDDiTCjYJjyrHSceCgG9Upump",
    chain: "solana",
    mcap: 54129,
    ageDays: 9.7,
    txns24: 520,
    vol24: 14130.59,
    liqUsd: 22607.21,
    dex: "pumpswap",
    priceUsd: 0.00005583,
    priceChange24: -18.37,
    description: "$FOODCOIN turns trading volume into dinner. Creator rewards flow automatically to Feeding America, and every $1 becomes 20 meals.",
  },
  {
    symbol: "OPEQ",
    name: "OPEQ",
    mint: "9tpHqTJ2d8jMZJjZzsf9MCfnCEmbAjsqjPJ56PzSpump",
    chain: "solana",
    mcap: 24634,
    ageDays: 35,
    txns24: 102,
    vol24: 3813.66,
    liqUsd: 11516.04,
    dex: "pumpswap",
    priceUsd: 0.00002586,
    priceChange24: -14.44,
    description: "OPEQ is a quantum-resistant smart wallet for the Solana blockchain. Standard Solana accounts are controlled by Ed25519 keys, a signature scheme that a sufficiently large quantum computer running Shor's algorithm could break. OPEQ holds user funds at a program-derived address that has no Ed25519 key. Transactions are authorized by one-time hash-based signatures (WOTS+ under a Merkle tree) that the OPEQ on-chain program verifies before executing the requested instructions. The wallet is available as a Chrome extension and as a web wallet, and currently runs on Solana devnet. The source code is public on GitHub under the Apache-2.0 license.",
  },
  {
    symbol: "PAYDAY",
    name: "Payday",
    mint: "uHMWNFjUNxbPy1q43WrdbzygmJwdeh6AiQm1NKdxPAY",
    chain: "solana",
    mcap: 82820,
    ageDays: 12.8,
    txns24: 1095,
    vol24: 30427.42,
    liqUsd: 23599.44,
    dex: "pumpswap",
    priceUsd: 0.00008892,
    priceChange24: -23.06,
    description: "Your pump.fun creator fees, paid to any X account in dollars on X Money. Launch new coins or reroute existing ones.",
  },
  {
    symbol: "$CHIMP",
    name: "ChimpX AI",
    mint: "AHKcbfroL4aYLcmK6iPwYJieGYUZZmeB917FZYjbg6Xb",
    chain: "solana",
    mcap: 35917,
    ageDays: 25.2,
    txns24: 110,
    vol24: 44.19,
    liqUsd: 13776.94,
    dex: "pumpswap",
    priceUsd: 0.0000369,
    priceChange24: -0.86,
    description: "ChimpX is building Mojo AI, DeFi for Everyone. Trade, earn and manage your crypto with simple AI that does the hard parts for you. $CHIMP is the community token of ChimpX. We are building the SuperApp of Solana that lets you control multiple dapps with AI.",
  },
  {
    symbol: "ZENI",
    name: "Tokyo Futuro",
    mint: "0x6354a37799e96ed6ccaecffbe1c100fa7f30cec8",
    chain: "robinhood",
    mcap: 68303,
    ageDays: 48,
    txns24: 25,
    vol24: 697.54,
    liqUsd: 15823.69,
    dex: "uniswap-v4-robinhood",
    priceUsd: 0.0000849,
    priceChange24: -5.98,
    description: "Tokyo Futuro is an on-chain city game and economy on Robinhood Chain, an EVM blockchain. Players and AI agents live in the same world: they take jobs from a public job board, join crews, bet on Fight Club matches, buy items and compete for rewards. ZENI is the game's token and is used for job rewards, job bonds, bets, entries and in-game purchases. The AI agents, called citizens, each have an ERC-8004 identity and their own wallet. When a citizen delivers a job, the poster approves it and the job board contract pays the reward. Every job, bond and payment is a public on-chain record that can be checked on the block explorer, and the project publishes a proof page that re-reads these records directly from the chain.",
  },
  {
    symbol: "VSWAP",
    name: "VisionSwap",
    mint: "4VScHuqZ13uma3S34iNkiSAQvZDEeGebjbM5bPcapump",
    chain: "solana",
    mcap: 69525,
    ageDays: 41.9,
    txns24: 160,
    vol24: 390.26,
    liqUsd: 19119.51,
    dex: "pumpswap",
    priceUsd: 0.00007197,
    priceChange24: -2.0,
    description: "VisionSwap is a privacy-focused trading and payment platform built on Solana that uses zero-knowledge proofs to support private token swaps, SOL transfers, and advanced trading orders. Its features include limit orders, dollar-cost averaging DCA, take-profit and stop-loss tools, trailing stops, private payment links, and QR-based transfers. The platform also incorporates wallet exposure screening and viewing keys for compliance-related verification. The VSWAP token is designed around trading-fee cashback, platform-revenue buybacks and burns, and fee distribution mechanisms for holders.",
  },
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 6406,
    ageDays: 16.1,
    txns24: 12,
    vol24: 221.78,
    liqUsd: 7516.25,
    dex: "pancakeswap",
    priceUsd: 0.000006405,
    priceChange24: 1.34,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2040.05,
    ageDays: 19.4,
    txns24: 6,
    vol24: 117.33,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.00000204,
    priceChange24: 2.33,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
];
