# Knowledge model — v1 and proposed v2

## Existing canonical data

`taxonomy/taxonomy-v1.json` stores `meta`, `anchor_evidence`, `tree` and `crosslinks`.

Hierarchy: **region → domain → subdomain → concept → optional detail**.

- Region IDs: Roman numerals I–VI.
- Domain IDs: two digits, e.g. `09`.
- Subdomain IDs: `RS-09.04`.
- Concept IDs: `RS-09.04.01`.
- Further details extend the dotted ID scheme.

IDs remain stable even if labels change.

## Proposed passage-aware source record

```json
{
  "id": "RS-09.04",
  "title": "Example subdomain",
  "aliases": [],
  "source_status": "lead",
  "sources": [{
    "ga": "9",
    "work_title": "Theosophy",
    "kind": "authored book",
    "lecture_date": null,
    "section": "Chapter to be verified",
    "edition": null,
    "url": "https://rsarchive.org/Books/GA009/",
    "checked": false
  }],
  "review_notes": []
}
```

This example is **not verified evidence** and must never be imported as an actual citation without checking.

## Crosslinks

Typed edges use `from`, `to` and `relationship`, with both endpoints referring to real canonical node IDs. Future models should add evidence, status, direction and provenance. Distinguish researcher-inferred conceptual connections from Steiner's explicitly stated relations.

## HTML presentation

Pages should be keyed by canonical node ID, providing breadcrumbs, children, source records, quotations or restrained paraphrases, source-status indicators, German terminology, related topics, chronology and editorial cautions. Render from structured files rather than embedding teaching texts in UI code.
