/**
 * background.js — ScamShield Service Worker
 *
 * Responsibilities:
 *  - Register context menu items for links and selected text
 *  - Handle context menu clicks: extract URL/text → call /analyze API
 *  - Store latest result for popup to display
 *  - Message routing between popup ↔ content scripts
 */

import { analyzeUrl, analyzeText, getApiBase } from '../shared/api.js';

// ---------------------------------------------------------------------------
// Context menu setup
// ---------------------------------------------------------------------------

chrome.runtime.onInstalled.addListener(() => {
  // Primary menu item — shown on right-clicking a hyperlink
  chrome.contextMenus.create({
    id: 'scamshield-check-link',
    title: '🛡️ Check with ScamShield',
    contexts: ['link'],
  });

  // Secondary menu item — shown on right-clicking selected text
  chrome.contextMenus.create({
    id: 'scamshield-check-text',
    title: '🛡️ Check selection with ScamShield',
    contexts: ['selection'],
  });

  // Separator + Page scan
  chrome.contextMenus.create({
    id: 'scamshield-scan-page',
    title: '🔍 Scan all links on this page',
    contexts: ['page'],
  });
});

// ---------------------------------------------------------------------------
// Context menu click handler
// ---------------------------------------------------------------------------

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'scamshield-check-link') {
    const url = info.linkUrl;
    if (!url) return;

    // Store a "loading" state so popup can show spinner immediately
    await chrome.storage.local.set({
      lastResult: null,
      lastQuery: url,
      lastType: 'url',
      status: 'loading',
    });

    // Open popup (won't open automatically on context menu click in MV3, 
    // so we inject an in-page notification instead)
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showLoadingBanner,
        args: [url],
      });
    } catch (_) {}

    // Perform analysis
    const result = await analyzeUrl(url);

    await chrome.storage.local.set({
      lastResult: result,
      lastQuery: url,
      lastType: 'url',
      status: 'done',
    });

    // Inject result banner into the page
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showResultBanner,
        args: [url, result],
      });
    } catch (_) {}

  } else if (info.menuItemId === 'scamshield-check-text') {
    const text = info.selectionText;
    if (!text) return;

    await chrome.storage.local.set({
      lastResult: null,
      lastQuery: text,
      lastType: 'text',
      status: 'loading',
    });

    const result = await analyzeText(text);

    await chrome.storage.local.set({
      lastResult: result,
      lastQuery: text,
      lastType: 'text',
      status: 'done',
    });

    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: showResultBanner,
        args: [text.slice(0, 60) + '…', result],
      });
    } catch (_) {}

  } else if (info.menuItemId === 'scamshield-scan-page') {
    // Message content script to scan all links
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'SCAN_PAGE_LINKS' });
    } catch (_) {}
  }
});

// ---------------------------------------------------------------------------
// Message listener — popup ↔ background ↔ content
// ---------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ANALYZE_URL') {
    analyzeUrl(message.url).then(result => sendResponse({ result }));
    return true; // Keep channel open for async response
  }

  if (message.action === 'ANALYZE_TEXT') {
    analyzeText(message.text).then(result => sendResponse({ result }));
    return true;
  }

  if (message.action === 'GET_STATUS') {
    chrome.storage.local.get(['lastResult', 'lastQuery', 'lastType', 'status'], data => {
      sendResponse(data);
    });
    return true;
  }
});

// ---------------------------------------------------------------------------
// Page-injected banner functions (serialized via executeScript)
// These functions run IN the page context, NOT in the extension context.
// ---------------------------------------------------------------------------

function showLoadingBanner(query) {
  const existing = document.getElementById('scamshield-banner');
  if (existing) existing.remove();

  const banner = document.createElement('div');
  banner.id = 'scamshield-banner';
  banner.style.cssText = `
    position: fixed; top: 16px; right: 16px; z-index: 2147483647;
    background: #0f1729; border: 1px solid #00d4ff44;
    border-radius: 12px; padding: 14px 18px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px; color: #e2e8f0; box-shadow: 0 8px 32px #00000088;
    min-width: 280px; max-width: 360px; backdrop-filter: blur(16px);
    animation: slideIn 0.3s ease;
  `;
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="width:20px;height:20px;border:2px solid #00d4ff;border-top-color:transparent;
        border-radius:50%;animation:spin 0.8s linear infinite;flex-shrink:0;"></div>
      <div>
        <div style="font-weight:600;color:#00d4ff;">🛡️ ScamShield</div>
        <div style="opacity:0.7;font-size:12px;margin-top:2px;">Analyzing…</div>
      </div>
    </div>
    <style>
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } }
    </style>
  `;
  document.body.appendChild(banner);
}

function showResultBanner(query, result) {
  const existing = document.getElementById('scamshield-banner');
  if (existing) existing.remove();

  const level = result?.risk_level || 'Unknown';
  const score = result?.risk_score ?? '—';
  const signals = result?.signals || [];
  const explanation = result?.explanation || '';

  const colors = {
    Dangerous: { bg: '#ff4d4d22', border: '#ff4d4d', text: '#ff6b6b', emoji: '🔴' },
    Suspicious: { bg: '#ffa50022', border: '#ffa500', text: '#ffc107', emoji: '🟡' },
    Safe: { bg: '#00ff8822', border: '#00cc66', text: '#00e676', emoji: '🟢' },
    Unknown: { bg: '#ffffff11', border: '#888', text: '#aaa', emoji: '⚪' },
  };
  const c = colors[level] || colors.Unknown;

  const topSignals = signals.slice(0, 3)
    .map(s => `<li style="margin:2px 0;opacity:0.85;">• ${s.detail.slice(0, 70)}</li>`)
    .join('');

  const banner = document.createElement('div');
  banner.id = 'scamshield-banner';
  banner.style.cssText = `
    position: fixed; top: 16px; right: 16px; z-index: 2147483647;
    background: #0f1729; border: 1px solid ${c.border}66;
    border-radius: 12px; padding: 14px 18px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px; color: #e2e8f0; box-shadow: 0 8px 32px #00000088;
    min-width: 300px; max-width: 380px; backdrop-filter: blur(16px);
    animation: slideIn 0.3s ease;
  `;
  banner.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div style="font-weight:700;color:${c.text};font-size:14px;">
        ${c.emoji} ScamShield — ${level}
      </div>
      <div style="cursor:pointer;opacity:0.5;font-size:16px;line-height:1;margin-left:12px;"
        onclick="this.closest('#scamshield-banner').remove()">✕</div>
    </div>
    <div style="margin:6px 0;font-size:12px;opacity:0.6;">${query.slice(0, 50)}</div>
    <div style="display:flex;align-items:center;gap:8px;margin:8px 0;">
      <div style="flex:1;height:6px;border-radius:4px;background:#ffffff18;overflow:hidden;">
        <div style="width:${score}%;height:100%;background:${c.text};border-radius:4px;
          transition:width 0.5s ease;"></div>
      </div>
      <span style="font-weight:700;color:${c.text};">${score}/100</span>
    </div>
    ${topSignals ? `<ul style="margin:6px 0 0;padding:0;list-style:none;font-size:12px;">${topSignals}</ul>` : ''}
    <style>
      @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } }
    </style>
  `;
  document.body.appendChild(banner);

  // Auto-dismiss Safe results after 5 seconds
  if (level === 'Safe') {
    setTimeout(() => {
      const el = document.getElementById('scamshield-banner');
      if (el) el.style.opacity = '0', el.style.transition = 'opacity 0.5s', setTimeout(() => el.remove(), 500);
    }, 5000);
  }
}
