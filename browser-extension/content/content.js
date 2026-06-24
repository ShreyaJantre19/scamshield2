/**
 * content.js — ScamShield Content Script
 *
 * Runs in the context of web pages. Responsibilities:
 *  - Listen for SCAN_PAGE_LINKS message from background
 *  - When triggered, scan all anchor tags on the page
 *  - Inject warning badges next to suspicious links
 */

// Inject minimal keyframe styles once
(function injectStyles() {
  if (document.getElementById('scamshield-styles')) return;
  const style = document.createElement('style');
  style.id = 'scamshield-styles';
  style.textContent = `
    .ss-badge {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      font-size: 10px;
      font-weight: 700;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 2px 6px;
      border-radius: 100px;
      vertical-align: middle;
      margin-left: 4px;
      cursor: pointer;
      border: none;
      text-decoration: none;
      line-height: 1.4;
      letter-spacing: 0.02em;
      transition: opacity 0.15s;
    }
    .ss-badge:hover { opacity: 0.8; }
    .ss-badge-dangerous { background: #ff4d4d22; color: #ff6b6b; border: 1px solid #ff4d4d55; }
    .ss-badge-suspicious { background: #ffa50022; color: #ffc107; border: 1px solid #ffa50055; }
    .ss-badge-loading { background: #00d4ff11; color: #00d4ff; border: 1px solid #00d4ff33; }
    @keyframes ss-spin { to { transform: rotate(360deg); } }
    .ss-spinner {
      width: 8px; height: 8px;
      border: 1.5px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: ss-spin 0.7s linear infinite;
    }
  `;
  document.head.appendChild(style);
})();

// ---------------------------------------------------------------------------
// Message listener
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'SCAN_PAGE_LINKS') {
    scanPageLinks();
    sendResponse({ ok: true });
  }
  if (message.action === 'HIGHLIGHT_URL') {
    highlightUrlOnPage(message.url, message.result);
    sendResponse({ ok: true });
  }
});

// ---------------------------------------------------------------------------
// Page link scanner
// ---------------------------------------------------------------------------

async function scanPageLinks() {
  const anchors = Array.from(document.querySelectorAll('a[href]'));
  const httpAnchors = anchors.filter(a => {
    try {
      const u = new URL(a.href);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch { return false; }
  });

  // Deduplicate by href, limit to 20 to avoid hammering the API
  const unique = [...new Map(httpAnchors.map(a => [a.href, a])).values()].slice(0, 20);

  // Show loading badges on all
  unique.forEach(a => attachBadge(a, 'loading', '⟳ Checking…'));

  // Analyze each URL in parallel (batched)
  const BATCH = 5;
  for (let i = 0; i < unique.length; i += BATCH) {
    const batch = unique.slice(i, i + BATCH);
    await Promise.all(batch.map(async a => {
      const result = await analyzeUrlFromPage(a.href);
      const level = result?.risk_level;
      const score = result?.risk_score ?? 0;

      if (level === 'Dangerous') {
        attachBadge(a, 'dangerous', `🔴 ${score}/100`, result);
      } else if (level === 'Suspicious') {
        attachBadge(a, 'suspicious', `🟡 ${score}/100`, result);
      } else {
        // Remove loading badge for safe links — no clutter
        const existing = a.nextElementSibling;
        if (existing && existing.classList.contains('ss-badge')) existing.remove();
      }
    }));
  }
}

// ---------------------------------------------------------------------------
// Badge attachment
// ---------------------------------------------------------------------------

function attachBadge(anchor, type, label, result) {
  // Remove any existing badge for this anchor
  const prev = anchor.nextSibling;
  if (prev && prev.nodeType === 1 && prev.classList && prev.classList.contains('ss-badge')) {
    prev.remove();
  }

  const badge = document.createElement('span');
  badge.className = `ss-badge ss-badge-${type}`;

  if (type === 'loading') {
    badge.innerHTML = `<span class="ss-spinner"></span> Checking`;
  } else {
    badge.textContent = label;
  }

  if (result) {
    badge.title = result.explanation || `Risk: ${label}`;
    badge.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      showInlineCard(anchor, result);
    });
  }

  anchor.parentNode.insertBefore(badge, anchor.nextSibling);
}

// ---------------------------------------------------------------------------
// Inline detail card
// ---------------------------------------------------------------------------

function showInlineCard(anchor, result) {
  // Remove existing card
  const existingCard = document.getElementById('ss-inline-card');
  if (existingCard) existingCard.remove();

  const level = result.risk_level || 'Unknown';
  const score = result.risk_score ?? 0;
  const signals = result.signals || [];
  const colors = {
    Dangerous: '#ff6b6b', Suspicious: '#ffc107', Safe: '#00e676', Unknown: '#aaa',
  };
  const color = colors[level] || '#aaa';

  const card = document.createElement('div');
  card.id = 'ss-inline-card';
  card.style.cssText = `
    position: absolute; z-index: 2147483646;
    background: #0f1729; border: 1px solid ${color}44;
    border-radius: 10px; padding: 12px 16px; min-width: 260px; max-width: 340px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 12px; color: #e2e8f0; box-shadow: 0 8px 24px #00000099;
    backdrop-filter: blur(12px);
  `;

  const topSignals = signals.slice(0, 3)
    .map(s => `<li>• ${(s.detail || s.name).slice(0, 80)}</li>`)
    .join('');

  card.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <span style="font-weight:700;color:${color};font-size:13px;">🛡️ ${level}</span>
      <span style="cursor:pointer;opacity:0.5;" onclick="this.closest('#ss-inline-card').remove()">✕</span>
    </div>
    <div style="margin-bottom:6px;">
      <div style="height:4px;border-radius:2px;background:#ffffff18;">
        <div style="width:${score}%;height:100%;background:${color};border-radius:2px;"></div>
      </div>
      <div style="opacity:0.6;margin-top:3px;">Score: ${score}/100</div>
    </div>
    ${topSignals ? `<ul style="margin:0;padding:0;list-style:none;opacity:0.8;">${topSignals}</ul>` : ''}
  `;

  // Position near the anchor
  const rect = anchor.getBoundingClientRect();
  card.style.top = `${window.scrollY + rect.bottom + 6}px`;
  card.style.left = `${window.scrollX + rect.left}px`;
  document.body.appendChild(card);

  // Auto-close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closer(e) {
      if (!card.contains(e.target)) { card.remove(); document.removeEventListener('click', closer); }
    });
  }, 100);
}

// ---------------------------------------------------------------------------
// Highlight a specific URL (called after context menu analysis)
// ---------------------------------------------------------------------------

function highlightUrlOnPage(url, result) {
  const anchors = Array.from(document.querySelectorAll(`a[href="${url}"]`));
  anchors.forEach(a => {
    const level = result?.risk_level;
    const score = result?.risk_score ?? 0;
    if (level === 'Dangerous') attachBadge(a, 'dangerous', `🔴 ${score}/100`, result);
    else if (level === 'Suspicious') attachBadge(a, 'suspicious', `🟡 ${score}/100`, result);
  });
}

// ---------------------------------------------------------------------------
// API call from content script (via background message)
// ---------------------------------------------------------------------------

function analyzeUrlFromPage(url) {
  return new Promise(resolve => {
    chrome.runtime.sendMessage({ action: 'ANALYZE_URL', url }, response => {
      resolve(response?.result || null);
    });
  });
}
