# Chronology Explorer — Single Transforming Half-Wheel POC v3

**Implementation date:** 16 November 2026  
**Live route:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-dial.html  
**Research document:** [Steiner Hierarchical Chronology v0.1](STEINER_HIERARCHICAL_CHRONOLOGY_MASTER_V01.md)  
**Data:** [Source-linked 204-entry research index](../research/steiner-hierarchical-chronology-events-v01.json)

## Why the interface changed

The approved hand-drawn concept is **not a full wheel made from rings**, and it is **not two wheel views**. It is a *single half-wheel of spokes* with the hub near the left side of the canvas. The wheel itself conceptually has 360 degrees, but only the right-facing semicircle is shown. Dragging it rotates all spokes so those hidden on the left become visible on the right.

**Long main spokes** belong to the current level: cosmic conditions, great Earth epochs, cultural periods, or individual research events after successive zooms. **Short subsidiary spokes** between them give a labeled preview of the children of the currently focused main spoke (up to five at a time to maintain legibility).

Clicking a main or subsidiary ray that has children **replaces the rays on the same wheel** with those children, now promoted to long/main spokes. There is no second or inset visualization. A terminal research-event ray opens its information in the adjacent panel while keeping the current level visible. The information panel exists at every level and never contains a duplicate wheel.

## Controls and interaction

- Touch/mouse drag rotates the wheel by its angular change around the hub; click/tap only opens a ray when movement stayed below the drag threshold.
- Rotate-left and rotate-right buttons and keyboard left/right arrows rotate without changing level.
- Explicit **Zoom in (+)** enters the currently selected major ray or the highlighted next-level preview when available. **Zoom out (−)** returns to the immediate parent.
- Breadcrumbs navigate directly to ancestral levels, and **Return to whole cycle** resets the zoom.
- Keyboard Enter/Space activates focused ray; Escape/Backspace zooms out.
- The browser URL hash identifies a selected node for sharing/bookmarking.
- All ray labels remain horizontal (rather than rotating with the dial), with abbreviation only if needed to fit. Full titles appear in accessible names, source information and the supplementary label list below the wheel.
- Responsive geometry is recalculated for narrow screens, maintaining the same *half-wheel with one hub* instead of a shrunken full wheel.

## Source and hierarchy audit

- Cosmic-condition root: exactly **7** main intervals.
- Earth: exactly **7** formal great Earth epochs.
- Post-Atlantean: exactly **7** cultural periods.
- A total of **154** passage-linked research records are staged under those formal chronological branches.
- The remaining **50** research entries (including the six Earth-wide CH-5 statements and CH-1, 17, 20, 24–27 strands) are accessible as collapsed contextual research in the relevant information panel. These are *not* inserted as extra formal Earth epochs merely to make every item a spoke.
- The dataset and source links are not copied into the interface. The page reads its existing canonical JSON from \`../research/steiner-hierarchical-chronology-events-v01.json\`, currently containing 204 records and 34 source-register records.

A ray's length is a **categorical representation of hierarchical scale**, not the claimed age in years. Main and subsidiary ray widths are design priorities, not a quantitative assessment of the relative importance of spiritual beings. The seven cosmic stages are attributed to Steiner, not scientific astronomy. Past and future stages (including approximate cultural dates) are esoteric teaching and predictions, not established chronology. Keep original-language reviews and source flags in ongoing research.

## Validation and publication

- HTML control IDs vs JavaScript references checked; no missing bindings.
- JavaScript syntax checked.
- Model graph checked: 7 / 7 / 7 and all 204 research items accounted for without inventing extra epochs.
- One half-wheel SVG, and **no duplicate zoom-wheel inset**.
- Existing site links already route to \`atlas/chronology-dial.html\`; no additional homepage navigation change is required.
- Changes to the wheel's HTML/CSS/JS are eligible for the existing selective automatic Pages publication on a normal main-branch commit. Do not add new workflows or scheduled jobs.
- Publishing **must be confirmed from the run status**; a commit alone is not deployment evidence.

## Next iterations after visual approval

1. Mobile/desktop visual review with actual screenshot inspection for collisions and touch fidelity.
2. Full source audit for remaining chronological subdivisions, with alternate translations and exact paragraph cues.
3. Source-backed agent/category ontology and cross-era overlays, separate from hierarchical interval coloring.
4. Continuous animated zoom easing and selective historical duration cues *only where evidence supports dates*.
5. Optional lens for separate recurring individual-life cycles without confusing these with once-only cosmic epochs.
