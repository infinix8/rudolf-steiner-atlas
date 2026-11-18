# Chronology Time Dial — Ivory & Bronze POC v1 (18 November 2026)

New standalone visual proof of concept based on the approved ivory/bronze, museum-like time-dial concept image.

**Live route:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-time-dial.html

## Navigation contract
- **Rotate in place**: drag horizontally on the curved bottom dial or the bronze rotor, use arrow keys while the dial is focused, use the Backward/Forward controls, or tap a visible stage. Rotation changes the selected sibling *within the current level* and updates the scene, overview, sources and neighboring stages.
- **Drill down**: the Enter this stage button moves into a selected stage's children and replaces the dial entries, keeping the same location and illustration space. Tapping an already selected dial node also opens its children. No parallel duplicate visualization.
- **Four levels**: the depth control chooses Cosmic (seven planetary conditions), Earth epochs (seven within Earth), Cultures (seven within Post-Atlantean) or Sub-epoch/detail (available nested phases or source-indexed research events). Detail defaults to Atlantean phases when no deeper context has been chosen. The current scope is always shown in breadcrumbs.
- **Return**: Up one level and the breadcrumb trail navigate to any ancestor; the user's last-selected sibling is remembered within the open page. Deep links by node id are available via the hash.
- **Documented subperiods**: seven GA 11 Atlantean named phases (retained as historical source terms, with explicit editorial caution) and three cited GA 181 Greco-Roman subdivisions are offered before miscellaneous research events. This is not an invention of extra formal great Earth epochs.
- **Research notes**: the main panel favors concise explanation; source-linked atomic research entries appear in a collapsible section below. The interface reads the existing `research/steiner-hierarchical-chronology-events-v05.json`; it does not duplicate the 380-entry dataset.

## Visuals and source caution
Artwork uses original coded SVG/CSS symbolic illustration, rather than asserting there are authentic images of prehistoric/esoteric conditions. Astro-chronological lengths are intentionally *not* mapped to calendar duration. The description and bibliography are attributed to Steiner's teachings and editorial project data, not empirical historical findings.

## Preservation and publishing
New files are exclusively `atlas/chronology-time-dial.{html,css,js}` and this note; the existing `chronology-celestial.*`, `chronology-dial.*` and their research content remain intact. Homepage and research-menu links are additive. Existing selective GitHub Pages workflow publishes the new page in one main-branch push, without adding workflows.

## Follow-up
User feedback on the tactile dial shape, hero illustration and scale selector will guide later visual refinements; source-driven temporal granularity should only be added where the corpus explicitly supports it.
