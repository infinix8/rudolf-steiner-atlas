"""Validate the cumulative chronology snapshot and its passage graph."""
from pathlib import Path
from urllib.parse import urlsplit
import json
import sys

ROOT = Path(__file__).resolve().parents[1]


def load(path):
    return json.loads((ROOT / path).read_text(encoding="utf-8"))


def by_id(rows):
    indexed = {row["id"]: row for row in rows}
    assert len(indexed) == len(rows), "Duplicate IDs"
    return indexed


audit = load(sys.argv[1] if len(sys.argv) > 1 else "research/steiner-earth-culture-audit-v05.json")
index = load(audit["explorer_index"])
baseline = load(audit["baseline"])
events = by_id(index["events"])
sources = by_id(index["sources"])
groups = by_id(index["groups"])
findings = by_id(audit["findings"])
audit_sources = by_id(audit["sources"])
entity_nodes = by_id(audit["entity_nodes"])
relationships = by_id(audit["relationships"])
comparisons = by_id(audit["comparisons"])
assert len(by_id(audit["source_leads"])) == audit["counts"]["source_leads"]

manifest = load(audit["organ_manifest"])
organ_path = Path("research") / manifest["files"]["dossiers"]
organs = by_id(load(organ_path)["dossiers"])
cosmic_path = index["meta"]["cosmic_dossier_file"]
cosmic = {row["node_id"] for row in load(cosmic_path)["conditions"]}
dossiers = {row["node_id"]: row for row in audit["dossiers"]}
assert len(cosmic) == 7 and len(dossiers) == 15
assert set(index["stage_notes"]) == set(dossiers)
for parent in ("cos-earth", "earth-post"):
    children = [d for d in dossiers.values() if d["parent_id"] == parent]
    assert sorted(d["sequence"] for d in children) == list(range(1, 8))
    assert all(d["classification"] == "interval" for d in children)
assert sorted(f for d in dossiers.values() for f in d["finding_ids"]) == sorted(findings)

assert baseline["groups"] == index["groups"]
assert index["sources"][:len(baseline["sources"])] == baseline["sources"]
for original in baseline["events"]:
    updated = events[original["id"]]
    for key in ("id", "parent_id", "title", "section", "time_scale", "chronology_status"):
        assert original[key] == updated[key], (original["id"], key)
    assert set(original["source_ids"]) <= set(updated["source_ids"]), original["id"]
assert len(events) == index["meta"]["entry_count"]
assert len(sources) == index["meta"]["source_count"]
assert len(events) - len(baseline["events"]) == audit["counts"]["new_explorer_entries"]

for row in audit_sources.values():
    url = urlsplit(row["url"])
    assert url.scheme == "https" and url.netloc == "rsarchive.org", row
    assert row["reviewed_scope"] and row["section"], row
urls = {row["id"]: row["url"] for row in sources.values()}
for event in events.values():
    assert event["parent_id"] in groups and event["source_ids"]
    assert set(event["source_ids"]) <= sources.keys(), event["id"]
    assert set(event.get("organ_ids", [])) <= organs.keys(), event["id"]
    for passage in event.get("audited_passages", []):
        finding = findings[passage["finding_id"]]
        assert passage["source_id"] in event["source_ids"]
        assert urls[passage["source_id"]] == audit_sources[finding["source_id"]]["url"]

for finding in findings.values():
    fid = finding["id"]
    event = events[finding["explorer_event_id"]]
    assert fid in dossiers[finding["node_id"]]["finding_ids"], fid
    assert finding["passage_cue"] and finding["source_id"] in audit_sources, fid
    assert any(p["finding_id"] == fid for p in event["audited_passages"]), fid
    assert set(finding.get("german_crosscheck_source_ids", [])) <= audit_sources.keys()
    assert set(finding.get("alternate_translation_source_ids", [])) <= audit_sources.keys()
    for organ in finding["organ_ids"]:
        assert organ in organs and organ in event["organ_ids"], (fid, organ)
        assert relationships[f"CR-{organ}-corresponds_to-{fid}"]["bidirectional"], (fid, organ)

for scheme in audit.get("chronological_schemes", []):
    staged = by_id(scheme["nodes"])
    assert len(staged) == 14
    for parent in ("cos-earth", "earth-life-4"):
        children = [n for n in staged.values() if n["parent_id"] == parent]
        assert sorted(n["sequence"] for n in children) == list(range(1, 8))
    for node in staged.values():
        assert node["parent_id"] in cosmic | staged.keys()
        assert node["evidence"] and set(node["evidence"]) <= findings.keys()
    assert staged[scheme["earth_epoch_parent"]]["label"] == "Physical form"
    assert set(scheme["earth_epoch_ids"]) == {d["node_id"] for d in dossiers.values() if d["level"] == "earth_epoch"}
    assert scheme["current_form_ordinal"] == 3 * 49 + 3 * 7 + 4
    assert set(scheme["evidence"]) <= findings.keys()

if audit.get("consciousness_crosswalk"):
    crosswalk = audit["consciousness_crosswalk"]
    assert len(crosswalk) == len(cosmic)
    assert {row["node_id"] for row in crosswalk} == cosmic
    assert len({row["group_id"] for row in crosswalk}) == len(crosswalk)
    for row in crosswalk:
        assert row["group_id"] in groups and row["label"]
        assert row["evidence"] and set(row["evidence"]) <= findings.keys()

if audit.get("prior_audit"):
    prior = load(audit["prior_audit"])
    for record in prior["findings"]:
        carried = findings[record["id"]]
        assert all(carried[key] == value for key, value in record.items() if key != "german_crosscheck_source_ids")
        assert set(record.get("german_crosscheck_source_ids", [])) <= set(carried.get("german_crosscheck_source_ids", []))
    for relation in prior["relationships"]:
        assert relationships[relation["id"]] == relation

valid_nodes = set(findings) | set(dossiers) | cosmic | set(events) | set(entity_nodes) | set(organs)
for edge in relationships.values():
    assert {edge["source"], edge["target"]} <= valid_nodes, edge["id"]
    assert edge["evidence"] and set(edge["evidence"]) <= findings.keys(), edge["id"]
for issue in comparisons.values():
    assert issue["finding_ids"] and set(issue["finding_ids"]) <= findings.keys(), issue["id"]

assert len(findings) == audit["counts"]["findings"]
assert len(relationships) == audit["counts"]["relations"]
assert len(comparisons) == audit["counts"]["total_comparisons"]
assert sum(row["full_views_audited"] for row in audit["coverage_ledger"]) == audit["counts"]["complete_english_views"]
assert sum(len(e.get("organ_ids", [])) for e in events.values()) > 0
print(f"Validated {len(events)} chronology entries, {len(findings)} findings and {len(relationships)} research edges.")
