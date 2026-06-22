/**
 * api.js — ScamShield Shared API Client
 *
 * Used by both background.js and popup.js.
 * Reads API base URL from chrome.storage (set via options page).
 */

const DEFAULT_API_BASE = 'http://localhost:8000';

export async function getApiBase() {
  return new Promise(resolve => {
    chrome.storage.local.get(['apiBase'], data => {
      resolve(data.apiBase || DEFAULT_API_BASE);
    });
  });
}

/**
 * Analyze a URL using the unified /analyze/json endpoint.
 */
export async function analyzeUrl(url) {
  const base = await getApiBase();
  try {
    const res = await fetch(`${base}/api/analyze/json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'url', url }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      risk_score: 0,
      risk_level: 'Error',
      signals: [],
      explanation: `Could not reach ScamShield API: ${err.message}. Make sure the backend is running at ${base}.`,
      error: true,
    };
  }
}

/**
 * Analyze free text (treated as email body for keyword/URL extraction).
 */
export async function analyzeText(text) {
  const base = await getApiBase();
  // Extract first URL if present, otherwise treat as email body
  const urlMatch = text.match(/https?:\/\/[^\s"'<>]+/);
  if (urlMatch) {
    return analyzeUrl(urlMatch[0]);
  }

  try {
    const res = await fetch(`${base}/api/analyze/json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'email',
        sender: 'unknown@unknown.com',
        subject: '',
        body: text,
      }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      risk_score: 0,
      risk_level: 'Error',
      signals: [],
      explanation: `Could not reach ScamShield API: ${err.message}`,
      error: true,
    };
  }
}

/**
 * Analyze a full email (sender + subject + body).
 */
export async function analyzeEmail(sender, subject, body) {
  const base = await getApiBase();
  try {
    const res = await fetch(`${base}/api/analyze/json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', sender, subject, body }),
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return await res.json();
  } catch (err) {
    return {
      risk_score: 0,
      risk_level: 'Error',
      signals: [],
      explanation: `Could not reach ScamShield API: ${err.message}`,
      error: true,
    };
  }
}
