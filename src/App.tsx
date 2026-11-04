import { type CSSProperties, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Menu, Search, SunMoon, X, Flame, Radio, Copy, Check, Home } from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
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

type Token = {
  symbol: string;
  name: string;
  score: string;
  category: string;
};

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
  Perps: '1-vs-1 perps',
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
  Discover: 'The good, bad, ugly',
  Outdex: 'Tokens to watch',
  Claim: 'Recoup your losses',
  Perps: 'New launch Perps',
  TCapital: 'Thesis capital',
  Resources: 'Find resources',
};

const tokenList: Token[] = [
  { symbol: 'ARB', name: 'Arbitrum', score: 'A', category: 'Layer 2' },
  { symbol: 'AVAX', name: 'Avalanche', score: 'A-', category: 'Layer 1' },
  { symbol: 'BASE', name: 'Base', score: 'B+', category: 'Layer 2' },
  { symbol: 'BTC', name: 'Bitcoin', score: 'A+', category: 'Store of value' },
  { symbol: 'ETH', name: 'Ethereum', score: 'A+', category: 'Layer 1' },
  { symbol: 'LINK', name: 'Chainlink', score: 'A', category: 'Oracle' },
  { symbol: 'SOL', name: 'Solana', score: 'A', category: 'Layer 1' },
  { symbol: 'TIA', name: 'Celestia', score: 'B+', category: 'Modular blockchain' },
];

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
      'The bad narrative around crypto is understandable because it is based on real experiences. For many outsiders, the market appears to be controlled by insiders, misleading promoters, and projects created mainly for quick profit. In fast-moving ecosystems such as Pimpfun and Stolana, harmful actors can take advantage of limited research tools, weak protections, and the pressure to act quickly. Common dangers include pump-and-dump schemes, rug pulls, emotional FOMO traps, and gambling-like trading. After seeing these problems, responsible people may decide that avoiding crypto completely is the safest choice.',
      'This narrative is written from the perspective of an outsider with more than seven years of experience in the crypto space. That experience shows that the market’s bad reputation does not represent every project or opportunity. Some early-stage projects are built around legitimate ideas and may develop in the same way that promising young companies grow after receiving early support. The real challenge is separating credible innovation from short-term speculation and manipulation. Recoupa aims to help outsiders make that distinction through clearer research, stronger caution, and a better understanding of risk.',
    ],
  },
  {
    id: 'opportunity-ahead',
    title: 'The Good Onboarding',
    color: '#047857',
    paragraphs: [
      'Good onboarding means helping people enter crypto through education rather than excitement or pressure. Adoption is likely to continue as more outsiders and younger generations become comfortable with digital assets. The important question is not only whether they will participate, but whether their first experience will be responsible and well informed. Without guidance, a new user may begin in the most speculative and unsafe parts of the market. A better starting point combines clear information, careful research, and practical risk awareness.',
      'Recoupa supports this journey with practical tools created for onboarders and outsiders without insider knowledge. Our Outdex presents selected early-stage projects so users can explore promising opportunities from a more informed starting point. Our casualty-claim tool also allows eligible $Recoupa token holders to file a claim for review if they experience a crypto loss. Together, these tools combine opportunity discovery with loss awareness and a possible path toward partial recovery. This approach helps users enter with the right footing, build knowledge they can share with future generations, and act on informed interest rather than careless FOMO.',
    ],
  },
  {
    id: 'cost-of-waiting',
    title: 'The Ugly Fear',
    color: '#B45309',
    paragraphs: [
      'The Ugly Fear is simple: fear can protect people from bad projects, but it can also keep them away from exceptional ones. One of the most painful outcomes is discovering a credible project only after its largest period of growth has passed. Early participation may offer greater potential than entering after a project becomes widely known and highly valued. Many outsiders wait because the risks are confusing and reliable information is difficult to find. Their caution is reasonable, but waiting without a trusted research process may cause important opportunities to be missed.',
      'The solution is not to rush into every new project or follow market excitement without evidence. A responsible approach is to study the project, understand its purpose, examine the warning signs, and decide whether the possible reward justifies the risk. Recoupa aims to make this process more accessible to people without insider connections or specialized knowledge. We highlight selected early opportunities while keeping caution and loss prevention at the center of the experience. The goal is to help users avoid the ugly result of arriving too late without exposing them to the equally dangerous cost of acting carelessly.',
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
          <span>CA: BthQ6kzzeLRJqKfLy5TKvYkEQ6enujxFwZANk6Ajpump</span>
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
    if (selectedToken) {
      return `Here is the data and score for ${selectedToken.name}.`;
    }
    if (destination === 'Discover') {
      if (tab === 'Thesis') {
        return "Recoupa helps traders and investors find new crypto projects early — projects that could grow into real companies. If a project team runs away with your money in a scam, Recoupa can help you get part of your loss back, so you can start again with more confidence.";
      }
      return "Recoupa is a list of selected crypto projects (the Outdex) and a safety system that helps prevent losses.";
    }
    if (destination === 'Outdex') {
      return "Our Outdex shows new projects that we think can grow well over a long time.";
    }
    if (destination === 'Claim') {
      return "If you lost money on other crypto tokens and you hold the required $Recoupa tokens, you can file a claim here.";
    }
    if (destination === 'Perps') {
      return "Go long or go short on any new launch. Another finds your position and decides to counter it.";
    }
    return `Explore ${destination} and learn what you need to trade with more confidence.`;
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
            {getHeroText()}
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
              <span className="hero-metric-value font-mono">
                {currentViewLabels[destination]}
              </span>
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
                          <span className="token-category">{token.category}</span>
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
                  <div className="list-header">
                    <div className="col-id">#</div>
                    <div className="col-name">TOKEN</div>
                    <div className="col-metric hidden-mobile">CATEGORY</div>
                    <div className="col-metric">SCORE</div>
                  </div>
                  <div className="list-body">
                    {tokenList.map((token, i) => (
                      <button
                        key={token.symbol}
                        className="list-row"
                        onClick={() => selectToken(token)}
                      >
                        <div className="col-id font-mono">{(i + 1).toString().padStart(2, '0')}</div>
                        <div className="col-name">
                          <div className="token-avatar">{token.symbol.slice(0, 1)}</div>
                          <div className="token-info">
                            <span className="token-title">{token.name}</span>
                            <span className="token-subtitle">@{token.symbol.toLowerCase()}</span>
                          </div>
                        </div>
                        <div className="col-metric hidden-mobile">
                          <span className="micro-label">CATEGORY</span>
                          <span className="metric-val">{token.category}</span>
                        </div>
                        <div className="col-metric">
                          <span className="micro-label">SCORE</span>
                          <span className="metric-val font-mono">{token.score}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {destination !== 'Discover' && destination !== 'Outdex' && (
                <div className="empty-card" />
              )}
            </>
          )}
        </section>
          </div>
        </div>
      )}
    </main>
  );
}

function TokenDetail({ token, onBack }: { token: Token; onBack: () => void }) {
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
        <div className="detail-score font-mono">{token.score}</div>
      </div>

      <div className="detail-metrics">
        <div className="metric-box">
          <span className="micro-label">CATEGORY</span>
          <span className="metric-val">{token.category}</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">LISTING STATUS</span>
          <span className="metric-val">Selected</span>
        </div>
        <div className="metric-box">
          <span className="micro-label">OUTDEX RATING</span>
          <span className="metric-val font-mono">{token.score}</span>
        </div>
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
