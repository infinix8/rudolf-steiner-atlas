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


## Second iteration: guided reading and focused concept pages

Added `atlas/journey.html`, `journey.js` and `journey.css`. The reader consumes the existing eight editorial study paths, presenting their 41 stops one at a time. The home page and all six themes expose relevant journeys. Position URLs support direct sharing, reload and browser history. Concept pages retain a return link to the originating step, including when a reader follows a subtopic.

Concept pages now use three accessible reading layers: Explore, Original sources and Connections. Keyboard arrow keys and Home/End move between tabs; inactive panels are hidden. Research status text and unverified-link distinctions remain attached to their respective material. On small screens the classification sidebar starts folded, while desktop navigation stays open.

Focused interactive checks exercised all eight journeys and 41 stops, next-step navigation, concept/source tabs, keyboard switching and return to step 2. Narrow iframe checks verified journey and concept layouts without horizontal overflow and confirmed the mobile drawer starts closed. Additional regression cases cover these interactions in the existing manual smoke suite. Its server now assembles the public folder layout so the landing-page checks exercise the same structure as Pages. No additional automatic workflow was introduced. Full smoke-suite execution remains separate from the focused interactive checks.


### Release checkpoint

Source commit: `a9520ece3e837d18366d050c12c147836b742160`.

The integrity workflow passed. Pages run `42259560310` assembled and uploaded the website successfully but remained `deployment_queued` until the job's ten-minute timeout cancelled it. The new journey route was not public when checked. This is an incomplete release, not a verified live deployment. No automatic retry was started, to avoid repeated runner usage while the Pages queue remained stalled.

Resume publication from this existing source commit/run after the Pages queue recovers; do not redo the implementation. The exact run is https://github.com/infinix8/rudolf-steiner-atlas/actions/runs/42259560310. The local preview and focused browser checks passed; the full manual smoke suite was not run.


### Publishing retry repair

The user requested a retry. Attempt 2 of run `42259560310` passed assembly/upload but failed immediately because two artifacts named `github-pages` existed in the same run. The publishing workflow now gives each run/attempt a unique artifact name and passes the identical name to the deployment action. This preserves selective triggers and avoids artifact deletion or broader permissions. The workflow repair creates a fresh release of the same reader content.
