# 3 November 2026 — Atlas organ concordance integration and source-critical research

## Outcome

This iteration continues the **Rudolf Steiner Atlas as a companion to RS Archive**. It integrates substantial organ-evolution research that was already being developed in the repository and incorporates a newer, concurrently committed GA317 English-reading batch. Primary books and lectures **remain on their original websites**; the Atlas hosts only original editorial classification, passage cues, translation cautions, comparisons, and navigational links.

### Verified repository state after reconciliation

| Measure | Current state | Essential qualification |
|---|---:|---|
| Thematic taxonomy nodes | 1,006 | Six regions / 26 domains / 150 subdomains; editorial structure |
| Source-qualified broad Atlas relationships | 218 | Not a complete Steiner corpus knowledge graph |
| Original source-page records | 58 | Page or translation count, **not** independent lecture events |
| Cross-domain graph links | 113 | Typed editorial passage associations, not independent scientific findings |
| Direct subdomain graph endpoints | 53 | Presence does not establish a complete subject review |
| Child-only subdomain evidence | 51 | Does not verify the whole parent subdomain |
| Subdomains without graph evidence | 46 | Research gaps in this project, not in Steiner's actual writings |
| Organ comparative dossiers | 29 | Source metadata across several research phases; not 29 exhaustive organ histories |
| GA313–317 catalogue records | 61 | Includes recognized alternate views of shared events |
| English source views with all available numbered sections reviewed | 27 | Not complete German collation or exhaustive atomic extraction |
| Thematic / selected-only / unread | 1 / 3 / 30 | Strictly different audit levels |
| Counted numbered English source-view sections | 696 | Includes a confirmed GA313 IX / GA315 VII alias; unique event total not yet certified |

All counts were reconciled against the current v17 research ledger and latest knowledge graph after overlapping work. The primary UI and research continue to be maintained in the same canonical repository.

## New: standalone Organ Concordance Explorer

[Launch locally](../atlas/organs.html) through the static server; the new browser reads the current [29-dossier v17 organ concordance](../research/organ-comparative-dossiers-v17.json) and [61-entry corpus ledger](../research/organ-corpus-ledger-ga313-317-v17.json). Features include:

- Search by organ, alternative name, historical relation type, and documented editorial note.
- Separate **initial comparative source relationships** from **phase-by-phase selected claim annotations**, retaining citation provenance instead of merging them into an asserted medical fact.
- Direct outward archive links for each supported original source.
- Displays **26 original v16 dossier records plus additional phase17 organ dossiers**, with no loss of earlier 25 established organ dossiers.
- A visible, searchable supplemental [GA317 VIII case review](../research/organ-selected-reading-ga317-viii-v16.json) with 14 thematic passage cards and two unresolved original-language numerical differences.
- Explicit warnings against using historical diagnosis, spiritual-member attribution, parental-causing-disability speculation, or therapeutic assertions as evidence-based care.

The reader is connected to the existing Atlas concept browser, knowledge graph, source guide, chronology, coverage view, trajectories and study dossiers. Desktop/mobile Chromium tests exercise its search, source links and case/translation panels.

## New: supplementary phase-16 source criticism without fabricated completeness

The [RSP1972 GA317 VIII alternative English page](https://rsarchive.org/Lectures/GA317/English/RSP1972/19240703p01.html) yielded **14 selected passage notes**, **10 selected provisional atomic claims** and **two unresolved cross-language numeric issues**:

1. A reported birth weight appears as **5¾ lb in displayed English versus 5¼ lb in displayed German**.
2. A different child’s birth weight appears as **under 4¼ lb in displayed English versus under 4 lb in displayed German**.

These are **translation/transcription discrepancies**, not medical findings. It is vital to keep separate the reported clinical history, Steiner’s occult or karmic causal conjectures, and the lecturer's proposed future observation (such as dreams before waking). The original case presentation explicitly defers treatment to another lecture; no treatment outcome is demonstrated in that section.

The [phase16 note](ORGAN_CONCORDANCE_PHASE16_FINDINGS.md) and [candidate claims](../research/organ-atomic-claims-ga317-viii-v16.json) remain stable historical supplements. They are **not counted as an additional original lecture event** or a second full-English review.

## Concurrent phase17 first-pass GA317 completion correctly integrated

While the phase-16 research was underway, the repository received a larger [phase17 GA317 VIII–XII batch](ORGAN_CONCORDANCE_PHASE17_FINDINGS.md). It audits 150 numbered English paragraphs across five lectures and additionally logs one unnumbered table. The complete GA317 English series now totals 348 numbered sections across 12 source views. The phase-17 cumulative GA313–317 numbered English source-view count is **696**. Full original German collation and independent second review remain incomplete.

This integration deliberately preserves the newer v17 as the current baseline and the earlier phase16 record as a **separate translation-critical comparison**. [Canonical resume instructions](ORGAN_CONCORDANCE_RESUME.md) and the [long Work task](WORK_TASK_COMPLETE_ORGAN_CONCORDANCE.md) have been corrected accordingly.

### Specific interpretation risks that remain visible

- A reported child's symptoms and organ sizes are **not independent clinical validation** of Steiner's diagnosis.
- Claims connecting illness or disability to a mother's feelings, father's heart disease, karma or astral organization are unverified and can be harmful if used to blame families.
- The lecture's metaphysical account of womb, cosmic head formation, breathing and limb construction is **not modern embryology**.
- The historical discussions of lead, arsenic, nicotine and other proposals in this corpus are **not treatment recommendations**.
- Alternate translations and GA catalogue aliases must not be counted as independently confirming the same occurrence.
- The level of textual audit (selected English passage versus full numbered English view versus German collation versus exhaustive claim extraction) remains explicit.

## Engineering and validation

- Added `atlas/organs.html`, `atlas/organs.js`, `atlas/organs.css` and navigational links throughout the Atlas.
- Added `tools/validate_organ_phase16.py` to prevent inflation of v16 numbered-section counts, protect all previous dossiers and candidate IDs, and check numerical issue metadata.
- Updated `tools/validate_organ_concordance.py` to admit selected-only RSP paragraph cues without pretending they are numbered SOL paragraphs.
- Updated GitHub Actions to validate the current **v17 ledger** plus the v16 supplement, and to execute the organ reader’s desktop/mobile browser smoke tests.
- Regenerated `docs/KNOWLEDGE_GRAPH_COVERAGE.md` and `docs/SUBDOMAIN_EVIDENCE_COVERAGE.md` against the **latest** graph, preserving the alternate-source-event caveat.
- All edits are committed to the canonical `infinix8/rudolf-steiner-atlas` repository, separate from the BOTA project.

## Next concrete research work

1. Complete GA315 **II–VI and VIII**, the six outstanding source views, carefully respecting the GA313 IX / GA315 VII event alias.
2. Continue the GA314 and GA316 source views, comparing organ/disease/soul-member propositions passage by passage.
3. Collate original German and alternate English on clinically consequential claims, including the two GA317 VIII numeric cases and previous pituitary and procedure terminology issues.
4. Crosslink individual organ dossiers to distinct stages **Old Saturn, Old Sun, Old Moon, Earth, future stages** only where Steiner *explicitly* makes the association; resist inventing a one-to-one organ/hierarchy table.
5. Extend source-linked review to the remaining 46 subdomains; keep broad GA source pointers at lead status until exact passages are read.
6. Perform additional independent review and a real accessibility audit before any public hosting.

**Completeness boundary:** This is a significant, verifiable development iteration, not a complete concordance of Steiner's thousands of lectures. No automated background work is promised or implied.

## Additional research-integrity improvement: identify duplicate source views

After the organ reader was integrated, the primary-source guide gained a [partial source-view identity registry](../research/known-source-view-aliases-v1.json). Its **two confirmed event groups** label two pairs of web pages as alternate views of one original lecture: GA313 IX / GA315 VII (18 April 1921 afternoon) and RSP1972 / SOL of GA317 VIII (3 July 1924). The guide displays a clear warning and retains both original source links. The source-event validator and Chromium tests check this functionality.

The registry deliberately **does not** declare the remaining source-page records unique. The Atlas keeps a source-page count, a source-view coverage count, and a confirmed alias-event record as different metrics. This prevents double-counting a source re-edition as independent spiritual-scientific corroboration.

## Later phase18 concurrent research fully incorporated

After this report's initial phase17 integration, another research commit completed the remaining six GA315 English source views. The [current GA315 phase18 findings](ORGAN_CONCORDANCE_PHASE18_FINDINGS.md) and [latest resume](ORGAN_CONCORDANCE_RESUME.md) supersede the phase17 statistics above: **33 completed English-numbered source views**, **1 thematic**, **0 selected-only**, **27 unread** of 61 catalogue entries; **854 numbered source units** (five in GA315 VI are heading/other-speaker units) plus the separately tracked GA317 XI table. The Organ Concordance Explorer and CI now read the **v18 corpus ledger and 32-dossier collection**. The broad Atlas graph has **227 edges across 64 source-page records**. Earlier GA317 VIII RSP translation checks remain supplementary—not an extra source event or another complete English review. Next audit: remaining GA314 and GA316 sources.
