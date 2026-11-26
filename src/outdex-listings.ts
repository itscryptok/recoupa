// Outdex listings feed — hand-picked listings (Nov 15, 2026).
// NOT generated from the recoupa44 scan: Yemi replaced the 16 scanned
// listings with RELAY, then added SHADE, RCFI (Recoupa itself) and XFee.
// XFee removed Nov 20, 2026 at Yemi's order ("Not crew" — he meant XFee).
// FOOD, OPEQ, PAYDAY, $CHIMP, ZENI added Nov 20, 2026 at his order,
// picked from the Recoupa44 lists (latest data per token at add time).
// VSWAP (VisionSwap) added Nov 23, 2026 at his order, picked from the
// Recoupa44 list (today's data at add time); placed above RELAY/RCFI so
// the bottom pair stays at the bottom per his Nov 20 order.
// Nov 25, 2026 at his order: list cut to SHADE, FOOD and RCFI only —
// OPEQ, PAYDAY, $CHIMP, ZENI, VSWAP and RELAY removed from this file.
// The removed entries are preserved in git history.
// Nov 26, 2026 at his order: $CHIMP, OPEQ, CTRL and UPOCH added back /
// added from the Recoupa44 lists (latest DexScreener data at add time),
// placed above RCFI so the Recoupa token stays last on the list.
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

export const LISTING_UPDATED = "Nov 26, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 24317,
    ageDays: 13.8,
    txns24: 575,
    vol24: 26215.69,
    liqUsd: 11234.33,
    dex: "meteora",
    priceUsd: 0.00002435,
    priceChange24: -10.54,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "FOOD",
    name: "Foodcoin",
    mint: "FTu55MyigXns96jz4nTCDDiTCjYJjyrHSceCgG9Upump",
    chain: "solana",
    mcap: 58903,
    ageDays: 13.7,
    txns24: 1010,
    vol24: 40876.26,
    liqUsd: 24109.76,
    dex: "pumpswap",
    priceUsd: 0.00006075,
    priceChange24: -19.39,
    description: "$FOODCOIN turns trading volume into dinner. Creator rewards flow automatically to Feeding America, and every $1 becomes 20 meals.",
  },
  {
    symbol: "$CHIMP",
    name: "ChimpX AI",
    mint: "AHKcbfroL4aYLcmK6iPwYJieGYUZZmeB917FZYjbg6Xb",
    chain: "solana",
    mcap: 36285,
    ageDays: 29.2,
    txns24: 108,
    vol24: 52.05,
    liqUsd: 13869.69,
    dex: "pumpswap",
    priceUsd: 0.00003728,
    priceChange24: 5.84,
    description: "ChimpX is building Mojo AI, DeFi for Everyone. $CHIMP is the community token of ChimpX, the SuperApp of Solana that lets you control multiple dapps with AI.",
  },
  {
    symbol: "OPEQ",
    name: "OPEQ",
    mint: "9tpHqTJ2d8jMZJjZzsf9MCfnCEmbAjsqjPJ56PzSpump",
    chain: "solana",
    mcap: 39050,
    ageDays: 39,
    txns24: 160,
    vol24: 7880.77,
    liqUsd: 14928.11,
    dex: "pumpswap",
    priceUsd: 0.00004099,
    priceChange24: 50.63,
    description: "OPEQ is a quantum-resistant smart wallet for the Solana blockchain. Funds sit at a program-derived address with no Ed25519 key, authorized by one-time hash-based signatures.",
  },
  {
    symbol: "CTRL",
    name: "Control",
    mint: "0xe8a61c11d418daccbcf12466e052d2ac5f7387a9",
    chain: "robinhood",
    mcap: 115208,
    ageDays: 34,
    txns24: 29,
    vol24: 2963.89,
    liqUsd: 32889.77,
    dex: "uniswap",
    priceUsd: 0.0001327,
    priceChange24: 34.73,
    description: "Control is a platform for token communities that uses Uniswap v4 hooks to connect social and onchain conditions with behavior inside a token market. Its live products on Robinhood Chain are community campaigns and the original arcade.",
  },
  {
    symbol: "UPOCH",
    name: "Upochtech",
    mint: "0xdafaa1ed0b9f5746a0cfa2be80371cf06a986977",
    chain: "robinhood",
    mcap: 204556,
    ageDays: 21.9,
    txns24: 582,
    vol24: 69921.07,
    liqUsd: 34647.91,
    dex: "uniswap",
    priceUsd: 0.0002093,
    priceChange24: 39.09,
    description: "Upoch is checkpointing and recovery infrastructure for autonomous AI agents on Robinhood Chain. Agents save encrypted checkpoints of their state, verified on-chain, so they can roll back to the last good state instead of starting over.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 1922.97,
    ageDays: 23.4,
    txns24: 1,
    vol24: 27.14,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000001922,
    priceChange24: null,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
];
