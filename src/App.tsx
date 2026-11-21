import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ChevronDown, Menu, Search, SunMoon, X, Flame, Copy, Check, Home } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { outdexListings, LISTING_UPDATED, type OutdexListing } from './outdex-listings';
import AddyPage from '@/pages/addy';
import {
  ApiError,
  fetchClaims,
  submitClaim as submitClaimApi,
  migrateClaim,
  submitContactMessage,
  type Claim,
  type ContactTopic,
  type TxChain,
} from './api';
import referenceImage from '@assets/IMG_1197_recoupa_car_clean_local.jpeg';
import {
  Link,
  Route,
  Router as WouterRouter,
  Switch,
  useLocation,
} from 'wouter';

type Destination =
  | 'Discover'
  | 'Outdex500'
  | 'Claim'
  | 'Buy'
  | 'Projects'
  | 'Contact'
  | 'Perps'
  | 'TCapital'
  | 'Resources';

type DiscoverTab = 'Thesis' | 'About';

type Token = OutdexListing;

const destinations: Destination[] = [
  'Discover',
  'Outdex500',
  'Claim',
  'Buy',
  'Projects',
  'Contact',
  'Perps',
  'TCapital',
  'Resources',
];

const currentViewLabels: Record<Destination, string> = {
  Discover: 'Discover the mission',
  Outdex500: 'The outsider dex',
  Claim: 'Your Claim portal',
  Buy: 'Buy crypto',
  Projects: 'List your project',
  Contact: 'Contact us',
  Perps: 'PvP Perps',
  TCapital: 'Thesis capital',
  Resources: 'Contacts and resources',
};

const pageAccents: Record<Destination, string> = {
  Discover: '#047857',
  Outdex500: '#1D4ED8',
  Claim: '#BE123C',
  Buy: '#EA580C',
  Projects: '#0891B2',
  Contact: '#DB2777',
  Perps: '#7C3AED',
  TCapital: '#B45309',
  Resources: '#0F766E',
};

const pageButtonLabels: Record<Destination, string> = {
  Discover: 'Find out more',
  Outdex500: 'View the Outdex500',
  Claim: 'File a claim to recoup',
  Buy: 'How to buy',
  Projects: 'List your project',
  Contact: 'Reach us here',
  Perps: 'New launch Perps',
  TCapital: 'Thesis capital',
  Resources: 'Find resources',
};

const tokenList: Token[] = outdexListings;

// Beginner wallet-setup links shown on the Buy destination.
const PHANTOM_GUIDE_URL =
  'https://www.coingecko.com/learn/ultimate-guide-to-solana-phantom-wallet';
const PHANTOM_VIDEO_URL = 'https://www.youtube.com/watch?v=xMQpQ6wa7Q8';

// Public contact emails (Yemi's order, Nov 21, 2026).
const SUPPORT_EMAIL = 'support@recoupafi.com';
const CONTACT_EMAIL = 'itscryptok@gmail.com';

type SubmittedClaim = {
  claimNumber: string;
  walletAddress: string;
  lossTokenCa: string;
  dateFiled: string;
};

const SUBMITTED_CLAIMS_KEY = 'recoupa_claims_submitted';

function loadSubmittedClaims(): SubmittedClaim[] {
  try {
    const raw = localStorage.getItem(SUBMITTED_CLAIMS_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (claim): claim is SubmittedClaim =>
        typeof claim === 'object' &&
        claim !== null &&
        typeof (claim as SubmittedClaim).claimNumber === 'string' &&
        typeof (claim as SubmittedClaim).walletAddress === 'string' &&
        typeof (claim as SubmittedClaim).lossTokenCa === 'string' &&
        typeof (claim as SubmittedClaim).dateFiled === 'string',
    );
  } catch {
    return [];
  }
}

function formatClaimDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) {
    return iso;
  }
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const TX_EXPLORERS: Record<TxChain, string> = {
  solana: 'https://explorer.solana.com/tx/',
  base: 'https://basescan.org/tx/',
  bsc: 'https://bscscan.com/tx/',
  robinhood: 'https://robinhoodchain.blockscout.com/tx/',
};

function txExplorerUrl(chain: TxChain | null, txHash: string) {
  return `${TX_EXPLORERS[chain ?? 'solana']}${txHash}`;
}

type ClaimTab = 'new' | 'open' | 'rejected' | 'paid';

const NEW_CLAIM_AGE_MS = 48 * 60 * 60 * 1000;

function claimTabOf(claim: Claim): ClaimTab {
  if (claim.status === 'rejected') return 'rejected';
  if (claim.status === 'paid') return 'paid';
  const ageMs = Date.now() - new Date(claim.created_at).getTime();
  return ageMs < NEW_CLAIM_AGE_MS ? 'new' : 'open';
}

const CLAIMS_PAGE_SIZE = 10;

// Public board search: matches the loss-token CA, the wallet address, the
// claim number, or the filed date in any common pattern (2026-11-21,
// Nov 21, 2026, 11/21/2026, or any substring of those).
function claimMatchesSearch(claim: Claim, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const filed = claim.created_at.slice(0, 10);
  const [year, month, day] = filed.split('-').map(Number);
  const haystacks = [
    claim.claim_number,
    claim.wallet_address,
    claim.loss_token_ca,
    filed,
    formatClaimDate(filed),
    filed.replace(/-/g, '/'),
  ];
  if (year && month && day) {
    haystacks.push(`${month}/${day}/${year}`, `${month}-${day}-${year}`);
  }
  return haystacks.some((value) => value.toLowerCase().includes(q));
}

function formatMcap(value: number) {
  if (value < 1000)
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  return `$${(value / 1000).toFixed(1)}K`;
}

function formatUsd(value: number) {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatAge(days: number) {
  return `${days.toFixed(1)}d`;
}

function formatPrice(value: number) {
  return `$${value.toFixed(8)}`;
}

function formatChange(value: number | null) {
  if (value === null) return '—';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

const chainLabels: Record<string, string> = {
  bnb: 'BNB',
  bsc: 'BNB',
  solana: 'Solana',
  base: 'Base',
  ethereum: 'Ethereum',
};

function formatChain(chain: string) {
  return chainLabels[chain.toLowerCase()] ?? (chain.charAt(0).toUpperCase() + chain.slice(1));
}

const dexLabels: Record<string, string> = {
  pancakeswap: 'PancakeSwap',
  meteora: 'Meteora',
  pumpfun: 'pump.fun',
  raydium: 'Raydium',
  'pons-v2-dex': 'Pons V2',
};

function formatDex(dex: string) {
  return dexLabels[dex.toLowerCase()] ?? (dex.charAt(0).toUpperCase() + dex.slice(1));
}

function truncateMint(mint: string) {
  return `${mint.slice(0, 6)}…${mint.slice(-4)}`;
}

const aboutParagraphs = [
  'Recoupa is an Outdex and loss-prevention system created specifically for the crypto market. Our Outdex is a selected index for outsiders, cautious traders, and newcomers who do not have insider access. It highlights early-stage projects that we believe show strong potential for long-term growth. Some of these projects may have the ability to reach a billion-dollar market value over time. Our goal is to help users discover promising opportunities earlier while entering the market with better information, stronger awareness, and less avoidable risk.',
  'Recoupa also provides a casualty-claim tool for eligible users who experience a crypto loss. Users who hold the $Recoupa token can use this tool to file a loss claim for review. An approved claim may help recover part of the lost value, depending on the circumstances and applicable requirements. Full recovery is not guaranteed, but partial support may give a user something to begin again with after a difficult loss. Visit the Claim section to understand how the process works, what losses may qualify, and which requirements apply.',
];

const whySections = [
  {
    id: 'market-risks',
    title: 'The Bad Narrative',
    color: '#BE123C',
    paragraphs: [
      'Buying tokens in the fast markets exposes 99% of participants to severe, life-altering losses. The risk falls on ordinary participants, not on the insider traders who find projects early and pump and dump them, or the millions of rug-pull scam artists.',
      'That reputation is not unfounded. Too many outsiders encounter insider dealing, false promoters, and projects built solely for rapid profit. In fast-moving markets, weak safeguards and the pressure to act quickly leave ordinary participants exposed to pump-and-dump schemes, rug pulls, fear-driven buying, and trading that resembles gambling. It is little surprise that many careful people choose to stay away entirely. Just know that if you decide to go hunt crypto gains from those fast profit platforms like ..., you will be dealing with the worst of the worst scammers in the world.',
      'Yet that reputation does not describe every project. Some new ventures are built on genuine ideas and can develop into substantial companies with early support. The real challenge is distinguishing sound ideas from short-term hype and deception, and that is where Recoupa contributes: clear research, disciplined caution, and a better understanding of risk for outsiders.',
    ],
  },
  {
    id: 'opportunity-ahead',
    title: 'The Good Onboarding',
    color: '#047857',
    paragraphs: [
      'Professional onboarding means bringing people into crypto through education rather than excitement or pressure. More newcomers will enter the market over time, and the decisive question is not whether they join, but whether their first experience is safe and well informed. Without guidance, a new participant can easily begin in the riskiest corners of the market. A sound start rests on clear information, careful research, and genuine risk awareness.',
      'Recoupa provides structured tools for that journey, designed for people without insider connections. The Outdex presents selected early-stage projects, so opportunities can be explored from an informed starting point. The claim tool allows eligible $Recoupa token holders to submit a claim for review following a loss on other tokens. Together, these tools combine opportunity discovery with loss awareness and a possible path to partial recovery, so participants can proceed on informed interest rather than impulsive speculation.',
    ],
  },
  {
    id: 'cost-of-waiting',
    title: 'The Ugly Fear',
    color: '#B45309',
    paragraphs: [
      'The Ugly Fear is straightforward: caution can protect you from poor projects, yet it can also exclude you from exceptional ones. The most costly outcome is discovering a strong project only after its greatest growth has passed. Early participation generally offers more than entering once a project is already prominent and expensive. Many outsiders hesitate because the risks are unclear and reliable information is scarce. That caution is understandable, but waiting without a trusted research process means forfeiting meaningful opportunities.',
      'The response is neither rushing into every new project nor following market enthusiasm without evidence. A disciplined approach examines the project, understands its purpose, checks the warning signs, and weighs whether the potential reward justifies the risk. Recoupa makes that process accessible to people without insider contacts or specialist knowledge, highlighting selected early opportunities while keeping caution and loss prevention at the center. The objective is clear: neither arrive too late nor act carelessly.',
    ],
  },
] as const;

function Mark() {
  return (
    <span className="recoupa-mark" aria-hidden="true">
      <span className="mark-lens mark-lens-left" />
      <span className="mark-lens mark-lens-right" />
      <span className="mark-bridge" />
      <span className="mark-feather" />
    </span>
  );
}

function LandingPage() {
  const [caCopied, setCaCopied] = useState(false);
  const copyCa = async () => {
    const contract = 'BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump';
    try {
      await navigator.clipboard.writeText(contract);
    } catch {
      const area = document.createElement('textarea');
      area.value = contract;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCaCopied(true);
    window.setTimeout(() => setCaCopied(false), 2000);
  };
  return (
    <main className="reference-landing" data-testid="page-landing">
      <h1 className="sr-only">Recoupa crypto discovery and loss prevention</h1>
      <div className="reference-image-wrap">
        <img
          src={referenceImage}
          alt="Recoupa — Crypto is bad, Recoupa is breaking bad"
          className="reference-image"
        />
        <span className="reference-car-copy" aria-hidden="true">
          <span className="reference-pointer">☞</span>
          <span>or buck around and find out</span>
        </span>
        <div className="reference-ca-copy">
          <span>
            CA:{' '}
            <a
              className="reference-ca-link"
              href="https://pump.fun/coin/BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump"
              target="_blank"
              rel="noopener noreferrer"
            >
              BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump
            </a>
          </span>
          <button
            type="button"
            className="reference-ca-button"
            onClick={copyCa}
            aria-label="Copy contract address"
            data-testid="button-copy-ca"
          >
            {caCopied ? <Check size={16} /> : <Copy size={16} />}
            {caCopied ? 'Copied' : null}
          </button>
        </div>
        <Link
          href="/explore"
          className="reference-button"
          aria-label="enter here"
          data-testid="link-explore"
        >
          enter here
        </Link>
      </div>
    </main>
  );
}

function updateMetaTag(
  attribute: 'name' | 'property',
  key: string,
  content: string,
) {
  let tag = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

function Seo() {
  const [location] = useLocation();

  useEffect(() => {
    const isExplore = location === '/explore' || location.startsWith('/explore/');
    const isPrivacy = location === '/privacy';
    const isTerms = location === '/terms';
    const title = isExplore
      ? 'Recoupa Explore | Crypto Discovery & Loss Prevention'
      : isPrivacy
        ? 'Privacy Policy | Recoupa'
        : isTerms
          ? 'Terms of Service | Recoupa'
          : 'Recoupa | Crypto Discovery & Loss Prevention';
    const description = isExplore
      ? 'Explore Recoupa’s curated crypto Outdex, compare promising projects, and find early opportunities with a clearer, lower-risk lens.'
      : isPrivacy
        ? 'How Recoupa handles your information: what we collect when you file a claim, what stays on your device, and what we never ask for.'
        : isTerms
          ? 'The terms for using Recoupa: the Outdex, the claim rules, and what Recoupa does and does not promise.'
          : 'Recoupa helps non-insider crypto traders discover promising projects early while reducing risk and recouping losses from the crypto market.';
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const canonicalPath = `${basePath}${isExplore ? '/explore' : isPrivacy ? '/privacy' : isTerms ? '/terms' : '/'}` || '/';
    const canonicalUrl = new URL(canonicalPath, window.location.origin).href;

    document.title = title;
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', canonicalUrl);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('property', 'og:site_name', 'Recoupa');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:card', 'summary');

    let canonical = document.head.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [location]);

  return null;
}

function ExplorePage() {
  const [destination, setDestination] = useState<Destination>('Discover');
  const [tab, setTab] = useState<DiscoverTab>('Thesis');
  const [selectedWhyCard, setSelectedWhyCard] = useState<string | null>('market-risks');
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [nightMode, setNightMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeMenuOnOutsideClick = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', closeMenuOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeMenuOnOutsideClick);
  }, [menuOpen]);

  useEffect(() => {
    setHeroExpanded(false);
  }, [destination, tab, selectedToken]);

  useEffect(() => {
    if (!contentOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContentOpen(false);
        setSelectedToken(null);
        setSearchQuery('');
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [contentOpen]);

  const selectDestination = (next: Destination) => {
    setDestination(next);
    setMenuOpen(false);
    if (next !== 'Outdex500') {
      setSelectedToken(null);
    }
  };

  const currentIndex = destinations.indexOf(destination);

  const matchingTokens = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query || selectedToken) {
      return [];
    }

    return tokenList
      .filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query),
      )
      .slice(0, 6);
  }, [searchQuery, selectedToken]);

  const selectToken = (token: Token) => {
    setSelectedToken(token);
    setDestination('Outdex500');
    setSearchQuery(`${token.name} (${token.symbol})`);
    setMenuOpen(false);
  };

  const returnToOutdex = () => {
    setSelectedToken(null);
    setSearchQuery('');
    setDestination('Outdex500');
  };

  const closeContentOverlay = () => {
    setContentOpen(false);
    setSelectedToken(null);
    setSearchQuery('');
  };

  const selectWhySection = (id: string) => {
    setSelectedWhyCard(id);
  };

  const getHeroText = () => {
    // Every hero ends with the financial-advice disclaimer (Yemi's order
    // Nov 16, 2026). The old Discover wording ("This is not financial
    // advice. Please consult with your financial advisor first.") was
    // removed as a duplicate of this line.
    const DISCLAIMER = "None of this represents financial advice. Talk to your financial advisor.";
    let text: string;
    if (selectedToken) {
      text = `Here is the data for ${selectedToken.name}.`;
    } else if (destination === 'Discover') {
      if (tab === 'Thesis') {
        text = "Does money dictate how you live your life - when you wake up, when you sleep and more? Crypto might actually be your answer to financial freedom. But crypto is bad and risky. So how did we get around that bad and risky side? We simply started following two things: Our own Outdex list (built for Outsider trading) and the loss Claim tool that is built to help anyone recover some of their losses in case something goes wrong with any of our recommended projects on the Outdex500. With this, we hope anyone can onboard and buy tokens of promising projects that are listed on our Outdex500 with confidence. But you will need to buy and hold our Recoupa token in order to qualify for a loss claim. See more under the claim section.\n\nIf you have been trading crypto before now, we think you should stop buying new launches. If you don't have insider information about a project token launch, then do not buy its new launch. Don't be deceived by the possibility to make big gains from new launches because 99% of the time you're going to end up being scammed or being dumped on. Let all the projects cool down for about 4 days or better still, follow the Outdex 500 listing on this platform to find the most promising projects after they have cooled down.";
      } else {
        text = "Selected crypto projects in the Outdex. A safety system that helps prevent losses.";
      }
    } else if (destination === 'Outdex500') {
      text = "Find promising projects early, before the wider market notices them. Watch them grow into long-term companies with substantial market capitalization. If a project we recommend on the Outdex500 page fails in a rug pull, we refund part of your losses. You must hold 500,000 $Recoupa tokens for more than 24 hours before the rug pull happens. You then qualify for a share of the fee rewards earned from $Recoupa trading activity. When you submit a claim, we review the activity on your wallet to confirm your eligibility and decide how much to send you. All filed claims and completed payout transaction hashes are public on this webapp.";
    } else if (destination === 'Claim') {
      text = "Lost money on other crypto tokens? To receive a paid claim, you must have held 500,000 $Recoupa tokens for more than 24 hours before the loss token crash, the token you lost money on must be one of the tokens on our Outdex list, and you must have held that loss token for more than 24 hours before the crash. The loss token must also have lost 95% of its value and be irredeemable. Payouts come from the fees accumulated from trading $Recoupa. Your share depends on the value of the loss token you hold as a percentage of all claims filed for that same token, and on the fees available for payout after 40% is set aside for marketing and development. File a claim below.";
    } else if (destination === 'Buy') {
      text = "New to crypto? You need a Solana wallet before you can buy anything. Here is how to set one up in a few minutes.\n\n1. Download Phantom, the most popular Solana wallet, from phantom.com or your phone's official app store. Only use the official links — fake wallet apps steal funds.\n\n2. Open Phantom and create a new wallet. Write down your 12-word secret recovery phrase on paper and keep it somewhere private and offline. Never share it with anyone, not even Phantom support.\n\n3. Add SOL to your wallet. Buy SOL on an exchange and send it to your wallet address, or buy it directly inside Phantom.\n\n4. You are ready to buy. Find a token on the Outdex list, then swap SOL for it inside Phantom or on pump.fun using the token's contract address.";
    } else if (destination === 'Projects') {
      text = "Building a crypto project with real utility? If your project solves a real problem and your team is committed for the long term, we want to hear from you. We vet projects for the Outdex500 — our list of promising projects our community can buy with confidence. Tell us about your project through the contact form, or email us at support@recoupafi.com or itscryptok@gmail.com.";
    } else if (destination === 'Contact') {
      text = "Questions about a claim, a project listing, or anything else on Recoupa? You can reach us about getting your project vetted for the Outdex500, help with a loss claim, feedback on the site, or any general question. Send a message through the form below and we will reply to your email, or write to us directly at support@recoupafi.com or itscryptok@gmail.com.";
    } else if (destination === 'Perps') {
      text = "Go long or go short on any new launch. Another finds your position and decides to counter it.";
    } else {
      text = "Learn what you need to trade with more confidence.";
    }
    return `${text} ${DISCLAIMER}`;
  };

  return (
    <main
      className={`reference-explore ${nightMode ? 'night-mode' : 'day-mode'} page-${destination.toLowerCase()}`}
      style={{ '--page-accent': pageAccents[destination] } as CSSProperties}
      data-testid="page-explore"
    >
      <div className="explore-floating-nav-wrap">
        <nav ref={navRef} className="explore-floating-nav" aria-label="Explore">
          <Link href="/" className="explore-brand" aria-label="Recoupa">
            <Mark />
            <span>Recoupa</span>
          </Link>

          <div className={`explore-nav-links ${menuOpen ? 'is-open' : ''}`}>
            <div className="explore-nav-links-inner">
              {destinations.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={destination === item ? 'active' : ''}
                  onClick={() => selectDestination(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="explore-nav-actions">
            <Link href="/" className="home-button" aria-label="Home" title="Home">
              <Home size={18} />
            </Link>
            <button
              className="mode-button"
              type="button"
              onClick={() => setNightMode((mode) => !mode)}
              aria-pressed={nightMode}
              aria-label={nightMode ? 'Switch to day mode' : 'Switch to night mode'}
              title={nightMode ? 'Switch to day mode' : 'Switch to night mode'}
            >
              <SunMoon size={18} />
            </button>
            <button
              className="mobile-menu-button"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </div>

      <section className="explore-workspace">
        <div className="hero-page-nav">
          <button
            type="button"
            className="hero-page-arrow"
            aria-label="Previous page"
            onClick={() =>
              selectDestination(
                destinations[
                  (currentIndex - 1 + destinations.length) %
                    destinations.length
                ],
              )
            }
          >
            {'<'}
          </button>
          <button
            type="button"
            className="hero-page-arrow"
            aria-label="Next page"
            onClick={() =>
              selectDestination(
                destinations[(currentIndex + 1) % destinations.length],
              )
            }
          >
            {'>'}
          </button>
        </div>
        <div className="hero-card">
          <button
            type="button"
            className={`hero-toggle-button${heroExpanded ? ' is-expanded' : ''}`}
            aria-expanded={heroExpanded}
            aria-controls="hero-description"
            aria-label={heroExpanded ? 'Collapse hero text' : 'Expand hero text'}
            onClick={() => setHeroExpanded((expanded) => !expanded)}
            data-testid="button-toggle-hero-description"
          >
            <ChevronDown size={18} />
          </button>
          <div
            id="hero-description"
            className={`hero-text ${heroExpanded ? 'is-expanded' : ''}`}
          >
            {getHeroText()
              .split('\n\n')
              .map((paragraph, index) => (
                <p key={index} className="hero-paragraph">
                  {paragraph}
                </p>
              ))}
          </div>
          {destination === 'Buy' && (
            <div className="hero-links">
              <a
                href={PHANTOM_GUIDE_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Detailed setup guide
              </a>
              <a
                href={PHANTOM_VIDEO_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch the video
              </a>
            </div>
          )}
          <div className="hero-metrics">
            <div className="hero-metric">
              <span className="hero-metric-label">CURRENT VIEW</span>
              <button
                type="button"
                className="hero-metric-value font-mono"
                aria-expanded={heroExpanded}
                aria-controls="hero-description"
                onClick={() => setHeroExpanded((expanded) => !expanded)}
              >
                {currentViewLabels[destination]}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="page-cta-button"
          onClick={() => setContentOpen(true)}
        >
          {destination === 'Discover' && tab === 'About'
            ? 'Read about Recoupa'
            : pageButtonLabels[destination]}
        </button>
      </section>

      {contentOpen && (
        <div
          className="content-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${destination} content`}
        >
          <div className="content-overlay-inner">
            <button
              type="button"
              className="overlay-back-button"
              onClick={closeContentOverlay}
              aria-label="Back"
            >
              <ArrowLeft size={22} />
            </button>

        {!selectedToken && (
          <div className="workspace-tools">
            <div className="tools-top">
              <div className="tools-label">
                <Flame size={18} /> <span>RECOUPA {destination.toUpperCase()}</span>
              </div>
              {destination === 'Outdex500' && (
                <div className={`search-field-wrap ${matchingTokens.length ? 'has-results' : ''}`}>
                  <label className="search-field">
                    <Search size={18} />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search tokens..."
                      aria-label="Search tokens"
                      autoComplete="off"
                    />
                    {!searchQuery && <kbd>Ctrl K</kbd>}
                  </label>
                  {matchingTokens.length > 0 && (
                    <div className="autocomplete-results" role="listbox" aria-label="Matching tokens">
                      {matchingTokens.map((token) => (
                        <button
                          key={token.symbol}
                          type="button"
                          role="option"
                          onClick={() => selectToken(token)}
                        >
                          <span className="token-symbol font-mono">{token.symbol}</span>
                          <span className="token-name">{token.name}</span>
                          <span className="token-category">{formatMcap(token.mcap)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {destination === 'Discover' && (
              <div className="tools-bottom">
                <div className="discover-tabs" role="tablist" aria-label="Discover sections">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'Thesis'}
                    className={tab === 'Thesis' ? 'active' : ''}
                    onClick={() => setTab('Thesis')}
                  >
                    THE THESIS
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'About'}
                    className={tab === 'About' ? 'active' : ''}
                    onClick={() => setTab('About')}
                  >
                    ABOUT RECOUPA
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <section className="markets-panel">
          {selectedToken ? (
            <TokenDetail token={selectedToken} onBack={returnToOutdex} />
          ) : (
            <>
              <h1 className="sr-only">Recoupa {destination}</h1>

              {destination === 'Discover' && tab === 'Thesis' && (
                <>
                  <p className="thesis-intro">
                    Crypto is actually good, but most crypto are bad. The good
                    ones are quality projects capable of delivering substantial
                    returns to those who enter early, before they mature into
                    large, long-term companies. We will show you both. This is
                    not financial advice. And if a project we list fails, we
                    can help you recoup your losses — provided you hold the
                    Recoupa token.
                  </p>
                  <div className="why-tabs" role="tablist" aria-label="Thesis sections">
                    {[...whySections]
                      .sort((a, b) => {
                        if (a.id === selectedWhyCard) return 1;
                        if (b.id === selectedWhyCard) return -1;
                        return 0;
                      })
                      .map((section) => {
                        const isActive = selectedWhyCard === section.id;
                        return (
                          <div key={section.id} className="why-tab">
                            <button
                              type="button"
                              role="tab"
                              aria-selected={isActive}
                              className={`why-tab-header${isActive ? ' active' : ''}`}
                              style={{
                                background: `linear-gradient(135deg, ${section.color}, color-mix(in srgb, ${section.color} 68%, #000000))`,
                              }}
                              onClick={() => selectWhySection(section.id)}
                            >
                              <span>{section.title}</span>
                            </button>
                            {isActive && (
                              <article
                                className="why-section"
                                style={{
                                  borderTop: 'none',
                                  borderLeft: `2px solid ${section.color}`,
                                  borderRight: `2px solid ${section.color}`,
                                  borderBottom: `2px solid ${section.color}`,
                                  background: `color-mix(in srgb, ${section.color} 16%, var(--mode-surface))`,
                                }}
                              >
                                {section.paragraphs.map((paragraph) => (
                                  <p key={paragraph}>{paragraph}</p>
                                ))}
                              </article>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </>
              )}

              {destination === 'Discover' && tab === 'About' && (
                <div className="about-card">
                  {aboutParagraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}

              {destination === 'Outdex500' && (
                <div className="outdex-list">
                  <div className="list-freshness">
                    Updated {LISTING_UPDATED} · {tokenList.length} listings
                  </div>
                  {tokenList.map((token, i) => (
                    <article key={token.symbol} className="outdex-card">
                      <div className="outdex-card-top">
                        <span className="outdex-rank font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                        <div className="token-avatar">{token.symbol.slice(0, 1)}</div>
                        <div className="token-info">
                          <a
                            className="token-title-link"
                            href={`https://pump.fun/coin/${token.mint}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(event) => event.stopPropagation()}
                          >
                            {token.name}
                          </a>
                          <span className="token-subtitle">@{token.symbol.toLowerCase()}</span>
                        </div>
                        <span className="chain-pill" data-chain={token.chain.toLowerCase()}>
                          <span className="chain-dot" />
                          {formatChain(token.chain)}
                        </span>
                      </div>
                      <p className="outdex-desc">{token.description}</p>
                      <div
                        className="outdex-ca-row"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <span className="micro-label">CA</span>
                        <span className="outdex-ca font-mono">{truncateMint(token.mint)}</span>
                        <CopyButton
                          value={token.mint}
                          label={`Copy ${token.symbol} contract address`}
                        />
                      </div>
                      <div className="outdex-stats">
                        <div className="outdex-stat">
                          <span className="micro-label">MCAP</span>
                          <span className="metric-val font-mono">{formatMcap(token.mcap)}</span>
                        </div>
                        <div className="outdex-stat">
                          <span className="micro-label">24H</span>
                          <span
                            className={`metric-val font-mono${
                              token.priceChange24 === null || token.priceChange24 === 0
                                ? ''
                                : token.priceChange24 > 0
                                  ? ' change-pos'
                                  : ' change-neg'
                            }`}
                          >
                            {formatChange(token.priceChange24)}
                          </span>
                        </div>
                        <div className="outdex-stat">
                          <span className="micro-label">AGE</span>
                          <span className="metric-val font-mono">{formatAge(token.ageDays)}</span>
                        </div>
                        <div className="outdex-stat">
                          <span className="micro-label">24H VOL</span>
                          <span className="metric-val font-mono">{formatMcap(token.vol24)}</span>
                        </div>
                        <div className="outdex-stat">
                          <span className="micro-label">TXNS</span>
                          <span className="metric-val font-mono">{token.txns24.toLocaleString('en-US')}</span>
                        </div>
                        <div className="outdex-stat">
                          <span className="micro-label">LIQ</span>
                          <span className="metric-val font-mono">{token.liqUsd === 0 ? '—' : formatMcap(token.liqUsd)}</span>
                        </div>
                        <div className="outdex-stat">
                          <span className="micro-label">DEX</span>
                          <span className="metric-val">{formatDex(token.dex)}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {destination === 'Claim' && <ClaimSection />}

              {destination === 'Buy' && <BuySection />}

              {destination === 'Projects' && (
                <ProjectsSection
                  onGoContact={() => selectDestination('Contact')}
                />
              )}

              {destination === 'Contact' && <ContactSection />}

              {destination !== 'Discover' &&
                destination !== 'Outdex500' &&
                destination !== 'Claim' &&
                destination !== 'Buy' &&
                destination !== 'Projects' &&
                destination !== 'Contact' && <div className="empty-card" />}
            </>
          )}
        </section>
          </div>
        </div>
      )}
      <SiteFooter />
    </main>
  );
}

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement('textarea');
      area.value = value;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      className="claim-copy-button"
      onClick={copy}
      aria-label={label}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? 'Copied' : null}
    </button>
  );
}

type ChainTab = 'overview' | 'robinhood' | 'bnb' | 'base';

const chainTabs: { id: ChainTab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'robinhood', label: 'Robinhood' },
  { id: 'bnb', label: 'BNB' },
  { id: 'base', label: 'Base' },
];

function ChainsTabContent({ tab }: { tab: ChainTab }) {
  if (tab === 'overview') {
    return (
      <div className="chains-overview">
        <h3>What a decentralized wallet is</h3>
        <p>
          A decentralized wallet — also called a self-custody wallet — is an
          app that holds your crypto, and only you hold the keys. There is no
          company that can freeze it, reset your password, or recover it for
          you. Your 12-word secret recovery phrase is your wallet: anyone with
          those words owns everything in it, and if you lose them, nobody can
          get your funds back.
        </p>
        <h3>How wallets differ from chain to chain</h3>
        <p>
          Every blockchain is its own network, with its own addresses and its
          own coin for fees. Solana addresses are long strings of letters and
          numbers, and fees are paid in SOL. Ethereum-style chains — Robinhood
          Chain, BNB Chain, and Base — use addresses that start with 0x, and
          fees are paid in ETH or BNB. One wallet app can hold several chains
          at once, but each chain is a separate account: a token on one chain
          does not automatically show up on another.
        </p>
        <h3>Wallets are not exchanges</h3>
        <p>
          A wallet stores your crypto. A DEX (decentralized exchange) is where
          you trade it: you connect your wallet, swap one token for another,
          and the tokens go straight back to your wallet. The DEX never holds
          your money. Popular DEXs include pump.fun and Raydium on Solana,
          Uniswap on Base, and PancakeSwap on BNB Chain.
        </p>
        <h3>Some wallets have swaps built in</h3>
        <p>
          Phantom, MetaMask, and Trust Wallet can swap tokens without you
          visiting a DEX website. Behind the scenes the wallet is still routing
          your trade through a DEX — it just saves you the extra step.
        </p>
        <h3>Never send a token to the wrong wallet</h3>
        <p>
          Crypto sent to the wrong network is usually lost forever. There is
          no undo button and no support desk to call it back. Before every
          transfer, check that the chain matches on both sides, check that the
          address format looks right, and send a small test amount first.
        </p>
      </div>
    );
  }
  if (tab === 'robinhood') {
    return (
      <div>
        <p className="chains-tab-intro">
          Robinhood Chain is an Ethereum-style chain, so it uses the same
          wallets as Ethereum. Its gas token is ETH.
        </p>
        <ol className="buy-steps">
          <li>
            <strong>Install MetaMask</strong> from metamask.io — as a browser
            extension or a phone app. Only use the official links.
          </li>
          <li>
            <strong>Create a new wallet.</strong> Write down your 12-word
            secret recovery phrase on paper and keep it somewhere private and
            offline. Never share it with anyone.
          </li>
          <li>
            <strong>Add the Robinhood Chain network</strong> in MetaMask:
            network name Robinhood Chain, RPC URL
            https://rpc.mainnet.chain.robinhood.com, chain ID 4663, currency
            ETH, explorer https://robinhoodchain.blockscout.com.
          </li>
          <li>
            <strong>Fund it with ETH on Robinhood Chain</strong> — bridge ETH
            from Ethereum, or withdraw from an exchange that supports
            Robinhood Chain.
          </li>
          <li>
            <strong>You are ready to buy.</strong> Find a token&apos;s
            contract address on the Outdex list, then swap ETH for it on a
            Robinhood Chain DEX.
          </li>
        </ol>
      </div>
    );
  }
  if (tab === 'bnb') {
    return (
      <div>
        <p className="chains-tab-intro">
          BNB Chain is an Ethereum-style chain. Its gas token is BNB.
        </p>
        <ol className="buy-steps">
          <li>
            <strong>Install MetaMask</strong> from metamask.io, or Trust
            Wallet from trustwallet.com. Only use the official links.
          </li>
          <li>
            <strong>Create a new wallet.</strong> Write down your 12-word
            secret recovery phrase on paper and keep it somewhere private and
            offline. Never share it with anyone.
          </li>
          <li>
            <strong>Add the BNB Smart Chain network</strong> (chain ID 56).
            Many wallets list it by default; if not, add it from
            chainlist.org.
          </li>
          <li>
            <strong>Add BNB for fees.</strong> Buy BNB on an exchange and
            withdraw it to your wallet on the BNB Chain network (BEP-20).
          </li>
          <li>
            <strong>You are ready to buy.</strong> Swap BNB for a token on
            PancakeSwap using the token&apos;s contract address — always paste
            the address from a trusted source, never from a random chat.
          </li>
        </ol>
      </div>
    );
  }
  return (
    <div>
      <p className="chains-tab-intro">
        Base is Coinbase&apos;s Ethereum Layer 2 network. Its gas token is
        ETH.
      </p>
      <ol className="buy-steps">
        <li>
          <strong>Install MetaMask</strong> from metamask.io, or Coinbase
          Wallet. Only use the official links.
        </li>
        <li>
          <strong>Create a new wallet.</strong> Write down your 12-word secret
          recovery phrase on paper and keep it somewhere private and offline.
          Never share it with anyone.
        </li>
        <li>
          <strong>Add the Base network</strong> (chain ID 8453). It is built
          into most wallets now; if not, add it from chainlist.org.
        </li>
        <li>
          <strong>Add ETH on Base.</strong> Bridge ETH from Ethereum, or
          withdraw from Coinbase or another exchange that supports Base.
        </li>
        <li>
          <strong>You are ready to buy.</strong> Swap ETH for a token on
          Uniswap using the token&apos;s contract address — always paste the
          address from a trusted source, never from a random chat.
        </li>
      </ol>
    </div>
  );
}

function BuySection() {
  const [chainsOpen, setChainsOpen] = useState(false);
  const [activeChainTab, setActiveChainTab] = useState<ChainTab>('overview');

  useEffect(() => {
    if (!chainsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setChainsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [chainsOpen]);

  return (
    <div className="buy-section">
      <h2 className="buy-heading">Set up a Solana wallet</h2>
      <p className="buy-intro">
        You need a Solana wallet before you can buy anything on Recoupa. It
        takes a few minutes, and it is free.
      </p>
      <ol className="buy-steps">
        <li>
          <strong>Download Phantom</strong> — the most popular Solana wallet —
          from phantom.com or your phone&apos;s official app store. Only use
          the official links. Fake wallet apps steal funds.
        </li>
        <li>
          <strong>Create a new wallet.</strong> Write down your 12-word secret
          recovery phrase on paper and keep it somewhere private and offline.
          Never share it with anyone, not even Phantom support.
        </li>
        <li>
          <strong>Add SOL to your wallet.</strong> Buy SOL on an exchange and
          send it to your wallet address, or buy it directly inside Phantom.
        </li>
        <li>
          <strong>You are ready to buy.</strong> Find a token on the Outdex
          list, then swap SOL for it inside Phantom or on pump.fun using the
          token&apos;s contract address.
        </li>
      </ol>
      <div className="buy-links">
        <a href={PHANTOM_GUIDE_URL} target="_blank" rel="noopener noreferrer">
          Detailed setup guide (CoinGecko)
        </a>
        <a href={PHANTOM_VIDEO_URL} target="_blank" rel="noopener noreferrer">
          Watch the video (YouTube)
        </a>
      </div>
      <button
        type="button"
        className="buy-chains-button"
        onClick={() => {
          setActiveChainTab('overview');
          setChainsOpen(true);
        }}
      >
        Buy on other chains
      </button>
      {chainsOpen && (
        <div
          className="chains-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Buy on other chains"
          onClick={() => setChainsOpen(false)}
        >
          <div
            className="chains-modal-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="chains-modal-close"
              aria-label="Close"
              onClick={() => setChainsOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="chains-modal-heading">Buy on other chains</h2>
            <div className="chains-tabs" role="tablist">
              {chainTabs.map((chainTab) => (
                <button
                  key={chainTab.id}
                  type="button"
                  role="tab"
                  aria-selected={activeChainTab === chainTab.id}
                  className={
                    activeChainTab === chainTab.id
                      ? 'chains-tab active'
                      : 'chains-tab'
                  }
                  onClick={() => setActiveChainTab(chainTab.id)}
                >
                  {chainTab.label}
                </button>
              ))}
            </div>
            <div className="chains-tab-content">
              <ChainsTabContent tab={activeChainTab} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectsSection({ onGoContact }: { onGoContact: () => void }) {
  return (
    <div className="projects-section">
      <h2 className="projects-heading">Get your project listed</h2>
      <p className="projects-intro">
        The Outdex500 is our list of promising utility projects — the projects
        we believe are worth our community&apos;s attention. If you are
        building one, contact us and we will vet it for a listing.
      </p>
      <h3 className="projects-subheading">What we look for</h3>
      <ul className="projects-list">
        <li>
          <strong>Real utility</strong> — your token does something useful.
          Not a meme, not a quick flip.
        </li>
        <li>
          <strong>Long-term prospect</strong> — a project built to last, with
          a plan beyond launch day.
        </li>
        <li>
          <strong>Committed team</strong> — a team that keeps building after
          launch, through good markets and bad.
        </li>
      </ul>
      <div className="projects-contact">
        <h3 className="projects-subheading">How to reach us</h3>
        <p>
          Send us your project details through the contact form — tell us what
          your project does, who is building it, and where we can find it. Or
          email us directly:
        </p>
        <div className="buy-links">
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </div>
        <button
          type="button"
          className="claim-submit-button"
          onClick={onGoContact}
        >
          Contact us about your project
        </button>
      </div>
    </div>
  );
}

const CONTACT_TOPICS: [ContactTopic, string][] = [
  ['project-listing', 'Project listing request'],
  ['claim-help', 'Help with a claim'],
  ['general', 'General question'],
  ['feedback', 'Feedback'],
];

function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState<ContactTopic>('general');
  const [project, setProject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill in your name, email address, and message.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await submitContactMessage({
        name: name.trim(),
        email: email.trim(),
        topic,
        project: project.trim(),
        message: message.trim(),
      });
      setName('');
      setEmail('');
      setTopic('general');
      setProject('');
      setMessage('');
      setSent(true);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Could not send the message. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="claim-section">
      <div className="claim-form-card">
        <h2>Send us a message</h2>
        <p className="claim-intro">
          Tell us what you need — a project listing, help with a claim,
          feedback, or anything else. Your message goes straight to the
          Recoupa team.
        </p>
        {sent && (
          <p className="claim-success" role="status">
            Message sent. We will get back to you at the email you gave us.
          </p>
        )}
        <form onSubmit={submit} noValidate>
          <label className="claim-field">
            <span className="claim-field-label">Your name</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              maxLength={100}
              aria-label="Your name"
            />
          </label>
          <label className="claim-field">
            <span className="claim-field-label">Email address</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Where we can reply to you"
              autoComplete="email"
              maxLength={254}
              aria-label="Email address"
            />
          </label>
          <label className="claim-field">
            <span className="claim-field-label">What is this about?</span>
            <select
              value={topic}
              onChange={(event) =>
                setTopic(event.target.value as ContactTopic)
              }
              aria-label="What is this about?"
            >
              {CONTACT_TOPICS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="claim-field">
            <span className="claim-field-label">
              Project name or token address (optional)
            </span>
            <input
              type="text"
              value={project}
              onChange={(event) => setProject(event.target.value)}
              placeholder="If your message is about a project, name it here"
              autoComplete="off"
              spellCheck={false}
              maxLength={200}
              aria-label="Project name or token address"
            />
          </label>
          <label className="claim-field">
            <span className="claim-field-label">Your message</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Write your message here"
              rows={5}
              maxLength={5000}
              aria-label="Your message"
            />
          </label>
          {formError && (
            <p className="claim-error" role="alert">
              {formError}
            </p>
          )}
          <button
            type="submit"
            className="claim-submit-button"
            disabled={submitting}
          >
            {submitting ? 'Sending…' : 'Send message'}
          </button>
        </form>
        <p className="claim-note">
          Your message is private — only the Recoupa team reads it. It never
          appears on the public claims board. Prefer email? Write to us at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}

function ClaimSection() {
  const [walletAddress, setWalletAddress] = useState('');
  const [lossTokenCa, setLossTokenCa] = useState('');
  const [confirmations, setConfirmations] = useState([false, false, false]);
  const confirmationLabels = [
    'Have you held 500,000 $Recoupa tokens for more than 24 hours before the loss token crash?',
    'Can you confirm that the loss token is one of those listed on our Outdex list?',
    'Can you confirm that you have held the loss token for more than 24 hours before the crash?',
  ];
  const [boardClaims, setBoardClaims] = useState<Claim[]>([]);
  const [boardLoading, setBoardLoading] = useState(true);
  const [boardError, setBoardError] = useState('');
  const [activeTab, setActiveTab] = useState<ClaimTab>('new');
  const [justFiled, setJustFiled] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  // Both sections are accordions, collapsed by default; Claims filed sits
  // above the form.
  const [boardOpen, setBoardOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const loadBoard = async () => {
    setBoardLoading(true);
    setBoardError('');
    try {
      const data = await fetchClaims();
      setBoardClaims(data);
    } catch (err) {
      setBoardError(
        err instanceof Error ? err.message : 'Could not load claims.',
      );
    } finally {
      setBoardLoading(false);
    }
  };

  // One-time migration of claims filed into localStorage before the claims
  // board moved to the API. Silent; never blocks the UI. The local key is
  // removed only once every stored claim is accepted or already present
  // server-side (409) — on any other failure it stays for a later visit.
  useEffect(() => {
    let cancelled = false;
    const migrateAndLoad = async () => {
      const stored = loadSubmittedClaims();
      if (stored.length > 0) {
        const results = await Promise.allSettled(
          stored.map((claim) =>
            migrateClaim(
              claim.claimNumber,
              claim.walletAddress,
              claim.lossTokenCa,
              claim.dateFiled,
            ),
          ),
        );
        const allSettled = results.every(
          (result) =>
            result.status === 'fulfilled' ||
            (result.reason instanceof ApiError && result.reason.status === 409),
        );
        if (allSettled) {
          try {
            localStorage.removeItem(SUBMITTED_CLAIMS_KEY);
          } catch {
            // Storage unavailable — nothing to clean up.
          }
        }
      }
      if (!cancelled) {
        await loadBoard();
      }
    };
    migrateAndLoad();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabCounts = useMemo(() => {
    const counts: Record<ClaimTab, number> = {
      new: 0,
      open: 0,
      rejected: 0,
      paid: 0,
    };
    for (const claim of boardClaims) {
      counts[claimTabOf(claim)] += 1;
    }
    return counts;
  }, [boardClaims]);

  const searching = searchQuery.trim().length > 0;

  // Search spans every status ("any claim"); without a query the active
  // tab filters. Every listing is newest-first.
  const filteredClaims = useMemo(() => {
    const base = searching
      ? boardClaims
      : boardClaims.filter((claim) => claimTabOf(claim) === activeTab);
    return [...base]
      .filter((claim) => claimMatchesSearch(claim, searchQuery))
      .sort((a, b) => {
        const byDate =
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return byDate !== 0 ? byDate : b.id - a.id;
      });
  }, [boardClaims, activeTab, searchQuery, searching]);

  const pageCount = Math.max(
    1,
    Math.ceil(filteredClaims.length / CLAIMS_PAGE_SIZE),
  );
  const safePage = Math.min(page, pageCount);
  const pagedClaims = filteredClaims.slice(
    (safePage - 1) * CLAIMS_PAGE_SIZE,
    safePage * CLAIMS_PAGE_SIZE,
  );

  const selectTab = (tab: ClaimTab) => {
    setActiveTab(tab);
    setPage(1);
  };

  const updateSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const submitClaim = async (event: FormEvent) => {
    event.preventDefault();
    const wallet = walletAddress.trim();
    const lossCa = lossTokenCa.trim();
    if (!wallet || !lossCa) {
      setFormError('Enter both your wallet address and the loss token CA.');
      return;
    }
    if (!confirmations.every(Boolean)) {
      setFormError('Please confirm all three statements to file your claim.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const filed = await submitClaimApi(wallet, lossCa);
      setWalletAddress('');
      setLossTokenCa('');
      setConfirmations([false, false, false]);
      setJustFiled(filed.claim_number);
      setActiveTab('new');
      setPage(1);
      setBoardOpen(true);
      await loadBoard();
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : 'Could not file the claim. Please try again.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="claim-section">
      <div className="claims-block">
        <h2 className="claims-accordion-heading">
          <button
            type="button"
            className="claims-accordion-button"
            aria-expanded={boardOpen}
            onClick={() => setBoardOpen((open) => !open)}
          >
            <span>Claims filed</span>
            <ChevronDown
              size={20}
              className={`claims-accordion-chevron${boardOpen ? ' is-open' : ''}`}
            />
          </button>
        </h2>
        {boardOpen && (
          <div className="claims-accordion-body">
            <label className="claims-search">
              <Search size={18} />
              <span className="sr-only">Search claims</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search by wallet, token CA, claim number, or date"
                aria-label="Search claims"
                autoComplete="off"
              />
            </label>
            <div className="claims-tabs" role="tablist" aria-label="Claim status">
              {(
                [
                  ['new', 'New'],
                  ['open', 'Open'],
                  ['rejected', 'Rejected'],
                  ['paid', 'Paid'],
                ] as [ClaimTab, string][]
              ).map(([tab, label]) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  className={`claims-tab${activeTab === tab ? ' is-active' : ''}`}
                  onClick={() => selectTab(tab)}
                >
                  {label}
                  <span className="claims-tab-count">{tabCounts[tab]}</span>
                </button>
              ))}
            </div>
            {searching && !boardLoading && !boardError && (
              <p className="claims-result-note">
                {filteredClaims.length}{' '}
                {filteredClaims.length === 1 ? 'claim matches' : 'claims match'}{' '}
                &ldquo;{searchQuery.trim()}&rdquo; across all statuses.
              </p>
            )}
            {boardLoading ? (
              <p className="claim-empty">Loading claims…</p>
            ) : boardError ? (
              <p className="claim-empty" role="alert">
                {boardError}
              </p>
            ) : filteredClaims.length === 0 ? (
              <p className="claim-empty">
                {searching ? (
                  <>
                    No claims match &ldquo;{searchQuery.trim()}&rdquo;.
                  </>
                ) : (
                  <>
                    {activeTab === 'new' && 'No new claims yet.'}
                    {activeTab === 'open' && 'No open claims yet.'}
                    {activeTab === 'rejected' && 'No rejected claims yet.'}
                    {activeTab === 'paid' &&
                      'No paid claims yet. When a claim is paid, its claim number and payout transaction hash will appear here.'}
                  </>
                )}
              </p>
            ) : (
              <>
                <ul className="claims-list">
                  {pagedClaims.map((claim) => (
                    <li key={claim.id} className="claim-card">
                      <div className="claim-card-head">
                        <span className="claim-number font-mono">
                          #{claim.claim_number}
                        </span>
                        <span
                          className={`claim-status-badge${
                            claim.status === 'paid' ? ' is-paid' : ''
                          }${claim.status === 'rejected' ? ' is-rejected' : ''}`}
                        >
                          {claim.status === 'paid'
                            ? 'Paid'
                            : claim.status === 'rejected'
                              ? 'Rejected'
                              : claimTabOf(claim) === 'new'
                                ? 'New'
                                : 'Open'}
                        </span>
                      </div>
                      <div className="claim-row">
                        <span className="micro-label">WALLET</span>
                        <span className="claim-value font-mono">
                          {truncateMint(claim.wallet_address)}
                        </span>
                        <CopyButton
                          value={claim.wallet_address}
                          label="Copy wallet address"
                        />
                      </div>
                      <div className="claim-row">
                        <span className="micro-label">LOSS TOKEN CA</span>
                        <a
                          className="claim-value-link font-mono"
                          href={`https://pump.fun/coin/${claim.loss_token_ca}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {truncateMint(claim.loss_token_ca)}
                        </a>
                        <CopyButton
                          value={claim.loss_token_ca}
                          label="Copy loss token contract address"
                        />
                      </div>
                      <div className="claim-row">
                        <span className="micro-label">DATE FILED</span>
                        <span className="claim-value">
                          {formatClaimDate(claim.created_at.slice(0, 10))}
                        </span>
                      </div>
                      {claim.status === 'rejected' && claim.rejection_reason && (
                        <div className="claim-row">
                          <span className="micro-label">REASON</span>
                          <span className="claim-value">
                            {claim.rejection_reason}
                          </span>
                        </div>
                      )}
                      {claim.status === 'paid' && claim.tx_hash && (
                        <div className="claim-row">
                          <span className="micro-label">TX HASH</span>
                          <a
                            className="claim-value-link font-mono"
                            href={txExplorerUrl(claim.tx_chain, claim.tx_hash)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {truncateMint(claim.tx_hash)}
                          </a>
                          <CopyButton
                            value={claim.tx_hash}
                            label="Copy transaction hash"
                          />
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
                {pageCount > 1 && (
                  <div className="claims-pagination">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setPage(safePage - 1)}
                    >
                      Previous
                    </button>
                    <span>
                      Page {safePage} of {pageCount}
                    </span>
                    <button
                      type="button"
                      disabled={safePage >= pageCount}
                      onClick={() => setPage(safePage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="claim-form-card">
        <h2 className="claims-accordion-heading">
          <button
            type="button"
            className="claims-accordion-button"
            aria-expanded={formOpen}
            onClick={() => setFormOpen((open) => !open)}
          >
            <span>File a claim (form)</span>
            <ChevronDown
              size={20}
              className={`claims-accordion-chevron${formOpen ? ' is-open' : ''}`}
            />
          </button>
        </h2>
        {formOpen && (
          <div className="claims-accordion-body">
            <p className="claim-intro">
              Lost money on another token? File a claim for review. We will check
              the activity on the wallet you submit to determine your eligibility
              and how much to send you.
            </p>
            {justFiled && (
              <p className="claim-success" role="status">
                Claim submitted. Your claim number is{' '}
                <strong className="font-mono">{justFiled}</strong> — keep it safe,
                you will need it to check your payout.
              </p>
            )}
            <form onSubmit={submitClaim} noValidate>
              <label className="claim-field">
                <span className="claim-field-label">Wallet address</span>
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(event) => setWalletAddress(event.target.value)}
                  placeholder="Your Solana or EVM wallet address"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Wallet address"
                />
              </label>
              <label className="claim-field">
                <span className="claim-field-label">Loss token CA</span>
                <input
                  type="text"
                  value={lossTokenCa}
                  onChange={(event) => setLossTokenCa(event.target.value)}
                  placeholder="Contract address of the token you lost money on"
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Loss token contract address"
                />
              </label>
              <div className="claim-checks">
                {confirmationLabels.map((label, index) => (
                  <label key={label} className="claim-check">
                    <input
                      type="checkbox"
                      checked={confirmations[index]}
                      onChange={(event) => {
                        const next = [...confirmations];
                        next[index] = event.target.checked;
                        setConfirmations(next);
                      }}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              {formError && (
                <p className="claim-error" role="alert">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                className="claim-submit-button"
                disabled={submitting}
              >
                {submitting ? 'Submitting…' : 'Submit claim'}
              </button>
            </form>
            <p className="claim-note">
              Claims cover losses on other tokens, not on $Recoupa itself. To
              qualify, you must have held 500,000 $Recoupa tokens for more than 24
              hours before the loss token crash, and have held the loss token for
              more than 24 hours before the crash.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TokenDetail({ token, onBack }: { token: Token; onBack: () => void }) {
  const [caCopied, setCaCopied] = useState(false);
  const copyCa = async () => {
    try {
      await navigator.clipboard.writeText(token.mint);
    } catch {
      const area = document.createElement('textarea');
      area.value = token.mint;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    }
    setCaCopied(true);
    window.setTimeout(() => setCaCopied(false), 2000);
  };
  return (
    <div className="token-detail-card">
      <button type="button" className="back-button" onClick={onBack}>
        <ArrowLeft size={16} />
        <span>BACK TO OUTDEX</span>
      </button>

      <div className="detail-header">
        <div className="detail-avatar-large">{token.symbol.slice(0, 1)}</div>
        <div className="detail-title-group">
          <h1>{token.name}</h1>
          <span>@{token.symbol.toLowerCase()}</span>
        </div>
        <div className="detail-mcap font-mono">{formatMcap(token.mcap)}</div>
      </div>

      <div className="detail-metrics">
        <div className="metric-box">
          <span className="micro-label">MARKET CAP</span>
          <span className="metric-val font-mono">{formatMcap(token.mcap)}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">PRICE</span>
          <span className="metric-val font-mono">{formatPrice(token.priceUsd)}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">24H CHANGE</span>
          <span className="metric-val font-mono">{formatChange(token.priceChange24)}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">AGE</span>
          <span className="metric-val font-mono">{formatAge(token.ageDays)}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">24H TRANSACTIONS</span>
          <span className="metric-val font-mono">{token.txns24.toLocaleString('en-US')}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">24H VOLUME</span>
          <span className="metric-val font-mono">{formatUsd(token.vol24)}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">LIQUIDITY</span>
          <span className="metric-val font-mono">{token.liqUsd === 0 ? '—' : formatUsd(token.liqUsd)}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">CHAIN / DEX</span>
          <span className="metric-val">{formatChain(token.chain)} / {token.dex}</span>
        </div>
      </div>

      <p className="detail-description">{token.description}</p>

      <div className="detail-actions">
        <a
          className="detail-pumpfun-link"
          href={`https://pump.fun/coin/${token.mint}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Pump.fun
        </a>
      </div>

      <div className="detail-ca-row">
        <span className="micro-label">CONTRACT</span>
        <span className="detail-ca-address font-mono">{truncateMint(token.mint)}</span>
        <button
          type="button"
          className="detail-ca-button"
          onClick={copyCa}
          aria-label="Copy contract address"
        >
          {caCopied ? <Check size={16} /> : <Copy size={16} />}
          {caCopied ? 'Copied' : null}
        </button>
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <span className="site-footer-copy">© 2026 Recoupa</span>
      <nav className="site-footer-links" aria-label="Legal">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </nav>
    </footer>
  );
}

function PrivacyContent() {
  return (
    <>
      <p>
        Recoupa is a crypto discovery and loss-recovery webapp. This policy
        explains what information we collect when you use it, and what we do
        with it. We keep it short on purpose.
      </p>

      <h2>What we collect when you file a claim</h2>
      <p>
        When you file a claim, you give us your wallet address, the contract
        address of the token you lost money on, and your answers to the
        confirmation checkboxes. We store that filing on our server, and it
        appears on the public claims board with your claim number, wallet
        address, token, filing date, status, and payout transaction hash once
        a claim is paid.
      </p>
      <p>
        Your wallet address is already public on the blockchain, and anything
        you put in a claim is public on this site. Do not add anything to a
        claim that the form does not ask for.
      </p>

      <h2>What we collect when you contact us</h2>
      <p>
        When you send a message through the contact form, you give us your
        name, email address, and your message. We store it on our server so
        we can read it and reply to you. Contact messages are private — they
        never appear on the public claims board or anywhere else on the site.
      </p>

      <h2>What stays on your device</h2>
      <p>
        When you file a claim, a copy of your own submitted claims is saved in
        your browser&apos;s local storage so you can see them again later. That
        copy never leaves your device. You can clear it at any time in your
        browser settings.
      </p>

      <h2>What we do not collect</h2>
      <p>
        We do not ask for your phone number. We only ask for your name and
        email address when you contact us, so we can reply to you. We do not
        run analytics or advertising trackers on this site. We never ask
        for your seed phrase or private keys — anyone who does is not us.
      </p>

      <h2>Admin access</h2>
      <p>
        The admin area is protected by a password. The password is stored as
        a one-way hash, never as plain text.
      </p>

      <h2>Server logs</h2>
      <p>
        Our hosting provider keeps standard server logs, such as IP addresses
        and request times, to keep the service running and secure. We do not
        use those logs to identify you, and we do not sell data.
      </p>

      <h2>Other websites</h2>
      <p>
        Token prices and market data shown on the site come from public
        market-data services. Links on the site, such as pump.fun and block
        explorers, take you to other websites. Their privacy practices are
        their own.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy. The date at the top shows the latest
        version.
      </p>
    </>
  );
}

function TermsContent() {
  return (
    <>
      <p>
        These terms govern your use of the Recoupa webapp. By using the site,
        you agree to them.
      </p>

      <h2>The service</h2>
      <p>
        Recoupa helps you discover crypto projects early through the Outdex
        list, and helps you file claims to recoup part of your losses when a
        listed project fails. Some features shown in the menu are still being
        built.
      </p>

      <h2>Not financial advice</h2>
      <p>
        Nothing on this site is financial advice. Token listings,
        descriptions, and market data are information only. Do your own
        research before buying anything. None of this represents financial
        advice. Talk to your financial advisor.
      </p>

      <h2>No endorsement, no guarantee</h2>
      <p>
        A token appearing on the Outdex is not a recommendation, and it is
        not a promise that the token will gain value or stay safe. Crypto
        projects can lose value quickly or fail completely.
      </p>

      <h2>Claims</h2>
      <p>To receive a paid claim, all of the following must be true:</p>
      <ul>
        <li>
          You held 500,000 $Recoupa tokens for more than 24 hours before the
          loss token crash.
        </li>
        <li>The token you lost money on is on the Outdex list.</li>
        <li>
          You held that loss token for more than 24 hours before the crash.
        </li>
        <li>
          The loss token lost 95% or more of its value and is irredeemable.
        </li>
      </ul>
      <p>
        Payouts come from the fees earned from $Recoupa trading. Your share
        is worked out pro-rata among all claims filed for the same token,
        after 40% of the fees is set aside for marketing and development.
        Eligibility and payout amounts are decided by a review of your
        wallet. All filed claims and payout transaction hashes are public on
        this site.
      </p>
      <p>
        A claim is not a guarantee of payment. Payouts depend on the fees
        available, and Recoupa may reject a claim that does not meet these
        terms.
      </p>

      <h2>Your wallet</h2>
      <p>
        You are responsible for your own wallet, keys, and transactions.
        Never share your seed phrase or private keys with anyone. Recoupa
        will never ask for them.
      </p>

      <h2>Fair use</h2>
      <p>
        File honest claims only. Do not file false claims, do not try to
        break or abuse the service, and do not use the site for anything
        unlawful. We may refuse service to anyone who abuses it.
      </p>

      <h2>Availability</h2>
      <p>
        The site and the claims service may be unavailable at times, and
        features may change or be removed.
      </p>

      <h2>Liability</h2>
      <p>
        The service is provided as is. Crypto trading is risky. Recoupa is
        not responsible for losses from tokens you buy, from market
        movements, or from claims that are rejected or unpaid.
      </p>

      <h2>Age</h2>
      <p>You must be at least 18 years old to file a claim.</p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms. Continued use of the site after a change
        means you accept the new terms.
      </p>
    </>
  );
}

function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const isPrivacy = kind === 'privacy';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="reference-explore legal-page">
      <div className="legal-top">
        <Link href="/explore" className="legal-back">
          <ArrowLeft size={18} /> Back to Explore
        </Link>
      </div>
      <article className="legal-article">
        <h1>{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1>
        <p className="legal-updated">Last updated: November 21, 2026</p>
        {isPrivacy ? <PrivacyContent /> : <TermsContent />}
      </article>
      <SiteFooter />
    </main>
  );
}

function PrivacyPage() {
  return <LegalPage kind="privacy" />;
}

function TermsPage() {
  return <LegalPage kind="terms" />;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Seo />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/explore" component={ExplorePage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/terms" component={TermsPage} />
        <Route path="/addy" component={AddyPage} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Router />
    </WouterRouter>
  );
}

export default App;
