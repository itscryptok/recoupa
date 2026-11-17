import { useEffect, useState, type CSSProperties, type FormEvent } from 'react';
import { Link } from 'wouter';
import { Check, Copy } from 'lucide-react';
import {
  adminStatus,
  adminSetup,
  adminLogin,
  adminFetchClaims,
  adminUpdateClaim,
  type Claim,
  type ClaimStatus,
  type TxChain,
} from '../api';

const TOKEN_KEY = 'recoupa_admin_token';

const CHAIN_OPTIONS: [TxChain, string][] = [
  ['solana', 'Solana'],
  ['base', 'Base'],
  ['bsc', 'BNB Chain'],
  ['robinhood', 'Robinhood Chain'],
];

function truncate(value: string) {
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatAgeAgo(createdAt: string) {
  const ageMs = Date.now() - new Date(createdAt).getTime();
  const days = Math.floor(ageMs / (24 * 60 * 60 * 1000));
  if (days >= 1) return `${days}d ago`;
  const hours = Math.floor(ageMs / (60 * 60 * 1000));
  if (hours >= 1) return `${hours}h ago`;
  const minutes = Math.max(1, Math.floor(ageMs / (60 * 1000)));
  return `${minutes}m ago`;
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

type AdminFilter = 'all' | ClaimStatus;

function AdminClaimCard({
  claim,
  token,
  onUpdated,
  onError,
}: {
  claim: Claim;
  token: string;
  onUpdated: () => void;
  onError: (message: string) => void;
}) {
  const [mode, setMode] = useState<'none' | 'reject' | 'paid'>('none');
  const [reason, setReason] = useState('');
  const [txHash, setTxHash] = useState('');
  const [txChain, setTxChain] = useState<TxChain>('solana');
  const [busy, setBusy] = useState(false);

  const update = async (patch: Parameters<typeof adminUpdateClaim>[2]) => {
    setBusy(true);
    try {
      await adminUpdateClaim(token, claim.id, patch);
      setMode('none');
      setReason('');
      setTxHash('');
      onUpdated();
    } catch (err) {
      onError(
        err instanceof Error ? err.message : 'Could not update the claim.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="claim-card">
      <div className="claim-card-head">
        <span className="claim-number font-mono">#{claim.claim_number}</span>
        <span
          className={`claim-status-badge${
            claim.status === 'paid' ? ' is-paid' : ''
          }${claim.status === 'rejected' ? ' is-rejected' : ''}`}
        >
          {claim.status === 'paid'
            ? 'Paid'
            : claim.status === 'rejected'
              ? 'Rejected'
              : 'Pending'}
        </span>
      </div>
      <div className="claim-row">
        <span className="micro-label">WALLET</span>
        <span className="claim-value font-mono">
          {truncate(claim.wallet_address)}
        </span>
        <CopyButton value={claim.wallet_address} label="Copy wallet address" />
      </div>
      <div className="claim-row">
        <span className="micro-label">LOSS TOKEN CA</span>
        <a
          className="claim-value-link font-mono"
          href={`https://pump.fun/coin/${claim.loss_token_ca}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {truncate(claim.loss_token_ca)}
        </a>
        <CopyButton
          value={claim.loss_token_ca}
          label="Copy loss token contract address"
        />
      </div>
      <div className="claim-row">
        <span className="micro-label">FILED</span>
        <span className="claim-value">
          {formatDate(claim.created_at.slice(0, 10))} ·{' '}
          {formatAgeAgo(claim.created_at)}
        </span>
      </div>
      {claim.status === 'rejected' && claim.rejection_reason && (
        <div className="claim-row">
          <span className="micro-label">REASON</span>
          <span className="claim-value">{claim.rejection_reason}</span>
        </div>
      )}
      {claim.status === 'paid' && claim.tx_hash && (
        <div className="claim-row">
          <span className="micro-label">TX HASH</span>
          <span className="claim-value font-mono">
            {truncate(claim.tx_hash)}
          </span>
          <CopyButton value={claim.tx_hash} label="Copy transaction hash" />
        </div>
      )}
      <div className="addy-actions">
        {claim.status === 'pending' && (
          <>
            <button
              type="button"
              className="addy-action-button is-reject"
              onClick={() => setMode(mode === 'reject' ? 'none' : 'reject')}
            >
              Reject
            </button>
            <button
              type="button"
              className="addy-action-button is-paid"
              onClick={() => setMode(mode === 'paid' ? 'none' : 'paid')}
            >
              Mark paid
            </button>
          </>
        )}
        {claim.status !== 'pending' && (
          <button
            type="button"
            className="addy-action-button"
            disabled={busy}
            onClick={() => update({ status: 'pending' })}
          >
            Reopen
          </button>
        )}
      </div>
      {mode === 'reject' && (
        <div className="addy-inline-form">
          <label className="claim-field">
            <span className="claim-field-label">Rejection reason</span>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why is this claim rejected? The reason shows on the public claims board."
              rows={3}
              maxLength={500}
            />
          </label>
          <div className="addy-inline-buttons">
            <button
              type="button"
              className="addy-action-button is-reject"
              disabled={busy || !reason.trim()}
              onClick={() =>
                update({ status: 'rejected', rejectionReason: reason.trim() })
              }
            >
              {busy ? 'Saving…' : 'Confirm rejection'}
            </button>
            <button
              type="button"
              className="addy-action-button"
              onClick={() => setMode('none')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {mode === 'paid' && (
        <div className="addy-inline-form">
          <label className="claim-field">
            <span className="claim-field-label">Payout transaction hash</span>
            <input
              type="text"
              value={txHash}
              onChange={(event) => setTxHash(event.target.value)}
              placeholder="Transaction hash of the payout"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <label className="claim-field">
            <span className="claim-field-label">Chain</span>
            <select
              value={txChain}
              onChange={(event) => setTxChain(event.target.value as TxChain)}
            >
              {CHAIN_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <div className="addy-inline-buttons">
            <button
              type="button"
              className="addy-action-button is-paid"
              disabled={busy || !txHash.trim()}
              onClick={() =>
                update({
                  status: 'paid',
                  txHash: txHash.trim(),
                  txChain,
                })
              }
            >
              {busy ? 'Saving…' : 'Confirm paid'}
            </button>
            <button
              type="button"
              className="addy-action-button"
              onClick={() => setMode('none')}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

export default function AddyPage() {
  const [stage, setStage] = useState<
    'checking' | 'setup' | 'login' | 'authed'
  >('checking');
  const [stageError, setStageError] = useState('');
  const [setupDone, setSetupDone] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState('');
  const [filter, setFilter] = useState<AdminFilter>('all');

  const loadClaims = async (authToken: string) => {
    setClaimsLoading(true);
    setClaimsError('');
    try {
      const data = await adminFetchClaims(authToken);
      setClaims(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Could not load claims.';
      if (message.toLowerCase().includes('login required')) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setStage('login');
        setStageError('Your session expired — please log in again.');
      } else {
        setClaimsError(message);
      }
    } finally {
      setClaimsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const { configured } = await adminStatus();
        if (!configured) {
          setStage('setup');
          return;
        }
        const stored = sessionStorage.getItem(TOKEN_KEY);
        if (stored) {
          setToken(stored);
          setStage('authed');
          await loadClaims(stored);
        } else {
          setStage('login');
        }
      } catch (err) {
        setStageError(
          err instanceof Error
            ? err.message
            : 'Could not reach the admin service.',
        );
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSetup = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      setStageError('Please choose a password of 8+ characters.');
      return;
    }
    if (password !== confirmPassword) {
      setStageError('The passwords do not match.');
      return;
    }
    setAuthBusy(true);
    setStageError('');
    try {
      await adminSetup(password);
      setPassword('');
      setConfirmPassword('');
      setSetupDone(true);
      setStage('login');
    } catch (err) {
      setStageError(
        err instanceof Error ? err.message : 'Setup failed. Please try again.',
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setAuthBusy(true);
    setStageError('');
    try {
      const { token: newToken } = await adminLogin(password);
      sessionStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setPassword('');
      setStage('authed');
      await loadClaims(newToken);
    } catch (err) {
      setStageError(
        err instanceof Error ? err.message : 'Login failed. Please try again.',
      );
    } finally {
      setAuthBusy(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setClaims([]);
    setStage('login');
  };

  const counts: Record<AdminFilter, number> = {
    all: claims.length,
    pending: 0,
    rejected: 0,
    paid: 0,
  };
  for (const claim of claims) counts[claim.status] += 1;
  const visibleClaims =
    filter === 'all' ? claims : claims.filter((c) => c.status === filter);

  const shellStyle = { '--page-accent': '#BE123C' } as CSSProperties;

  return (
    <div className="reference-explore" style={shellStyle}>
      <div className="addy-page">
        <Link href="/" className="addy-home-link">
          ← Back to Recoupa home
        </Link>
        <h1 className="addy-title">Claims admin</h1>

        {stage === 'checking' && !stageError && (
          <p className="claim-empty">Loading…</p>
        )}

        {stageError && (
          <p className="claim-error" role="alert">
            {stageError}
          </p>
        )}

        {stage === 'setup' && (
          <div className="claim-form-card addy-card">
            <h2>Set your admin password</h2>
            <p className="claim-intro">
              This is a one-time setup. Choose a password for the claims admin
              portal — you will use it every time you come back here.
            </p>
            <form onSubmit={handleSetup} noValidate>
              <label className="claim-field">
                <span className="claim-field-label">New password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="8+ characters"
                  autoComplete="new-password"
                  aria-label="New admin password"
                />
              </label>
              <label className="claim-field">
                <span className="claim-field-label">Confirm password</span>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat the password"
                  autoComplete="new-password"
                  aria-label="Confirm admin password"
                />
              </label>
              <button
                type="submit"
                className="claim-submit-button"
                disabled={authBusy}
              >
                {authBusy ? 'Saving…' : 'Set admin password'}
              </button>
            </form>
          </div>
        )}

        {stage === 'login' && (
          <div className="claim-form-card addy-card">
            <h2>Admin login</h2>
            {setupDone && (
              <p className="claim-success" role="status">
                Admin password set. Log in below.
              </p>
            )}
            <p className="claim-intro">
              Enter the admin password to manage claims.
            </p>
            <form onSubmit={handleLogin} noValidate>
              <label className="claim-field">
                <span className="claim-field-label">Admin password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Your admin password"
                  autoComplete="current-password"
                  aria-label="Admin password"
                />
              </label>
              <button
                type="submit"
                className="claim-submit-button"
                disabled={authBusy}
              >
                {authBusy ? 'Logging in…' : 'Log in'}
              </button>
            </form>
          </div>
        )}

        {stage === 'authed' && token && (
          <div className="addy-board">
            <div className="addy-board-head">
              <h2>Claims</h2>
              <button
                type="button"
                className="addy-action-button"
                onClick={logout}
              >
                Log out
              </button>
            </div>
            <div
              className="claims-tabs"
              role="tablist"
              aria-label="Claim status filter"
            >
              {(
                [
                  ['all', 'All'],
                  ['pending', 'Pending'],
                  ['rejected', 'Rejected'],
                  ['paid', 'Paid'],
                ] as [AdminFilter, string][]
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={filter === value}
                  className={`claims-tab${filter === value ? ' is-active' : ''}`}
                  onClick={() => setFilter(value)}
                >
                  {label}
                  <span className="claims-tab-count">{counts[value]}</span>
                </button>
              ))}
            </div>
            {claimsLoading ? (
              <p className="claim-empty">Loading claims…</p>
            ) : claimsError ? (
              <p className="claim-empty" role="alert">
                {claimsError}
              </p>
            ) : visibleClaims.length === 0 ? (
              <p className="claim-empty">
                {filter === 'all'
                  ? 'No claims yet.'
                  : `No ${filter} claims.`}
              </p>
            ) : (
              <ul className="claims-list">
                {visibleClaims.map((claim) => (
                  <AdminClaimCard
                    key={claim.id}
                    claim={claim}
                    token={token}
                    onUpdated={() => loadClaims(token)}
                    onError={setClaimsError}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
