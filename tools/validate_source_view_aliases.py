#!/usr/bin/env python3
"""Validate only documented same-event source-view groups; never infer global uniqueness."""
from pathlib import Path
from datetime import date
import json

root=Path(__file__).resolve().parents[1]
graph=json.loads((root/"research/knowledge-graph-v1.json").read_text(encoding="utf-8"))
aliases=json.loads((root/"research/known-source-view-aliases-v1.json").read_text(encoding="utf-8"))
sources={s["id"]:s for s in graph["sources"]}
assert len(sources)==len(graph["sources"])
assert len(aliases["events"])==aliases["metrics"]["known_duplicate_view_groups"]
seen=set()
for event in aliases["events"]:
    assert event["status"]=="same_event_confirmed"
    date.fromisoformat(event["date"])
    assert len(event["source_ids"])>=2
    assert event["canonical_research_record"]
    for sid in event["source_ids"]:
        assert sid in sources and sid not in seen
        seen.add(sid)
        assert sources[sid]["lecture_date"]==event["date"]
assert len(seen)==aliases["metrics"]["known_source_ids_in_groups"]
assert "intentionally partial" in aliases["policy"]
assert (root/"atlas/sources.js").is_file()
print(f"PASS: {len(aliases['events'])} confirmed multi-page source events, {len(seen)} source views; no independent-event total inferred")
