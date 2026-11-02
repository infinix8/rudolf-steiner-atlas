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
    if review.get("archive_url_checked") is not True or not review.get("archive_page_opened_on"):
        errors.append("missing source-site opening audit: " + str(sid))
    if review.get("full_translation_collation") is not False:
        errors.append("do not imply full translations were compared: " + str(sid))

ids = set()
allowed_statuses = {"selected_passage_checked", "editorial_comparison_with_checked_passages"}
allowed_basis = {"direct", "editorial_comparison"}
allowed_types = {
    "acts_during",
    "applies_imitation_to_early_childhood",
    "applies_spiritual_knowledge_to",
    "applies_to_art",
    "applies_to_description_of",
    "argued_as_spiritual_continuity",
    "argues_for_images_before_abstract_judgment",
    "associated_with",
    "associates_authority_with_second_stage",
    "attributed_as_governing_forces",
    "attributed_nature_explanation",
    "attributes_plant_timing_to_lunar_conditions",
    "attributes_reproductive_rhythms_to",
    "begins_development_of",
    "belong_to_same_nature_kingdom",
    "bridges_color_experience_and_art",
    "combines_with",
    "compared_through_art_philosophy",
    "compares_cosmic_sound_with_motion",
    "compares_goethe_and_newton_accounts",
    "compares_with_initiation",
    "condensed_as",
    "connects_planetary_and_earthly_processes",
    "contrasted_with_authority_based_action",
    "contrasts_causality_with",
    "contrasts_idea_and_experience_in",
    "contrasts_inward_vowel_and_outward_consonant",
    "contrasts_monism_with_kantian_dualism",
    "contrasts_observation_with_abstract_theory",
    "contributes_to",
    "criticizes_limit_claims_about",
    "depends_on_knowledge_of_phenomena",
    "depicts_future_transformation_of_sense_world",
    "derives_its_view_of_movement_from",
    "described_as_cooperating",
    "described_as_recollection_not_stored_picture",
    "described_transition",
    "describes_as_form_of_own_past",
    "describes_own_activity_as",
    "describes_phase_of",
    "describes_separation_of_faculties_in",
    "directs_activity_of",
    "discussed_as_epochal_context",
    "discusses_prism_boundary_experiment_in",
    "distinguished_from",
    "distinguished_postmortem_from_karma",
    "distinguishes_from",
    "distinguishes_lesser_and_greater_guardian",
    "draws_on_method",
    "elaborated_through",
    "emphasizes_value_of_sense_world",
    "enables_development_toward",
    "exemplified_by_archetypal_plant",
    "explained_through_individual_biography",
    "explains_goethean_color_through",
    "explains_through",
    "explicitly_respects_free_will",
    "explores_soul_response_to",
    "expounded_in_written_work",
    "expressed_as_individual_action",
    "expressed_in_architecture",
    "expressed_in_biography",
    "expressed_in_early_goethe_scholarship",
    "expressed_through",
    "expresses_sound_through_movement",
    "forms_process_with",
    "forms_unity_with",
    "framed_as_related_to",
    "frames_as_living_whole",
    "frames_education_through_life_phases",
    "frames_festival_interpretation",
    "frames_problem_of",
    "further_modified_by",
    "has_component",
    "historically_asserted_relation",
    "historically_exemplified_by",
    "illustrates",
    "influences_festival_interpretation",
    "influences_next_rank",
    "interacts_with",
    "interpreted_as_postmortem_context",
    "interpreted_as_preparing_reincarnation",
    "interpreted_as_preserving_past",
    "interpreted_through_actions_and_reincarnation",
    "interprets_debate_through",
    "interprets_gospel_episode",
    "interprets_imitation_as_early_development",
    "interprets_symbolically",
    "interprets_tradition_through",
    "interrelates_poetic_sound_and_gesture",
    "involves",
    "is_preparatory_practice_within",
    "is_training_practice_within",
    "linked_to_act_of_knowledge",
    "links_guardian_to_karmic_self_assessment",
    "motivates_educational_task",
    "must_distinguish",
    "performed_as",
    "precedes_in_account",
    "preparatory_to",
    "prepared_as",
    "presented_as_application_to",
    "presented_as_opposing_influence",
    "provides_elements_for_visible_speech",
    "provides_epistemic_basis_for",
    "provides_seasonal_context_for",
    "related_to_moral_development",
    "relates_method_to_science",
    "relates_planting_to_weather_and_seasons",
    "requires_for_realization",
    "sets_responsibility_condition",
    "special_case_of",
    "symbolically_compares_to",
    "symbolically_corresponds_to",
    "takes_account_of",
    "transforms",
    "treats_soil_field_and_crop_as_whole",
    "unites_percept_and_concept_in",
    "used_as_analogy_for",
    "used_in_pedagogical_account",
    "uses_observational_experiment",
    "uses_underlying_formative_type",
    "works_with",
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

# Ensure old exploratory crosslinks cannot silently become 'verified'.
legacy = json.loads((ROOT / "research/legacy-crosslink-audit.json").read_text(encoding="utf-8"))
original_links = taxonomy.get("crosslinks", [])
if len(legacy.get("relations", [])) != len(original_links):
    errors.append("legacy crosslink audit is incomplete")
edge_lookup = {e.get("id"): e for e in data.get("edges", [])}
for idx, old in enumerate(original_links):
    if idx >= len(legacy.get("relations", [])):
        break
    audit = legacy["relations"][idx]
    if audit.get("from") != old.get("from") or audit.get("to") != old.get("to"):
        errors.append(f"legacy order/endpoints mismatch at {idx + 1}")
        continue
    direct = [e for e in data.get("edges", []) if
              (e.get("from"), e.get("to")) in (
                  (old.get("from"), old.get("to")),
                  (old.get("to"), old.get("from")))]
    if audit.get("review_status") == "matched_exact_nodes":
        if not direct:
            errors.append(f"claim of match without exact evidence at {idx + 1}")
        if not any(e.get("id") in audit.get("candidate_graph_edges", []) for e in direct):
            errors.append(f"unlinked match at {idx + 1}")
    elif audit.get("review_status") == "not_yet_evidenced":
        if direct:
            errors.append(f"new verified edge not reflected in legacy audit at {idx + 1}")
    elif audit.get("review_status") != "related_descendant_evidence_not_sufficient":
        errors.append(f"unknown audit status at {idx + 1}")

for src in sources:
    if not source_refs[src]:
        errors.append("unused source: " + src)

required = ["atlas/graph.html", "atlas/graph.js", "atlas/graph.css", "atlas/index.html", "atlas/app.js", "atlas/sources.html", "atlas/sources.js", "atlas/coverage.html", "atlas/coverage.js", "atlas/timeline.html", "atlas/timeline.js", "atlas/dossiers.html", "atlas/dossiers.js", "atlas/trajectories.html", "atlas/trajectories.js"]
for file in required:
    if not (ROOT / file).is_file():
        errors.append("missing interface file: " + file)

print(f"{len(nodes)} canonical taxonomy nodes, {len(ids)} graph edges, {len(sources)} primary-source pages, {cross_domains} cross-domain edges")
if errors:
    for error in errors: print("ERROR: " + error, file=sys.stderr)
    sys.exit(1)
print("PASS: references, relationships, provenance and local UI files structurally consistent")
