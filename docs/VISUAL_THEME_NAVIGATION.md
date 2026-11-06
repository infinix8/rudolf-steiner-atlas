# Visual theme navigation — 6 November 2026

The public entry point now leads through six distinct visual themes rather than repeated research menus. Each theme opens a focused gateway, with one branch selected at a time and links into the existing source-linked concept pages.

## Structure

- `site/index.html`: light landing page, six visual theme cards, concept search and three visual journeys.
- `atlas/explore.html?region=I`: reusable theme gateway; regions I–VI use the canonical taxonomy directly.
- `atlas/explore.js`: theme presentation, branch selection, shareable `region`/`domain` URL state, search vocabulary and links into the existing taxonomy.
- `atlas/explore.css`: shared responsive presentation, distinct theme colours, native SVG ornaments, gentle motion and reduced-motion support.
- `atlas/index.html`, `atlas/app.js`, `atlas/style.css`: compact research navigation, optional entry-page reference panels and a contextual return link to the visual theme.

The six regions retain all 26 domains and 150 immediate subdomains. These are editorial categories, not a claim that Steiner authored this classification. Source records, organ dossiers and evolutionary research are unchanged. Visual motifs are decorative, not representations of measured cosmic relationships.

## Interaction and accessibility

Theme branches are native buttons with selected state, keyboard access and live topic updates. Selections survive reload and browser navigation through URL parameters. Search includes the existing editorial vocabulary, with empty and failed-loading states. Decorative orbital motion has a pause control and respects system reduced-motion preferences. Theme pages link to relevant body, cosmic, historical and source views. The source research pages lead back to the appropriate visual theme and domain.

## Validation performed

- Browser interaction checks across all six themes and all 26 branch selectors.
- Concept search for Manas, pause control, branch reload persistence and navigation into a concept and back to its theme.
- Narrow-viewport rendering through a 390 px iframe (375 px content area): home, theme branches and a concept page; no horizontal overflow in those checked views. This is responsive-layout verification, not physical-device certification.
- Taxonomy, Atlas integrity and visual organ Atlas validators pass.
- JavaScript syntax and assembled HTML dependencies checked.
- New regression cases added to the existing manual browser smoke suite. The full suite was not executed during this release; the focused checks above were executed interactively.

Publishing retains the existing selective automatic workflow. One website commit triggers one Pages release; no new workflow or schedule was added. Publication also checks for all three theme gateway assets.
