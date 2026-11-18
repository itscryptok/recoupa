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

export const LISTING_UPDATED = "Nov 18, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 8804,
    ageDays: 12.1,
    txns24: 41,
    vol24: 743.05,
    liqUsd: 9051.92,
    dex: "pancakeswap",
    priceUsd: 0.000008803,
    priceChange24: -5.02,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 18526,
    ageDays: 5.8,
    txns24: 499,
    vol24: 25271.41,
    liqUsd: 10065.28,
    dex: "meteora",
    priceUsd: 0.00001854,
    priceChange24: -0.09,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2019.43,
    ageDays: 15.4,
    txns24: 1,
    vol24: 4.93,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000002019,
    priceChange24: null,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
  {
    symbol: "XFee",
    name: "XFee",
    mint: "7DicoaDnuUPJKVCMLg8h2CLPqt4Xjcy6ZNHJYgFApump",
    chain: "solana",
    mcap: 4023.42,
    ageDays: 3.5,
    txns24: 3,
    vol24: 104.89,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000004023,
    priceChange24: 5.55,
    description: "Launch a coin connected to any X account. When it replies to you, you get paid, straight to your X account.",
  },
];
