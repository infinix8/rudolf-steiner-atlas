# Iteration record — 2 November 2026

## Goal

Turn the breadth-first classification into a **rigorously source-linked knowledge graph**, adding a navigable layer over the existing Rudolf Steiner Archive and the official Complete Works bibliography rather than copying original texts.

## Delivered and committed

- Reviewed selected original passages in **13 distinct source pages** (authored chapters and dated lectures) spanning GA 4, 9, 10, 13, 23, 110, 151, 170, 223, 293, 312 and 327.
- Created `research/knowledge-graph-v1.json` with **66 typed relationships**, of which **19 cross thematic domains**. Each edge has taxonomy endpoints, a specific relationship type, original brief editorial paraphrase, and source locator.
- Clearly distinguished **direct paraphrase of checked passages** from **editorial comparison** between two checked contexts.
- Added `atlas/graph.html`, `atlas/graph.js` and `atlas/graph.css`: filtered source/relationship graph, interactive node navigation, accessible evidence table, and direct links to original source pages.
- Integrated the checked graph into main concept pages, separate from the pre-existing editorial crosslinks.
- Audited all **30 initial hypothesis-only crosslinks**: **4 now have matching sourced edges; 26 remain unverified and explicitly provisional**.
- Added structural and provenance validation (taxonomy endpoints, source IDs, bibliographic dates, review status, safe external URL hostnames, original claim limits and reconciliation).
- Added a reproducible per-domain/source report and GitHub Actions checks to avoid stale reports.
- Preserved original source texts and translations at the source websites, without mirroring or automated crawling.

## Primary sources audited only in selected passages

GA 4 chapter I; GA 9 *The Essential Nature of Man*; GA 10 opening chapter; GA 13 cosmic evolution chapter; GA 23 chapter II; GA 110 Lecture V (14 April 1909); GA 151 Lecture Three (22 January 1914); GA 170 Lecture Eight (13 August 1916); GA 223 Lecture I (31 March 1923); GA 293 Lectures VII (28 August) and XIV (5 September 1919); GA 312 Lecture I (21 March 1920); GA 327 Lecture IV (12 June 1924).

See [methodology and exact original links](KNOWLEDGE_GRAPH_METHOD.md) and [coverage](KNOWLEDGE_GRAPH_COVERAGE.md).

## Important research boundaries

- **66 edges are not a fully exhaustive map of Steiner's writings.** The existing 1,006-node taxonomy remains a breadth-first draft, and only a subset has evidence-linked relationships.
- Review means a **selected passage** was read, not a complete book, lecture cycle or translation comparison. The graph does not establish independent scientific or historical validity.
- A known taxonomy hazard `RS-09.03` ("threefold bodily nature" but its children denote physical/etheric/astral) still requires an ID-preserving correction across all exports.
- Relation types are a precise description of the editor's reading. Subsequent source reviews may refine, qualify or retract them.
- Interface code passed automated structure/syntax checks, but has not undergone a full visual, keyboard, and responsive browser audit; it is not publicly deployed.

## Next highest-value research

1. **One subdomain at a time:** attach exact original chapters and dated lectures for the remainder of 150 subdomains, not GA-volume landing pages.
2. Expand from the initial source concentration toward domains of karma, nature kingdoms, Christology, cultural history, arts, language and architecture with careful source provenance.
3. Audit the 26 legacy crosslinks still unsupported by exact matching passage-based relations, avoiding semantic inflation.
4. Build versioned terminology and conceptual-difference records, including translation variants and chronological shifts.
5. Audit and correct taxonomy ambiguities in Markdown/JSON/OPML together, preserving canonical IDs.
6. Run a true-browser test and improve graph filters for source status, epoch, and relation types.

This is a self-contained completed iteration. Further changes happen during future active work, not unattended in the background.
