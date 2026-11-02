# Organ concordance — current continuation checkpoint

Updated 2 November 2026 after phases 12–13. The original work brief remains in [WORK_TASK_COMPLETE_ORGAN_CONCORDANCE.md](WORK_TASK_COMPLETE_ORGAN_CONCORDANCE.md).

## Read these current records first

1. [Phase 12 findings](ORGAN_CONCORDANCE_PHASE12_FINDINGS.md) and [phase 13 findings](ORGAN_CONCORDANCE_PHASE13_FINDINGS.md).
2. [Current corpus ledger v13](../research/organ-corpus-ledger-ga313-317-v13.json): 16 English-complete numbered reviews, one additional thematic sweep, three selected-only entries, 41 unread; 395 sections in completed English lectures.
3. [Current dossiers v13](../research/organ-comparative-dossiers-v13.json): 21 organ/process dossiers, all older relations retained.
4. [German checks/corrections v12](../research/organ-german-checks-and-corrections-v12.json), [textual issues v13](../research/organ-german-checks-and-textual-issues-v13.json).
5. [Cumulative manuscript v13](Steiner_Organ_Evolution_Research_Atlas_v13.md). Its v11 body is preserved exactly, with an explicit current correction layer.

## Exact next full-English source

**GA 313 Lecture VII, 17 April 1921: start at §1.** Locate the English text through the GA 313 catalogue before marking any section reviewed. Continue VII–IX in sequence. No section in these lectures has been newly read in phases 12–13.

**Second sequence: GA 317 Lecture VI, 1 July 1924: start at §1.** Then proceed VII–XII. GA 317 V is dated **30 June**, not 29 June; do not infer dates by lecture ordinal.

The following priorities remain GA 315 V–VIII, the remaining GA 314/316 catalogue entries and then the wider GA corpus specified in the work brief. Query the v13 ledger for exact unread entries; do not reconstruct them from this summary.

## Unfinished work within English-complete lectures

- Full original-German collation, systematic sentence-level claim extraction and independent second review remain incomplete for every lecture. Zero certified exhaustive bilingual audits.
- Reconcile the sleep formulations across GA 317 III §3, GA 313 II §26 and III §5. Do not declare the apparent conflict resolved by analogy alone.
- Check printed editions for the GA 317 IV §4 formula, GA 313 VI §6 digital reading rendered as arm, and GA 317 V §5 diagram references.
- Check GA 313 V §16 phosphorus-process translation, §4 versus §21 bowel/I causal tension, and GA 317 V §26 editorial note provenance.
- Propagate the v12 correction layer whenever earlier v8/v9 claims are reused. Their stable IDs and historical files were preserved intentionally.
- The 63 provisional new candidates from this session are not a certified globally unique teaching count. Full cross-corpus deduplication remains outstanding.

## Verification and working tools

`python3 tools/validate_organ_concordance.py 13`

`python3 tools/validate_knowledge_graph.py`

`python3 tools/report_knowledge_graph.py --check`

`python3 tools/query_organ_concordance.py --organ liver`

The search tool covers 93 selected v12–v13 propositions and the cumulative dossiers; it does not claim to search the entire Steiner corpus. The main taxonomy graph has 191 edges and 46 primary-source pages; only 12 edges and six pages were added in this session. The organ evidence graph is a separate connected view, not an additional count of teachings.

Preserve all prior files. Never equate organ formation, present function, metamorphic analogy, symptom theory, sleep relation, inter-incarnation account and hierarchy agency. Medical and disability assertions remain attributed historical material, never diagnosis or treatment instructions.
