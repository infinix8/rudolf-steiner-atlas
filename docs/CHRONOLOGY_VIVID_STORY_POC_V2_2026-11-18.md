# Vivid Cosmic Stories — 56-scene atlas implementation

**Date:** 18 November 2026  
**Live page:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-story-vivid.html?stage=cos-saturn  
**Stage IDs:** cos-saturn, cos-sun, cos-moon, cos-earth, cos-jupiter, cos-venus, cos-vulcan.

## Deliverables
- 56 standalone **illustrated compositions** in seven original 4×2 SVG image atlases in `atlas/story-scenes/`. One four-column/two-row sheet per planetary condition. Every scene card selects its own region from the corresponding local image asset.
- A source-linked curated mapping `atlas/story-scenes/story-visual-index.json` with eight scenes per stage, each referencing a canonical research item in `research/steiner-hierarchical-chronology-events-v05.json`.
- New mobile-responsive working story page with source-linked + markers, full-scene image viewer, right-side aspect index, stage sidebar, shareable stage query parameter, and fixed bottom rotatable time dial.
- The prior `atlas/chronology-story.html`, `chronology-time-dial.html`, `chronology-celestial.html`, `chronology-dial.html`, and their assets are intentionally preserved. Homepage entry is additive.

## Image scope and limitations
The illustrations are original *vector scene paintings* generated from layered local SVG gradients, silhouettes, cosmic landscapes and story-appropriate motifs. They are distinctive and richer than the early diagram placeholders, but intentionally do **not** replicate the fully painterly/photoreal rendered-image mockups from the ChatGPT conversation. Those generated mockup files were not available as exportable bytes for the GitHub publish connector. The individual images should be replaced with more realistic concept-consistent assets when a binary upload path is available, keeping the same curated 56-node mapping and interaction framework.

## Attribution and research caveat
All images are symbolic, not documentary evidence. The title and description of each scene are an editorial adaptation of indexed Steiner claims. Original source URLs are resolved at runtime from the canonical index; no source text is mirrored. Importantly, Future Jupiter, Venus and Vulcan are projective/eschatological teachings, **not established science or confidently detailed pictured futures**. A scene is a *research theme* in an editorial reading sequence, not a verified chronological timestamp. The “seventh stage” Vulcan is explicitly limited in GA 13's detail; the final scenes show the limits of knowledge, not invented historical specifics.

## Navigation and performance
- The bottom dock remains fixed while scrolling; keyboard arrows and touch-drag step through the seven conditions.
- Image scene viewer opens on a separate button; the + marker expands each source-linked explanation independently.
- Changing the stage replaces all eight picture selections and source cards without a full reload; URL `?stage=<id>` is deep linkable.
- One vector sheet per stage minimizes resource requests. The artwork is portable, needs no off-site URLs, and is SVG, not huge external raster assets.
- Progressive fallback: if the curated index fails to load, the earlier basic diagram renderer still works.

## Deployment
One main-branch commit; existing selective GitHub Pages workflow; no extra automation or scheduled action.
