> **Unified Atlas publication prepared (5 November 2026):** [Public Atlas URL](https://infinix8.github.io/rudolf-steiner-atlas/) · [Combined website homepage](site/index.html) · [Guided organ preview](atlas/mobile-preview.html) · [Full thematic Atlas](atlas/index.html) · [40-dossier organ explorer](atlas/organs.html). **One manual GitHub Pages release is required for the new combined homepage to appear live.** [Publish manually](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/publish-organ-atlas.yml). Both publication and browser tests are **manual-only**, to preserve GitHub Actions minutes. [Publishing guide](docs/ATLAS_PUBLICATION_GUIDE.md).

> **Current research status — Phase 27, 5 November 2026:** The canonical organ atlas now has a [cumulative Markdown v27 manuscript](docs/Steiner_Organ_Evolution_Research_Atlas_v27.md), [current source checkpoint](docs/ORGAN_CONCORDANCE_RESUME.md), [40 organ dossiers](research/organ-comparative-dossiers-v27.json), and a [source-grounded hierarchy/stage/action matrix](atlas/agency.html). GA313–317 **61/61** and GA128 **8/8** complete English source-view first passes; GA110 **8/12** (162 numbered English units). The full [knowledge graph](research/knowledge-graph-v1.json) has **342 qualified relations**, **107 source-page records**, and **225 cross-domain links**. **57 / 54 / 39** of 150 subdomains have direct / child-only / no source-linked evidence. This does not certify exhaustive extraction, unique events, full German collation, scientific validity or independent second review. **Next GA110 IX, 18 April 1909**.

# Rudolf Steiner Atlas

## Latest organ research checkpoint 3 November 2026

[Version24 cumulative manuscript](docs/Steiner_Organ_Evolution_Research_Atlas_v24.md) · [Word edition](docs/Steiner_Organ_Evolution_Research_Atlas_v24.docx) · [Session results](docs/ORGAN_CONCORDANCE_SESSION_V24.md) · [Exact resume](docs/ORGAN_CONCORDANCE_RESUME.md).

GA313–317: all **61 catalogue source views English-complete**, with 1,607 numbered units, 44 editorial blocks and one table. GA128: **I–IV English-complete**, 87 numbered units; V–VIII pending. **39 organ dossiers**, **289 graph relationships**, **96 source views**. Full bilingual, exhaustive atomic and independent review remain uncertified. Earlier checkpoint counts below are historical.


A source-grounded, evolving thematic atlas of the **teachings of Rudolf Steiner**, designed to be navigable from broad domains through individual concepts to exact passages in his writings and recorded lectures.

> **Status:** Foundation / taxonomy v1.0 (1 November 2026). This classification is a research-created working taxonomy, not a list of headings chosen by Steiner. GA volume references are often **research leads**, not verified passage-level citations.

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

## New: compare spiritual hierarchy agencies without inventing exclusive organ builders

- [Hierarchy–Stage–Function Explorer](atlas/agency.html): **23 source-linked rows** distinguishing reception of cosmic aims, planning, warmth-substance donation, formative/executive/preservative activities, symbolic zodiacal directions, named organ rudiments, and human I transformation. No row claims an exclusive builder of a modern anatomical organ.
- [Research methodology and findings](docs/ORGAN_CONCORDANCE_PHASE27_FINDINGS.md), [86 GA110 V–VIII English section cards](research/organ-paragraph-review-ga110-v-viii-v27.json), [47 selected candidate propositions](research/organ-atomic-claims-ga110-v-viii-v27.json), [six translation/interpretation issues](research/organ-textual-issues-ga110-v-viii-v27.json).
- [Current-version organ manifest](research/organ-current.json) drives the [Organ Concordance Explorer](atlas/organs.html), avoiding stale hardcoded dossier filenames. Latest cumulative Markdown [v27](docs/Steiner_Organ_Evolution_Research_Atlas_v27.md) preserves the full v24 manuscript text with phase25–27 research addenda. The DOCX version remains v24.
- [Phase27 research checkpoint](docs/ORGAN_CONCORDANCE_RESUME.md): next GA110 IX and X, followed by the two Q&A source entries. The 342 Atlas relationships are claims grounded in selected original text, **not** scientific corroboration or a finished Steiner corpus.
