#!/usr/bin/env python3
"""Check visual organ guide structure and source links with standard library only.

Run locally (no GitHub Actions needed): python3 tools/validate_visual_organ_atlas.py
This checks editorial structure/provenance, not the factual correctness of Steiner's claims.
"""
from __future__ import annotations
import json
from pathlib import Path
from urllib.parse import urlparse
from collections import Counter

ROOT = Path(__file__).resolve().parent.parent
load = lambda path: json.loads((ROOT / path).read_text(encoding="utf-8"))
errors: list[str] = []

def check(cond: bool, message: str) -> None:
    if not cond:
        errors.append(message)

body = load("research/organ-body-map-v1.json")
guides = load("research/organ-atlas-guides-v1.json")
dossiers = load("research/organ-comparative-dossiers-v29.json")
canonical = {item["id"] for item in dossiers["dossiers"]}

expected_layers = {
    "overview", "body", "interpretation", "evolution",
    "agencies", "connections", "sources", "questions",
}
layer_ids = [item["id"] for item in guides["layers"]]
check(set(layer_ids) == expected_layers and len(layer_ids) == 8,
      "Guide must declare precisely eight distinct expected layers.")
check(body["organ_count"] == len(body["organs"]) == 8,
      "Body map must contain exactly eight unique organs.")
map_ids = [item["id"] for item in body["organs"]]
check(len(set(map_ids)) == len(map_ids), "Duplicated organ map ID.")
check(set(map_ids) <= canonical, "Body map refers to nonexistent canonical dossiers.")

for item in body["organs"]:
    check(item["status"] in {"guided", "research_dossier", "index_only"},
          f"{item['id']}: invalid status")
    route = item["route"]
    target = route.split("?", 1)[0].split("#", 1)[0]
    check("/" not in target and not target.startswith(".") and
          (ROOT / "atlas" / target).is_file(),
          f"{item['id']}: broken local route {route}")

guide_ids = [g["id"] for g in guides["guides"]]
check(set(guide_ids) == {"organ-heart", "organ-liver"} and len(guide_ids) == 2,
      "Expected complete Heart and Liver visual guides.")
for item in body["organs"]:
    if item["status"] == "guided":
        check(item["id"] in guide_ids and item["route"].startswith("organ-detail.html?"),
              f"{item['id']}: guided map route should point to visual detail page")

for g in guides["guides"]:
    check(g["id"] in canonical, f"Unknown guide dossier ID {g['id']}")
    check((ROOT / "atlas" / g["dossier_url"].split("?")[0]).is_file(),
          f"{g['id']}: missing full dossier reader")
    src_ids = [s["id"] for s in g["sources"]]
    check(len(set(src_ids)) == len(src_ids),
          f"{g['id']}: repeated local source ID")
    source_set = set(src_ids)
    for src in g["sources"]:
        u = urlparse(src["url"])
        check(u.scheme == "https" and u.netloc in {"rsarchive.org", "www.rsarchive.org"} and
              src.get("ga") and src.get("cue") and src.get("title"),
              f"{g['id']}: invalid primary-source record {src.get('id')}")

    required_parts = [
        ("overview", g["quick_takeaways"]),
        ("body", g["body"]["cards"]),
        ("interpretation", g["interpretation"]["cards"]),
        ("evolution", g["evolution"]["timeline"]),
        ("agency", g["agencies"]["rows"]),
        ("connections", g["connections"]["nodes"]),
        ("questions", g["questions"]),
        ("comparison", [g["evolution"]["compare"]["left"],g["evolution"]["compare"]["right"]]),
    ]
    for section, records in required_parts:
        check(records, f"{g['id']}: no {section} entries")
        for i, rec in enumerate(records):
            check(bool(rec.get("title", rec.get("agent", rec.get("label")))),
                  f"{g['id']}/{section}/{i}: missing heading")
            refs=rec.get("sources",[])
            if not refs:
                check(section == "questions" or
                      (section == "body" and rec.get("type") == "modern_anatomy") or
                      (section == "evolution" and rec.get("kind") == "research_gap"),
                      f"{g['id']}/{section}/{i}: missing source")
            check(all(r in source_set for r in refs),
                  f"{g['id']}/{section}/{i}: unresolved source ID {refs}")
    check(len(g["connections"]["nodes"]) <= 5,
          f"{g['id']}: orbit renderer supports up to five nodes")
    check(len(g["quick_takeaways"]) <= 5,
          f"{g['id']}: introductory content should remain concise")

html=(ROOT / "atlas/organ-detail.html").read_text(encoding="utf-8")
js=(ROOT / "atlas/organ-detail.js").read_text(encoding="utf-8")
css=(ROOT / "atlas/organ-detail.css").read_text(encoding="utf-8")
landing=(ROOT / "site/index.html").read_text(encoding="utf-8")
visual_map=(ROOT / "atlas/body.html").read_text(encoding="utf-8")
check("organ-detail.js" in html and "organ-detail.css" in html,
      "Detail page missing scripts/styles")
check("organ-atlas-guides-v1.json" in js, "Guide JS must load canonical curated JSON")
check("data-organ-id=" in visual_map and visual_map.count("data-organ-id=") == 8,
      "Interactive diagram must expose 8 hotspots")
check('href="atlas/body.html"' in landing,
      "Homepage must include visual human body map")
check("organ-detail.html" in visual_map,
      "Body map must lead to new guided pages")
check("@media(max-width:680px)" in css,
      "Guide needs explicit mobile style")
check("historical" in html.lower() and "medical" in html.lower(),
      "Historical and medical-claims scope must remain visible")

if errors:
    print("Visual Organ Atlas validation FAILED:")
    for error in errors:
        print(" - " + error)
    raise SystemExit(1)
print(f"Visual Organ Atlas validated: {len(map_ids)} hotspots, {len(guide_ids)} curated guides, "
      f"{len(layer_ids)} layers, {sum(len(x['sources']) for x in guides['guides'])} "
      "attributed source anchors. Source review remains editorial, not scientific validation.")
