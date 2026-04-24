"""
ThinkBox HTML Export — converts Markdown reports to styled, client-ready HTML.
Opens in any web browser. Print to PDF with Ctrl+P → Save as PDF.
No external libraries required.
"""

import re

CSS = """
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px; line-height: 1.7;
  color: #222; background: #eef0f5;
}
.page {
  max-width: 820px; margin: 30px auto;
  background: #fff; padding: 52px 60px;
  border-radius: 4px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
}
.brand-bar {
  background: #1a2744; color: #c9a227;
  font-size: 11px; font-weight: bold;
  letter-spacing: 1.5px; text-transform: uppercase;
  padding: 10px 20px; margin: -52px -60px 36px;
  border-radius: 4px 4px 0 0;
}
h1 { font-size: 26px; color: #1a2744; margin: 24px 0 8px; border-bottom: 3px solid #1a2744; padding-bottom: 10px; }
h2 { font-size: 17px; color: #1a2744; margin: 32px 0 10px; border-bottom: 1px solid #dde2f0; padding-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
h3 { font-size: 14px; color: #1a2744; margin: 20px 0 8px; }
p  { margin: 10px 0; }
strong { color: #1a2744; }
ul, ol { padding-left: 22px; margin: 10px 0; }
li { margin-bottom: 6px; }
hr { border: none; border-top: 1px solid #dde2f0; margin: 28px 0; }
blockquote {
  border-left: 4px solid #c9a227; padding: 12px 20px;
  margin: 16px 0; background: #fdfbf3;
  font-style: italic; color: #444;
}
pre {
  background: #f4f6fb; border: 1px solid #dde2f0;
  border-radius: 4px; padding: 16px 20px;
  font-family: Consolas, monospace; font-size: 13px;
  margin: 12px 0; white-space: pre-wrap; word-break: break-word;
}
code { font-family: Consolas, monospace; background: #f4f6fb; padding: 1px 5px; border-radius: 3px; font-size: 12px; }
table { width: 100%; border-collapse: collapse; margin: 14px 0; font-size: 13px; }
th { background: #1a2744; color: #fff; padding: 9px 14px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px; }
td { padding: 9px 14px; border-bottom: 1px solid #eee; vertical-align: top; }
tr:last-child td { border-bottom: none; }
tr:nth-child(even) td { background: #f8f9fc; }
.footer {
  margin-top: 48px; padding-top: 16px;
  border-top: 1px solid #dde2f0;
  font-size: 11px; color: #aaa; text-align: center;
}
@media print {
  body { background: #fff; }
  .page { box-shadow: none; margin: 0; padding: 32px 40px; }
  .brand-bar { margin: -32px -40px 32px; }
  h2 { page-break-after: avoid; }
}
"""

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>{css}</style>
</head>
<body>
<div class="page">
  <div class="brand-bar">ThinkBox AI Operation Systems &nbsp;&mdash;&nbsp; MJUEM AI Operations System&trade;</div>
  {body}
  <div class="footer">
    Prepared by ThinkBox AI Operation Systems &nbsp;|&nbsp; MJUEM AI Operations System&trade;<br>
    All client data stored locally &mdash; not shared externally without consent.
  </div>
</div>
</body>
</html>"""


def md_to_html(md: str) -> str:
    """Convert the Markdown subset we generate into HTML."""
    lines   = md.split("\n")
    out     = []
    in_pre  = False
    pre_buf = []
    in_table= False
    table_buf = []
    i = 0

    def flush_table():
        if not table_buf:
            return ""
        rows = table_buf[:]
        html = ["<table>"]
        for ri, row in enumerate(rows):
            cells = [c.strip() for c in row.strip("|").split("|")]
            if ri == 0:
                html.append("<thead><tr>" + "".join(f"<th>{_inline(c)}</th>" for c in cells) + "</tr></thead><tbody>")
            elif ri == 1 and all(re.match(r"[-:]+$", c.strip()) for c in cells):
                continue  # separator row
            else:
                html.append("<tr>" + "".join(f"<td>{_inline(c)}</td>" for c in cells) + "</tr>")
        html.append("</tbody></table>")
        return "\n".join(html)

    while i < len(lines):
        line = lines[i]

        # Code fences
        if line.strip().startswith("```"):
            if in_pre:
                out.append("<pre>" + "\n".join(pre_buf) + "</pre>")
                pre_buf = []
                in_pre  = False
            else:
                if in_table:
                    out.append(flush_table())
                    table_buf = []
                    in_table  = False
                in_pre = True
            i += 1
            continue

        if in_pre:
            pre_buf.append(_esc(line))
            i += 1
            continue

        # Tables
        if line.startswith("|"):
            in_table = True
            table_buf.append(line)
            i += 1
            continue
        elif in_table:
            out.append(flush_table())
            table_buf = []
            in_table  = False

        # Headings
        m = re.match(r"^(#{1,3})\s+(.*)", line)
        if m:
            level = len(m.group(1))
            text  = _inline(m.group(2))
            out.append(f"<h{level}>{text}</h{level}>")
            i += 1
            continue

        # HR
        if re.match(r"^---+$", line.strip()):
            out.append("<hr>")
            i += 1
            continue

        # Blockquote
        if line.startswith("> "):
            out.append(f"<blockquote>{_inline(line[2:])}</blockquote>")
            i += 1
            continue

        # Unordered list
        m = re.match(r"^(\s*)[-*]\s+(.*)", line)
        if m:
            items = []
            while i < len(lines):
                m2 = re.match(r"^(\s*)[-*]\s+(.*)", lines[i])
                if m2:
                    items.append(f"<li>{_inline(m2.group(2))}</li>")
                    i += 1
                else:
                    break
            out.append("<ul>" + "".join(items) + "</ul>")
            continue

        # Ordered list
        m = re.match(r"^\d+\.\s+(.*)", line)
        if m:
            items = []
            while i < len(lines):
                m2 = re.match(r"^\d+\.\s+(.*)", lines[i])
                if m2:
                    items.append(f"<li>{_inline(m2.group(1))}</li>")
                    i += 1
                else:
                    break
            out.append("<ol>" + "".join(items) + "</ol>")
            continue

        # Blank line
        if not line.strip():
            out.append("")
            i += 1
            continue

        # Paragraph
        out.append(f"<p>{_inline(line)}</p>")
        i += 1

    if in_table:
        out.append(flush_table())
    if in_pre:
        out.append("<pre>" + "\n".join(pre_buf) + "</pre>")

    return "\n".join(out)


def _esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _inline(text: str) -> str:
    text = _esc(text)
    # Bold+italic
    text = re.sub(r"\*\*\*(.*?)\*\*\*", r"<strong><em>\1</em></strong>", text)
    # Bold
    text = re.sub(r"\*\*(.*?)\*\*", r"<strong>\1</strong>", text)
    # Italic
    text = re.sub(r"\*(.*?)\*", r"<em>\1</em>", text)
    # Inline code
    text = re.sub(r"`(.*?)`", r"<code>\1</code>", text)
    # Em dash
    text = text.replace("—", "&mdash;")
    return text


def save_html(md_path, md_text: str) -> "Path":
    """Save a .html file next to the .md file. Returns the HTML path."""
    from pathlib import Path
    md_path  = Path(md_path)
    html_path = md_path.with_suffix(".html")

    # Derive title from first H1 or filename
    m = re.search(r"^#\s+(.+)", md_text, re.MULTILINE)
    title = m.group(1) if m else md_path.stem

    body = md_to_html(md_text)
    html = TEMPLATE.format(title=_esc(title), css=CSS, body=body)
    html_path.write_text(html, encoding="utf-8")
    return html_path
