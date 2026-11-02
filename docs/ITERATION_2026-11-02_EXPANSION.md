# Iteration 4 — comprehensive source-linked expansion (2 November 2026)

## Intent

The Atlas is a **discovery layer above primary-source repositories**, not a copy of the books or the existing archive subject index. This iteration emphasizes missing-domain coverage, better terminology distinctions, source-aware navigation and reproducible checks.

## Completed GitHub work

### Research scope
- Expanded the source-linked graph from **66 relations/13 source pages** to **116 relations/27 original source pages**.
- **51 cross-domain relations**, reaching all **26 thematic domains** (domain coverage is *not* comprehensive source coverage at the concept level).
- Added 14 exact original-source pages across GA 1, 2, 26, 36, 106, 112, 230, 235 (two), 275 (two), 279, 283, 321.
- Added relations with passage cues for karmic causality and biography, elemental beings and plant life, early mysteries and Christology, eurythmy and education/therapy, music and soul life, Michael and consciousness, Goethean morphology and architecture, plus observations of warmth in Steiner's approach to science.
- Source metadata tracks checked URL, relevant passages, work type, dates where applicable, translation edition where available, and explicitly states that translation comparison and complete-work review have **not** been performed.
- Revised the 30 historical hypothesis crosslinks: **4 exact matches**, **1 narrower descendant connection only**, **25 without corresponding passage-level evidence**.

### Classification corrections
- Renamed RS-09.03 to *Physical–etheric–astral grouping (not physiological threefolding)*, distinguishing it from RS-09.02.05's physiological nervous-sensory/rhythmic/metabolic-limb classification.
- Maintained all existing taxonomy IDs. Synced label changes across JSON, Markdown and OPML.
- Repaired two previously concatenated Markdown outline entries.
- Added `tools/validate_taxonomy_exports.py`, which checks 974 RS-prefixed node IDs and titles across the three exports.

### Discovery interfaces
- The [concept browser](../atlas/index.html) offers expandable taxonomy, search and outgoing source links.
- The [evidence graph](../atlas/graph.html) now filters by original source, domain, relation type, editorial/source-checked basis and text query.
- The [original-source guide](../atlas/sources.html) filters the 27 checked source pages by title, GA number, source kind, publication/lecture date and atlas domain, linking outward to original pages and inward to graph connections.
- The static website loads project-owned JSON. Original books, lectures and essays remain at their source archive.

### Reproducibility and QA
- `tools/validate_knowledge_graph.py` checks taxonomy endpoint IDs, source locations, relation types and source-audit fields.
- `tools/report_knowledge_graph.py --check` detects stale graph coverage records; [report](KNOWLEDGE_GRAPH_COVERAGE.md) documents graph exposure by domain.
- `.github/workflows/validate.yml` checks data and syntax, including JSON/MD/OPML agreement.
- `.github/workflows/browser-smoke.yml` uses modern Playwright and Chromium to exercise desktop and mobile concept search, graph filters, source-guide filters, and source outbound links.
- Initial smoke workflow required an updated Playwright version to support the current Ubuntu runner; successfully rerun after the update.
- Full accessibility audit, complete translation verification, exhaustive primary-source checking and public deployment are **not** complete.

## Research honesty

Even 116 edges is a small, carefully differentiated sample against the many books and lecture cycles in Steiner's collected works. `selected_passage_checked` means a selected passage has been reviewed for a concise attributed paraphrase, not that all surrounding passages, editions and translations agree. Source links are not scientific endorsements; historical medical and racialized teachings require particular contextual caution.

## Most valuable next iteration

1. Attach exact original passages to each of the remaining poorly linked subdomains, preserving source type and translation identity.
2. Extend direct (not merely editorially inferred) cross-domain relationships, especially to the 25 original proposed links still unsupported by matched source evidence.
3. Build chronological concept variations by lecture date, recording terminology and qualified contradictions without forcing them into a single summary.
4. Add source coverage indicators to the concept hierarchy and a browsable chronology of original source events.
5. Run accessibility audit with keyboard focus, contrast and accessible names; keep serving only static project-owned data.
6. Stabilize the source-register QA, then evaluate public hosting only after a separate decision.

All changes are committed to the dedicated GitHub repository; work proceeds during active iterations, not unattended in the background.
