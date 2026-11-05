#!/usr/bin/env python3
"""Validate the preserved phase 27 Atlas manifest, GA110 v27 progression and provenance.

Structural checks only; this does not certify Steiner's metaphysical claims,
modern medicine, exhaustive translation comparison or independent scholarship.
"""
from pathlib import Path
from collections import Counter
import json
import re

ROOT=Path(__file__).resolve().parents[1]
def load(path):
    return json.loads((ROOT/path).read_text(encoding="utf-8"))

manifest=load("research/organ-current-v27.json")
assert manifest["research_phase"]==27
paths=manifest["files"]
for key,value in paths.items():
    assert re.fullmatch(r"\.\./research/[a-z0-9-]+\.json",value), (key,value)
    assert (ROOT/value.removeprefix("../")).is_file(),(key,value)

ledger26=load("research/organ-corpus-ledger-ga110-v26.json")
ledger=load(paths["ga110_corpus"].removeprefix("../"))
assert (ledger26["complete_English_source_views"],ledger26["unread"],ledger26["numbered_units_reviewed"])==(4,8,76)
assert (ledger["complete_English_source_views"],ledger["unread"],ledger["numbered_units_reviewed"])==(8,4,162)
assert ledger["catalogued_entries"]==len(ledger["entries"])==12
before={r["id"]:r for r in ledger26["entries"]}
after={r["id"]:r for r in ledger["entries"]}
assert set(before)==set(after)
for rid in before:
    if rid not in {"GA110-05","GA110-06","GA110-07","GA110-08"}:
        assert before[rid]==after[rid],f"Earlier catalogue changed: {rid}"
expected={5:21,6:23,7:25,8:17}
for n,total in expected.items():
    item=after[f"GA110-{n:02d}"]
    assert item["audit_status"]=="all_numbered_english_paragraphs_reviewed"
    assert item["english_paragraphs_reviewed"]==total
    assert not item["complete_bilingual_collation"]
    assert not item["exhaustive_atomic_claims"]
    assert not item["independent_second_review"]

section=load(paths["section_review"].removeprefix("../"))
assert len(section["sections"])==section["total_section_cards"]==sum(expected.values())==86
section_ids=set()
for entry in section["sections"]:
    assert entry["id"] not in section_ids
    section_ids.add(entry["id"])
    assert entry["catalogue_entry_id"] in after
    assert entry["source_url"]==after[entry["catalogue_entry_id"]]["source_url"]
    assert 1<=entry["section"]<=after[entry["catalogue_entry_id"]]["english_paragraphs_reviewed"]
    assert entry["editorial_paraphrase"] and not entry["source_text_reproduced"]

claims=load(paths["candidate_claims"].removeprefix("../"))["records"]
assert len(claims)==manifest["verified_current_counts"]["ga110_v27_selected_candidate_claims"]==47
claim_index={}
for c in claims:
    assert c["id"] not in claim_index
    claim_index[c["id"]]=c
    assert c["catalogue_entry_id"] in after
    assert c["source_url"]==after[c["catalogue_entry_id"]]["source_url"]
    assert c["reconciliation"]["decision"]=="candidate_unpaired"
    assert not c["reconciliation"]["prior_claim_ids"]
    assert c["german_status"] and c["caveats"]

issues=load(paths["textual_issues"].removeprefix("../"))["issues"]
assert len(issues)>=6
assert any("V13" in i["id"] and "Gewalten" in " ".join(i.get("original_german_terms",[])) for i in issues)
assert all(i["source_url"].startswith("https://rsarchive.org/Lectures/GA110/") for i in issues)

old_dossiers=load("research/organ-comparative-dossiers-v26.json")
dossiers=load(paths["dossiers"].removeprefix("../"))
assert len(dossiers["dossiers"])==dossiers["dossier_count"]==manifest["verified_current_counts"]["organ_dossiers"]==40
old_index={x["id"]:x for x in old_dossiers["dossiers"]}
for d in dossiers["dossiers"]:
    assert d["id"] in old_index
    for key,value in old_index[d["id"]].items():
        assert d[key]==value,f"Dossier history lost: {d['id']} {key}"
    for r in d.get("phase27_refinements",[]):
        assert r["claim_ref_id"] in claim_index
        assert r["source_url"]==claim_index[r["claim_ref_id"]]["source_url"]

medical=load(paths["medical_corpus"].removeprefix("../"))
ga128=load(paths["ga128_corpus"].removeprefix("../"))
assert medical["english_paragraph_coverage_complete"]==61 and medical["unreviewed"]==0
assert ga128["complete_English_source_views"]==8 and ga128["unread"]==0
assert manifest["verified_current_counts"]["ga110_complete"]==ledger["complete_English_source_views"]
assert manifest["verified_current_counts"]["ga110_unread"]==ledger["unread"]

matrix=load(paths["stage_agency"].removeprefix("../"))
rows=matrix["rows"]
assert len(rows)==manifest["verified_current_counts"]["stage_agency_rows"]==23
assert len({x["id"] for x in rows})==23
for x in rows:
    assert x["source_claim_id"] in claim_index
    c=claim_index[x["source_claim_id"]]
    assert x["source_url"]==c["source_url"]
    assert x["source_id"]==c["catalogue_entry_id"]
    assert x["passage_locator"].removeprefix("SOL ")==c["passage_cue"].removeprefix("SOL ")
    assert x["relation_kind"] in matrix["allowed_relation_kinds"]
    assert x["exclusive_organ_builder"] is False
    assert len(x["caution"])>=20
assert "Old Saturn" in {x["stage"] for x in rows}
assert len([x for x in rows if x["relation_kind"]=="anatomical_rudiment"])==1

graph=load("research/knowledge-graph-v1.json")
source_index={s["id"]:s for s in graph["sources"]}
for n in (5,6,7,8):
    sid="SG-GA110-19090414" if n==5 else f"SG-GA110-{n:02d}-V27"
    assert sid in source_index
    assert source_index[sid]["url"]==after[f"GA110-{n:02d}"]["source_url"]
assert graph["organ_concordance_phase27"]["numbered_units"]==162
assert graph["organ_concordance_phase27"]["selected_atomic_records"]==47
assert len(graph["organ_concordance_phase27"]["graph_new_edge_ids"])>=30

for f in ["atlas/organs.html","atlas/organs.js","atlas/agency.html","atlas/agency.js"]:
    assert (ROOT/f).is_file(),f
assert manifest["manuscript_latest_published"].endswith("_v24.md")
assert (ROOT/manifest["manuscript_latest_published"]).is_file()
print("PASS: organ current-manifest, four GA110 source views, 86 section cards, 47 candidate claims, 40 conserved dossiers, 23 agency rows")
