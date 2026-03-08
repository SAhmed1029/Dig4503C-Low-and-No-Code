"""
export_transcripts.py
Exports Claude Code session transcripts for this project to:
  - Week 8/transcript_export.html   (full, styled conversation log)
  - Week 8/TRANSCRIPT-HIGHLIGHTS.md (summary of key sessions)

Only includes the current Week 8 session (Spoonful app).
"""

import json
import os
import re
import html
from datetime import datetime, timezone
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
PROJECT_DIR = Path(r"C:\Users\sarap\.claude\projects\c--Users-sarap-Documents-GitHub-Dig4503C-Low-and-No-Code")
OUTPUT_HTML = Path(r"c:\Users\sarap\Documents\GitHub\Dig4503C-Low-and-No-Code\Week 8\transcript_export.html")
OUTPUT_MD   = Path(r"c:\Users\sarap\Documents\GitHub\Dig4503C-Low-and-No-Code\Week 8\TRANSCRIPT-HIGHLIGHTS.md")
# Only this session — the active Week 8 / Spoonful session
SESSION_FILE = PROJECT_DIR / "89a41839-8e29-42eb-a416-d7423c2f1322.jsonl"

# Tool calls we surface in the transcript
VISIBLE_TOOLS = {"Bash", "Edit", "Write", "Read", "Glob", "Grep", "WebFetch", "WebSearch"}

# ── Helpers ───────────────────────────────────────────────────────────────────
def fmt_ts(iso: str) -> str:
    try:
        dt = datetime.fromisoformat(iso.replace("Z", "+00:00"))
        local = dt.astimezone()
        return local.strftime("%Y-%m-%d %H:%M")
    except Exception:
        return iso

def extract_text(content) -> str:
    """Pull plain text out of a message content (list or str)."""
    if isinstance(content, str):
        return content
    parts = []
    for block in content:
        if isinstance(block, dict):
            if block.get("type") == "text":
                t = block.get("text", "")
                # strip system-reminder injections for cleanliness
                t = re.sub(r"<system-reminder>.*?</system-reminder>", "", t, flags=re.DOTALL)
                t = re.sub(r"<ide_opened_file>.*?</ide_opened_file>", "", t, flags=re.DOTALL)
                t = re.sub(r"<ide_selection>.*?</ide_selection>", "", t, flags=re.DOTALL)
                t = t.strip()
                if t:
                    parts.append(t)
    return "\n\n".join(parts)

def extract_tool_calls(content) -> list[dict]:
    """Return list of {name, input_summary} for tool_use blocks."""
    calls = []
    if not isinstance(content, list):
        return calls
    for block in content:
        if isinstance(block, dict) and block.get("type") == "tool_use":
            name = block.get("name", "")
            if name not in VISIBLE_TOOLS:
                continue
            inp = block.get("input", {})
            summary = ""
            if name == "Bash":
                summary = inp.get("command", "")[:120]
            elif name in ("Edit", "Write"):
                summary = inp.get("file_path", "")
            elif name == "Read":
                summary = inp.get("file_path", "")
            elif name == "Glob":
                summary = inp.get("pattern", "")
            elif name == "Grep":
                summary = inp.get("pattern", "")
            elif name in ("WebFetch", "WebSearch"):
                summary = inp.get("url", inp.get("query", ""))[:80]
            calls.append({"name": name, "summary": summary})
    return calls

def load_session(path: Path) -> list[dict]:
    """Parse a JSONL file → list of message dicts with role/text/ts/tools."""
    messages = []
    try:
        with open(path, encoding="utf-8", errors="replace") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    obj = json.loads(line)
                except json.JSONDecodeError:
                    continue
                if obj.get("type") not in ("user", "assistant"):
                    continue
                msg = obj.get("message", {})
                role = msg.get("role", obj.get("type", ""))
                content = msg.get("content", "")
                text = extract_text(content)
                tools = extract_tool_calls(content) if role == "assistant" else []
                ts = obj.get("timestamp", "")
                if text or tools:
                    messages.append({"role": role, "text": text, "tools": tools, "ts": ts})
    except Exception as e:
        print(f"  Warning: could not read {path.name}: {e}")
    return messages

def first_user_prompt(messages: list[dict]) -> str:
    for m in messages:
        if m["role"] == "user" and m["text"]:
            t = m["text"].strip()
            return t[:120] + ("…" if len(t) > 120 else "")
    return "(no prompt)"

# ── Load single session ───────────────────────────────────────────────────────
sessions = []
messages = load_session(SESSION_FILE)
if messages:
    ts_vals = [m["ts"] for m in messages if m["ts"]]
    sessions.append({
        "id": SESSION_FILE.stem,
        "path": SESSION_FILE,
        "messages": messages,
        "first_ts": min(ts_vals) if ts_vals else "",
        "last_ts":  max(ts_vals) if ts_vals else "",
        "first_prompt": first_user_prompt(messages),
    })

print(f"Loaded {len(sessions)} session — {len(messages)} messages.")

# ── Build HTML ────────────────────────────────────────────────────────────────
CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f4f4f6; color: #222; }
h1 { font-size: 1.6rem; font-weight: 700; }
h2 { font-size: 1.15rem; font-weight: 700; color: #333; }

.page-header {
  background: linear-gradient(135deg, #6db474, #4a8a52);
  color: #fff; padding: 28px 40px; display: flex;
  align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
}
.page-header small { opacity: .8; font-size: .85rem; }

.toc { background: #fff; border-radius: 12px; margin: 24px 40px 0; padding: 20px 28px;
       box-shadow: 0 2px 10px #0001; }
.toc h2 { margin-bottom: 14px; color: #4a8a52; }
.toc ol { padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.toc li { font-size: .9rem; }
.toc a { color: #4a8a52; text-decoration: none; }
.toc a:hover { text-decoration: underline; }
.toc .toc-meta { font-size: .78rem; color: #888; margin-left: 6px; }

.sessions { padding: 24px 40px 60px; display: flex; flex-direction: column; gap: 32px; }

.session { background: #fff; border-radius: 12px; box-shadow: 0 2px 10px #0001; overflow: hidden; }
.session-header { background: #e8f4ea; padding: 14px 20px; display: flex;
                   align-items: baseline; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.session-header h2 { color: #4a8a52; font-size: 1rem; }
.session-header .session-meta { font-size: .78rem; color: #888; }

.messages { padding: 0 20px 16px; display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }

.msg { display: flex; gap: 12px; }
.msg.user { flex-direction: row-reverse; }

.avatar { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center; font-size: .8rem;
          font-weight: 700; color: #fff; margin-top: 2px; }
.avatar.user-av { background: #6db474; }
.avatar.ai-av   { background: #4a8a52; }

.bubble { max-width: 78%; background: #f4f4f6; border-radius: 12px; padding: 12px 16px; }
.msg.user .bubble { background: #e8f4ea; border-bottom-right-radius: 4px; }
.msg.assistant .bubble { background: #f4f4f6; border-bottom-left-radius: 4px; }

.bubble-text { font-size: .88rem; line-height: 1.65; white-space: pre-wrap; word-break: break-word; }
.bubble-text code { background: #e0e0e0; border-radius: 4px; padding: 1px 4px; font-size: .82rem; }
pre.code-block { background: #1e1e2e; color: #cdd6f4; border-radius: 8px; padding: 12px 14px;
                  font-size: .78rem; overflow-x: auto; margin-top: 6px; white-space: pre; }
.tool-calls { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; }
.tool-pill { display: inline-flex; align-items: center; gap: 5px; background: #cce8d0;
              color: #2e7d32; font-size: .72rem; font-weight: 600; border-radius: 20px;
              padding: 2px 10px; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.tool-pill code { background: none; color: inherit; font-size: .7rem; }
.ts { font-size: .68rem; color: #bbb; margin-top: 4px; text-align: right; }
.msg.user .ts { text-align: left; }
"""

def render_text(text: str) -> str:
    """Convert plain text → HTML with inline code and fenced code blocks."""
    segments = re.split(r"(```[\s\S]*?```)", text)
    out = []
    for seg in segments:
        if seg.startswith("```"):
            inner = re.sub(r"^```\w*\n?", "", seg).rstrip("`").rstrip()
            out.append(f'<pre class="code-block">{html.escape(inner)}</pre>')
        else:
            escaped = html.escape(seg)
            # inline `code`
            escaped = re.sub(r"`([^`]+)`", lambda m: f"<code>{html.escape(m.group(1))}</code>", escaped)
            out.append(f'<span class="bubble-text">{escaped}</span>')
    return "".join(out)

def build_html(sessions: list[dict]) -> str:
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Spoonful — Claude Code Transcripts</title>
<style>{CSS}</style>
</head>
<body>
<div class="page-header">
  <div>
    <h1>Week 8 &mdash; Spoonful App &mdash; Claude Code Transcript</h1>
    <small>Project: Dig4503C Low-and-No-Code &nbsp;|&nbsp; Exported {now}</small>
  </div>
  <small>{len(sessions[0]["messages"])} messages</small>
</div>
"""]

    # Table of contents
    lines.append('<div class="toc"><h2>Sessions</h2><ol>')
    for i, s in enumerate(sessions, 1):
        date = fmt_ts(s["first_ts"])[:10] if s["first_ts"] else "unknown date"
        prompt_esc = html.escape(s["first_prompt"])
        lines.append(f'<li><a href="#session-{i}">{date} &mdash; {prompt_esc}</a>'
                      f'<span class="toc-meta">{len(s["messages"])} messages</span></li>')
    lines.append("</ol></div>")

    # Sessions
    lines.append('<div class="sessions">')
    for i, s in enumerate(sessions, 1):
        date_range = fmt_ts(s["first_ts"])
        if s["last_ts"] and s["last_ts"] != s["first_ts"]:
            date_range += " → " + fmt_ts(s["last_ts"])
        lines.append(f'<div class="session" id="session-{i}">')
        lines.append(f'<div class="session-header"><h2>Session {i}</h2>'
                      f'<span class="session-meta">{date_range} &nbsp;|&nbsp; {len(s["messages"])} messages &nbsp;|&nbsp; ID: {s["id"][:8]}…</span></div>')
        lines.append('<div class="messages">')
        for m in s["messages"]:
            role = m["role"]
            av_class = "user-av" if role == "user" else "ai-av"
            av_label = "You" if role == "user" else "AI"
            msg_class = "user" if role == "user" else "assistant"

            lines.append(f'<div class="msg {msg_class}">')
            lines.append(f'<div class="avatar {av_class}">{av_label}</div>')
            lines.append('<div class="bubble">')
            if m["text"]:
                lines.append(render_text(m["text"]))
            if m.get("tools"):
                lines.append('<div class="tool-calls">')
                for t in m["tools"]:
                    summary_esc = html.escape(t["summary"])
                    lines.append(f'<span class="tool-pill">⚙ {t["name"]} <code>{summary_esc}</code></span>')
                lines.append("</div>")
            if m["ts"]:
                lines.append(f'<div class="ts">{fmt_ts(m["ts"])}</div>')
            lines.append("</div></div>")  # bubble, msg
        lines.append("</div></div>")  # messages, session

    lines.append("</div></body></html>")
    return "\n".join(lines)

html_output = build_html(sessions)
OUTPUT_HTML.write_text(html_output, encoding="utf-8")
print(f"HTML written -> {OUTPUT_HTML}  ({len(html_output)//1024} KB)")

# ── Build TRANSCRIPT-HIGHLIGHTS.md ───────────────────────────────────────────
def build_md(sessions: list[dict]) -> str:
    lines = ["# Week 8 — Spoonful App — Claude Code Transcript Highlights", "",
             f"> Exported {datetime.now().strftime('%Y-%m-%d')} &nbsp;|&nbsp; Project: **Dig4503C Low-and-No-Code**",
             ""]

    for i, s in enumerate(sessions, 1):
        date = fmt_ts(s["first_ts"])[:10] if s["first_ts"] else "unknown"
        user_msgs  = [m for m in s["messages"] if m["role"] == "user" and m["text"]]
        ai_msgs    = [m for m in s["messages"] if m["role"] == "assistant"]
        tool_names = []
        for m in ai_msgs:
            tool_names += [t["name"] for t in m.get("tools", [])]
        tool_summary = ", ".join(sorted(set(tool_names))) if tool_names else "none"

        lines += [f"## Session {i} — {date}", ""]
        lines += [f"**First prompt:** {s['first_prompt']}", ""]
        lines += [f"- Messages: {len(s['messages'])} ({len(user_msgs)} from you, {len(ai_msgs)} from AI)"]
        lines += [f"- Tools used: {tool_summary}"]

        # list up to 5 user prompts as bullet points
        lines += ["- Key exchanges:"]
        for m in user_msgs[:5]:
            snippet = m["text"].strip().replace("\n", " ")[:100]
            lines.append(f'  - "{snippet}{"…" if len(m["text"]) > 100 else ""}"')
        lines.append("")

    return "\n".join(lines)

md_output = build_md(sessions)
OUTPUT_MD.write_text(md_output, encoding="utf-8")
print(f"Markdown written -> {OUTPUT_MD}  ({len(md_output)//1024} KB)")
