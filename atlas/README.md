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

Open `http://localhost:8000/atlas/graph.html` for a filterable diagram and an accessible evidence table covering 142 typed relations, 30 original book/lecture/essay pages and 60 cross-domain connections.

The main concept browser includes separate panels for **passage-checked** relationships and **unverified proposed** crosslinks. All relations are original paraphrases or explicitly marked editorial comparisons. Follow the outgoing source link to read Steiner's own text in its original context.

See [graph evidence method](../docs/KNOWLEDGE_GRAPH_METHOD.md) and [coverage report](../docs/KNOWLEDGE_GRAPH_COVERAGE.md). To regenerate and verify the report, run `python tools/report_knowledge_graph.py --write` and `python tools/report_knowledge_graph.py --check`.

## Original-source guide

Open `http://localhost:8000/atlas/sources.html`. Filter the source pages used in the graph by GA number, title, date, domain or work type. Every record opens the **original source page** rather than a text copy. These 30 graph source pages are distinct from the earlier 19 first-pass source-gateway records.

## Test the browser as well as the data

The browser smoke tests at `tests/atlas-browser-smoke.mjs` use Chromium on desktop and mobile viewports, exercising search, taxonomy deep links, graph filters, primary-source cards and the source-guide filters. GitHub Actions runs them automatically for relevant changes.

## Advanced discovery pages

- `/atlas/coverage.html`: evidence status across all 150 subdomains, distinguishing direct source-linked endpoints, child-only evidence and gaps.
- `/atlas/timeline.html`: chronological browsing of **dated talks** in the graph, without assigning unfounded publication years to authored works.
- `/atlas/dossiers.html`: five original editorial concept guides with 17 sourced sections, open research questions, and direct original-text links.

The companion [subdomain coverage report](../docs/SUBDOMAIN_EVIDENCE_COVERAGE.md) is regenerated with `python tools/report_subdomain_coverage.py --write` and validated with `--check`. The structured dossiers are in `research/concept-dossiers-v1.json` and checked by `python tools/validate_dossiers.py`.

## Source-context comparisons and evidence families

- Open `/atlas/trajectories.html` for six source-grounded comparisons. The viewer does **not** treat date of an English edition as original composition or lecture date, or assume two differing contexts prove a doctrinal shift.
- The graph viewer now allows a **coarse connection family** filter (eight editorial types), with the exact fine-grained edge type and passage unchanged.
- Current graph: **179 relations / 40 source pages / 78 cross-domain links**. The subdomain coverage summary is **51 direct / 48 descendant only / 51 not linked**.
- `python tools/validate_trajectories.py` verifies all trajectory IDs and source contexts.
- See [relation family method](../docs/RELATION_FAMILY_METHOD.md) and [iteration record](../docs/ITERATION_2026-11-02_CONCEPT_CONTEXTS.md).
