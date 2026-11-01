# Run the interactive Rudolf Steiner Atlas

From the **repository root**, run:

```sh
python -m http.server 8000
```

Then open **http://localhost:8000/atlas/**.

The prototype runs entirely in the browser with no external JavaScript packages or server API. It loads only local, editorial JSON: taxonomy, study routes, subject crosswalk and source gateways. It **does not** fetch or copy Steiner's books, lectures, or the source sites' text.

## Available features

- Browse six regions and all 26 domains; expand to each of 1,006 concept/detail nodes.
- Search classification labels and ancestors; constrain to a single domain.
- Copy deep links to individual concepts.
- Browse eight editorial cross-domain study routes.
- Follow initial typed conceptual connections, including those inherited from broader topics.
- Jump out to located chapter/lecture links, relevant GA bibliography, source archive categories and official editorial catalogue.

## Evidence markers

- **Located original source** means the external URL was opened; no claim of full passage audit.
- **GA research lead** points to an associated GA number; do not treat as a passage citation.
- **Related concept** is an editorially proposed link until individually evidenced.

## Limitations

No real full-text search, automatic harvesting, AI-generated summaries of uncited text, search-by-original-term synonyms or public deployment yet. The source site retains the original text. For research policy see [complementary architecture](../docs/COMPLEMENTARY_ARCHITECTURE.md).

## Validate

```sh
python tools/validate_taxonomy.py
python tools/validate_atlas.py
node --check atlas/app.js
```
