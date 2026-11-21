// Typed client for the Recoupa claims API (server/). The base URL comes
// from VITE_API_URL, set on the Render static service once the API service
// exists. There is intentionally no hardcoded fallback URL.
export const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

export type ClaimStatus = 'pending' | 'rejected' | 'paid' | 'hidden';

export type ContactTopic =
  | 'project-listing'
  | 'claim-help'
  | 'general'
  | 'feedback';

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  topic: ContactTopic;
  project: string | null;
  message: string;
  created_at: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  topic: ContactTopic;
  project: string;
  message: string;
};

export type TxChain = 'solana' | 'base' | 'bsc' | 'robinhood';

export type Claim = {
  id: number;
  claim_number: string;
  wallet_address: string;
  loss_token_ca: string;
  status: ClaimStatus;
  rejection_reason: string | null;
  tx_hash: string | null;
  tx_chain: TxChain | null;
  created_at: string;
};

export type AdminClaimPatch = {
  status: ClaimStatus;
  rejectionReason?: string;
  txHash?: string;
  txChain?: TxChain;
};

const UNAVAILABLE = 'The claims service is unavailable right now. Please try again later.';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function baseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(UNAVAILABLE);
  }
  return API_BASE_URL.replace(/\/$/, '');
}

async function readError(res: Response, fallback: string): Promise<string> {
  try {
    const data: unknown = await res.json();
    if (typeof data === 'object' && data !== null && typeof (data as { error?: unknown }).error === 'string') {
      return (data as { error: string }).error;
    }
  } catch {
    // Not JSON — fall through to the generic message.
  }
  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${baseUrl()}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    throw new ApiError(res.status, await readError(res, `Request failed (${res.status}).`));
  }
  return (await res.json()) as T;
}

export async function fetchClaims(): Promise<Claim[]> {
  return request<Claim[]>('/api/claims');
}

export async function submitClaim(wallet: string, ca: string): Promise<Claim> {
  return request<Claim>('/api/claims', {
    method: 'POST',
    body: JSON.stringify({ walletAddress: wallet, lossTokenCa: ca }),
  });
}

// One-time migration of a claim previously filed into localStorage: the
// original claim number and filed date are preserved server-side.
export async function migrateClaim(
  claimNumber: string,
  wallet: string,
  ca: string,
  dateFiled: string,
): Promise<Claim> {
  return request<Claim>('/api/claims', {
    method: 'POST',
    body: JSON.stringify({ walletAddress: wallet, lossTokenCa: ca, claimNumber, dateFiled }),
  });
}

export async function submitContactMessage(
  data: ContactFormData,
): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function adminFetchMessages(
  token: string,
): Promise<ContactMessage[]> {
  return request<ContactMessage[]>('/api/admin/messages', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminStatus(): Promise<{ configured: boolean }> {
  return request<{ configured: boolean }>('/api/admin/status');
}

export async function adminSetup(password: string): Promise<{ ok: boolean }> {
  return request<{ ok: boolean }>('/api/admin/setup', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function adminLogin(password: string): Promise<{ token: string }> {
  return request<{ token: string }>('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function adminFetchClaims(token: string): Promise<Claim[]> {
  return request<Claim[]>('/api/admin/claims', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function adminUpdateClaim(
  token: string,
  id: number,
  patch: AdminClaimPatch,
): Promise<Claim> {
  return request<Claim>(`/api/admin/claims/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  });
}
