# Evidence reconciliation — v0.15
27 November 2026 · Research-only checkpoint

## Scope and result
Recovered and parsed the complete rendered HP v0.9 (138 rows), VP v0.6 (128 rows) and MA v0.1 (140 rows) evidence CSVs; also parsed the complete private HP import JSON, graph seed, central ID crosswalk and VP relation proposal. Raw-byte materialization was denied by project access, so no original-file hashes or byte-for-byte archival claims. The indexed files remain the restricted originals. No private text, private locator, course filename, scan or private access detail is published. This is a complete row-disposition pass for the three recovered ledgers, not a complete primary-source audit or all planetary evidence.

| Ledger | Steiner source records | Restricted BOTA | Comparative assessments |
|---|---:|---:|---:|
| HP | 94 | 44 | 0 |
| VP | 76 | 52 | 0 |
| MA | 19 | 65 | 56 |

Total: 406 rows; 189 source records, 161 restricted IDs, 56 assessments. Do not add these counts to canonical source/claim totals. Multiple locators and translations can point to the same passage; same-date groups are review candidates, never automatic duplicates. 38 shared exact-page URL groups; 111 candidate witness groups. All status is inherited from branch audit, not fresh primary-source inspection.

## Row dispositions
- withhold_private_content: 161
- review_same_date_or_chapter: 23
- register_branch_witness: 142
- link_existing_url: 22
- defer_metadata_review: 2
- retain_comparison_no_primary_promotion: 56

## Relationship reconciliation
526 hidden-path evidence links (372 public-source references; remainder restricted count only). 621 visible public path tags. 41 relationship proposals, all tracked separately from canonical claims and tree edges.
- defer_private_comparison: 11
- crosslink_existing_claims: 17
- retain_superseded_interpretation: 1
- alias_existing_context: 6
- defer_claim_level_review: 6

HPX-G07 preserved as historical interpretation; HPX-G24 qualifies it. HPX-G25/27 and VP06-R01–03 cross-reference existing GA237 claims rather than counting new discoveries. HPX-G28/30 cross-reference GA136 claims; VP06-R04/06 preserve mediation and after-death dispute. VP06-R07/08 preserve authorship and continuity differences. Private comparisons remain review-only. No change to 38 edges, 78 cards, or six Daath records. All 36 Steiner decanate slots remain unassigned.

## Validation and exceptions
- PASS: csv_rows_unique
- PASS: hp_csv_expected_count
- PASS: vp_csv_expected_count
- PASS: ma_csv_expected_count
- PASS: private_import_rows
- PASS: private_import_fields_match
- PASS: seed_relationship_ids_and_evidence_match
- PASS: all_crosswalk_edges_match
- PASS: all_seed_edges_match
- PASS: all_visible_key_links_match
- PASS: all_daath_alias_targets_exist
- PASS: all_hidden_link_refs_resolved
- PASS: all_relation_refs_resolved
- PASS: all_central_claim_refs_resolved
- PASS: private_rows_minimized
- PASS: all_visible_path_tags_recognized
- private_csv_field_mismatches: none
- seed_relationship_evidence_mismatches: none
- hidden_missing_evidence_refs: none
- relation_missing_evidence_refs: none
- visible_unrecognized_path_tokens: none
- minor_comparisons_without_resolved_source_refs: ["MA:CMP-MA-CU-10","MA:CMP-MA-SW-03","MA:CMP-CT-SW-QU"]
Minor assessment source refs resolve only exact local IDs in the source column; absence is a review lead, not proof of no evidence. Daath checks validate alias targets, not original geometry. The graph's prior 43 claims and 26 canonical sources are unchanged; branch metadata is a separate reconciliation layer.

## Next gate
Recover full Mercury, Jupiter, Vulcan, Saturn, Venus, Sun, Moon, Mars, Upper Tree, independent review and new zodiac/hierarchy/Worlds/Earth ledgers. None was fully recovered in this pass. Promote specific claims only after checking source context and the original authorized course material where needed. Reinspect any flagged source/relationship exceptions. Do not merge or deploy the live Atlas as part of reconciliation.
