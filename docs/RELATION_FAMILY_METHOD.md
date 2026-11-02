# Relationship families: navigational semantics, not Steiner-authored doctrine

**Scope.** The Atlas retains every precisely worded relationship type in its original evidence graph. Because 179 relationships use 123 nuanced types, the interface also offers a coarser **eight-family editorial classification** so readers can find similar forms of reasoning. These families are a navigation tool—not primary-source terminology or additional evidence.

| Family | Current relationships | Editorial meaning |
|---|---:|---|
| development and sequence | 17 | A source-linked ordering, progression or development within the specified narrative or lecture context. |
| distinction and comparison | 23 | Contrasts or explicitly distinguishes ideas or frameworks; shared language does not establish identity. |
| symbolic correspondence | 11 | Analogy, symbol, parallel or illustrative comparison; does not imply literal or empirical equivalence. |
| composition and structure | 11 | A relation between members, structures, combinations, aspects or processes within a defined framework. |
| method and application | 16 | A method, training condition, practice or application presented in the source context. |
| attributed process and causation | 41 | A process, action or causation attributed by Steiner; spiritual, scientific and historical validity is not implied. |
| explanation and interpretation | 34 | How Steiner interprets, explains or frames a concept in a cited original source. |
| contextual association | 26 | A documented topical association that does not establish a stronger causal, structural or historical connection. |

## Rule of interpretation

1. The **exact edge claim** and **passage evidence** govern the meaning of a relationship; the family never supersedes the original wording.
2. An **analogy or symbolic correspondence is not identity or scientific causation**; the interface must preserve its qualification.
3. An **attributed process/causation** describes what Steiner asserted, not independently established empirical findings; apply special care to medical, historical and agricultural cases.
4. A **distinction** may compare unlike conceptual schemes. It must not be misread as a transformation or stage sequence.
5. A **method/application** indicates a recommendation or practical domain discussed by Steiner; it is not a proven effect.
6. The eight-family classification was assigned editorially using a reviewed word-based grouping of exact relation types; individual assignments require continued scholarly audit. Do not claim these families form a taxonomy that Steiner himself published.

## Source model

- Graph record: `research/knowledge-graph-v1.json`, `edges[].type` (fine-grained), `edges[].relation_family` (coarse), `edges[].claim`, `edges[].evidence`.
- Source audit: `edges[].evidence[].source_id` and `passage_locator` refer to an original archive page, edition and a limited review scope.
- Interface: `atlas/graph.html` lets readers filter by family, exact relationship type, source, topic, or evidence basis.
- Validation: `tools/validate_knowledge_graph.py` requires each family to exist in the canonical family registry.

Original source texts remain at RS Archive. This document contains original editorial explanations and is not an archive of Steiner's writings.
