#!/usr/bin/env python3
"""Offline integrity validation for the *atlas's own data*. Never crawls the external sites."""
from pathlib import Path
from urllib.parse import urlparse
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
errors = []
def load(path):
    try:
        return json.loads((ROOT / path).read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        errors.append(f"{path}: {error}")
        return {}

taxonomy = load("taxonomy/taxonomy-v1.json")
paths = load("atlas/study-paths.json")
crosswalk = load("research/archive-topic-crosswalk.json")
anchors = load("research/primary-source-anchors.json")
models = load("research/concept-models.json")
vocabulary = load("research/search-vocabulary.json")
nodes, parents = {}, {}
def visit(node, parent=None):
    nid = node.get("id")
    if not nid or nid in nodes:
        errors.append(f"Invalid or duplicate node ID: {nid}")
        return
    nodes[nid] = node
    parents[nid] = parent
    if not node.get("title"):
        errors.append(f"Missing title: {nid}")
    for child in node.get("children", []):
        visit(child, nid)
for root in taxonomy.get("tree", []):
    visit(root)
domains = {k for k in nodes if len(k) == 2 and k.isdigit()}
assertlen = lambda name, actual, expected: errors.append(f"{name}: expected {expected}, found {actual}") if actual != expected else None
assertlen("domains", len(domains), 26)
assertlen("regions", len(taxonomy.get("tree", [])), 6)
def safe_url(url):
    try:
        u = urlparse(url)
        return u.scheme == "https" and u.hostname in ("rsarchive.org", "www.rsarchive.org", "rudolf-steiner.com", "www.rudolf-steiner.com")
    except (TypeError, ValueError):
        return False

path_ids = set()
for route in paths.get("paths", []):
    rid = route.get("id")
    if not rid or rid in path_ids:
        errors.append(f"Duplicate / blank study path: {rid}")
    path_ids.add(rid)
    if len(route.get("nodes", [])) < 2:
        errors.append(f"Study path too short: {rid}")
    for nid in route.get("nodes", []):
        if nid not in nodes: errors.append(f"Invalid path node: {rid} -> {nid}")

topic_names, topic_urls = set(), set()
for topic in crosswalk.get("topics", []):
    name, url = topic.get("title"), topic.get("url")
    if not name or name in topic_names: errors.append(f"Duplicate / blank source topic: {name}")
    if url in topic_urls: errors.append(f"Repeated source topic URL: {url}")
    topic_names.add(name); topic_urls.add(url)
    if not safe_url(url): errors.append(f"Unsafe source topic URL: {url}")
    for domain in topic.get("atlas_domains", []):
        if domain not in domains: errors.append(f"Unknown crosswalk domain: {domain}")

record_ids, record_pair = set(), set()
for source in anchors.get("records", []):
    sid, nid, url = source.get("id"), source.get("topic_id"), source.get("url")
    if not sid or sid in record_ids: errors.append(f"Duplicate / missing anchor ID: {sid}")
    record_ids.add(sid)
    if nid not in nodes: errors.append(f"Unknown source target: {sid} -> {nid}")
    if not safe_url(url): errors.append(f"Unsafe source URL: {sid} -> {url}")
    if (sid, nid) in record_pair: errors.append(f"Duplicate source-topic association: {sid} -> {nid}")
    record_pair.add((sid,nid))
    if source.get("source_type") not in ("authored book","authored essay","recorded lecture"):
        errors.append(f"Unclear source type: {sid}")
    v = source.get("verification", {})
    if v.get("passage_reviewed") and not v.get("url_opened"):
        errors.append(f"Impossible review status: {sid}")
    if source.get("source_type") == "recorded lecture" and not source.get("lecture_date"):
        errors.append(f"Lecture without date: {sid}")

for term in vocabulary.get("terms", []):
    if term.get("target_id") not in nodes: errors.append(f"Unknown search target: {term}")
    if not term.get("term", "").strip(): errors.append(f"Blank search vocabulary term: {term}")
    if term.get("relation") not in ("lexical variant", "related search"):
        errors.append(f"Unexpected vocabulary relationship: {term}")

model_ids = set()
anchor_ids = {r.get("id") for r in anchors.get("records", [])}
for model in models.get("models", []):
    mid = model.get("id")
    if not mid or mid in model_ids: errors.append(f"Duplicate / blank model ID: {mid}")
    model_ids.add(mid)
    for nid in model.get("topic_ids", []):
        if nid not in nodes: errors.append(f"Unknown conceptual model node: {mid} -> {nid}")
    if model.get("source") not in anchor_ids: errors.append(f"Unknown model source anchor: {mid}")
    if not safe_url(model.get("source_url")): errors.append(f"Unsafe model source URL: {mid}")
    for section in model.get("sections", []):
        cols = len(section.get("columns", []))
        if not cols: errors.append(f"Missing comparison columns: {mid}")
        for row in section.get("rows", []):
            if len(row) != cols: errors.append(f"Unequal comparison row: {mid}")

for edge in taxonomy.get("crosslinks", []):
    if edge.get("from") not in nodes or edge.get("to") not in nodes:
        errors.append(f"Unresolved graph link: {edge}")

files = ["atlas/index.html", "atlas/app.js", "atlas/style.css"]
for file in files:
    if not (ROOT / file).is_file():
        errors.append(f"Missing application file: {file}")
if not errors:
    print("PASS: no internal integrity problems detected")
else:
    print("FAIL: " + str(len(errors)) + " problems detected", file=sys.stderr)
    for error in errors: print(" - " + error, file=sys.stderr)
print(f"{len(nodes)} nodes | {len(domains)} domains | {len(paths.get('paths', []))} study paths | " +
      f"{len(crosswalk.get('topics', []))} archive categories | {len(anchors.get('records', []))} source anchors")
sys.exit(1 if errors else 0)
