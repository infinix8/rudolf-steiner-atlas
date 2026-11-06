# Human Evolution Explorer — editorial checkpoint (6 November 2026)

The interactive [Human Evolution Explorer](../atlas/human-evolution.html) is linked from the combined [Atlas homepage](../site/index.html) and [thematic Atlas](../atlas/index.html). It is a static, self-contained HTML reader with an embedded snapshot and a matching structured [research dataset](../research/human-evolution-concordance-v1.json); no JS framework, API or runtime network connection is needed to open it locally. The original primary texts remain on RSArchive.

Includes all **21** stage entries from the 6 November 2026 *Steiner Human Evolution Concordance* document (7 Lemurian analytical milestones + 7 GA 11 Atlantean stage labels + 7 post-Atlantean cultural periods), **15 comparative attributes** each, **7** separate Atlantean Oracle entries and original source URLs. Views: stage explorer, horizontally scrollable matrix with four lenses, side-by-side comparison, Oracle guide. Filters, search and deep links (`#stage=A4`) work on mobile and desktop. The HTML includes the complete snapshot so `file://` opening works, even without a local web server.

## Source integrity

- Lemurian rows are **thematic reconstructions**, not Steiner-defined seven formal sequential sub-stages; some overlap.
- Atlantean stages reproduce historically situated Theosophical labels from GA 11, not claims about modern ethnic groups.
- Ahrimanic intervention is placed *epoch-wide* near the middle of Atlantis, not assigned uniquely to A4.
- Oracles are a cross-stage institutional/spiritual layer, not mapped one-to-one to Atlantean stages.
- P6/P7 are *future* spiritual teachings. Chronological dates are not asserted as archaeological dates.
- This is a concordance of claims attributed to Steiner, not independently established human history.

## Maintenance

When updating a stage, update the JSON source first and regenerate the embedded `<script id="evolution-data">` in the HTML with the same JSON (escaping `<` as `\\u003c`). The publishing workflow already copies the entire `atlas/` tree and `research/*.json` into Pages: **no workflow edits or additional publish triggers** were introduced. One manual release is needed to show this revision on GitHub Pages. Ordinary commits can use `[skip ci]` to avoid triggering validation Actions when conserving monthly minutes.
