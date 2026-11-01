#!/usr/bin/env python3
"""Structural integrity checks; this does NOT verify original Steiner citations."""
from pathlib import Path
import json
import sys

path = Path(__file__).resolve().parents[1] / "taxonomy" / "taxonomy-v1.json"
data = json.loads(path.read_text(encoding="utf-8"))
errors, nodes, levels = [], {}, {}

def visit(node, depth=0):
    nid = node.get("id")
    if not isinstance(nid, str) or not nid.strip():
        errors.append(f"Missing node ID: {node.get('title')!r}")
    elif nid in nodes:
        errors.append(f"Duplicate ID: {nid}")
    else:
        nodes[nid] = node
    if not isinstance(node.get("title"), str) or not node["title"].strip():
        errors.append(f"Missing node title: {nid}")
    levels[depth] = levels.get(depth, 0) + 1
    for child in node.get("children", []):
        visit(child, depth + 1)

for region in data["tree"]:
    visit(region)

for edge in data.get("crosslinks", []):
    for endpoint in ("from", "to"):
        if edge.get(endpoint) not in nodes:
            errors.append(f"Unresolved crosslink {endpoint}: {edge.get(endpoint)!r}")
    if not edge.get("relationship"):
        errors.append(f"Missing crosslink relationship: {edge!r}")

for target in data.get("anchor_evidence", {}):
    if target not in nodes:
        errors.append(f"Unresolved anchor-evidence target: {target!r}")

print("Source:", path)
print("Nodes:", len(nodes), "by depth:", dict(sorted(levels.items())))
print("Crosslinks:", len(data.get("crosslinks", [])))
print("Anchor evidence topics:", len(data.get("anchor_evidence", {})))
if errors:
    print("\n".join("ERROR: " + error for error in errors), file=sys.stderr)
    sys.exit(1)
print("PASS: structural integrity; primary-source validity not independently checked")
