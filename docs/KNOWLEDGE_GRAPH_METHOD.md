# Passage-linked knowledge graph: evidence and provenance

**Iteration:** 2026-11-02. This graph is a **source-linked reconstruction of claims and connections in Steiner's writings and recorded lectures**, not a second archive of his texts.

## What the graph contains

The current `research/knowledge-graph-v1.json` contains **66 typed connections** backed by **13 original source pages** (selected book chapters or dated lectures). It links pre-existing, stable taxonomy IDs instead of inventing duplicate concept pages. The graph viewer is at [`atlas/graph.html`](../atlas/graph.html). No full Steiner text is stored.

Each edge records:
- a stable graph ID, source and target canonical taxonomy IDs;
- an explicit **relationship type** (such as `begins_development_of`, `forms_unity_with`, `symbolically_corresponds_to`, `used_as_analogy_for` or `must_distinguish`);
- an **original editorial paraphrase** describing the narrow claim;
- an evidence-basis label (**direct** versus **editorial comparison**);
- one or more original-source IDs, each with chapter/lecture and paragraph/section cue;
- the current review status and any uncertainty note.

Each source record includes GA number, original work title, date if a lecture, edition/translation information, outward URL, scope checked, and a declaration that the entire work was **not** audited.

## What "checked" means — carefully

`selected_passage_checked` says only that a named *portion of a primary chapter or lecture* was inspected and an original paraphrase was supported. It **does not** mean the entire chapter/volume was reviewed, that alternative translations were compared, or that a spiritual-scientific assertion has been independently corroborated.

`editorial_comparison_with_checked_passages` means that the editor has compared two source contexts and identified a distinction. It must **not** be presented as a direct quotation or explicit cross-work comparison made by Steiner.

The separate `research/legacy-crosslink-audit.json` checks the **30 preliminary crosslinks** from taxonomy v1. Exactly **four** have matching passage-supported graph edges in this first iteration. The other **26** remain *unverified hypotheses*. The concept browser now displays original, checked relations separately from the legacy proposal list.

## Why the relationship types matter

A connection that is a **sequence in Steiner's account** differs from an **analogy**; a **component** differs from a **transformation**. Most importantly, **different schemas must not be merged because they use similar terms**. For example:
- GA 9's ninefold, condensed sevenfold, and fourfold classifications must be represented distinctly.
- GA 293's head/chest/limb description and GA 23's physiological three systems should not be treated as another spelling of physical/etheric/astral.
- GA 151's twelve orientations, seven moods, three tones and special anthropomorphism case are different dimensions, not 23 interchangeable philosophies.

The current taxonomy's `RS-09.03` heading is a potential misclassification. An evidence-linked `must_distinguish` relation flags it, pending an ID-preserving correction of the original tree and its Markdown/OPML exports.

## Audited sources in this iteration

| GA | Original work / passage | Kind | External source |
|---|---|---|---|
| 4 | *The Philosophy of Freedom*, chapter I | authored book | [Original](https://rsarchive.org/Books/GA004/English/RSP1964/GA004_c01.html) |
| 9 | *Theosophy*, The Essential Nature of Man | authored book | [Original](https://rsarchive.org/Books/GA009/English/AP1971/GA009_c01.html) |
| 10 | *Knowledge of Higher Worlds*, opening chapter | authored book | [Original](https://rsarchive.org/Books/GA010/English/RSPC1947/GA010_c01.html) |
| 13 | *Occult Science*, Evolution of Cosmos and Man | authored book | [Original](https://rsarchive.org/Books/GA013/English/AP1972/GA013_c04.html) |
| 23 | *The Threefold Social Order*, chapter II | authored book | [Original](https://rsarchive.org/Books/GA023/English/AP1972/GA023_c02.html) |
| 110 | *The Spiritual Hierarchies*, April 14, 1909 | recorded lecture | [Original](https://rsarchive.org/Lectures/19090414p01.html) |
| 151 | *Human and Cosmic Thought*, Jan. 22, 1914 | recorded lecture | [Original](https://rsarchive.org/Lectures/GA151/English/RSP1991/19140122p02.html) |
| 170 | *The Riddle of Humanity*, Aug. 13, 1916 | recorded lecture | [Original](https://rsarchive.org/Lectures/GA170/English/RSP1990/19160813p01.html) |
| 223 | *Cycle of the Year*, March 31, 1923 | recorded lecture | [Original](https://rsarchive.org/Lectures/GA223/English/AP1984/19230331p01.html) |
| 293 | *The Study of Man*, Aug. 28, 1919 | recorded lecture | [Original](https://rsarchive.org/Lectures/GA293/English/RSP1966/19190828a01.html) |
| 293 | *The Study of Man*, Sept. 5, 1919 | recorded lecture | [Original](https://rsarchive.org/Lectures/GA293/English/RSP1966/19190905a01.html) |
| 312 | *Spiritual Science and Medicine*, March 21, 1920 | recorded lecture | [Original](https://rsarchive.org/Lectures/SpiSciMed/19200321p01.html) |
| 327 | *Agriculture*, June 12, 1924 | recorded lecture | [Original](https://rsarchive.org/Lectures/GA327/English/BDA1958/19240612p01.html) |

These are **selected passage checks** only. We make no claim that 13 works represent the full corpus.

## Scientific and historical context

The graph faithfully attributes **Steiner's descriptions** of cosmic phases, spiritual beings, human organization, medical beliefs, astrology-related correspondences and agricultural methods. These are not to be asserted as externally established physical, biological, clinical or historical findings. In particular, medical passages remain objects of historical research, not medical advice.

## Rights and archive relationship

We do not mirror or bulk-scrape original texts, or copy archive topic catalogues. The atlas stores only taxonomy labels, brief original editorial paraphrases, source metadata and outgoing links. Check the [source-site terms](https://rsarchive.org/Legal/Terms.html) before considering automated extraction, and obtain appropriate permission where required.

## Next stages

1. Audit original sources **for every one of the 26 legacy relationships still without a matching direct source relation**.
2. Map original sources to each subdomain, not just a GA volume lead.
3. Mark stronger evidence after checking surrounding context, translation variation and dating.
4. Construct a graph of differences and evolving terminology across Steiner's earlier books and later lectures, while preserving distinct schemas.
5. Build a corpus coverage matrix keyed by GA work and lecture date, using bibliographic links without rehosting source content.
6. Run real-browser functional, responsive and accessibility tests before any deployment.

**Quality control:** `python tools/validate_knowledge_graph.py`; GitHub Actions also checks JSON integrity and JavaScript syntax.
