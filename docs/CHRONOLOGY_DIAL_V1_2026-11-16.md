# Interactive Chronology Dial — version 1 (16 November 2026)

**Page:** [atlas/chronology-dial.html](../atlas/chronology-dial.html)  
**Public route:** https://infinix8.github.io/rudolf-steiner-atlas/atlas/chronology-dial.html  
**Canonical research data:** [research/steiner-hierarchical-chronology-events-v01.json](../research/steiner-hierarchical-chronology-events-v01.json)  
**Chronology document:** [Steiner Hierarchical Chronology v0.1](STEINER_HIERARCHICAL_CHRONOLOGY_MASTER_V01.md)

## Delivered

- One unified **nested** chronological dial, not separate disconnected time graphs.
- Seven cosmic conditions as the root level; Earth opens seven Earth epochs; fifth Earth (Post-Atlantean) opens seven cultural periods; each eligible period/condition opens its source-linked events.
- Outer child arcs are shorter/thinner than parent arcs; structural weights are **not literal durations**, because early cosmic conditions lack scientifically measured dates.
- Desktop and mobile adaptive layout with touch/pointer drag-to-rotate, turn buttons, keyboard-accessible SVG arcs, breadcrumbs, back/overview, stage cards and source-linked research panel.
- Search across all 204 existing event records and filter by study theme or named spiritual influence mentioned in the English research descriptions (keyword filtering, not exhaustive independent actor tagging).
- Four cross-cutting, non-sequential research strands: spiritual hierarchies, human constitution/organs, soul lives/reincarnation, present task.
- Direct links to the original Steiner source URLs included in the canonical research JSON; evidence and uncertainty flags remain in the detail panel.
- Deep links to existing IDs via URL hash, such as #cos-earth, #earth-post, #period-14 and #CH-14.12.
- No data duplication: published interface fetches the canonical JSON via ../research/steiner-hierarchical-chronology-events-v01.json. This version therefore needs an HTTP server/Pages for loading; direct file:// opening does not load its source data.

## Source and scope safeguards

The dial visualizes attributed esoteric historical/cosmic claims, not established history. Past/present/future colors are categorical and editorial, not physical measurements. Approximate dates and cultural typologies are research descriptions and may need revision. Filter results are based on words in summaries, not proof that a named being is exclusively active in an interval. The Earth-wide recapitulation and planetary transition records are not falsely presented as extra formal Earth epochs. The four cross-cutting groups are explicitly presented outside the consecutive sequence. Questionable racial or medical descriptions stay attributed and caveated.

## Publishing

This commit changes atlas/ and site/ and therefore qualifies for the repository's **existing selective automatic Pages publication** from main. No workflow trigger, cron or additional Action was added. The documented automatic release still requires its standard verification steps to succeed; the source commit itself is not confirmation that the public Pages deployment succeeded.

## Follow-up research and engineering

1. Audit the phase labels and conflicting claims in GA 11/13/102/110 and add properly sourced subnodes.
2. Introduce explicit source-backed interval edges and declared actor tags (rather than keyword filters).
3. Add genuinely proportional interval sizing **only** where duration is supported, while retaining structural sizing for undated conditions.
4. Add a subtle chronology-on-one-axis companion rail if users need date comparisons; do not coerce recurring cycles into single dates.
5. Extend the source panel to paragraph anchors, translated variant links and conflict annotations.
6. Enhance automated validation and mobile real-device screenshot/browser checks.

**Versioning:** This is an interface, not a declaration that the existing 204-event research index is exhaustive.
