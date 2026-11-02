#!/usr/bin/env python3
"""Generate an original quantitative coverage report from local atlas data only."""
from pathlib import Path
from collections import Counter
from datetime import date
import json
import sys

root = Path(__file__).resolve().parents[1]
tax = json.loads((root / "taxonomy/taxonomy-v1.json").read_text(encoding="utf-8"))
graph = json.loads((root / "research/knowledge-graph-v1.json").read_text(encoding="utf-8"))
legacy = json.loads((root / "research/legacy-crosslink-audit.json").read_text(encoding="utf-8"))
sources = {s["id"]: s for s in graph["sources"]}
edges = graph["edges"]
domains = [d for r in tax["tree"] for d in r["children"]]
counts = Counter()
source_counts = Counter()
for e in edges:
    a = e["from"].split("-")[1].split(".")[0]
    b = e["to"].split("-")[1].split(".")[0]
    counts[a] += 1
    if b != a: counts[b] += 1
    for ev in e["evidence"]: source_counts[ev["source_id"]] += 1
cross = sum(e["from"].split("-")[1].split(".")[0] !=
            e["to"].split("-")[1].split(".")[0] for e in edges)
lines = [
    "# Knowledge graph coverage report", "",
    "Generated from local, original Atlas records; no external documents accessed.", "",
    f"- **{len(edges)} passage-qualified relationships**; **{len(graph['sources'])} original source pages**.",
    f"- **{cross} direct cross-domain graph connections**.",
    f"- **{legacy['counts']['exact']} of 30 initial crosslinks** directly matched; "
    f"**{legacy['counts']['not_evidenced']} still have no matching exact-endpoint source evidence.",
    "- Source verification means **selected passages were checked**, not that full books were reviewed.",
    "",
    "## Related nodes by domain", "",
    "| Domain | Title | Incident graph edges |", "|---|---|---:|",
]
for d in domains:
    lines.append(f"| {d['id']} | {d['title']} | {counts[d['id']]} |")
lines += ["", "## Source-page contributions", "",
          "| Source | Original work | Graph evidence references |",
          "|---|---|---:|"]
for s in graph["sources"]:
    lines.append(f"| [{s['id']}]({s['url']}) | GA {s['ga']} — {s['work']} | {source_counts[s['id']]} |")
lines += ["", "## Audit boundaries", "",
          "All external texts remain on RS Archive. Graph claims are concise original editor paraphrases. "
          "This numerical report does not certify truth, source completeness, translation fidelity, "
          "or independent evidence for spiritual, historical, medical or agricultural assertions.",
          ""]
result = "\n".join(lines)
if len(sys.argv)>1 and sys.argv[1]=="--check":
    expected = (root / "docs/KNOWLEDGE_GRAPH_COVERAGE.md").read_text(encoding="utf-8")
    if expected.rstrip() != result.rstrip():
        raise SystemExit("Knowledge graph coverage report is stale. Run the report generator.")
    print("PASS: graph coverage report matches repository data")
elif len(sys.argv)>1 and sys.argv[1]=="--write":
    (root / "docs/KNOWLEDGE_GRAPH_COVERAGE.md").write_text(result,encoding="utf-8")
    print("Wrote coverage report.")
else:
    print(result)
