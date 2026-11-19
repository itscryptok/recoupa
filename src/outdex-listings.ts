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

export const LISTING_UPDATED = "Nov 19, 2026, 9:22 AM CST";

export const outdexListings: OutdexListing[] = [
  {
    symbol: "RELAY",
    name: "Relay",
    mint: "0x50c5fd46F8E8D56f35c358D99b33E67D8F547777",
    chain: "bnb",
    mcap: 8409,
    ageDays: 13.1,
    txns24: 63,
    vol24: 1996.8,
    liqUsd: 8884.65,
    dex: "pancakeswap",
    priceUsd: 0.000008408,
    priceChange24: -11.57,
    description: "Relay is the token of relaybnb.xyz, an on-chain OTC desk for BNB Chain tokens. Sellers post an ask and buyers post a bid in BNB, and trades settle atomically wallet to wallet in a single transaction minus a 0.30% fee. Tokens stay in the seller's wallet until settlement — no liquidity pool, no slippage.",
  },
  {
    symbol: "SHADE",
    name: "Shade",
    mint: "12bTtDLSegj1rw2oxXWYm63Rxw5QxkVSXDHCEvRShaDe",
    chain: "solana",
    mcap: 17497,
    ageDays: 6.8,
    txns24: 222,
    vol24: 13382.67,
    liqUsd: 9803.07,
    dex: "meteora",
    priceUsd: 0.00001751,
    priceChange24: -3.42,
    description: "The official token of Shade, the private token launchpad on Solana. Launch from a stealth deployer no wallet ever funded. Built on Helius Privacy Rings.",
  },
  {
    symbol: "RCFI",
    name: "Recoupa",
    mint: "BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump",
    chain: "solana",
    mcap: 2014.54,
    ageDays: 16.4,
    txns24: 0,
    vol24: 0,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000002014543,
    priceChange24: 0,
    description: "The Recoupa token. Hold 500,000 $Recoupa for more than 24 hours before a rug pull to qualify for a share of fee rewards when you file a claim.",
  },
  {
    symbol: "XFee",
    name: "XFee",
    mint: "7DicoaDnuUPJKVCMLg8h2CLPqt4Xjcy6ZNHJYgFApump",
    chain: "solana",
    mcap: 3418.1,
    ageDays: 4.5,
    txns24: 10,
    vol24: 192.1,
    liqUsd: 0,
    dex: "pumpfun",
    priceUsd: 0.000003418,
    priceChange24: -8.99,
    description: "Launch a coin connected to any X account. When it replies to you, you get paid, straight to your X account.",
  },
];
