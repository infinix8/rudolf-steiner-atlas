"""Check v28 provenance, coverage, attributions, claim links and reconciliation."""
from collections import Counter
import hashlib
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
research = root / "research"
def read(name):
    return json.loads((research / name).read_text())

rows = read("organ-paragraph-review-cross-corpus-v28.json")["records"]
claims = read("organ-atomic-claims-cross-corpus-v28.json")["records"]
by_unit = {(r["catalogue_entry_id"], r["paragraph"]): r for r in rows}
assert len(rows) == len(by_unit) == 306
expected = {"GA110-09": 18, "GA110-10": 29, "GA110-11": 44, "GA110-12": 28,
            "GA102-01": 32, "GA102-02": 26, "GA107-19": 29, "GA205-06": 26,
            "GA208-01": 43, "GA218-16": 26}
for entry, count in expected.items():
    numbers = [p for key, p in by_unit if key == entry and isinstance(p, int)]
    assert numbers == list(range(1, count + 1)), entry
assert len({r["id"] for r in rows}) == len(rows)
assert len({c["id"] for c in claims}) == len(claims) == 128
prior = set()
for file in research.glob("organ-atomic-claims-*.json"):
    prior.update(c["id"] for c in json.loads(file.read_text()).get("records", []) if "id" in c)
for claim in claims:
    row = by_unit[claim["catalogue_entry_id"], claim["section"]]
    assert claim["id"] in row["claim_ids"] and claim["source_url"] == row["source_url"]
    assert row["speaker"] not in ("audience", "editorial_heading")
    assert claim["reconciliation"]["decision"] == "new_candidate" or claim["reconciliation"]["prior_claim_ids"]
    assert set(claim["reconciliation"]["prior_claim_ids"]) <= prior
assert Counter(c["id"] for c in claims) == Counter(i for r in rows for i in r["claim_ids"])
ledger = read("organ-corpus-ledger-ga110-v28.json")
assert len(ledger["entries"]) == ledger["complete_English_source_views"] == 12
assert ledger["unread"] == 0 and sum(e["english_paragraphs_reviewed"] for e in ledger["entries"]) == 281
assert sum(e.get("unnumbered_continuations_reviewed", 0) for e in ledger["entries"]) == 1
assert all((root/e["audit_record"]).is_file() for e in ledger["entries"])
for e in ledger["entries"]:
    assert not any(e[k] for k in ("complete_bilingual_collation", "exhaustive_atomic_claims", "independent_second_review"))
old = {d["id"]: d for d in read("organ-comparative-dossiers-v27.json")["dossiers"]}
new = read("organ-comparative-dossiers-v28.json")["dossiers"]
assert len(new) == len(old) == 40
for dossier in new:
    assert all(dossier[k] == value for k,value in old[dossier["id"]].items())
    assert all(r["claim_ref_id"] in prior for r in dossier.get("phase28_refinements", []))
checks = read("organ-german-checks-and-textual-issues-v28.json")["checks"]
assert len(checks) == 17 and all("/German/" in r["german_url"] for r in checks)
m = read("organ-manuscript-provenance-v28.json")
body = (root/m["cumulative_path"]).read_bytes()
previous = body[m["preserved_start_byte"]:m["preserved_end_byte_exclusive"]]
assert len(previous) == m["source_bytes"] and hashlib.sha256(previous).hexdigest() == m["source_sha256"]
assert hashlib.sha256(body).hexdigest() == m["cumulative_sha256"]
print("PASS: 10 source views, 301 numbered positions, five supplements, 128 linked claims, 17 German checks and cumulative manuscript preservation")
