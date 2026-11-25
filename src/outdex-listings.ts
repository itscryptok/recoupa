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
