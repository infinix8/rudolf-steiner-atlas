#!/usr/bin/env python3
"""Ensure contextual comparisons use real Steiner source links without asserting invented dates."""
from pathlib import Path
from datetime import date
from urllib.parse import urlparse
import json
root=Path(__file__).resolve().parents[1]
data=json.loads((root/"research/concept-trajectories-v1.json").read_text(encoding="utf-8"))
graph=json.loads((root/"research/knowledge-graph-v1.json").read_text(encoding="utf-8"))
tax=json.loads((root/"taxonomy/taxonomy-v1.json").read_text(encoding="utf-8"))
sources={s["id"]:s for s in graph["sources"]}
nodes=set()
def scan(n):
    nodes.add(n["id"])
    for c in n.get("children",[]):scan(c)
for r in tax["tree"]:scan(r)
ids=set()
for t in data.get("trajectories",[]):
    assert t["id"] not in ids,t["id"]
    ids.add(t["id"])
    assert len(t["entries"])>=2 and t["conclusion"] and t["open_question"],t["id"]
    assert t["comparison_type"] in {
        "different_contexts_not_equivalent","conceptual_contexts_no_dated_doctrinal_shift",
        "adjacent_chapters_distinct_functions","dated_lecture_sequence_within_one_course",
        "distinct_genres_with_dated_later_lectures"}, t["id"]
    assert all(x in nodes for x in t["topic_ids"]),t["id"]
    seen_sources=set()
    dates=[]
    for e in t["entries"]:
        assert e["source_id"] in sources,(t["id"],e["source_id"])
        assert e["source_id"] not in seen_sources,(t["id"],"duplicate source context")
        seen_sources.add(e["source_id"])
        assert len(e["claim"])>=60 and e["locator"] and e["interpretation"],t["id"]
        s=sources[e["source_id"]]
        assert s["review"]["status"]=="selected_passages_checked",t["id"]
        assert s["review"]["entire_work_reviewed"] is False,t["id"]
        if s["lecture_date"]:
            date.fromisoformat(s["lecture_date"])
            dates.append(s["lecture_date"])
        else:
            assert s["kind"] in ("authored_book","authored_essay"),t["id"]
    if t["comparison_type"]=="dated_lecture_sequence_within_one_course":
        assert len(dates)==len(t["entries"]),t["id"]
        assert dates==sorted(dates),t["id"]
assert (root/"atlas/trajectories.html").is_file()
assert (root/"atlas/trajectories.js").is_file()
print(f"PASS: {len(ids)} concept trajectories and {sum(len(x['entries']) for x in data['trajectories'])} original source contexts")
