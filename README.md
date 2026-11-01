# Rudolf Steiner Atlas

A source-grounded, evolving thematic atlas of the **teachings of Rudolf Steiner**, designed to be navigable from broad domains through individual concepts to exact passages in his writings and recorded lectures.

> **Status:** Foundation / taxonomy v1.0 (1 November 2026). This classification is a research-created working taxonomy, not a list of headings chosen by Steiner. GA volume references are often **research leads**, not verified passage-level citations.

## Current scope

- Six major regions, 26 thematic domains, 150 subdomains, 785 concepts and 39 further-detail entries (first-pass totals).
- 30 conceptual crosslinks maintained independently of the primary knowledge tree.
- Versioned Markdown, JSON and OPML taxonomy and Mermaid/SVG mind maps.
- Primary-source editorial method, research roadmap and validation tooling.

### Six top-level regions

1. Knowledge, Method, and Spiritual Development (domains 01–04)
2. Cosmos, Spiritual Realities, and Destiny (05–08)
3. The Human Being, Mind, and Biography (09–12)
4. Christ, Religion, and Civilizations (13–16)
5. Science, Healing, Education, and Society (17–21)
6. Art, Architecture, Ritual, and Anthroposophical Life (22–26)

![Mind map overview](assets/mindmaps/overview.svg)

## Browse the project

| File | Use |
| --- | --- |
| [Full taxonomy](taxonomy/taxonomy-v1.md) | Read the complete thematic outline |
| [JSON taxonomy](taxonomy/taxonomy-v1.json) | Canonical structured data and crosslinks |
| [OPML taxonomy](taxonomy/taxonomy-v1.opml) | Mind-mapping outline interchange |
| [Editable Mermaid mind map](assets/mindmaps/overview.mmd) | Diagram source |
| [SVG mind map](assets/mindmaps/overview.svg) | Scalable overview |
| [Source method](docs/SOURCE_METHOD.md) | Evidence and editorial standards |
| [Roadmap](docs/ROADMAP.md) | Research and HTML development phases |
| [Content model](docs/CONTENT_MODEL.md) | Node IDs and source-aware records |
| [Workflow](docs/WORKFLOW.md) | GitHub development process |

## Sources and editorial scope

Substantive teaching entries are based only on **Steiner's own books, writings, recorded lectures and directly attributable artistic work**. Bibliographic catalogues are permitted to identify primary materials; later anthroposophical authors are not substituted for Steiner's teachings.

GA numbers alone **do not verify** a claim's presence in an exact lecture. Preserve differences between authored books, recorded lectures and editorial compilations, and record translation and attribution uncertainties. Steiner's spiritual-scientific, historical and empirical claims must be identified as his positions rather than presented as independently established facts. See [SOURCE_METHOD.md](docs/SOURCE_METHOD.md).

Principal archives: [Rudolf Steiner Archive](https://rsarchive.org/), [GA volumes](https://rsarchive.org/Volumes.html), [official Complete Works catalogue](https://www.rudolf-steiner.com/en/edition-englisch/complete-works/).

## Quality control and future work

Run `python tools/validate_taxonomy.py` to check stable IDs and crosslink integrity. The next major research milestone is a **GA-by-GA primary-source corpus audit**, followed by passage-level concept records and an interactive HTML atlas.

## Rights

The taxonomy, notes and diagrams are an original working classification. Original Steiner texts and translations may carry separate copyright restrictions; do not copy substantial external text into the repo without assessing rights. This project has no general license at present.
