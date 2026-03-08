const fs = require('fs');
const path = require('path');

const TRANSCRIPTS_DIR = path.join(
  process.env.USERPROFILE || process.env.HOME,
  '.claude', 'projects',
  'c--Users-sarap-Documents-GitHub-Dig4503C-Low-and-No-Code'
);
const OUTPUT_FILE = path.join(__dirname, 'Week 7', 'transcripts.html');

// Read and parse all JSONL files
const files = fs.readdirSync(TRANSCRIPTS_DIR)
  .filter(f => f.endsWith('.jsonl'))
  .sort();

const sessions = {};

for (const file of files) {
  const sessionId = file.replace('.jsonl', '');
  const lines = fs.readFileSync(path.join(TRANSCRIPTS_DIR, file), 'utf8')
    .split('\n').filter(Boolean);

  const messages = [];
  let sessionDate = null;

  for (const line of lines) {
    let entry;
    try { entry = JSON.parse(line); } catch { continue; }

    if (entry.type !== 'user' && entry.type !== 'assistant') continue;

    const role = entry.message?.role;
    const content = entry.message?.content;
    const ts = entry.timestamp;

    if (!role || !content) continue;
    if (!sessionDate && ts) sessionDate = ts;

    // Extract text from content (can be string or array of content blocks)
    let text = '';
    if (typeof content === 'string') {
      text = content;
    } else if (Array.isArray(content)) {
      text = content
        .filter(b => b.type === 'text')
        .map(b => b.text || '')
        .join('\n')
        .trim();
      // Strip system-reminder tags and ide_opened_file tags
      text = text
        .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
        .replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g, '')
        .replace(/<ide_selection>[\s\S]*?<\/ide_selection>/g, '')
        .replace(/<local-command-caveat>[\s\S]*?<\/local-command-caveat>/g, '')
        .replace(/<command-message>[\s\S]*?<\/command-message>/g, '')
        .replace(/<command-name>[\s\S]*?<\/command-name>/g, '')
        .trim();
    }

    if (!text) continue;

    messages.push({ role, text, timestamp: ts });
  }

  if (messages.length > 0) {
    sessions[sessionId] = { date: sessionDate, messages };
  }
}

// Sort sessions by date
const sortedSessions = Object.entries(sessions)
  .sort(([, a], [, b]) => new Date(a.date) - new Date(b.date));

// Escape HTML
function esc(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

// Build HTML
let sessionsHtml = '';
let sessionNum = 0;

for (const [sessionId, { date, messages }] of sortedSessions) {
  sessionNum++;
  let msgsHtml = '';
  for (const { role, text } of messages) {
    const label = role === 'user' ? 'You' : 'Claude';
    const cls = role === 'user' ? 'msg-user' : 'msg-claude';
    msgsHtml += `
      <div class="message ${cls}">
        <div class="msg-label">${label}</div>
        <div class="msg-text">${esc(text)}</div>
      </div>`;
  }

  sessionsHtml += `
    <div class="session">
      <div class="session-header">
        <span class="session-num">Session ${sessionNum}</span>
        <span class="session-date">${formatDate(date)}</span>
        <span class="session-count">${messages.length} messages</span>
      </div>
      <div class="session-messages">${msgsHtml}</div>
    </div>`;
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Claude Code Transcripts — Dig4503C</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: #f5f5f7;
      color: #1d1d1f;
      line-height: 1.6;
    }
    .page-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 32px;
      text-align: center;
    }
    .page-header h1 { font-size: 2rem; font-weight: 700; margin-bottom: 8px; }
    .page-header p { opacity: 0.85; font-size: 1rem; }
    .meta { display: flex; gap: 24px; justify-content: center; margin-top: 16px; }
    .meta span {
      background: rgba(255,255,255,0.2);
      border-radius: 20px;
      padding: 4px 16px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .container { max-width: 860px; margin: 0 auto; padding: 32px 20px; }
    .session {
      background: white;
      border-radius: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07);
      margin-bottom: 28px;
      overflow: hidden;
    }
    .session-header {
      background: #f9f9fb;
      border-bottom: 1px solid #e8e8ed;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }
    .session-num {
      font-weight: 700;
      font-size: 0.95rem;
      color: #764ba2;
    }
    .session-date { font-size: 0.85rem; color: #666; }
    .session-count {
      margin-left: auto;
      font-size: 0.8rem;
      color: #aaa;
    }
    .session-messages { padding: 16px 20px; display: flex; flex-direction: column; gap: 14px; }
    .message { display: flex; flex-direction: column; gap: 4px; }
    .msg-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .msg-user .msg-label { color: #667eea; }
    .msg-claude .msg-label { color: #2e7d32; }
    .msg-text {
      font-size: 0.9rem;
      line-height: 1.65;
      white-space: pre-wrap;
      word-break: break-word;
      padding: 10px 14px;
      border-radius: 8px;
    }
    .msg-user .msg-text {
      background: #f0eeff;
      border-left: 3px solid #667eea;
    }
    .msg-claude .msg-text {
      background: #f1f8f1;
      border-left: 3px solid #4caf50;
    }
  </style>
</head>
<body>
  <div class="page-header">
    <h1>Claude Code Transcripts</h1>
    <p>DIG 4503C — Low and No Code</p>
    <div class="meta">
      <span>${sortedSessions.length} sessions</span>
      <span>${sortedSessions.reduce((n, [, s]) => n + s.messages.length, 0)} messages</span>
      <span>Exported ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
    </div>
  </div>
  <div class="container">
    ${sessionsHtml}
  </div>
</body>
</html>`;

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, html, 'utf8');
console.log(`✓ Exported ${sortedSessions.length} sessions to: ${OUTPUT_FILE}`);
