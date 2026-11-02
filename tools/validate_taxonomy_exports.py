#!/usr/bin/env python3
"""Check taxonomy IDs and labels across JSON, Markdown and OPML exports."""
from pathlib import Path
from xml.etree import ElementTree as ET
import re, json, sys

root = Path(__file__).resolve().parents[1] / "taxonomy"
data = json.loads((root / "taxonomy-v1.json").read_text(encoding="utf-8"))
nodes = {}
def visit(n):
    ident = n["id"]
    if ident.startswith("RS-"):
        if ident in nodes: raise AssertionError("duplicate JSON node " + ident)
        nodes[ident] = n["title"]
    for child in n.get("children", []): visit(child)
for region in data["tree"]: visit(region)

md = (root / "taxonomy-v1.md").read_text(encoding="utf-8")
pattern = re.compile(r"^\s*-\s+(?:\*\*)?(RS-\d{2}(?:\.\d+)+)\s+(.+?)\*{0,2}\s*$", re.MULTILINE)
markdown = {}
for ident, title in pattern.findall(md):
    if ident in markdown: raise AssertionError("duplicate Markdown node " + ident)
    markdown[ident] = title.strip().removesuffix("**")

opml = ET.parse(root / "taxonomy-v1.opml").getroot()
outline = {}
for element in opml.iter("outline"):
    raw = element.get("text", "")
    match = re.match(r"^(RS-\d{2}(?:\.\d+)+)\s+(.+)$", raw)
    if match:
        if match[1] in outline: raise AssertionError("duplicate OPML node " + match[1])
        outline[match[1]] = match[2]

for label, catalog in [("Markdown", markdown), ("OPML", outline)]:
    missing = set(nodes) - set(catalog)
    excess = set(catalog) - set(nodes)
    unequal = [(k, nodes[k], catalog[k]) for k in nodes.keys() & catalog.keys() if nodes[k] != catalog[k]]
    if missing or excess or unequal:
        raise AssertionError(f"{label} differs: missing={sorted(missing)[:5]}, extra={sorted(excess)[:5]}, labels={unequal[:5]}")
print(f"PASS: {len(nodes)} taxonomy entries agree across JSON, Markdown and OPML")
