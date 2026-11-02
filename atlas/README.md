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

No real full-text search, automatic harvesting, AI-generated summaries of uncited text, systematic multilingual term indexing or public deployment yet. The source site retains the original text. For research policy see [complementary architecture](../docs/COMPLEMENTARY_ARCHITECTURE.md).

## Validate

```sh
python tools/validate_taxonomy.py
python tools/validate_atlas.py
node --check atlas/app.js
```

## Additional features

19 earlier source-gateway links and 27 source pages in the expanded graph; 14 archive-topic bridges; 41 controlled alternative search phrases; and 3 source-linked comparison models (GA 9, GA 151 and GA 293).

## Passage-evidence graph (iteration 2026-11-02)

Open `http://localhost:8000/atlas/graph.html` for a filterable diagram and an accessible evidence table covering 116 typed relations, 27 original book/lecture/essay pages and 51 cross-domain connections.

The main concept browser includes separate panels for **passage-checked** relationships and **unverified proposed** crosslinks. All relations are original paraphrases or explicitly marked editorial comparisons. Follow the outgoing source link to read Steiner's own text in its original context.

See [graph evidence method](../docs/KNOWLEDGE_GRAPH_METHOD.md) and [coverage report](../docs/KNOWLEDGE_GRAPH_COVERAGE.md). To regenerate and verify the report, run `python tools/report_knowledge_graph.py --write` and `python tools/report_knowledge_graph.py --check`.

## Original-source guide

Open `http://localhost:8000/atlas/sources.html`. Filter the source pages used in the graph by GA number, title, date, domain or work type. Every record opens the **original source page** rather than a text copy. These 27 graph source pages are distinct from the earlier 19 first-pass source-gateway records.

## Test the browser as well as the data

The browser smoke tests at `tests/atlas-browser-smoke.mjs` use Chromium on desktop and mobile viewports, exercising search, taxonomy deep links, graph filters, primary-source cards and the source-guide filters. GitHub Actions runs them automatically for relevant changes.
