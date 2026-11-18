# Illustrated evolutionary story with persistent stage dial — POC v1

**Date:** 18 November 2026  
**Live route:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-story.html?stage=cos-sun  
**Canonical research:** `research/steiner-hierarchical-chronology-events-v05.json` (380 events, 71 sources when published).

## Scope and approval
The approved concept features a parchment-and-bronze museum-story page, eight illustrated key moments, + markers that expand into explanations, a left planetary selector, a right aspect index, and a dial that stays continuously visible at the page bottom.

This is a **separate sub-POC**, not a replacement for:
- `atlas/chronology-time-dial.html` (ivory time-dial POC)
- `atlas/chronology-celestial.html` (celestial half-wheel POC)
- `atlas/chronology-dial.html` (earlier evolutionary arc POC).

## Implemented interactions
- Fixed compact curved bronze/indigo time dial on desktop and mobile, with all seven conditions and highlighted current stage.
- Direct stage selection using the dial, side rail, and next/previous controls.
- Horizontal pointer drag and keyboard arrow/Home/End navigation in the focused dial.
- Stage selection updates title, introduction, image cards, short annotations, source links and adjacent stage controls without reloading the whole site.
- Eight Old Sun story moments: recapitulation, gift of etheric life, air, light, plant-like life, hierarchical work, sleep-like awareness and Life-Spirit germ.
- Each illustration has a contextual + marker expanding into a longer description and source list; the side guide opens the same relevant card.
- Deep links via `?stage=cos-sun` and the six other cosmic stage IDs, with Back/Forward history navigation.
- Other six conditions provide preliminary research themes from the canonical data, with abstract symbolic artworks. They do **not** claim an equivalent eight-step vetted narrative.

## Illustration approach
The initial deploy uses eight original custom-coded SVG illustrations: ringed warmth globe, light-body silhouette, elemental wave transition, burst of light, formative plant analogy, hierarchies, sleep analogy and spiritual-seed imagery. These are editable, lightweight, responsive illustrations. They are intentionally not photographs, and the page states that the images are **symbolic, not historical documentation**. The supplied concept image is the aesthetic target for later higher-fidelity artwork.

## Content and scholarly limits
The eight Old Sun nodes map to canonical source-linked entries **CH-3.01 / .02 / .03 / .04 / .05 / .07 / .09 / .10**, principally GA 13 chapter IV. No additional fictitious formal cosmic stages are introduced. The visible sequence is a reading/storytelling sequence, not a claim that each process can be uniquely dated or separated; activity of hierarchies can overlap. Old Sun is not the present solar body. Future planetary conditions are Steiner's projected esoteric claims, not astronomy or established scientific predictions.

The canonical JSON is loaded at runtime; when the data is unavailable, the eight editorial Old Sun text fragments and a GA 13 fallback remain visible.

## Deployment
The existing selective GitHub Pages workflow assembles the new page with the rest of `atlas/`. Additive homepage, thematic-index and existing time-dial links make it discoverable. A **single main-branch commit** triggers the existing Pages release, with no additional scheduled workflows or changes to prior POC assets.

## Known POC limits
- The Old Sun page has eight individually illustrated story moments; other stages intentionally receive lighter indexed-theme views until separately authored.
- SVG artwork is stylized rather than as detailed as the generated concept mockup.
- Browser-device interaction and visual regression checks need a separate end-user/device review.
