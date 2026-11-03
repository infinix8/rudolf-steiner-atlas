# Organ concordance continuation checkpoint Version 24

Updated 3 November 2026. Current cumulative manuscript is Version24, 42,089 words, 77 Word pages. Read this checkpoint and the current ledgers before selecting new work. Historical checkpoints remain in Git history and in the preserved cumulative manuscript.

## Exact next original source

**GA128 Lecture V, 24 March 1911, Prague, §1**

https://rsarchive.org/Lectures/GA128/English/SOL/19110324p01.html

No section of V was newly reviewed in phases20–24. Start at §1 and read the entire available English source; then VI (26 March), VII (27 March), VIII (28 March). Older GA128 thematic notes or selected references do not substitute for a complete source-view audit. Initial lectures explicitly defer qualifications to the rest of the course.

## Authoritative current files

- `research/organ-corpus-ledger-ga313-317-v24.json`: all61 catalogue source views English-complete, 59 numbered views and two unnumbered views; 1,607 numbered units, 44 editorial blocks and one supplementary table. Zero unread, thematic-only or selected-only entries.
- `research/organ-corpus-ledger-ga128-v24.json`: eight events, I–IV complete English, 87 numbered units, V–VIII unread. Keep the eight-entry denominator separate from the fixed61.
- `research/organ-comparative-dossiers-v24.json`: 39 dossiers, all earlier fields/relations retained.
- `research/organ-evidence-graph-v24.json`: selected claim/dossier/reconciliation links.
- `research/knowledge-graph-v1.json`: 289 relationships and 96 source views. These are not independent-event or unique-teaching totals.
- `research/organ-atomic-claims-*-v20.json` through v24 and corresponding paragraph-review files: selected extraction after whole-English reading.
- `research/organ-german-checks-and-textual-issues-v20.json` through v24: 38 new selective checks; unresolved register retained.
- `docs/Steiner_Organ_Evolution_Research_Atlas_v24.md` and `.docx`: cumulative manuscript; provenance in `research/organ-manuscript-provenance-v24.json`.
- `docs/ORGAN_CONCORDANCE_SESSION_V24.md`, phase20–24 findings and `research/organ-session-results-v24.json`: exact new/reconciled counts and section totals.

## Certification boundaries

Complete English source-view reading is not exhaustive atomic extraction. Full original-German collation, exhaustive extraction and independent second review remain uncertified across the corpus. Selective German checks must not be reported as complete German lecture reviews. Catalogue aliases GA313 IX/GA315 VII, the alternate GA317 VIII edition, and five GA315 VI heading/Husemann units remain explicit. GA316-14 is a joint Steiner–Wegman circular; -16 is a personal meditation, not a recorded lecture.

## Corrections that must travel with reuse

GA314 entry6 SOL page repeats entry5’s body under a new title/date. The correct audited English source is MP1986 `19221027a01.html`, 38 editorial blocks; do not count duplicate SOL body as a second lecture or pretend these ordinals are printed sections. SOL/catalogue/MP location metadata remains unresolved.

Preserve late-twenties age correction (GA314-10 Palmer reply after §28), child’s mother/aunt correction (-16 §4), disappearing accessory-organ limitation (-16 §18), and beekeeper correction (GA316-01 §15). Original files remain historical evidence; corrections are additive.

Open comparisons: GA314-10 §15 versus -14 §21 arsenic cure scope; GA314-10 §23 inward/outward ear breathing; GA316-01 §§7–8 / -10 §10 / -15 §12 kidney intervention; changed ages in Kristiania poisoning story; GA314-16 §7 versus GA317-03 cramp mechanisms; sleep interruption/redistribution/inertia across prior and new sources; organ-surface activity versus pathological spiritualization; personal karma after puberty versus prior-life force effects in childhood. Never force agreement by changing the subject or bodily organization.

GA128 III’s meal-rhythm spleen account must retain IV §6’s explicit secondary-function qualification. Claimed supersensible persistence after splenectomy is not proof of physical regeneration in GA316’s rabbit account. Saturnian isolation, Old Saturn warmth and present planetary Saturn activity remain distinct explanatory settings. Pineal memory-forming and pituitary receiving currents must not be reversed. Galle requires contextual distinction between bile and biliary organ.

## Execute the next batch

Read all GA128 V–VIII English sections; record zero-claim contexts and other speakers. Extract atomic claims separately, with exact locations and genre/actor/temporal setting. Check consequential German passages and update dossiers/evidence links while retaining stable prior IDs. Mark any inaccessible source blocked and continue. After GA128, follow the workbrief’s wider sequence GA110,102,107,205,208,218. Keep incomplete bilingual/exhaustive work visible while broadening.

Run the nine checks recorded in the validation file, including `python3 tools/validate_organ_concordance.py 24`, graph/report checks and source aliases. The graph report is regenerated with `python3 tools/report_knowledge_graph.py --write`. Word pagination is rendering-specific; preserve every preceding Markdown byte when building the next cumulative edition. Commit at meaningful milestones and update issue14.
