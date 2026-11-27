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

export const LISTING_UPDATED = "Nov 27, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 23016,
    ageDays: 14.8,
    txns24: 303,
    vol24: 11987.28,
    liqUsd: 10980.92,
    dex: "meteora",
    priceUsd: 0.00002304,
    priceChange24: -5.54,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "FOOD",
    name: "Foodcoin",
    mint: "FTu55MyigXns96jz4nTCDDiTCjYJjyrHSceCgG9Upump",
    chain: "solana",
    mcap: 50759,
    ageDays: 14.7,
    txns24: 527,
    vol24: 18777.36,
    liqUsd: 22510.69,
    dex: "pumpswap",
    priceUsd: 0.00005235,
    priceChange24: -14.42,
    description: "$FOODCOIN turns trading volume into dinner. Creator rewards flow automatically to Feeding America, and every $1 becomes 20 meals.",
  },
  {
    symbol: "$CHIMP",
    name: "ChimpX AI",
    mint: "AHKcbfroL4aYLcmK6iPwYJieGYUZZmeB917FZYjbg6Xb",
    chain: "solana",
    mcap: 37446,
    ageDays: 30.2,
    txns24: 77,
    vol24: 44.32,
    liqUsd: 14345.87,
    dex: "pumpswap",
    priceUsd: 0.00003847,
    priceChange24: 2.82,
    description: "ChimpX is building Mojo AI, DeFi for Everyone. $CHIMP is the community token of ChimpX, the SuperApp of Solana that lets you control multiple dapps with AI.",
  },
  {
    symbol: "OPEQ",
    name: "OPEQ",
    mint: "9tpHqTJ2d8jMZJjZzsf9MCfnCEmbAjsqjPJ56PzSpump",
    chain: "solana",
    mcap: 35972,
    ageDays: 40,
    txns24: 101,
    vol24: 3245.75,
    liqUsd: 14276.76,
    dex: "pumpswap",
    priceUsd: 0.00003776,
    priceChange24: -6.59,
    description: "OPEQ is a quantum-resistant smart wallet for the Solana blockchain. Funds sit at a program-derived address with no Ed25519 key, authorized by one-time hash-based signatures.",
  },
  {
    symbol: "CTRL",
    name: "Control",
    mint: "0xe8a61c11d418daccbcf12466e052d2ac5f7387a9",
    chain: "robinhood",
    mcap: 125544,
    ageDays: 35,
    txns24: 30,
    vol24: 5775.71,
    liqUsd: 34564.74,
    dex: "uniswap",
    priceUsd: 0.0001446,
    priceChange24: 11.95,
    description: "Control is a platform for token communities that uses Uniswap v4 hooks to connect social and onchain conditions with behavior inside a token market. Its live products on Robinhood Chain are community campaigns and the original arcade.",
  },
  {
    symbol: "UPOCH",
    name: "Upochtech",
    mint: "0xdafaa1ed0b9f5746a0cfa2be80371cf06a986977",
    chain: "robinhood",
    mcap: 240241,
    ageDays: 22.9,
    txns24: 455,
    vol24: 40252.4,
    liqUsd: 37403.14,
    dex: "uniswap",
    priceUsd: 0.0002459,
    priceChange24: 32.71,
    description: "Upoch is checkpointing and recovery infrastructure for autonomous AI agents on Robinhood Chain. Agents save encrypted checkpoints of their state, verified on-chain, so they can roll back to the last good state instead of starting over.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 1951.45,
    ageDays: 24.4,
    txns24: 0,
    vol24: 0,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.00000195145,
    priceChange24: 0,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
];
