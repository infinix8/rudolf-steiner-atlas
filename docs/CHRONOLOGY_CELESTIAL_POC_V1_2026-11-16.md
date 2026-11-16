# Celestial Chronology POC — design alternative (2026-11-16)

## Why it exists

This is an **additional**, non-destructive design alternative to the U-shaped Evolutionary Arc:
- **New POC:** [Celestial chronology](../atlas/chronology-celestial.html), published at https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-celestial.html
- **Previous POC preserved:** [U-shaped Evolutionary Arc](../atlas/chronology-dial.html), published at https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-dial.html

The user supplied a dark celestial reference image: a half-visible, rotatable gold spoke dial anchored at left with an illuminated central hub, orbit markers, nighttime observatory, a framed reading panel at right, and a lower level picker. This POC renders a similar design using original CSS gradients and SVG, without copying or embedding the reference image itself. The mockup's **Rudolf Steiner biography dates** are **not** imported into the cosmological chronology data. The working page shows the project's source-linked **cosmic evolutionary conditions** instead.

## Navigation and content

- Initial view: seven cosmic conditions (Old Saturn, Old Sun, Old Moon, Earth, Future Jupiter, Venus, Vulcan), arranged in chronological order around a 360° wheel, with the right-facing half visible.
- Drag to rotate the wheel, or use arrow buttons/keyboard arrow keys.
- Click a visible ray to select it and read the panel. Click **Explore this Stage** (or the + control) to promote its child level into the same wheel. The − control goes out; the level dropdown and breadcrumbs navigate directly.
- Earth opens exactly **seven formal Earth epochs**. Post-Atlantean opens exactly **seven cultural periods**. Individual source-linked events are selectable at finer levels. An event is not treated as an interval with fabricated subdivisions.
- Panel displays sourced summaries, focus themes, child events and primary-source links, backed by existing [231-entry JSON](../research/steiner-hierarchical-chronology-events-v02.json) and [7 cosmic dossiers](../research/steiner-cosmic-condition-dossiers-v02.json).
- Search includes parent intervals and all 231 research records, including cross-era records not inaccurately forced into the sevenfold Earth hierarchy.
- Stage selection can be bookmarked/shared using the URL hash and header bookmark-copy button.
- The previous design remains linked from the new page, and both are independently accessible from the website home and Atlas research navigation.

## Important research boundaries

This is an interactive visualization of **Steiner's accounts** and forecasts, **not empirically established cosmology, history, medical anatomy or physical planetary chronology**. The astronomical-looking central hub and golden celestial diagram are decorative; no physical-looking planet represents a scientifically verified cosmic stage. Arc length, angular spacing, colors and minor unlabeled guide lines represent navigation, not measured dates, hierarchy membership or verified chronology. The 7 / 7 / 7 structural counts are formal for the stages used in the existing research. Other ongoing and recurrent processes remain accessible through search.

## Validation and release

Use a consolidated milestone commit to avoid triggering unnecessary GitHub Actions. Test JavaScript syntax, DOM bindings, 7/7/7 hierarchy, source links, wheel rotation/zoom and old-route preservation; then verify the Pages workflow. No workflow or site build configuration changes are necessary.
