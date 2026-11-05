# Rudolf Steiner Atlas — Organ Research Presentation Blueprint

**Design decision:** Integrate the organ concordance as a navigable, progressively disclosed learning experience inside the existing Rudolf Steiner Atlas, not as a standalone PDF/website or a dump of atomic claims.

**Prepared:** 5 November 2026, against **research phase 29**. This is an implementation design, **not** a claim that the proposed interfaces or the full concordance are implemented. Canonical research: [current checkpoint](ORGAN_CONCORDANCE_RESUME.md), [v29 findings](ORGAN_CONCORDANCE_SESSION_V29.md), [v29 manuscript](Steiner_Organ_Evolution_Research_Atlas_v29.md). Existing interface: [Organ Concordance Explorer](../atlas/organs.html) and [Hierarchy–Stage–Function Explorer](../atlas/agency.html).

## 1. Product promise and boundaries

A reader should be able to:
1. **Understand** a subject quickly in clear prose, without requiring prior knowledge.
2. **Explore** the details, see relationships and compare accounts from different Steiner sources.
3. **Verify** a claim at the exact original lecture/chapter and inspect qualifications, alternate German wording, and unresolved comparisons.

Content must use Steiner's works for attributed doctrinal substance; explanations and visualizations are **our original editorial work**. Link to RS Archive instead of mirroring lecture bodies. Never present historical esoteric cosmology, asserted pathology, diagnosis, therapy or disability explanations as scientific/clinical fact.

Maintain canonical Steiner taxonomy IDs and the dedicated \`infinix8/rudolf-steiner-atlas\` repository; do not mix BOTA materials into the canonical Steiner evidence corpus.

## 2. Proposed navigation (all views of the *same* evidence)

- **Learn:** thematic entrance pages with plain-language explanations and guided paths, e.g. "How did the human body develop?" and "Why does the human I work on an inherited organism?"
- **Human being:** 40 existing organ/organization dossiers, then more as verified; each page presents coherent teaching, an organ timeline, organization/member associations and passage evidence.
- **Cosmic evolution:** Old Saturn → Old Sun → Old Moon → Earth → future conditions, with separate subviews for Earth's recapitulations, modern planetary correspondences and anthroposophical spiritual stages. Do not collapse these into one timeline.
- **Spiritual beings:** stage × named hierarchy/agency × precisely stated action × target. No automatic "exclusive builder of organ" labels.
- **Connections:** scoped graph focused on a current organ, stage, member, or question; edge type and exact source remain visible.
- **Primary sources:** GA/date/genre/edition, source-view aliases, exact passage cues, German crosschecks, observed conflicts and audit coverage.
- **Research mode:** complete passage concordance and open questions, available but not used as the default beginner view.

These are independent navigation paths over one set of source-qualified claims, not competing editorial copies.

## 3. A reusable organ page: proposed reading sequence

**Hero:** "Heart — in Steiner's account of bodily and spiritual evolution"; 80–130-word plain-language orientation, 2–4 key takeaways, clearly labeled *Steiner's teaching*.

**1 · The big picture (2-minute explanation):** one coherent narrative distinguishing claims of physical anatomy, the prospective organ-rudiment, current function, spiritual analogy and future development. An optional glossary exposes terms such as etheric body, astral body and I without losing the reader's place.

**2 · Evolution journey:** visual cards or horizontal timeline; tap a stage to reveal what was asserted to develop, by which agency (if named), the sense of "development", and source evidence. Clearly distinguish an earlier condition from a later recapitulation.

**3 · What works through this organ?** a matrix of physical / etheric / astral / I roles when supported, with honest blanks where nothing relevant has yet been checked. "No verified entry" is a research-status label, not a Steiner claim.

**4 · Beings and activities:** role-specific rows: donation, organization, metamorphosis, preservation, guidance, etc. Separate *named being*, *inferred association*, *cosmic sphere*, and *symbolic direction*.

**5 · Connections:** interactive ego-network linking heart to blood, rhythm, sleep, the I, Sun, creative life, etc. Only show links found in the typed research graph and claim ledger; group unsupported links as clearly labeled questions, never as verified edges.

**6 · Compare passages:** present excerpts as **brief editorial paraphrases**, source/date on each row, plus "compatible / different context / apparent conflict / not yet compared". Include historical chronology and German terminology where actually checked.

**7 · Deep research:** filterable claim table with source link, paragraph, GA, temporal setting, organ, relation type, review status, German status and uncertainty. Open questions at the end.

**8 · Keep learning:** next guided topics and exact source links; reader can move from any detail to a parent concept or related dossier.

### Minimum mobile layout

\`\`\`text
[Atlas] [Search] [Menu]
Home > Human being > Organs > Heart

HEART
Steiner's account · Not clinical advice
[2-minute overview]   [See sources]
[Short orientation / key ideas]

[Learn] [Timeline] [Connections] [Evidence]

Cosmic / evolutionary timeline
  Old Saturn — claimed rudiment [source]
  Old Sun    — compare context   [source]
  Old Moon   — not yet certified [state]
  Earth      — recapitulation    [source]

How this relates to the human I
  [plain-language explanation]
  [Read the exact passage]

Related: blood · breath · rhythm · spiritual beings

Sources / conflicts / German / methodological caveats
\`\`\`

This mockup is a *structure*, not a source-verified chronological assertion that every displayed stage contains a heart-specific teaching. Only reviewed propositions can populate stage cells.

## 4. Example editorial treatment: heart development (qualified)

Use two distinct cards, never a single undated sentence "the heart originated on X":

- **Earlier planetary embodiment:** GA 110 IX §8 discusses a heart rudiment in the Old Saturn frame. See [original GA 110 IX](https://rsarchive.org/Lectures/GA110/English/SOL/19090418a01.html).
- **Earth recapitulation:** GA 102 V §§21–24 discusses a heart disposition in the Earth's replay of prior conditions; it is not the mature anatomical heart. See [original GA 102 V](https://rsarchive.org/Lectures/GA102/English/SOL/19080316p01.html).

A compare module should state that these are **different temporal settings**, not infer a resolution of every organ-genesis question. The source pointers are already captured in the v29 findings. Keep organ/biomedical science visually separate from Steiner's historical attributions.

## 5. Evidence-to-presentation architecture

Current source assets:
- \`research/organ-current.json\` (phase-aware pointer manifest)
- \`research/organ-comparative-dossiers-v29.json\` (40 dossier records and versioned refinements)
- \`research/knowledge-graph-v1.json\` (typed knowledge relationships)
- \`taxonomy/taxonomy-v1.json\` (stable concept/domain IDs)
- Phase-specific ledgers, atomic candidate claims, source-view checks, and textual issues
- \`atlas/organs.html\` + \`atlas/organs.js\` (currently annotation-first)
- \`atlas/agency.html\` + \`atlas/agency.js\` (currently matrix-first)

**Do not ask the browser to manufacture polished prose from raw claim fragments.** Author a separate, reviewed presentation layer that links to canonical evidence IDs. Proposed new files:

- \`research/organ-atlas-guides-v1.json\`: human-edited plain-language guide sections keyed by stable dossier ID; each substantive section contains \`evidence_ids\`, source cues and editorial review state.
- \`research/organ-atlas-comparisons-v1.json\`: explicit pairwise source comparisons (same context, different context, overlap, apparent conflict, unresolved) with participating source records and reasons.
- \`research/organ-atlas-paths-v1.json\`: guided questions, prerequisites, next steps and canonical taxonomy/organ links.
- \`research/organ-atlas-visuals-v1.json\`: **diagram specifications referencing evidence** rather than free-form untraceable illustrations.
- \`tools/build_organ_atlas_data.py\`: normalized read model from phase-specific canonical records; never silently flatten unknown review statuses or event aliases.
- \`atlas/organ-detail.html\` + matching JS/CSS: a reusable dossier page; maintain compatibility and old deep links from \`organs.html?organ=organ-heart\`.

Illustrative guide record shape (proposal, not imported research):
\`\`\`json
{
  "dossier_id": "organ-heart",
  "title": "Heart",
  "summary": "Reviewed editorial introduction goes here",
  "sections": [{
    "id": "development",
    "heading": "How its organization develops",
    "body": "Reviewed explanation goes here",
    "evidence_ids": [],
    "editorial_status": "draft"
  }],
  "related_taxonomy_ids": [],
  "related_dossier_ids": [],
  "editorial_status": "draft",
  "reviewed_on": null
}
\`\`\`

Only publish substantive assertions as **reviewed** when links are resolvable to checked source records. Preserve stable source/evidence IDs. If legacy records lack stable claim IDs, add migration/alias maps rather than rewriting their historical identities.

### Pipeline

Primary Steiner original → paragraph/lecture audit → atomic source-qualified proposition → normalization and cross-volume comparison → **curated interpretation and explanation** → referenced visualization specification → static site → browser and source-integrity tests.

Every stage keeps provenance. A new GA lecture may add evidence without automatically rewriting an existing explanation; changed interpretations require editorial review.

## 6. Visual-design language

- Calm, legible editorial typography and spacious information hierarchy, closer to a scholarly illustrated atlas than a dashboard.
- Use **one consistent visual grammar** for cosmic stages, organ organizations, agents, and evidence status. Do not use a colored decorative badge to imply validity.
- Visually distinguish *directly attributed claim* from *editorial synthesis*, *source comparison*, and *research gap*.
- Use responsive, accessible SVG diagrams, short captions, keyboard-focus states, mobile-friendly cards and reduced-motion handling. All diagram meaning is available as a text/table alternative.
- Expandable details prevent intimidating walls of research records.
- Gentle progressive disclosure: 2-minute → 15-minute → full concordance.
- Diagram types: stage trajectory, organ/body map with clearly schematic labels, hierarchies-by-activity matrix, local relationship graph, source chronology, side-by-side contradiction compare.
- The Atlas's default diagrams should be internally sourced, not generic anatomical photographs or AI-generated explanatory diagrams purporting to prove claims.

## 7. Interaction rules

- Clicking a stage filters the displayed cited claims, not an invented narrative.
- Clicking a hierarchy reveals the specific attributed *action* and context.
- Clicking a source opens the **original RS Archive page** with clear source location, avoiding wholesale mirroring.
- Search supports synonyms, German terms and source GA numbers while preserving non-equivalence.
- All displays must be useful without interactive JS whenever practical (fallback links/summary text).
- Shared canonical IDs and deep links let a learner move from the general Atlas to an organ, then to original evidence, then back again.

## 8. Acceptance criteria

**Research validity:** Every nontrivial claim has source evidence and exact cue; original paraphrase; stage, relation, agent, genre, historical date and status are not conflated. The phase-29 remaining work is **not** marked complete. German checks, source aliases and apparent conflicts survive migration.

**Content quality:** First page offers a readable orientation, meaningful examples, glossary, synthesis across sources, and nuanced comparisons—more than a list of citations. Editors can identify unsourced inferences.

**Usability:** Desktop/mobile, keyboard-only, screen-reader headings/labels, contrast and zoom/reflow tests, diagram text equivalents, stable deep links, and search states for gaps.

**Engineering:** Source pointers resolve; all evidence IDs exist; no duplicate event counting; all 40 dossiers stay accessible; existing graph/agency/taxonomy pages keep working; JSON schema validation, link checks and Chromium smoke tests pass.

**Governance:** Prose/visual changes receive a changelog entry with source revisions; latest phase manifest is explicit; GitHub history preserves earlier text and interpretations.

## 9. Implementation sequence

**Milestone A — presentation-quality pilot (start here)**
- Build a **Heart** page with an excellent 2-minute overview, separate Old Saturn/Earth-recapitulation source cards, precise source references and a compact visual timeline.
- Add **Liver** as a deliberately different example: Jupiter *analogy* versus liver–gall/I, inward sense for nourishment, relation to childhood head and water element. Never fuse these distinct predicates.
- Reuse existing dossiers. Include an explicit "insufficient evidence" state, unresolved comparisons, and deep links.
- Test both as complete learner journeys on mobile and desktop.

**Milestone B — reusable, source-backed system**
- Introduce guide schema, evidence resolver, controlled legend, organ-detail renderer, breadcrumbs, search/filter and study paths.
- Migrate all 40 dossiers to browseable presentation shells while only publishing substantive reviewed prose where supported.
- Improve organ↔taxonomy↔graph↔source round-trips and automated QA.

**Milestone C — multi-perspective visual atlas**
- Cosmic evolution explorer with correct distinction between planetary embodiments and recapitulations.
- Role-specific hierarchy explorer; organ map and relationship graphs; compare two sources directly.
- GA/source chronology and a curated "best route to understand this" reader flow.

**Milestone D — research continuously enriches the Atlas**
- GA107 and wider audited sources flow into normalized evidence; reviewed guide text and visuals are updated selectively.
- Maintain a "What's newly learned?" page with links to changed guides and open questions.
- Expand independently reviewed, German-collated records without pretending all other entries are complete.

**Milestone E — polish & release**
- Independent critical-source review, mobile/tablet/desktop tests, accessibility audit, crosslink and original-source QA, deployment strategy, performance optimization and versioned release.

## 10. First development ticket

**Deliverable:** \`atlas/organ-detail.html?organ=organ-heart\` and analogous liver route, with genuine source-linked guides, 2-minute/15-minute/source tabs, stage/role differentiation, local related links, and visible evidence-status explanations. Preserve \`atlas/organs.html\` as directory/search. First prove understanding with two exceptional pages rather than mechanically auto-generating 40 shallow summaries.

**Next action:** implement the heart/liver pilot on a feature branch, add data and visual tests, then merge a validated version; do not replace or truncate the v29 cumulative manuscript or prior evidence files.
