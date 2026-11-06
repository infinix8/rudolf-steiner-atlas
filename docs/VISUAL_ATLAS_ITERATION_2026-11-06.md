# Visual Atlas iteration — 6 November 2026

**Repository:** [infinix8/rudolf-steiner-atlas](https://github.com/infinix8/rudolf-steiner-atlas) · default branch `main`.

## Product direction

Make the Steiner Atlas a progressively explorable illustrated learning environment. Keep the complete research ledgers, uncertainties and original sources available underneath, but lead with clean maps, short comparisons, filtered diagrams and a source-first path to depth. Do **not** confuse an illustration with evidence about spiritual origins or with medical science.

## Changes completed

### A. Anatomical body map: corrected callouts

**Changed:** `atlas/body.html` and `research/organ-body-map-v1.json`.

- Kept the DBCLS CC BY 4.0 adult anatomy illustration ([artwork credits](ANATOMY_ARTWORK_ATTRIBUTION.md)).
- Replaced the large circular numbered badges that covered the drawing with **six thin-leader, labeled organ callouts**: brain, lungs, heart, liver, stomach, intestines.
- Moved the annotated target coordinates into the visible organ areas of the 600×1000 source illustration, referencing the Wikimedia/DBCLS image preview. The coordinates are **editorial approximate guides**, still to be verified against a real Android screenshot.
- **Kidneys and spleen are not depicted separately in the licensed frontal plate**. They remain fully reachable via clearly labeled extra links and the searchable list; they are no longer falsely pinned to other abdominal organs.
- Maintained all eight canonical dossier IDs, eight accessible selection controls, the organ filter and system selector, the preview panel and deep-linked Heart/Liver guides.
- Matched visible figure numbers with the accessible textual navigation. Distinctions like *liver alone* vs *liver–gall* remain in the written source guide.

### B. Heart/Liver mini-body locators

**Changed:** `atlas/organ-detail.css`.

- Adjusted Heart and Liver locator rings to the same 600×1000 visual reference coordinates used by the body map: approximately (306,283) and (267,319).
- Preserved the source illustration and on-page CC BY 4.0 credit. Correct visual placement needs a real-phone inspection before being called fully verified.

### C. Five source-linked comparison lenses

**New:**
- `research/organ-visual-comparisons-v1.json`: structured comparison content with five lenses, twenty concise claim cards and references to existing original-source IDs.
- `atlas/compare-organs.html`: visual, interactive side-by-side Heart/Liver comparison.

Lenses:

1. **Origins and evolution:** Old Saturn heart disposition vs Earth recapitulation; liver's inner Jupiter analogy vs its distinct water-element affiliation.
2. **In the organism:** heart rhythmic/head–metabolic interpretation vs liver nourishment and liver–gall system.
3. **Inner life and will:** heart purported inward sense/conscience vs liver purported nourishment perception/intention and movement.
4. **Who is said to act:** named-hierarchy context vs analogy and human-member relations; no unsupported exclusive organ builders.
5. **Unresolved questions:** source tensions and clinical limitations remain visible.

All twenty comparison cards link to the original archive through source records already in `research/organ-atlas-guides-v1.json`. The comparison explicitly warns that historic esoteric and disputed medical assertions are not scientific findings. No copyrighted lecture text was copied.

### D. Easier wayfinding

- Body-map page includes a visual **Compare Heart & Liver** doorway.
- Both eight-layer organ-detail pages have a Heart/Liver switcher; it preserves the selected explanation layer while switching.
- The organ pages link to the comparison and the full research dossier.
- The combined homepage links to the comparison page.
- The combined homepage now presents six visual cards for canonical taxonomy regions I–VI, linking to actual IDs using `/atlas/index.html#node=I`, etc.

### E. Validation and GitHub Actions budget

- Updated `tools/validate_visual_organ_atlas.py` to check the **six callouts + two not-depicted links**, canonical organ IDs, marker coordinate bounds, human artwork attribution, all five comparison lenses, and every comparison card's reference to its own organ's source list.
- Updated the existing GitHub Pages workflow to require the comparison HTML and JSON in the output package and run the existing **standard-library validator** as part of the **same single manual deployment**.
- The **Pages publish** and **Chromium smoke-test** workflows remain `workflow_dispatch` only: there are no `push` triggers.
- There was **no GitHub Actions run** during this iteration. Changes are committed to GitHub, not yet proven deployed publicly.
- Programmatic JavaScript syntax and structured-data cross-reference checks were done without Actions. Actual browser rendering, accessibility and source-link visits are **not** yet independently tested in a mobile browser; do not claim them as tested.

## How to preview

At the next planned publication milestone, run **one** manual workflow from [Publish Rudolf Steiner Atlas](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/publish-organ-atlas.yml) on `main`.

Expected paths after a **successful** Pages run:

- [Combined homepage](https://infinix8.github.io/rudolf-steiner-atlas/)
- [Human-body map](https://infinix8.github.io/rudolf-steiner-atlas/atlas/body.html)
- [Heart and Liver visual comparison](https://infinix8.github.io/rudolf-steiner-atlas/atlas/compare-organs.html)
- [Heart guide](https://infinix8.github.io/rudolf-steiner-atlas/atlas/organ-detail.html?organ=organ-heart&layer=overview)
- [Liver guide](https://infinix8.github.io/rudolf-steiner-atlas/atlas/organ-detail.html?organ=organ-liver&layer=overview)

The cited URLs are **expected route addresses**, not proof of a successful fresh deployment.

## Next improvements, prioritized

1. **Mobile visual QA:** inspect labels, overlap, exact anatomy alignment, typography and accessibility at Android screen widths. Fix marker offsets based on a real screenshot rather than guessing.
2. **Add organ categories to visual body map:** introduce diagrams or cards for blood/circulation, chest rhythm, head system, digestive system; preserve distinction between organs and organizational systems.
3. **Extend guide templates to lungs, brain and kidneys:** use the present 40 organ dossiers, with honest evidence density instead of fabricated sources or complete cosmic evolution stories.
4. **Connect visual cards to more precise claim IDs and issue records** while retaining existing GA/edition/paragraph cues, and expose typed relationships across the thematic Atlas.
5. **Offer stage-filtered research lens** (Old Saturn, Old Sun, Old Moon, Earth, future) but only where passage evidence exists; distinguish physical embodiment from recapitulation and analogy.
6. **Replace remaining research-first walls of text with progressive disclosure** and mobile-friendly charts while retaining an expert/research mode.

**Research preservation:** No organ concordance version was overwritten, no audit ledger was truncated, no taxonomy ID was changed, and no new independent original-text certification was claimed. The master current organ checkpoint is still `research/organ-current.json`.
