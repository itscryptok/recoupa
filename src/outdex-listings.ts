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

export const LISTING_UPDATED = "Nov 25, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 26965,
    ageDays: 12.8,
    txns24: 566,
    vol24: 25466.08,
    liqUsd: 11559.85,
    dex: "meteora",
    priceUsd: 0.000027,
    priceChange24: -2,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "FOOD",
    name: "Foodcoin",
    mint: "FTu55MyigXns96jz4nTCDDiTCjYJjyrHSceCgG9Upump",
    chain: "solana",
    mcap: 75899,
    ageDays: 12.7,
    txns24: 1304,
    vol24: 51426.6,
    liqUsd: 26795.07,
    dex: "pumpswap",
    priceUsd: 0.00007828,
    priceChange24: -8.24,
    description: "$FOODCOIN turns trading volume into dinner. Creator rewards flow automatically to Feeding America, and every $1 becomes 20 meals.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 1974.33,
    ageDays: 22.4,
    txns24: 13,
    vol24: 211.54,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000001974,
    priceChange24: -1.25,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
];
