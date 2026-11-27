# Planetary evidence intake — v0.16
27 November 2026 · continuation of v0.15 evidence reconciliation

Recovered and parsed five complete rendered artifacts: Vulcan source register, evidence matrix, depth verification log, Saturn editorial disposition table v0.14, Jupiter individual-topic audit v1.1. Different kinds of records are not additive source counts. No raw-byte hashes, no independent source reopening, no private lesson publication.

| Record type | Rows |
|---|---:|
| Vulcan source register | 99 |
| Vulcan evidence mappings | 723 |
| Vulcan depth verification log | 159 |
| Saturn topic dispositions | 506 |
| Jupiter individual topic audits | 294 |

## Vulcan
Actual recovered register has 99 sources and matrix 723 mappings over 279 distinct topic IDs. This is not necessarily the latest v0.15 concordance: earlier handovers report 732 or other mapping counts. Preserve actual recovered counts; request the exact latest bundle. Mapping grades: {"unresolved":493,"direct":175,"contested":17,"synthesis":37,"lead":1}. 0 records match a central exact URL; 3 match a prior branch exact URL. Same URL is not same proposition. 83 register-vs-matrix source field variants recorded, not silently overwritten; source record and mapping are separate. Unresolved references: []. No cluster-level candidate promoted to direct evidence. Depth log is indexed only by available ID/status fields; no private text copied.

## Saturn
Recovered v0.14 editorial disposition table with 506 stable topic IDs. {"addressed":381,"bounded":113,"scope excluded":1,"targeted primary review":9,"gap":2}. This corrects the previous absence of any current Saturn completion checkpoint; it does not establish that the final PDF, source ledger or pilot release passed. Its editorial dispositions are not primary-source verification.

## Jupiter
Recovered individual topic audit v1.1 with 294 topic blocks, extracted evidence-status classifications {"passage_checked_reported":268,"inherited_locator":24,"other_or_review":2}. Missing expected IDs []; missing anchors []. These are inherited audit decisions, not independent PDF navigation or source checks. Source register and actual final PDF still require recovery.

## Validation
- PASS: vulcan_source_ids_unique
- PASS: vulcan_mapping_ids_unique
- PASS: vulcan_source_refs_resolved
- PASS: saturn_topic_ids_unique
- PASS: jupiter_ids_unique
- PASS: jupiter_294_ids_preserved

## Remaining gaps
Mercury complete evidence CSV (audit and reader available but not full source/mapping ledger in this pass); Jupiter full evidence source register; Saturn source matrix and reader; exact latest Vulcan private and public ledgers; Sun/Moon/Mars/Venus source-level reconciliation; Upper Tree, independent review, zodiac/hierarchy/Four Worlds and Earth new branch ledgers. No claim of corpus-wide completion. Source-critical work should focus on GA317, GA89/91, GA227/231, names/roles and original diagrams. The canonical graph remains 43 claims and 26 sources; intake records live in separate evidence layer.
