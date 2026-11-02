#!/usr/bin/env python3
"""Validate the editorial Steiner knowledge graph against canonical taxonomy.

Does not scrape external sites or verify that a passage proves a particular claim.
Those judgments require human source review and are recorded independently.
"""
from pathlib import Path
from urllib.parse import urlparse
from collections import Counter
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / "research/knowledge-graph-v1.json").read_text(encoding="utf-8"))
taxonomy = json.loads((ROOT / "taxonomy/taxonomy-v1.json").read_text(encoding="utf-8"))
errors = []
nodes = {}
def walk(node):
    nid = node["id"]
    if nid in nodes:
        errors.append("duplicate taxonomy ID: " + nid)
    nodes[nid] = node
    for child in node.get("children", []):
        walk(child)
for region in taxonomy["tree"]:
    walk(region)

sources = {}
for src in data.get("sources", []):
    sid = src.get("id")
    if not sid or sid in sources:
        errors.append("missing or repeated source ID: " + str(sid))
    sources[sid] = src
    u = urlparse(src.get("url", ""))
    if u.scheme != "https" or u.hostname not in ("rsarchive.org", "www.rsarchive.org"):
        errors.append("unapproved archive URL for " + str(sid))
    if src.get("kind") not in ("authored_book", "recorded_lecture", "authored_essay"):
        errors.append("missing / invalid original-source kind: " + str(sid))
    if src.get("kind") == "recorded_lecture" and not src.get("lecture_date"):
        errors.append("undated lecture: " + str(sid))
    if not src.get("edition") or not src.get("unit") or not src.get("ga"):
        errors.append("incomplete bibliographic fields: " + str(sid))
    review = src.get("review", {})
    if review.get("status") != "selected_passages_checked":
        errors.append("ambiguous source review status: " + str(sid))
    if review.get("entire_work_reviewed") is not False:
        errors.append("must not suggest entire work was checked: " + str(sid))
    if not review.get("scope"):
        errors.append("missing passage audit scope: " + str(sid))

ids = set()
allowed_statuses = {"selected_passage_checked", "editorial_comparison_with_checked_passages"}
allowed_basis = {"direct", "editorial_comparison"}
allowed_types = {
    "distinguished_from", "attributed_nature_explanation", "described_transition",
    "forms_unity_with", "condensed_as", "transforms", "begins_development_of",
    "acts_during", "contributes_to", "precedes_in_account", "describes_phase_of",
    "combines_with", "further_modified_by", "symbolically_corresponds_to",
    "special_case_of", "associated_with", "used_in_pedagogical_account",
    "interacts_with", "is_preparatory_practice_within", "enables_development_toward",
    "prepared_as", "provides_seasonal_context_for", "frames_as_living_whole",
    "frames_problem_of", "must_distinguish"
}
source_refs = Counter()
cross_domains = 0
for edge in data.get("edges", []):
    eid = edge.get("id")
    if not eid or eid in ids:
        errors.append("duplicate / blank graph relation ID: " + str(eid))
    ids.add(eid)
    for field in ("from", "to"):
        if edge.get(field) not in nodes:
            errors.append(str(eid) + ": invalid " + field + " " + str(edge.get(field)))
    if edge.get("from") == edge.get("to"):
        errors.append(str(eid) + ": reflexive relation requires explicit modeling")
    if edge.get("type") not in allowed_types:
        errors.append(str(eid) + ": missing / unknown relation type " + str(edge.get("type")))
    if edge.get("status") not in allowed_statuses:
        errors.append(str(eid) + ": ambiguous evidence status")
    if edge.get("evidence_basis") not in allowed_basis:
        errors.append(str(eid) + ": invalid relation evidence basis")
    if edge.get("evidence_basis") == "editorial_comparison":
        if edge.get("status") != "editorial_comparison_with_checked_passages":
            errors.append(str(eid) + ": editorial comparison mislabelled")
        if len(edge.get("evidence", [])) < 2:
            errors.append(str(eid) + ": editorial comparison needs multiple source contexts")
    if edge.get("evidence_basis") == "direct" and edge.get("status") != "selected_passage_checked":
        errors.append(str(eid) + ": direct paraphrase mislabelled")
    if not edge.get("claim") or len(edge["claim"]) > 250:
        errors.append(str(eid) + ": claim missing or excessively long")
    evs = edge.get("evidence", [])
    if not evs:
        errors.append(str(eid) + ": relation with no supporting passage")
    for ev in evs:
        if ev.get("source_id") not in sources:
            errors.append(str(eid) + ": missing source " + str(ev.get("source_id")))
        else:
            source_refs[ev["source_id"]] += 1
        if not ev.get("passage_locator"):
            errors.append(str(eid) + ": missing precise passage locator")
    a = edge.get("from", "").split("-")[1].split(".")[0] if "-" in edge.get("from", "") else ""
    b = edge.get("to", "").split("-")[1].split(".")[0] if "-" in edge.get("to", "") else ""
    if a and b and a != b: cross_domains += 1

for src in sources:
    if not source_refs[src]:
        errors.append("unused source: " + src)

required = ["atlas/graph.html", "atlas/graph.js", "atlas/graph.css", "atlas/index.html", "atlas/app.js"]
for file in required:
    if not (ROOT / file).is_file():
        errors.append("missing interface file: " + file)

print(f"{len(nodes)} canonical taxonomy nodes, {len(ids)} graph edges, {len(sources)} primary-source pages, {cross_domains} cross-domain edges")
if errors:
    for error in errors: print("ERROR: " + error, file=sys.stderr)
    sys.exit(1)
print("PASS: references, relationships, provenance and local UI files structurally consistent")
