# Living Cosmos research data

Start with [The Macrocosm and Microcosm](MASTER_RESEARCH.md). The [source ledger](PRIMARY_SOURCE_LEDGER.csv), twelve CSV matrices and [graph](KNOWLEDGE_GRAPH.json) can be used independently of the Atlas.

Edit the four TSV files as the authoritative input. An entity has a stable ID and kind. A relationship has directional endpoints, a verb, classification, relevant context, evidence pointers, a paraphrase and qualification. A source view identifies an edition of a lecture, book chapter or essay. The optional matrix context identifies additional entities mentioned by that one claim, without automatically creating new graph edges. Add distinct edges for distinct relationships. More than one edge may join the same pair of nodes.

A citation is written as `source-id@paragraph-range`. Split exact paragraph selections with commas and distinct sources with a pipe. In CSV provenance columns the values separated by a pipe align positionally. GA, title, date, URL, language and location are provided on all matrix rows. Date is N/A for undated book chapters. Evidence in the graph resolves to the source collection by source-view ID. The source ledger counts each distinct source-view and locator combination, including overlapping paragraph ranges.

From repository root run `python3 tools/build_unified_cosmos.py` to update the matrices, source ledger and graph. Run it with `--check` to verify all committed exports and references. Evidence classes describe textual support. They are independent of whether a claim can be demonstrated in modern historical or empirical terms.
