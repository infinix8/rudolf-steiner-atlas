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
original_guides = load("research/organ-atlas-guides-v1.json")
expanded_guides = load("research/organ-atlas-guides-v2-expansion.json")
guides = dict(original_guides)
guides["guides"] = original_guides["guides"] + expanded_guides["guides"]
check(expanded_guides.get("base_dataset") == "research/organ-atlas-guides-v1.json" and
      expanded_guides.get("research_phase") == original_guides.get("research_phase"),
      "Expansion must declare the original guide dataset and the same research phase.")
dossiers = load("research/organ-comparative-dossiers-v29.json")
canonical = {item["id"] for item in dossiers["dossiers"]}
dossiers_by_id = {item["id"]: item for item in dossiers["dossiers"]}
# Source provenance: every newly curated original-source URL must already be
# indexed in the corresponding canonical organ dossier (relations or phased claims).
for new_guide in expanded_guides["guides"]:
    base = dossiers_by_id.get(new_guide["id"])
    if base is None:
        check(False, f"Expanded visual guide is not a canonical organ dossier: {new_guide['id']}")
        continue
    indexed = list(base.get("relations", []))
    for key, value in base.items():
        if key.startswith("phase") and key.endswith("_refinements") and isinstance(value, list):
            indexed.extend(value)
    indexed_urls = {row.get("source_url") for row in indexed if isinstance(row, dict)}
    for source in new_guide["sources"]:
        check(source["url"] in indexed_urls,
              f"{new_guide['id']}: guide source {source['id']} lacks provenance in canonical dossier.")

expected_layers = {
    "overview", "body", "interpretation", "evolution",
    "agencies", "connections", "sources", "questions",
}
layer_ids = [item["id"] for item in guides["layers"]]
check(set(layer_ids) == expected_layers and len(layer_ids) == 8,
      "Guide must declare precisely eight distinct expected layers.")
check(body["organ_count"] == len(body["organs"]) == 10,
      "Body map must contain exactly ten unique organ navigation entries.")
map_ids = [item["id"] for item in body["organs"]]
check(len(set(map_ids)) == len(map_ids), "Duplicated organ map ID.")
check(set(map_ids) <= canonical, "Body map refers to nonexistent canonical dossiers.")
artwork = body.get("artwork", {})
check(artwork.get("creator", "").startswith("DataBase Center for Life Science") and
      artwork.get("license") == "CC BY 4.0" and
      "creativecommons.org/licenses/by/4.0" in artwork.get("license_url", "") and
      artwork.get("source", "").endswith("202403_human_anatomy_organs.svg"),
      "Anatomy art must preserve DBCLS source and CC BY 4.0 attribution.")
check(artwork.get("overlay_viewBox") == [0, 0, 600, 1000],
      "Anatomy marker coordinate system must match the 600x1000 source illustration.")

for item in body["organs"]:
    check(item["status"] in {"guided", "research_dossier", "index_only"},
          f"{item['id']}: invalid status")
    marker = item.get("marker", {})
    check(isinstance(marker.get("visible"), bool),
          f"{item['id']}: missing artwork visibility classification")
    if marker.get("visible"):
        anchor = marker.get("anchor", {})
        callout = marker.get("callout", {})
        check(all(isinstance(anchor.get(k), (int, float)) for k in ("x", "y")) and
              0 <= anchor.get("x", -1) <= 600 and 0 <= anchor.get("y", -1) <= 1000,
              f"{item['id']}: invalid visible-organ anchor coordinates")
        check(all(isinstance(callout.get(k), (int, float)) for k in ("x", "y")) and
              0 <= callout.get("x", -1) <= 600 and
              0 <= callout.get("y", -1) <= 1000 and
              callout.get("side") in {"left", "right"},
              f"{item['id']}: invalid organ callout geometry")
    else:
        check(marker.get("confidence") == "not_depicted" and
              not marker.get("anchor") and
              marker.get("visibility_note"),
              f"{item['id']}: unpictured organs must not be assigned invented physical positions")
    route = item["route"]
    target = route.split("?", 1)[0].split("#", 1)[0]
    check("/" not in target and not target.startswith(".") and
          (ROOT / "atlas" / target).is_file(),
          f"{item['id']}: broken local route {route}")

guide_ids = [g["id"] for g in guides["guides"]]
expected_guide_ids = {"organ-heart", "organ-liver", "organ-lungs", "organ-brain",
                      "organ-kidneys", "organ-spleen"}
check(set(guide_ids) == expected_guide_ids and len(guide_ids) == 6,
      "Expected precisely six unique completed visual guide records.")
for item in body["organs"]:
    if item["status"] == "guided":
        check(item["id"] in guide_ids and item["route"].startswith("organ-detail.html?"),
              f"{item['id']}: guided map route should point to visual detail page")
check({item["id"] for item in body["organs"] if item["status"] == "guided"} == expected_guide_ids,
      "All six guided organs should be offered through body map navigation.")
check({item["id"] for item in body["organs"] if item["status"] == "index_only"}
      == {"organ-thyroid", "organ-stomach", "organ-bladder"},
      "Three index-only organ topics must not be presented as completed guides.")
check({item["id"] for item in body["organs"] if item["status"] == "research_dossier"}
      == {"organ-intestines"},
      "Intestines must retain its existing source-linked dossier status, not be downgraded to index-only.")


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
                      (section in {"evolution", "comparison"} and rec.get("kind") == "research_gap"),
                      f"{g['id']}/{section}/{i}: missing source")
            check(all(r in source_set for r in refs),
                  f"{g['id']}/{section}/{i}: unresolved source ID {refs}")
    check(len(g["connections"]["nodes"]) <= 5,
          f"{g['id']}: orbit renderer supports up to five nodes")
    for node in g["connections"]["nodes"]:
        if node.get("related_guide_id"):
            check(node["related_guide_id"] in expected_guide_ids,
                  f"{g['id']}: related organ {node['related_guide_id']} is not a curated guide.")
            check(bool(node.get("sources")),
                  f"{g['id']}: an inter-organ navigation edge must retain a source reference.")
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
check("organ-atlas-guides-v2-expansion.json" in js,
      "Guide JS must load four expanded guide records without discarding Heart/Liver.")
check("data-organ-id=" in visual_map and visual_map.count("data-organ-id=") == 8,
      "Interactive diagram must expose 8 hotspots")
check('href="atlas/body.html"' in landing,
      "Homepage must include visual human body map")
check("organ-detail.html" in visual_map,
      "Body map must lead to new guided pages")
check(sum(1 for item in body["organs"] if item["marker"].get("visible")) == 8,
      "The licensed frontal artwork depicts eight of the current ten organ targets.")
check(set(item["id"] for item in body["organs"] if not item["marker"].get("visible"))
      == {"organ-kidneys", "organ-spleen"},
      "Kidneys and spleen must remain distinctly labeled as not depicted.")
check(visual_map.count('class="organ hotspot callout-link"') == 8 and
      visual_map.count('class="unpictured-chip organ"') == 2,
      "Eight labelled illustration callouts and two non-depicted organ links are expected.")
for item in body["organs"]:
    check('data-organ-id="' + item["id"] + '"' in visual_map,
          f"Missing interactive organ control for {item['id']}")
check("dbcls-human-anatomy-organs.svg" in visual_map and
      "dbcls-human-anatomy-organs.svg" in html and
      "medical-locator" in html and
      "anatomy-hotspots" in visual_map,
      "Body and detail pages must render the same professional DBCLS artwork.")
check("creativecommons.org/licenses/by/4.0/" in visual_map and
      "creativecommons.org/licenses/by/4.0/" in html,
      "CC BY 4.0 artwork attribution is required on both rendered pages.")
check("@media(max-width:680px)" in css,
      "Guide needs explicit mobile style")
check("historical" in html.lower() and "medical" in html.lower(),
      "Historical and medical-claims scope must remain visible")

comparison = load("research/organ-visual-comparisons-v1.json")
compare_page = (ROOT / "atlas/compare-organs.html").read_text(encoding="utf-8")
check(len(comparison.get("lenses", [])) == 5 and
      len({lens["id"] for lens in comparison["lenses"]}) == 5,
      "Five distinct visual comparison lenses required.")
guide_sources = {
    "heart": {s["id"] for g in guides["guides"] if g["id"] == "organ-heart" for s in g["sources"]},
    "liver": {s["id"] for g in guides["guides"] if g["id"] == "organ-liver" for s in g["sources"]},
}
for lens in comparison["lenses"]:
    check(bool(lens.get("title") and lens.get("distinction")),
          f"{lens['id']}: missing comparison explanation")
    for organ in ("heart", "liver"):
        cards = lens[organ]["cards"]
        check(len(cards) == 2, f"{lens['id']}/{organ}: exactly two concise comparison cards required")
        for card in cards:
            check(bool(card.get("label") and card.get("description") and card.get("kind")),
                  f"{lens['id']}/{organ}: incomplete comparison card")
            check(bool(card.get("sources")) and all(x in guide_sources[organ]
                  for x in card.get("sources", [])),
                  f"{lens['id']}/{organ}: source is missing from curated organ guide")
check("organ-visual-comparisons-v1.json" in compare_page and
      "organ-atlas-guides-v1.json" in compare_page,
      "Visual comparison must load both canonical source-linked datasets.")
check("compare-organs.html" in visual_map and
      "compare-organs.html" in html and
      "atlas/compare-organs.html" in landing,
      "Comparison must be reachable from body, guided page and unified homepage.")

if errors:
    print("Visual Organ Atlas validation FAILED:")
    for error in errors:
        print(" - " + error)
    raise SystemExit(1)
print(f"Visual Organ Atlas validated: {len(map_ids)} organ access points, {len(guide_ids)} curated guides, "
      f"{len(layer_ids)} layers, {sum(len(x['sources']) for x in guides['guides'])} "
      "attributed source anchors. Source review remains editorial, not scientific validation.")
