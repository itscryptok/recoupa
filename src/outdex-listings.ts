// Outdex listings feed — hand-picked listings (Nov 15, 2026).
// NOT generated from the recoupa44 scan: Yemi replaced the 16 scanned
// listings with RELAY, then added SHADE, RCFI (Recoupa itself) and XFee.
// Order is the order of his picks. The recoupa44 set is preserved in git
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

export const LISTING_UPDATED = "Nov 16, 2026, 9:23 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 10890,
    ageDays: 10.1,
    txns24: 78,
    vol24: 2278.85,
    liqUsd: 10048.01,
    dex: "pancakeswap",
    priceUsd: 0.00001089,
    priceChange24: -17.75,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 25526,
    ageDays: 3.8,
    txns24: 777,
    vol24: 36270.92,
    liqUsd: 11693.54,
    dex: "meteora",
    priceUsd: 0.00002554,
    priceChange24: 51.98,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2026.85,
    ageDays: 13.4,
    txns24: 0,
    vol24: 0,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000002026852,
    priceChange24: 0,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
  {
    symbol: "XFee",
    name: "XFee",
    mint: "7DicoaDnuUPJKVCMLg8h2CLPqt4Xjcy6ZNHJYgFApump",
    chain: "solana",
    mcap: 4020.19,
    ageDays: 1.5,
    txns24: 10,
    vol24: 19.72,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.00000402,
    priceChange24: 20.78,
    description: "Launch a coin connected to any X account. When it replies to you, you get paid, straight to your X account.",
  },
];
