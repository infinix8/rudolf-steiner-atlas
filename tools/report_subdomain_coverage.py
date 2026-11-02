#!/usr/bin/env python3
"""Subdomain evidence coverage from the Atlas's own source-linked graph only.

'Direct' refers to a graph relationship endpoint exactly on a subdomain node.
'Descendant' refers to a relationship on a nested concept, NOT proof of the whole
subdomain. This measures OUR research coverage, never completeness of Steiner's works.
"""
from pathlib import Path
from collections import defaultdict
import json
import sys

root = Path(__file__).resolve().parents[1]
taxonomy = json.loads((root / "taxonomy/taxonomy-v1.json").read_text(encoding="utf-8"))
graph = json.loads((root / "research/knowledge-graph-v1.json").read_text(encoding="utf-8"))
subdomains = []
edges = graph["edges"]

def descendants(node):
    result = {node["id"]}
    for child in node.get("children", []):
        result.update(descendants(child))
    return result

for region in taxonomy["tree"]:
    for domain in region["children"]:
        for sub in domain["children"]:
            desc = descendants(sub)
            matched = [edge for edge in edges if edge["from"] in desc or edge["to"] in desc]
            direct = [edge for edge in matched if sub["id"] in (edge["from"], edge["to"])]
            sources = {ev["source_id"] for edge in matched for ev in edge["evidence"]}
            status = "direct" if direct else "descendant" if matched else "none"
            subdomains.append((domain, sub, status, len(matched), len(sources)))

by_domain = defaultdict(list)
for entry in subdomains:
    by_domain[entry[0]["id"]].append(entry)

count = lambda items, status: sum(1 for entry in items if entry[2] == status)
direct, child, empty = [count(subdomains, status) for status in ("direct", "descendant", "none")]
lines = [
    "# Source-linked subdomain coverage",
    "",
    "Generated only from the repository's own taxonomy IDs and source-linked graph.",
    "",
    f"**{len(subdomains)} subdomains:** {direct} with an edge directly on the subdomain, "
    f"{child} with an edge only on a nested child, {empty} with no graph-attached edge.",
    "",
    "**This is an editorial workflow metric, not a measurement of Steiner's corpus coverage.** "
    "A source-linked edge records selected passages, not a fully audited concept or lecture. "
    "An empty status does not mean the original works omit the subject.",
    "",
    "## By knowledge domain",
    "",
    "| Domain | Direct | Child only | None | Total |",
    "|---|---:|---:|---:|---:|"
]
for domain_id, entries in by_domain.items():
    lines.append(f"| {domain_id} | {count(entries, 'direct')} | {count(entries, 'descendant')} "
                 f"| {count(entries, 'none')} | {len(entries)} |")
lines += ["", "## Subdomain evidence inventory", "",
          "| Canonical subdomain | Evidence level | Linked relationships | Distinct source pages |",
          "|---|---|---:|---:|"]
for domain, sub, status, edges_count, source_count in subdomains:
    target = "../atlas/index.html#node=" + sub["id"]
    lines.append(f"| [{sub['id']} {sub['title']}]({target}) | {status} | {edges_count} | {source_count} |")
lines += [
    "",
    "## Definitions and research use",
    "",
    "- **Direct:** at least one existing source-checked graph edge has this exact subdomain ID as an endpoint.",
    "- **Descendant:** there is a graph edge on a child concept; it does not establish the entire subdomain.",
    "- **None:** no source-checked graph edge on the subdomain or any descendant, even if the taxonomy contains a GA-volume research lead.",
    "- Counts reflect relationship incidence and unique source IDs, not verified passages for every concept.",
    "- Prioritize 'none' entries for original source research; replace generic links with exact chapter, lecture and passage cues.",
    "",
    "Source texts are not stored in this project. Open the source archives through the linked graph records.",
    ""
]
content = "\n".join(lines)
out = root / "docs/SUBDOMAIN_EVIDENCE_COVERAGE.md"
if len(sys.argv) > 1 and sys.argv[1] == "--write":
    out.write_text(content, encoding="utf-8")
    print("Wrote", out)
elif len(sys.argv) > 1 and sys.argv[1] == "--check":
    if out.read_text(encoding="utf-8").rstrip() != content.rstrip():
        raise SystemExit("Stale subdomain coverage report. Run: python tools/report_subdomain_coverage.py --write")
    print(f"PASS: {len(subdomains)} subdomains, {direct} direct, {child} child only, {empty} absent")
else:
    print(content)
