# Evolutionary Arc — selected visual POC (16 November 2026)

## Reference and scope

User-selected design: a luminous U-shaped progression with **Old Saturn → Old Sun → Old Moon → Earth (the low point) → Future Jupiter → Future Venus → Future Vulcan**, against a warm/pastel mountain landscape. The reference image also includes compact left navigation, an Earth information panel, four smaller-stage thumbnails, and a lower navigation ribbon. This POC recreates its *layout, palette, and navigational intent* using text, CSS and accessible vector artwork; it does **not** claim to be a pixel-perfect reproduction of the reference illustration.

**Public URL:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-dial.html
**Data:** [231 source-linked chronology entries](../research/steiner-hierarchical-chronology-events-v02.json) and [seven cosmic dossiers](../research/steiner-cosmic-condition-dossiers-v02.json).
**Previous POC:** single transforming spoke half-wheel (archived in Git history).

## Working interactions

- **Root:** Seven cosmic conditions on a descent–Earth–ascent U-shaped arc, labeled by name and core human-development meaning.
- **Select a stage:** Updates the integrated research card, its tabs, linked sources, and thumbnails. Clicking an already selected arc node drills down if a deeper level exists; *Explore this stage in depth* offers the explicit path.
- **Dive deeper:** Selecting Earth reveals its **seven great Earth epochs**; selecting Post-Atlantean reveals **seven cultural periods**; selecting a period reveals event records that can span multiple seven-node pages.
- **Navigation:** Breadcrumbs, left/right stage controls, the bottom level-navigation ribbon, search across indexed nodes, and direct hashes preserve context.
- **Research tabs:** Overview, Key Processes, Human Development, Spiritual Beings, and Sources (GA) draw from the canonical dossiers and source IDs.
- **Cross-era topics:** The 50 source-linked general, transitional and recurrent events are separately visible in a "Cross-Era Developments" list, not inserted as extra epochs into the sevenfold scheme.

## Research integrity

The U shape at the **seven cosmic-condition level** reflects the descent/materialization → Earth → ascent/spiritualization pattern in Steiner's evolutionary account, **not** measured cosmic time or distance. At subordinate levels the same curve is only a consistent navigational shape: do not assert that every fourth Earth epoch or fourth cultural period is the equivalent cosmological low point without its own source passage. No present-day astronomical planet images should be used as evidence for the ancient/future spiritual conditions; spheres are decorative symbols. Cited spiritual, historical, racial, medical, and future claims are attributed to Steiner and not independently established. Section statuses and original passages must remain distinguishable.

## Accessibility and responsiveness

- Each stage point is a keyboard-focusable SVG control with a full accessible label and text title.
- Stage selection may also be achieved with the next/previous controls, lower navigation and searchable list.
- On narrow screens the visualization prioritizes the center and offers the same non-arc navigation for stages that would be too small to tap, then stacks research panels vertically.
- Reduced-motion settings are respected; light contrast text is placed on cream plaques rather than directly on the landscape.

## QA and rollout

Prototype uses existing selective Pages deployment: **one final main-branch release** and no new workflow. Before rollout, verify JavaScript syntax, all HTML IDs, seven/seven/seven hierarchy, all research/source pointers, real desktop/mobile rendering, and deployment success. There is no change to canonical research data in this UI-only update.
