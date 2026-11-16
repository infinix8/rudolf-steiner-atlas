# Sun-Ray Chronology POC — visual redesign v2
Updated: 16 November 2026

## Intent and page

- **Live route:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-dial.html
- **Canonical source document:** [Hierarchical chronology v0.1](STEINER_HIERARCHICAL_CHRONOLOGY_MASTER_V01.md)
- **Canonical structured data:** [204-entry chronology JSON](../research/steiner-hierarchical-chronology-events-v01.json)
- **Implementation:** [HTML](../atlas/chronology-dial.html), [CSS](../atlas/chronology-dial.css), [JavaScript](../atlas/chronology-dial.js)

This replaces the initial concentric-ring interface with a **sun-ray metaphor**. A long radial beam represents a larger interval. A fan of shorter labeled rays previews the next subordinate level. Clicking any interval-ray zooms into it, promoting its children to long rays and previewing grandchildren as shorter rays; clicking a terminal event keeps that interval in view and opens its citation-linked information.

## Interaction

- Drag anywhere on the SVG using mouse or touch to rotate by angular motion around the center.
- Use the left/right rotation buttons (or arrow keys when the SVG has focus); mouse-wheel over the dial also rotates.
- Each visible large and small ray has an accessible name, keyboard selection, a title tooltip, and a readable orientation-corrected radial label. Long titles may be visually abbreviated; the full name remains in the nearby navigation cards and the accessible label.
- Bread crumbs, the center's one-level-out button and the whole-cycle reset provide predictable navigation.
- The right-hand panel opens passage-level research information as available, dates/status caveats, and primary-source URLs.
- The bottom navigation displays full ray names and indicates the distinction between major rays and smaller previews.
- Four linked cross-era research threads (hierarchies, human constitution/organs, death/rebirth and the present task) remain outside the formal consecutive interval chain.

## Data and structural limitations

The POC consumes the existing published JSON and deliberately does not invent precise cosmic durations. Top-level and all intermediate sibling rays are spaced evenly by **structural** hierarchy, not duration. The initial 7 long rays represent cosmic conditions. The Earth ray opens 7 Earth epochs; Post-Atlantean opens 7 cultural periods; the next zoom opens 5–19 specific research entries depending on the selected source group.

A maximum of eight small rays appear as previews to maintain legibility; entering the corresponding larger ray reveals the full child set. Long ray labels are always visually present, but very long titles are truncated in the graphic (full title is available in the adjacent ray index and accessible description). No chronology events were removed. Stage-spanning conditions such as Earth's entire physical/etheric/astral organization and individual recurrent cycles are treated as cross-era topics, **not extra epochs**.

Colors distinguish **past (warm), current/ongoing (mint), and projected future (lilac)**; minor within-group color variation helps identify separate rays. This is a source-attributed representation of Steiner's spiritual-scientific claims, not established archaeology, medical science, astronomical chronology, or predictions validated by observation. Source flags retain their existing meanings and uncertainties.

## QA and publication

The page continues to use the existing canonical JSON and the established selective GitHub Pages workflow. CSS/JS are self-contained aside from optional Google Fonts. All HTML targets, JavaScript syntax, JSON references and GitHub release outcome should be checked after the final commit. One website commit avoids repeated deployment workflows.

## Iteration opportunities

1. **Visual validation:** open the live page on Android and desktop to inspect ray-label collisions and touch behavior, especially in dense source groups.
2. Extend the corpus so every cross-era source claim has an explicit temporal relation and verified passage anchor.
3. Introduce an explicit actor taxonomy so higher spiritual hierarchies can be color-coded independently of temporal status.
4. Add alternate views of the same chronological tree without claiming undated intervals have measured durations.
5. Add direct, tested browser interaction/screenshot checks after the POC has been reviewed.
