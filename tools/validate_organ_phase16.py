#!/usr/bin/env python3
"""Verify phase-16 selected organ reading without inflating GA corpus completeness.

Checks local metadata only, not the truth of Steiner's medical claims.
"""
from pathlib import Path
from collections import Counter
from urllib.parse import urlparse
import json

root=Path(__file__).resolve().parents[1]
def load(name):
    return json.loads((root/name).read_text(encoding="utf-8"))
old=load("research/organ-corpus-ledger-ga313-317-v15.json")
new=load("research/organ-corpus-ledger-ga313-317-v16.json")
r=load("research/organ-selected-reading-ga317-viii-v16.json")
claims=load("research/organ-atomic-claims-ga317-viii-v16.json")
d15=load("research/organ-comparative-dossiers-v15.json")
d16=load("research/organ-comparative-dossiers-v16.json")
graph=load("research/knowledge-graph-v1.json")
assert old["numbered_english_paragraphs_checked"]==new["numbered_english_paragraphs_checked"]==546
assert old["english_paragraph_coverage_complete"]==new["english_paragraph_coverage_complete"]==22
assert old["fully_audited"]==new["fully_audited"]==0
assert new["unreviewed"]==old["unreviewed"]-1
assert new["selective_passage_reviews"]==old["selective_passage_reviews"]+1
assert len(new["entries"])==len(old["entries"])==61
old_map={e["id"]:e for e in old["entries"]}
new_map={e["id"]:e for e in new["entries"]}
assert old_map.keys()==new_map.keys()
for eid in old_map:
    if eid!="GA317-08":
        assert old_map[eid]==new_map[eid],f"Unexpected earlier catalogue mutation: {eid}"
prior=old_map["GA317-08"];current=new_map["GA317-08"]
assert prior["audit_status"]=="unreviewed"
assert current["audit_status"]=="selected_english_passages_checked_not_whole_lecture"
assert current["english_paragraphs_reviewed"]==0
assert not current["full_lecture_audited"] and not current["extraction_complete"]
assert not current["german_checked"] and not current["source_url"].endswith("/English/SOL/19240703.html")
src=r["source"]["source_url"]
assert current["source_url"]==src==claims["records"][0]["source_url"]
parsed=urlparse(src)
assert parsed.scheme=="https" and parsed.hostname=="rsarchive.org"
assert "/GA317/English/RSP1972/19240703p01.html" in src
assert len(r["records"])==14
assert len(r["textual_issues"])==2
assert len({x["id"] for x in r["records"]})==len(r["records"])
assert len(claims["records"])==10
assert claims["counted_in_english_numbered_section_totals"] is False
lookup={(x["source_url"],x["paragraph"]):x for x in r["records"]}
ids=set()
for claim in claims["records"]:
    assert claim["id"] not in ids
    ids.add(claim["id"])
    row=lookup.get((claim["source_url"],claim["section"]))
    assert row is not None,claim["id"]
    assert claim["catalogue_entry_id"]==row["catalogue_entry_id"]=="GA317-08"
    assert claim["evidence_state"]=="selected_English_passage_review_only"
    assert claim["reconciliation"]["prior_claim_ids"]==[]
    assert claim["reconciliation"]["decision"]=="candidate_unpaired"
    assert claim["caveats"]
for issue in r["textual_issues"]:
    assert issue["status"].startswith("confirmed_difference_in_online_display")
    assert "collation pending" in issue["status"]
assert any("five and three-quarter" in x["english_1972_rendering"] for x in r["textual_issues"])
assert any("five and one-quarter" in x["german_record"] for x in r["textual_issues"])
d15map={d["id"]:d for d in d15["dossiers"]}
d16map={d["id"]:d for d in d16["dossiers"]}
assert len(d16map)==d16["dossier_count"]==26
assert len(d15map)==25
for did,d in d15map.items():
    assert did in d16map
    for key,value in d.items():
        assert d16map[did][key]==value, f"Earlier dossier field lost: {did} {key}"
assert "organ-bladder" in d16map
for d in d16["dossiers"]:
    for row in d.get("phase16_refinements",[]):
        assert row["claim_ref_id"] in ids
        assert row["source_url"]==src
assert any(s["url"]==src and s["ga"]=="317" for s in graph["sources"])
assert (root/"atlas/organs.js").is_file()
assert (root/"atlas/organs.html").is_file()
print(json.dumps({"phase":16,"source":"GA317 VIII, RSP1972 selected only",
 "selected_passage_cards":len(r["records"]),"selected_claims":len(ids),
 "translation_discrepancies":len(r["textual_issues"]),"organ_dossiers":len(d16map),
 "remaining_unread_catalogue":new["unreviewed"],"numbered_english_sections_unchanged":546,
 "checks":"passed"},ensure_ascii=False))
