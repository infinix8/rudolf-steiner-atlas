# Visual Organ Atlas — Six Guided Organs Milestone
**Completed:** 6 November 2026  
**Repository:** [infinix8/rudolf-steiner-atlas](https://github.com/infinix8/rudolf-steiner-atlas)  
**Research baseline:** Organ Evolution Concordance phase 29

## Outcome

The illustrated Organ Atlas now supports six separately curated, eight-layer organ guides:

| Guide | Link | Selected original-source records | Editorial emphasis |
|---|---|---:|---|
| Heart | [Heart](../atlas/organ-detail.html?organ=organ-heart&layer=overview) | 7 | Rhythmic organization, rudiment/recapitulation, inward sense, warmth and conscience |
| Liver | [Liver](../atlas/organ-detail.html?organ=organ-liver&layer=overview) | 8 | Nourishment, inner Jupiter, liver–gall, will and head |
| Lungs | [Lungs](../atlas/organ-detail.html?organ=organ-lungs&layer=overview) | 9 | Breath, lung/heart rhythm, formative air, inner Mercury and claimed memory associations |
| Brain | [Brain](../atlas/organ-detail.html?organ=organ-brain&layer=overview) | 9 | Nerve-sense organization, thinking, I activity, developmental and cosmic interpretations |
| Kidneys | [Kidneys](../atlas/organ-detail.html?organ=organ-kidneys&layer=overview) | 8 | Filtration versus historical astral theory, balancing, inner Venus, head and temperament |
| Spleen | [Spleen](../atlas/organ-detail.html?organ=organ-spleen&layer=overview) | 5 | Meal/blood rhythm, inner Saturn, physical vs supersensible spleen, acknowledged gaps |

**Total:** 46 per-guide source-reference records across six guides. This count is *not* 46 distinct lectures or 46 independently verified German witnesses: some lecture events are repeated in different organ guides. These are selected source-linked editorial explanations, **not** an exhaustive concordance or independently certified medical/spiritual claims.

## What was built

### Reusable eight-layer organ page

All six guides use the same [visual page template](../atlas/organ-detail.html) and [renderer](../atlas/organ-detail.js). Every guide has:

1. At a glance (concise source-linked cards)
2. In the body (anatomy separated from Steiner's historical bodily theory)
3. Steiner's account (human members and differentiated alleged functions)
4. Evolution (typed timeline, with **research-gap** rather than invented cosmic stages)
5. Beings and roles (distinguishes named beings from human members, analogy and unspecified agency)
6. Connections (five-node interactive constellation, supported by source cues)
7. Original sources (GA number, dated lecture, selected cue and original archive link)
8. Open questions (German checks, actor ambiguity, clinical caveats, contradictions)

The original [Heart/Liver versioned guide data](../research/organ-atlas-guides-v1.json) remains intact; new content is **additive**, in [organ-atlas-guides-v2-expansion.json](../research/organ-atlas-guides-v2-expansion.json). The renderer loads both files, validates six unique IDs and checks that every cited local reference resolves.

### Anatomy locator policy

The existing licensed [DBCLS adult anatomy figure](ANATOMY_ARTWORK_ATTRIBUTION.md) remains the visual basis. Brain/Lungs now receive approximate highlighted body locations. The frontal illustration **does not depict Kidneys or Spleen separately**, so their detail pages show the artwork **without a false highlight**, explicitly say "not depicted", and explain true anatomical location in the **In the body** layer. The body map retains eight clear on-figure callouts and two explicit not-depicted links.

### Research-safe connections

Seven source-grounded edges now link the new guide explanations to related guided organ pages. Examples:
- Lungs → Heart (rhythmic/etheric context; GA 314)
- Lungs → Brain (head/lung formative analogy; GA 314)
- Brain → Liver and Spleen (GA 128 symbolic head–viscera correspondences)
- Kidneys → Brain (GA 314 childhood kidney–head interpretation)
- Spleen → Liver and Brain (GA 128 nutritional and occipital correspondences)

**These edges do not assert direct modern medical causation or common builders.** The relationship type and original passage remain visible.

## Evidence safeguards and particularly important distinctions

### Lungs
- GA 316, 7 January 1924, §7 concerns formative **air/sound** claims.
- GA 205, 2 July 1921, §21 gives a separate **earth-element** correspondence.
- GA 128, 23 March 1911, §13 uses an **inner Mercury** analogy, not physical astronomical origin.
- GA 317 medical claims concerning seizures, consciousness and astral/I "entrapment" are historical and unsupported by current clinical science.

### Brain
- Distinguish physically described brain from **whole-head** and nerve-sense organization.
- GA 317's theory of the brain **reflecting world-ether thoughts** is unvalidated neuroscience.
- GA 102's Old Moon group-soul activity is a broader wisdom-imprint image, not an exclusive named builder of modern brain tissue.
- Head–liver/spleen planetary-metal relations in GA 128 are symbolic correspondences.

### Kidneys
- **Inner Venus** in GA 128 is a planetary correspondence, not a statement that kidneys appeared on present Venus.
- GA 205's **air-element** affiliation is another relationship predicate.
- GA 315, 15 April 1921's therapeutic eurythmy claims are **not established treatments**; avoid turning these into kidney/urinary guidance.

### Spleen
- GA 128, 22 March 1911 discusses purported mediation between irregular food timing and steady blood rhythm.
- GA 128, 23–24 March 1911 distinguishes an **anatomical spleen** from alleged spiritual force patterns after splenectomy; this is not validated physiology and does not provide clinical advice.
- **Inner Saturn** is a present symbolic analogy, **not the Old Saturn stage of cosmic genesis**.
- Existing canonical `organ-spleen` dossier has no `relations` in the original high-level base list, but multiple phase24 and phase25 source-specific claims support a bounded GA 128 guide. It must not be described as exhaustively surveyed.

### Source methodology

Primary links are to [RS Archive](https://rsarchive.org/) with GA and cue. No bulk lectures were copied. Some original English sources have been inspected, but comprehensive German collation and independent second-pass audit remain unfinished. Source-linked ≠ doctrinally true, scientifically valid or complete.

## Implementation files

- `research/organ-atlas-guides-v2-expansion.json` — four versioned new curated guides.
- `atlas/organ-detail.js` — joins v1+v2 without replacing v1, dynamic 6-organ switcher, exact link resolution and sourced related-organ navigation.
- `atlas/organ-detail.html`, `atlas/organ-detail.css` — six-organ UI, ethical anatomical locator states.
- `research/organ-body-map-v1.json`, `atlas/body.html` — six guided routes, four index-only routes and eleven functional entry paths including comparison.
- `site/index.html` — six mobile-friendly study cards.
- `tools/validate_visual_organ_atlas.py` — six unique IDs, source existence, claim gaps, visual hotspots and comparison-source validation.
- `.github/workflows/publish-organ-atlas.yml` — single **manual-only** release checks for the new JSON; no auto-commit Action.

## Release discipline

**No deployment has been triggered for this milestone.** Publishing and browser smoke-test workflows remain **workflow_dispatch only**, to protect the previously exhausted monthly Actions allotment.

For the next planned public release, run **one** workflow:
[Publish Rudolf Steiner Atlas](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/publish-organ-atlas.yml)

Expected successful Pages route: [Open human-body map](https://infinix8.github.io/rudolf-steiner-atlas/atlas/body.html).

The expected URLs are not proof that this unreleased code is already live.

## Remaining work

1. Visually test six guides and ten anatomical navigation links at Android widths; tune labels, contrast and keyboard behavior based on actual screenshots.
2. Audit GA128/GA313–317 claims organ-by-organ in the original German, preserving speaker, source cue, epoch and context.
3. Expand curated guides for stomach, intestines, circulation/blood, pancreas, larynx and other better-evidenced organs; do not promote index-only items until content and sources are adequate.
4. Build reusable views for **system-level** organization (nerve-sense, rhythmic, metabolic-limb) separately from the organ anatomy overlay.
5. Improve graph-to-page evidence crosslinks; don't turn symbolic similarities into scientifically validated anatomical or historical causation.

**Preservation:** This UI milestone did not overwrite canonical organ dossiers, ledger files, original phase29 manuscript, taxonomy IDs or research checkpoint.
