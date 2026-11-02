# Iteration 6 — source-gap reduction, concept contexts and semantic graph clarity

**Date:** 2 November 2026  
**Canonical repository:** `infinix8/rudolf-steiner-atlas`

## Goal and completed results

This iteration continues the Atlas as **an intellectual navigation layer over RS Archive and the official Rudolf Steiner Archiv**, not a duplicate text library. It intentionally prioritizes subdomains lacking primary-source evidence, temporal/contextual comparisons, and the user's ability to find connections.

- **179** selected-passage-linked graph relationships (**+37**).
- **40** distinct original source pages (**+10**).
- **78** links crossing major domains (**+18**).
- **All 26** top-level thematic domains remain represented, but much deeper work is required.
- The subdomain coverage audit improved from **40 direct / 39 child-only / 71 no evidence** to **51 direct / 48 child-only / 51 no evidence**.
- All **30 prior broad exploratory crosslinks** remain separately assessed: **4 directly matched, 3 narrower descendant-level related evidence, 23 without corresponding graph evidence**. Partial evidence does **not** verify a broad crosslink.
- **Six concept-context trajectories** with **16 original source-context records**, integrated into the Atlas. These explicitly avoid interpreting a difference in explanatory purpose as a doctrinal revision.
- **Eight editorial semantic relation families** overlay **123 precise existing relation types**, preserving the original types and exact source links.
- GitHub Actions validates original-source relationship endpoints, the two generated source-coverage reports, taxonomy export consistency, concept trajectories, and browser syntax; Chromium desktop/mobile smoke tests exercise the new comparisons and relation family filtering.

## Ten original source pages opened and inspected

| Source | Exact page | Key research threads |
|---|---|---|
| GA 4, chapter III | [Thinking in the Service of Knowledge](https://rsarchive.org/Books/GA004/English/RSP1964/GA004_c03.html) | concept/percept; thinking and observation |
| GA 4, chapter VII | [Are There Limits to Knowledge?](https://rsarchive.org/Books/GA004/English/RSP1964/GA004_c07.html) | Kant, monism/dualism, knowledge boundaries |
| GA 6, part I.1 | [Goethe and Schiller](https://rsarchive.org/Books/GA006/English/MP1985/GA006_c01_1.html) | Goethean observation and the archetypal plant |
| GA 6, part III | [The Phenomena of the World of Colors](https://rsarchive.org/Books/GA006/English/MP1985/GA006_c03.html) | light/dark boundary, Goethe/Newton contrast |
| GA 10, chapter IX | [The Guardian of the Threshold](https://rsarchive.org/Books/GA010/English/RSPC1947/GA010_c09.html) | lesser/greater Guardian, freedom and esoteric responsibility |
| GA 10, chapter X | [Life and Death: Greater Guardian](https://rsarchive.org/Books/GA010/English/RSPC1947/GA010_c10.html) | sense-world's role in Steiner's spiritual narrative |
| GA 327, lecture I | [7 June 1924](https://rsarchive.org/Lectures/GA327/English/BDA1958/19240607p01.html) | attributed planetary rhythms, soil, seasons and plant life |
| GA 279, lecture II | [25 June 1924](https://rsarchive.org/Lectures/GA279/English/APC1956/19240625p02.html) | vowel/consonant sound and expressive movement |
| GA 279, lecture X | [7 July 1924](https://rsarchive.org/Lectures/GA279/English/APC1956/19240707p02.html) | body and gesture, symbolic twelve/seven correspondences |
| GA 34, authored essay | [The Education of the Child](https://rsarchive.org/Articles/GA034/English/Singles/EduChi_essay.html) | imitation, childhood stages, authoritative example |

All new graph evidence contains concise **original editorial paraphrases**, exact source-page links, limited passage locators, original lecture date when applicable, and explicit uncertainty. Steiner's claims about esoteric beings, life after death, planetary farming influences and human development are **attributed historical claims**, not established scientific facts. The Guardian text also contains historically racialized typologies requiring critical contextualization, not uncritical repetition.

## Six structured context comparisons

The new [source comparison browser](../atlas/trajectories.html) draws from [six JSON research trajectories](../research/concept-trajectories-v1.json):

1. Ninefold/sevenfold human members versus bodily functional threefolding and social threefolding.
2. Thinking, Goethean science and Goetheanum form across different authored contexts.
3. Lesser and Greater Guardian in adjacent chapters of GA 10.
4. June–July 1924 speech-eurythmy sequence (actual dated lectures).
5. Two June 1924 agriculture lectures (actual dated lectures).
6. Karma as authored reasoning versus later dated lecture presentations.

**Crucial distinction:** the Atlas records verified **lecture dates**, but does not assign unknown book dates from modern translation editions, or assert that a different explanation equals a historical doctrinal reversal. Each comparison has an explicit open research question, relevant canonical concepts, and direct original-source links.

## Eight evidence-family navigation categories

Because 179 relations contain 123 precise, heterogeneously phrased types, the [graph explorer](../atlas/graph.html) offers a second, broad family filter. Families are editorial navigation aids, **not Steiner's authored categories**, and never supersede the more precise type and passage. See [the family method](RELATION_FAMILY_METHOD.md).

## Tests and limitations

- Graph and taxonomy identifiers remain stable. JSON, Markdown and OPML taxonomy formats stay synchronized.
- The graph retains exact relation types and provenance; no source-site crawling or republication of the books/lectures occurred.
- Six trajectories and their source IDs are validated by `tools/validate_trajectories.py`.
- `docs/KNOWLEDGE_GRAPH_COVERAGE.md` and `docs/SUBDOMAIN_EVIDENCE_COVERAGE.md` are generated and checked in CI.
- Browser tests cover the comparison selector, actual original lecture ordering, conservative treatment of undated authored works, semantic family filters and mobile navigation.
- Passing CI does **not** mean all source passages have been fully context-checked or that cross-translation comparison and full accessibility auditing are complete.

## Next research priorities

1. Address the remaining **51 unlinked subdomains**, beginning with actual original source passages rather than raising broad parent topics to verified by inference.
2. Review all semantic family assignments and edge semantics against original terminology; prevent overfitted relation names from masking conceptual distinctions.
3. Deepen the six comparisons with original German, original publication/revision dates, and explicitly attested historical changes.
4. Expand passage-specific editorial dossiers and structured concept histories; keep authored books and stenographed lectures distinguished.
5. Audit historically discriminatory passages carefully in context, particularly in anthropology, cultural history and esoteric education.
6. Perform comprehensive keyboard/screen-reader and color-contrast review and external link maintenance before considering public deployment.

This is a completed, committed iteration. No background maintenance or automatic future commits are implied.
