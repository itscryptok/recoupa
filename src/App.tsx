import { type CSSProperties, type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Menu, Search, SunMoon, X, Flame, Radio, Copy, Check, Home } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { outdexListings, LISTING_UPDATED, type OutdexListing } from './outdex-listings';
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
  | 'Outdex'
  | 'Claim'
  | 'Perps'
  | 'TCapital'
  | 'Resources';

type DiscoverTab = 'Thesis' | 'About';

type Token = OutdexListing;

const destinations: Destination[] = [
  'Discover',
  'Outdex',
  'Claim',
  'Perps',
  'TCapital',
  'Resources',
];

const currentViewLabels: Record<Destination, string> = {
  Discover: 'Discover the mission',
  Outdex: 'The outsider dex',
  Claim: 'Your Claim portal',
  Perps: 'PvP Perps',
  TCapital: 'Thesis capital',
  Resources: 'Contacts and resources',
};

const pageAccents: Record<Destination, string> = {
  Discover: '#047857',
  Outdex: '#1D4ED8',
  Claim: '#BE123C',
  Perps: '#7C3AED',
  TCapital: '#B45309',
  Resources: '#0F766E',
};

const pageButtonLabels: Record<Destination, string> = {
  Discover: 'Read the Thesis',
  Outdex: 'The Outdex list',
  Claim: 'Recoup losses',
  Perps: 'New launch Perps',
  TCapital: 'Thesis capital',
  Resources: 'Find resources',
};

const tokenList: Token[] = outdexListings;

type SubmittedClaim = {
  claimNumber: string;
  walletAddress: string;
  lossTokenCa: string;
  dateFiled: string;
};

type PaidClaim = {
  claimNumber: string;
  txHash: string;
};

// Paid claims are updated by hand: when a claim is paid, its claim number and
// payout transaction hash are added here.
const paidClaims: PaidClaim[] = [];

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

function generateClaimNumber() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let claimNumber = '';
  for (let i = 0; i < 6; i++) {
    claimNumber += chars[Math.floor(Math.random() * chars.length)];
  }
  return claimNumber;
}

function localTodayIso() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
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
    const title = isExplore
      ? 'Recoupa Explore | Crypto Discovery & Loss Prevention'
      : 'Recoupa | Crypto Discovery & Loss Prevention';
    const description = isExplore
      ? 'Explore Recoupa’s curated crypto Outdex, compare promising projects, and find early opportunities with a clearer, lower-risk lens.'
      : 'Recoupa helps non-insider crypto traders discover promising projects early while reducing risk and recouping losses from the crypto market.';
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
    const canonicalPath = `${basePath}${isExplore ? '/explore' : '/'}` || '/';
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
    if (next !== 'Outdex') {
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
    setDestination('Outdex');
    setSearchQuery(`${token.name} (${token.symbol})`);
    setMenuOpen(false);
  };

  const returnToOutdex = () => {
    setSelectedToken(null);
    setSearchQuery('');
    setDestination('Outdex');
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
        text = "Does money dictate how you live your life - when you wake up, when you sleep and more? Crypto might actually be your answer to financial freedom. But crypto is bad and dangerous. So how to get around that? Just follow our Outsider Dex (Outdex) listing and loss Claim tool that are built to protect you.";
      } else {
        text = "Selected crypto projects in the Outdex. A safety system that helps prevent losses.";
      }
    } else if (destination === 'Outdex') {
      text = "This is where you can find promising projects early, before the wider market catches on. Watch them grow into long-term companies with substantial market capitalization. And if any of the projects that we recommend on the Outdex500 page fails (a rug pull), we will refund some of your losses. But you must hold 500,000 $Recoupa tokens for more than 24 hours before the rug pull happens. You will then qualify for a share of the fee rewards earned from $Recoupa's trading activity. When you submit a claim, we will review the activity on the wallet you submit to determine your eligibility and how much to send you. All filed claims and completed payout transaction hashes will be public on this webapp.";
    } else if (destination === 'Claim') {
      text = "Lost money on other crypto tokens? To receive a paid claim, you must have held 500,000 $Recoupa tokens for more than 24 hours before the loss token crash, the token you lost money on must be one of the tokens on our Outdex list, and you must have held that loss token for more than 24 hours before the crash. The loss token must also have lost 95% of its value and be irredeemable. Payouts come from the fees accumulated from trading $Recoupa. Your share depends on the value of the loss token you hold as a percentage of all claims filed for that same token, and on the fees available for payout after 40% is set aside for marketing and development. File a claim below.";
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
          <div className="hero-status">
            <span className="hero-status-indicator">
              <Radio size={16} />
            </span>
            <span className="hero-status-text">
              SYSTEM ACTIVE / {tokenList.length} PROJECTS INDEXED
            </span>
          </div>
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
          <button
            type="button"
            className="hero-description-toggle"
            aria-expanded={heroExpanded}
            aria-controls="hero-description"
            onClick={() => setHeroExpanded((expanded) => !expanded)}
            data-testid="button-toggle-hero-description"
          >
            {heroExpanded ? 'Less' : 'Read more'}
          </button>
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
              {destination === 'Outdex' && (
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

              {destination === 'Outdex' && (
                <div className="structured-list-card">
                  <div className="list-freshness">
                    Updated {LISTING_UPDATED}
                  </div>
                  <div className="list-scroll">
                    <div className="list-header">
                      <div className="col-id">#</div>
                      <div className="col-name">TOKEN</div>
                      <div className="col-metric">CHAIN</div>
                      <div className="col-metric">MCAP</div>
                      <div className="col-metric">AGE</div>
                      <div className="col-metric">24H VOL</div>
                      <div className="col-metric">LIQ</div>
                    </div>
                    <div className="list-body">
                      {tokenList.map((token, i) => (
                        <div
                          key={token.symbol}
                          role="button"
                          tabIndex={0}
                          className="list-row"
                          onClick={() => selectToken(token)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter' || event.key === ' ') {
                              event.preventDefault();
                              selectToken(token);
                            }
                          }}
                        >
                          <div className="col-id font-mono">{(i + 1).toString().padStart(2, '0')}</div>
                          <div className="col-name">
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
                          </div>
                          <div className="col-metric">
                            <span className="micro-label">CHAIN</span>
                            <span className="metric-val">{formatChain(token.chain)}</span>
                          </div>
                          <div className="col-metric">
                            <span className="micro-label">MCAP</span>
                            <span className="metric-val font-mono">{formatMcap(token.mcap)}</span>
                          </div>
                          <div className="col-metric">
                            <span className="micro-label">AGE</span>
                            <span className="metric-val font-mono">{formatAge(token.ageDays)}</span>
                          </div>
                          <div className="col-metric">
                            <span className="micro-label">24H VOL</span>
                            <span className="metric-val font-mono">{formatMcap(token.vol24)}</span>
                          </div>
                          <div className="col-metric">
                            <span className="micro-label">LIQ</span>
                            <span className="metric-val font-mono">{token.liqUsd === 0 ? '—' : formatMcap(token.liqUsd)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {destination === 'Claim' && <ClaimSection />}

              {destination !== 'Discover' &&
                destination !== 'Outdex' &&
                destination !== 'Claim' && <div className="empty-card" />}
            </>
          )}
        </section>
          </div>
        </div>
      )}
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

function ClaimSection() {
  const [walletAddress, setWalletAddress] = useState('');
  const [lossTokenCa, setLossTokenCa] = useState('');
  const [confirmations, setConfirmations] = useState([false, false, false]);
  const confirmationLabels = [
    'Have you held 500,000 $Recoupa tokens for more than 24 hours before the loss token crash?',
    'Can you confirm that the loss token is one of those listed on our Outdex list?',
    'Can you confirm that you have held the loss token for more than 24 hours before the crash?',
  ];
  const [claims, setClaims] = useState<SubmittedClaim[]>(() =>
    loadSubmittedClaims(),
  );
  const [justFiled, setJustFiled] = useState<string | null>(null);
  const [formError, setFormError] = useState('');

  const submitClaim = (event: FormEvent) => {
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
    const existing = new Set(claims.map((claim) => claim.claimNumber));
    let claimNumber = generateClaimNumber();
    while (existing.has(claimNumber)) {
      claimNumber = generateClaimNumber();
    }
    const claim: SubmittedClaim = {
      claimNumber,
      walletAddress: wallet,
      lossTokenCa: lossCa,
      dateFiled: localTodayIso(),
    };
    const next = [claim, ...claims];
    setClaims(next);
    try {
      localStorage.setItem(SUBMITTED_CLAIMS_KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable — the claim still shows for this visit.
    }
    setWalletAddress('');
    setLossTokenCa('');
    setConfirmations([false, false, false]);
    setFormError('');
    setJustFiled(claimNumber);
  };

  return (
    <div className="claim-section">
      <div className="claim-form-card">
        <h2>File a claim</h2>
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
          <button type="submit" className="claim-submit-button">
            Submit claim
          </button>
        </form>
        <p className="claim-note">
          Claims cover losses on other tokens, not on $Recoupa itself. To
          qualify, you must have held 500,000 $Recoupa tokens for more than 24
          hours before the loss token crash, and have held the loss token for
          more than 24 hours before the crash.
        </p>
      </div>

      <div className="claims-block">
        <h2>Submitted claims</h2>
        {claims.length === 0 ? (
          <p className="claim-empty">
            No claims submitted yet. Claims you file here will appear below.
          </p>
        ) : (
          <ul className="claims-list">
            {claims.map((claim) => (
              <li key={claim.claimNumber} className="claim-card">
                <div className="claim-card-head">
                  <span className="claim-number font-mono">
                    #{claim.claimNumber}
                  </span>
                  <span className="claim-status-badge">Submitted</span>
                </div>
                <div className="claim-row">
                  <span className="micro-label">WALLET</span>
                  <span className="claim-value font-mono">
                    {truncateMint(claim.walletAddress)}
                  </span>
                  <CopyButton
                    value={claim.walletAddress}
                    label="Copy wallet address"
                  />
                </div>
                <div className="claim-row">
                  <span className="micro-label">LOSS TOKEN CA</span>
                  <a
                    className="claim-value-link font-mono"
                    href={`https://pump.fun/coin/${claim.lossTokenCa}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {truncateMint(claim.lossTokenCa)}
                  </a>
                  <CopyButton
                    value={claim.lossTokenCa}
                    label="Copy loss token contract address"
                  />
                </div>
                <div className="claim-row">
                  <span className="micro-label">DATE FILED</span>
                  <span className="claim-value">
                    {formatClaimDate(claim.dateFiled)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="claims-block">
        <h2>Paid claims</h2>
        {paidClaims.length === 0 ? (
          <p className="claim-empty">
            No paid claims yet. When a claim is paid, its claim number and
            payout transaction hash will appear here.
          </p>
        ) : (
          <ul className="claims-list">
            {paidClaims.map((paid) => (
              <li key={paid.claimNumber} className="claim-card">
                <div className="claim-card-head">
                  <span className="claim-number font-mono">
                    #{paid.claimNumber}
                  </span>
                  <span className="claim-status-badge is-paid">Paid</span>
                </div>
                <div className="claim-row">
                  <span className="micro-label">TX HASH</span>
                  <span className="claim-value font-mono">
                    {truncateMint(paid.txHash)}
                  </span>
                  <CopyButton
                    value={paid.txHash}
                    label="Copy transaction hash"
                  />
                </div>
              </li>
            ))}
          </ul>
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

function Router() {
  return (
    <RoutedErrorBoundary>
      <Seo />
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/explore" component={ExplorePage} />
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
