# Rudolf Steiner Atlas

A source-grounded, evolving thematic atlas of the **teachings of Rudolf Steiner**, designed to be navigable from broad domains through individual concepts to exact passages in his writings and recorded lectures.

> **Current status (3 November 2026):** Active source-linked Atlas with organ concordance through phase 17. The taxonomy remains a working editorial classification, not Steiner-authored headings; GA volume references alone are research leads, not passage verification. The original lecture and book texts remain on the archive sites.

## Current scope

- Six major regions, 26 thematic domains, 150 subdomains, 785 concepts and 39 further-detail entries (first-pass totals).
- 30 conceptual crosslinks maintained independently of the primary knowledge tree.
- Versioned Markdown, JSON and OPML taxonomy and Mermaid/SVG mind maps.
- Primary-source editorial method, research roadmap and validation tooling.

### Six top-level regions

1. Knowledge, Method, and Spiritual Development (domains 01–04)
2. Cosmos, Spiritual Realities, and Destiny (05–08)
3. The Human Being, Mind, and Biography (09–12)
4. Christ, Religion, and Civilizations (13–16)
5. Science, Healing, Education, and Society (17–21)
6. Art, Architecture, Ritual, and Anthroposophical Life (22–26)

![Mind map overview](assets/mindmaps/overview.svg)

## Browse the project

| File | Use |
| --- | --- |
| [Full taxonomy](taxonomy/taxonomy-v1.md) | Read the complete thematic outline |
| [JSON taxonomy](taxonomy/taxonomy-v1.json) | Canonical structured data and crosslinks |
| [OPML taxonomy](taxonomy/taxonomy-v1.opml) | Mind-mapping outline interchange |
| [Editable Mermaid mind map](assets/mindmaps/overview.mmd) | Diagram source |
| [SVG mind map](assets/mindmaps/overview.svg) | Scalable overview |
| [Source method](docs/SOURCE_METHOD.md) | Evidence and editorial standards |
| [Roadmap](docs/ROADMAP.md) | Research and HTML development phases |
| [Content model](docs/CONTENT_MODEL.md) | Node IDs and source-aware records |
| [Workflow](docs/WORKFLOW.md) | GitHub development process |

## Sources and editorial scope

Substantive teaching entries are based only on **Steiner's own books, writings, recorded lectures and directly attributable artistic work**. Bibliographic catalogues are permitted to identify primary materials; later anthroposophical authors are not substituted for Steiner's teachings.

GA numbers alone **do not verify** a claim's presence in an exact lecture. Preserve differences between authored books, recorded lectures and editorial compilations, and record translation and attribution uncertainties. Steiner's spiritual-scientific, historical and empirical claims must be identified as his positions rather than presented as independently established facts. See [SOURCE_METHOD.md](docs/SOURCE_METHOD.md).

Principal archives: [Rudolf Steiner Archive](https://rsarchive.org/), [GA volumes](https://rsarchive.org/Volumes.html), [official Complete Works catalogue](https://www.rudolf-steiner.com/en/edition-englisch/complete-works/).

## Quality control and future work

Run `python tools/validate_taxonomy.py` to check stable IDs and crosslink integrity. The next major research milestone is a **GA-by-GA primary-source corpus audit**, followed by passage-level concept records and an interactive HTML atlas.

## Rights

The taxonomy, notes and diagrams are an original working classification. Original Steiner texts and translations may carry separate copyright restrictions; do not copy substantial external text into the repo without assessing rights. This project has no general license at present.

## Companion architecture and prototype

**This is a conceptual index over the archives, not a second text archive.** RS Archive remains the destination for Steiner's writings and lectures; the Rudolf Steiner Archiv in Dornach provides the Complete Works bibliographic framework. The Atlas adds fine-grained classification, stable concept IDs, cross-domain routes, controlled term search and graded source references. [Read the architecture and non-duplication rules](docs/COMPLEMENTARY_ARCHITECTURE.md).

[Run the static atlas prototype](atlas/README.md): from the repository root run `python -m http.server 8000` and open `http://localhost:8000/atlas/`. It is committed but **not yet deployed** as a public website.

**Current research:** 1,006 nodes, eight editorial routes, 14 links back to RS Archive subject lists, 41 alternative search phrases, 19 earlier located gateway records, three comparison models, and automated integrity checks. [See source coverage and gaps](docs/SOURCE_COVERAGE_2026-11-01.md).

## Passage-linked knowledge graph · iteration 2026-11-02

The [knowledge graph explorer](atlas/graph.html) is a second, evidence-first navigation mode. It currently contains **142 typed relationships from 30 Steiner primary-source pages**, including **60 cross-domain connections**, and distinguishes paraphrases of selected checked passages from source-comparison judgments. It links directly to the original archive without rehosting source material.

- [Graph methodology, evidence levels and source URLs](docs/KNOWLEDGE_GRAPH_METHOD.md)
- [Reproducible graph coverage audit](docs/KNOWLEDGE_GRAPH_COVERAGE.md)
- [Original graph dataset](research/knowledge-graph-v1.json)
- [Reconciliation of 30 earlier hypothetical crosslinks](research/legacy-crosslink-audit.json) — 4 directly source-matched, 1 supported only at a narrower descendant level, 25 with no matching passage-level evidence
- [Work completed and further limitations](docs/ITERATION_2026-11-02.md)

Run locally with `python -m http.server 8000` and open `http://localhost:8000/atlas/` (concepts), `/atlas/graph.html` (evidence network) or `/atlas/sources.html` (source guide). The site has not been publicly deployed.

## Iteration 4 — stronger research breadth and reproducibility

- Graph relationships now reach all **26 thematic domains** (not all individual concepts).
- [Find original source works](atlas/sources.html) by GA, date, title, domain and source type; links lead outward to the archive.
- All **974 named taxonomy entries** are checked against JSON, Markdown and OPML so stable IDs remain consistent.
- [Desktop/mobile Chromium smoke tests](tests/atlas-browser-smoke.mjs) and [GitHub Actions](.github/workflows/browser-smoke.yml) cover concept search, graph filtering and source discovery.
- [Iteration report](docs/ITERATION_2026-11-02_EXPANSION.md) and [current domain coverage](docs/KNOWLEDGE_GRAPH_COVERAGE.md) describe completed work and open gaps.

## Source-focused depth · Iteration 5

- **[Subdomain evidence coverage](atlas/coverage.html)** distinguishes 40 subdomains with direct graph evidence, 39 with related child-concept evidence only, and 71 still without source-linked relations; this is an editorial research metric, not a measure of Steiner's complete works.
- **[Original lecture chronology](atlas/timeline.html)** navigates dated talks separately from undated authored pages. It does not invent book publication dates or assert a complete historical development.
- **[Five source-linked research dossiers](atlas/dossiers.html)** connect difficult topics across books and lectures: human constitution, karma and biography, freedom and initiation, worldviews, and Goethean science/architecture. These are original analytical guides rather than copied primary texts.
- [Full 150-subdomain coverage inventory](docs/SUBDOMAIN_EVIDENCE_COVERAGE.md) with a reproducible generator and CI check.
- [Current development record](docs/ITERATION_2026-11-02_DEEPENING.md) covers additional exact passage references, honest gaps, QA and next steps.

The **original archives remain the only reading destinations for full texts**. No complete lecture/book content is hosted by this project. There is no public website deployment yet.

## Iteration 6 — deeper sources and contextual comparisons

- The graph now contains **179 passage-qualified relations** from **40 original Steiner pages**, including **78 cross-domain links**.
- **[Six context comparisons](atlas/trajectories.html)** connect original texts without assuming different presentation contexts prove doctrinal changes; each source record carries an exact external link and verified lecture dates only when known.
- The [subdomain evidence audit](docs/SUBDOMAIN_EVIDENCE_COVERAGE.md) now distinguishes **51 direct, 48 child-only, and 51 lacking graph evidence** among the 150 subdomains.
- The [graph explorer](atlas/graph.html) includes **eight coarse editorial relationship-family filters** in addition to 123 precise relation types and original passage evidence. [See family method](docs/RELATION_FAMILY_METHOD.md).
- [Original research and build record](docs/ITERATION_2026-11-02_CONCEPT_CONTEXTS.md) documents ten new sources and remaining open questions.

To run: `python -m http.server 8000` in the repository root, then visit `http://localhost:8000/atlas/trajectories.html`. The site has not been publicly deployed. **Steiner's original works stay at the existing archive.**

# Organ concordance research checkpoint — phase 12

Current organ research: [Phase 12 findings](docs/ORGAN_CONCORDANCE_PHASE12_FINDINGS.md), [coverage ledger v12](research/organ-corpus-ledger-ga313-317-v12.json), [organ dossiers v12](research/organ-comparative-dossiers-v12.json). GA 317 III–IV complete in English at numbered-section level; full bilingual exhaustive audit pending. Older phase records below retain their historical counts.

# Current organ research — phase 13

[Cumulative research manuscript v13](docs/Steiner_Organ_Evolution_Research_Atlas_v13.md) · [Exact continuation checkpoint](docs/ORGAN_CONCORDANCE_RESUME.md) · [Current coverage ledger](research/organ-corpus-ledger-ga313-317-v13.json) · [21 cumulative dossiers](research/organ-comparative-dossiers-v13.json) · [Phase 13 findings](docs/ORGAN_CONCORDANCE_PHASE13_FINDINGS.md).

Current coverage: 16 complete English numbered-section lecture reviews, 1 additional thematic sweep, 4 selected-only entries, 40 unread of 61. Full bilingual exhaustive certification remains zero. Earlier checkpoints below retain historical statistics.


## Current phase 14 checkpoint

[Findings](docs/ORGAN_CONCORDANCE_PHASE14_FINDINGS.md) · [Coverage](research/organ-corpus-ledger-ga313-317-v14.json) · [24 dossiers](research/organ-comparative-dossiers-v14.json) · [Confirmed lecture alias](research/organ-source-event-aliases-v14.json).

20 complete English catalogue source views, 1 thematic, 3 selected-only, 37 unread. GA313 IX and GA315 VII share one event; 494 source-view sections is not distinct-text coverage. Historical counts above retain their checkpoint meaning.

## Current phase 15 checkpoint

[Cumulative manuscript v15](docs/Steiner_Organ_Evolution_Research_Atlas_v15.md) · [Word edition](docs/Steiner_Organ_Evolution_Research_Atlas_v15.docx) · [Phase 15 findings](docs/ORGAN_CONCORDANCE_PHASE15_FINDINGS.md) · [Current coverage](research/organ-corpus-ledger-ga313-317-v15.json) · [25 dossiers](research/organ-comparative-dossiers-v15.json) · [Resume](docs/ORGAN_CONCORDANCE_RESUME.md).

22 complete English catalogue source views, 1 thematic, 3 selected-only, 35 unread. The 546 completed source-view sections include the GA315 VII alias. Phases 14–15 add 151 section reads and 79 selected propositions across five events; globally unique teaching count remains unknown. Full German/exhaustive second-review certification remains zero. Earlier checkpoint counts above are historical.

## Organ Concordance and primary-text research (3 November 2026)

- **[Explore 29 comparative organ dossiers](atlas/organs.html)** in the new accessible local browser, including heart, lungs, liver, brain, bladder, uterus and other systems. The explorer distinguishes original comparative relations from later selected claim annotations and preserves source links and medical-evidence cautions.
- The corpus-level [phase-17 organ ledger](research/organ-corpus-ledger-ga313-317-v17.json) has **27 all-numbered-English-source-view reviews**, **1 thematic**, **3 selected-only**, **30 unread** entries, from **61 catalogued source views**. Numbered English source-view sections total **696**, plus a separately tracked unnumbered table. Counts are **source views**, not necessarily unique lecture events.
- [GA317 VIII phase-16 selected alternate-English reading](docs/ORGAN_CONCORDANCE_PHASE16_FINDINGS.md) remains as a separate source-critical supplement, noting **two numerical English/German discrepancies**. The [phase-17 continuation](docs/ORGAN_CONCORDANCE_PHASE17_FINDINGS.md) later completed the numbered English GA317 VIII–XII audit; the same VIII lecture must not be double counted.
- The current broad [knowledge graph](research/knowledge-graph-v1.json) contains **218 source-qualified relationships** across **58 source-page records**. Because some pages are alternate versions of a single lecture, page counts must not be interpreted as independent corroborations.
- The [150-subdomain coverage report](docs/SUBDOMAIN_EVIDENCE_COVERAGE.md) distinguishes **53 direct**, **51 descendant-only**, and **46 without graph-attached evidence**. This is a research workflow measure, not corpus completeness.
- [Current integration report](docs/ITERATION_2026-11-03_ORGAN_INTEGRATION.md) and [live resume checkpoint](docs/ORGAN_CONCORDANCE_RESUME.md).

All attributed spiritual, therapeutic, biological and parental-causation claims are historical material, not established medical science or individualized treatment guidance.

### Source-view identity (important for research accuracy)

The [Source Guide](atlas/sources.html) now identifies **two confirmed groups of alternate views of one original lecture**. The [partial event registry](research/known-source-view-aliases-v1.json) identifies the shared **GA313 IX / GA315 VII** afternoon event and the shared **GA317 VIII RSP1972 / SOL** event. The 58 source-page records are *not* an independently verified count of distinct original lectures. The remaining pages have not all been checked for identity overlap; do not subtract two duplicates and call the result a complete event census. [The original source-event crosswalk](research/organ-source-event-aliases-v14.json) retains detailed section alignment for the first group.
