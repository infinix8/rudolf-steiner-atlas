#!/usr/bin/env python3
"""Validate original editorial study dossiers; only source links, no source text copied."""
from pathlib import Path
import json
import re

root=Path(__file__).resolve().parents[1]
dossiers=json.loads((root/"research/concept-dossiers-v1.json").read_text(encoding="utf-8"))
graph=json.loads((root/"research/knowledge-graph-v1.json").read_text(encoding="utf-8"))
taxonomy=json.loads((root/"taxonomy/taxonomy-v1.json").read_text(encoding="utf-8"))
nodes={}
def walk(n):
    nodes[n["id"]]=n
    for c in n.get("children", []):walk(c)
for region in taxonomy["tree"]:walk(region)
sources={s["id"]:s for s in graph["sources"]}
edges={e["id"]:e for e in graph["edges"]}
assert len(edges)==len(graph["edges"]), "duplicate graph relationship ID"
assert len(sources)==len(graph["sources"]), "duplicate source ID"
seen=set()
section_count=0
for d in dossiers["dossiers"]:
    name=d["id"]
    assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*",name), name
    assert name not in seen, f"duplicate dossier ID {name}"
    seen.add(name)
    assert len(d.get("description",""))>=50, name
    assert len(d.get("sections",[]))>=3, name
    assert d.get("research_questions") and d.get("cautions"), name
    for node_id in d.get("topic_ids",[]):
        assert node_id in nodes,(name,node_id)
    assert d.get("connections"), f"{name} needs at least one checked conceptual relation"
    for edge in d["connections"]:
        assert edge["edge_id"] in edges,(name,edge)
        assert edge.get("note"),(name,edge)
    for section in d["sections"]:
        section_count+=1
        assert len(section.get("body",""))>=100,(name,section.get("heading"))
        assert section.get("evidence"),(name,section.get("heading"))
        for proof in section["evidence"]:
            sid=proof["source_id"]
            assert sid in sources,(name,sid)
            assert sources[sid]["review"]["status"]=="selected_passages_checked",(name,sid)
            assert len(proof.get("locator",""))>=3,(name,sid)
for page in ["atlas/dossiers.html","atlas/dossiers.js"]:
    assert (root/page).is_file(),page
print(f"PASS: {len(seen)} editorial dossiers, {section_count} section-level source annotations")
