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

export const LISTING_UPDATED = "Nov 17, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 9236,
    ageDays: 11.1,
    txns24: 70,
    vol24: 1440.28,
    liqUsd: 9291.03,
    dex: "pancakeswap",
    priceUsd: 0.000009236,
    priceChange24: -15.28,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 18957,
    ageDays: 4.8,
    txns24: 1317,
    vol24: 66244.87,
    liqUsd: 10302.64,
    dex: "meteora",
    priceUsd: 0.00001897,
    priceChange24: -24.76,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2032.9,
    ageDays: 14.4,
    txns24: 2,
    vol24: 14.8,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000002032,
    priceChange24: -0.27,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
  {
    symbol: "XFee",
    name: "XFee",
    mint: "7DicoaDnuUPJKVCMLg8h2CLPqt4Xjcy6ZNHJYgFApump",
    chain: "solana",
    mcap: 3949.51,
    ageDays: 2.5,
    txns24: 2,
    vol24: 11.87,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000003949,
    priceChange24: -6.22,
    description: "Launch a coin connected to any X account. When it replies to you, you get paid, straight to your X account.",
  },
];
