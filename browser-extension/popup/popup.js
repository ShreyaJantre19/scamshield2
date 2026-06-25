/**
 * popup.js — ScamShield Popup Logic
 *
 * Handles tab switching, form input, API calls, result rendering,
 * gauge animation, and page scanning trigger.
 */

import { analyzeUrl, analyzeEmail, analyzeText } from '../shared/api.js';

// ---------------------------------------------------------------------------
// DOM refs
// ---------------------------------------------------------------------------

const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-content');
const resultPanel = document.getElementById('result-panel');
const emptyState = document.getElementById('empty-state');
const errorState = document.getElementById('error-state');
const errorText = document.getElementById('error-text');

// URL tab
const urlInput = document.getElementById('url-input');
const btnAnalyzeUrl = document.getElementById('btn-analyze-url');
const btnPasteUrl = document.getElementById('btn-paste-url');

// Email tab
const emailSender = document.getElementById('email-sender');
const emailSubject = document.getElementById('email-subject');
const emailBody = document.getElementById('email-body');
const btnAnalyzeEmail = document.getElementById('btn-analyze-email');

// Page tab
const currentPageUrl = document.getElementById('current-page-url');
const btnScanPage = document.getElementById('btn-scan-page');

// Result panel
const gaugeFill = document.getElementById('gauge-fill');
const gaugeScore = document.getElementById('gauge-score');
const gaugeLabel = document.getElementById('gauge-label');
const riskBadge = document.getElementById('risk-badge');
const explanationBox = document.getElementById('explanation-box');
const signalsList = document.getElementById('signals-list');
const btnClear = document.getElementById('btn-clear');
const btnCopy = document.getElementById('btn-copy');
const btnSettings = document.getElementById('btn-settings');
const btnOpenSettings = document.getElementById('btn-open-settings');

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    const target = document.querySelector(`[data-panel="${tab.dataset.tab}"]`);
    if (target) target.classList.add('active');

    // Hide result when switching tabs
    hideResult();
  });
});

// ---------------------------------------------------------------------------
// URL Tab
// ---------------------------------------------------------------------------

btnAnalyzeUrl.addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) {
    urlInput.focus();
    urlInput.classList.add('shake');
    setTimeout(() => urlInput.classList.remove('shake'), 400);
    return;
  }
  setLoading(btnAnalyzeUrl, true);
  hideResult();

  const result = await analyzeUrl(url);
  setLoading(btnAnalyzeUrl, false);
  renderResult(result);
});

urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') btnAnalyzeUrl.click();
});

btnPasteUrl.addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text.trim();
    urlInput.focus();
  } catch {
    // Clipboard denied — just focus the field
    urlInput.focus();
  }
});

// ---------------------------------------------------------------------------
// Email Tab
// ---------------------------------------------------------------------------

btnAnalyzeEmail.addEventListener('click', async () => {
  const sender = emailSender.value.trim();
  const subject = emailSubject.value.trim();
  const body = emailBody.value.trim();

  if (!sender && !body) {
    emailSender.focus();
    return;
  }

  setLoading(btnAnalyzeEmail, true);
  hideResult();

  const result = await analyzeEmail(
    sender || 'unknown@unknown.com',
    subject,
    body
  );
  setLoading(btnAnalyzeEmail, false);
  renderResult(result);
});

// ---------------------------------------------------------------------------
// Page Tab
// ---------------------------------------------------------------------------

// Load current tab URL
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  const tab = tabs[0];
  if (tab?.url) {
    currentPageUrl.textContent = tab.url.length > 55
      ? tab.url.slice(0, 52) + '…'
      : tab.url;
  }
});

btnScanPage.addEventListener('click', async () => {
  setLoading(btnScanPage, true);
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      await chrome.tabs.sendMessage(tab.id, { action: 'SCAN_PAGE_LINKS' });
      // Show success note
      btnScanPage.querySelector('.btn-text').textContent = '✓ Scanning… check page for badges';
      setTimeout(() => {
        btnScanPage.querySelector('.btn-text').textContent = '🔍 Scan Page Links';
        setLoading(btnScanPage, false);
      }, 3000);
    }
  } catch (e) {
    setLoading(btnScanPage, false);
  }
});

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

btnSettings.addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});

if (btnOpenSettings) {
  btnOpenSettings.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

// ---------------------------------------------------------------------------
// Check for pre-loaded result from context menu
// ---------------------------------------------------------------------------

chrome.storage.local.get(['lastResult', 'lastQuery', 'status'], data => {
  if (data.status === 'done' && data.lastResult) {
    // Pre-fill input if applicable
    if (data.lastQuery && data.lastResult.sub_results?.url) {
      urlInput.value = data.lastQuery;
      // Switch to URL tab
      document.querySelector('[data-tab="url"]')?.click();
    }
    renderResult(data.lastResult);
    // Clear so next open doesn't auto-show stale result
    chrome.storage.local.set({ status: null });
  }
});

// ---------------------------------------------------------------------------
// Result rendering
// ---------------------------------------------------------------------------

function renderResult(result) {
  if (!result || result.error) {
    const msg = result?.explanation || 'Cannot connect to ScamShield API. Is the backend running?';
    showError(msg);
    return;
  }

  hideError();
  emptyState.classList.add('hidden');
  resultPanel.classList.remove('hidden');

  const score = result.risk_score ?? 0;
  const level = result.risk_level || 'Unknown';
  const signals = result.signals || [];
  const explanation = result.explanation || '';

  // Animate gauge
  animateGauge(score, level);

  // Risk badge
  riskBadge.className = 'risk-badge ' + level.toLowerCase();
  const levelEmoji = { Dangerous: '🔴', Suspicious: '🟡', Safe: '🟢', Unknown: '⚪' };
  riskBadge.textContent = `${levelEmoji[level] || ''} ${level}`;

  // Explanation
  explanationBox.textContent = explanation;

  // Signals
  renderSignals(signals);
}

function animateGauge(targetScore, level) {
  const colors = {
    Dangerous: '#ff4d4d',
    Suspicious: '#ffc107',
    Safe: '#00e676',
    Unknown: '#888',
  };
  const color = colors[level] || '#888';

  gaugeScore.textContent = targetScore;
  gaugeLabel.textContent = '/100';

  // Animate arc — full arc dasharray = 141.4, 0 = full, 141.4 = empty
  const offset = 141.4 - (targetScore / 100) * 141.4;
  gaugeFill.style.transition = 'stroke-dashoffset 0.7s ease, stroke 0.4s ease';
  gaugeFill.style.stroke = color;
  gaugeFill.style.strokeDashoffset = `${offset}`;

  gaugeScore.style.color = color;
}

function renderSignals(signals) {
  signalsList.innerHTML = '';
  if (!signals.length) {
    signalsList.innerHTML = '<div style="color:var(--text-muted);font-size:11px;">No significant signals detected.</div>';
    return;
  }

  signals.forEach(sig => {
    const score = sig.score ?? 0;
    const isCorrelation = sig.name.startsWith('correlation:');
    const dotClass = isCorrelation ? 'correlation' : score >= 30 ? 'high' : score >= 15 ? 'medium' : 'low';
    const displayName = sig.name
      .replace('correlation:', '🔗 ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());

    const card = document.createElement('div');
    card.className = 'signal-card';
    card.innerHTML = `
      <div class="signal-dot ${dotClass}"></div>
      <div class="signal-info">
        <div class="signal-name">${displayName}</div>
        <div class="signal-detail">${(sig.detail || '').slice(0, 90)}</div>
      </div>
      <div class="signal-score">+${score}</div>
    `;
    signalsList.appendChild(card);
  });
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

btnClear.addEventListener('click', () => {
  hideResult();
  urlInput.value = '';
  emailSender.value = '';
  emailSubject.value = '';
  emailBody.value = '';
  emptyState.classList.remove('hidden');
});

btnCopy.addEventListener('click', async () => {
  const score = gaugeScore.textContent;
  const level = riskBadge.textContent;
  const explanation = explanationBox.textContent;
  const signals = Array.from(document.querySelectorAll('.signal-card'))
    .map(c => `• ${c.querySelector('.signal-name').textContent}: ${c.querySelector('.signal-detail').textContent}`)
    .join('\n');

  const report = [
    '🛡️ ScamShield Analysis Report',
    `Risk Level: ${level} (Score: ${score}/100)`,
    '',
    'Explanation:',
    explanation,
    '',
    'Risk Signals:',
    signals,
    '',
    `Generated by ScamShield at ${new Date().toLocaleString()}`
  ].join('\n');

  try {
    await navigator.clipboard.writeText(report);
    btnCopy.textContent = '✓ Copied!';
    setTimeout(() => btnCopy.textContent = 'Copy Report', 2000);
  } catch {
    btnCopy.textContent = 'Failed';
    setTimeout(() => btnCopy.textContent = 'Copy Report', 2000);
  }
});

// ---------------------------------------------------------------------------
// State helpers
// ---------------------------------------------------------------------------

function setLoading(btn, isLoading) {
  const text = btn.querySelector('.btn-text');
  const spinner = btn.querySelector('.btn-spinner');
  btn.disabled = isLoading;
  if (isLoading) {
    text.classList.add('hidden');
    spinner.classList.remove('hidden');
  } else {
    text.classList.remove('hidden');
    spinner.classList.add('hidden');
  }
}

function hideResult() {
  resultPanel.classList.add('hidden');
  errorState.classList.add('hidden');
}

function showError(msg) {
  emptyState.classList.add('hidden');
  resultPanel.classList.add('hidden');
  errorText.textContent = msg;
  errorState.classList.remove('hidden');
}

function hideError() {
  errorState.classList.add('hidden');
}
