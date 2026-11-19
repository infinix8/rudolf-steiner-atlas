# Living Cosmos research checkpoint

Milestone 1 · 19 November 2026. The research baseline is the commit titled **Build the Living Cosmos primary-source foundation**, on top of `7df8c22b598e9ae4b433fbca8699a7283202b0ce`. The integration commit records its immutable research SHA here.

Read [the synthesis](MASTER_RESEARCH.md) and [coverage](RESEARCH_COVERAGE.md). Open [the comparison ledger](CONTRADICTIONS_LEDGER.csv) and [open questions](CONTRADICTIONS_AND_OPEN_QUESTIONS.md). This milestone integrates selected source passages from the prior organ, evolution and planetary work and adds source-specific comparisons for the Mars lung germ, Saturn liver influence and GA 102 Venus/Mercury wording. The entire initial graph and CSV output regenerate from the TSV inputs.

## Resume in this order

1. Add passage-level comparisons to CL04–CL06 and CL12 rather than rereading the already recorded locations just to rebuild the same rows. Start with [GA 110 VIII–X](https://rsarchive.org/Lectures/GA110/) and use the organ checkpoint for previously indexed Moon/Mars and Ton variants. Use [GA 102](https://rsarchive.org/Lectures/GA102/) for the surrounding chapters of the intellectuality passages. Keep their German and edition-local vocabulary.
2. Resolve the Oracle vocabulary and group counts. Open [GA 109 §12 and its neighbouring text](https://rsarchive.org/Lectures/GA109/English/AP1986/19090531p01.html), then compare the German and GA 13 IV §§91–100. Give the Atlantean guide, the GA 204 beings and Future Vulcan separate IDs.
3. Extend the organic links through [GA 208](https://rsarchive.org/Lectures/GA208/) and GA 313–317. Use the [existing organ ledger](../../ORGAN_CONCORDANCE_RESUME.md) for complete chapter and lecture inventories. Start with heart, lungs, endocrine organization and sense organs. Record earliest formation, later contributions and present operation separately, only where evidenced.
4. Compare GA 231 I–II and GA 239 I–II against the already extracted GA 231 III–IV and GA 239 III–IV. Add further GA 237–240 claims by phase of the journey. Compare GA 113 IX and GA 121 VI with the rest of GA 112 on the Christ–Yahweh issue.
5. Add precise second- and first-hierarchy developmental tasks and deeper Earth-culture profiles. Use the [chronology checkpoint](../../CHRONOLOGY_RESEARCH_RESUME.md) to reuse existing verified events and bilingual variants.
6. Update `SOURCE_VIEWS.tsv`, `RELATIONSHIPS.tsv` and, when needed, `ENTITIES.tsv` and `MATRIX_CONTEXT.tsv`. Run `python3 tools/build_unified_cosmos.py` then `python3 tools/build_unified_cosmos.py --check`. Update the manuscript and coverage using generated counts. Batch site-affecting changes in a single integration milestone.

The independent dataset and manuscript are complete enough for an initial proof of concept. Details of the explorer and exact checkpoint appear in the integration revision of this file.
