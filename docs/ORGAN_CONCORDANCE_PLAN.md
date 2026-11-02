# Complete organ concordance — research plan (GA 313–317)

**Status:** Phase 3 initiated, 2026-11-02. This is a research protocol and a selected-passage pilot, **not** a completed concordance. The corpus remains Rudolf Steiner's own authored writings, lectures and directly attributable teaching notes. It complements the Rudolf Steiner Archive by linking to sources, not duplicating their text.

## Coverage target

The primary tranche comprises the Archive catalogues for:
- [GA 313](https://rsarchive.org/Lectures/GA313/): **9** lectures, 1921 — organ systems, sleep, head/chest/metabolic differentiation.
- [GA 314](https://rsarchive.org/Lectures/GA314/): **16** listed lectures/discussions, 1920–24 — heart-lung, kidney, liver-gallbladder-spleen and the threefold organization.
- [GA 315](https://rsarchive.org/Lectures/GA315/): **8** lectures, 1921–22 — the larynx and metamorphosis, therapeutic eurythmy, and inner organs.
- [GA 316](https://rsarchive.org/Lectures/GA316/): **16** listed items, including 13 main lectures and supplements, 1924 — liver and heart, bones and muscles, air and warmth, the hierarchy of builders.
- [GA 317](https://rsarchive.org/Lectures/GA317/): **12** lectures, 1924 — head/organ reflection, child development, embodiment.

**Total: 61 catalogue entries, not 61 entirely read lectures.** Later expansion should include GA 312, 318, 319, 27, 128, 205, 221 and every organ-related passage in the broader GA catalogue.

## Completeness criterion

A claim of completeness requires a ledger for every eligible lecture or chapter (including zero-hit entries), full-text inspection in context, extraction of **every substantive organ-related assertion**, exact passage links, cross-volume comparison, translation checks as appropriate, and second-pass editorial review. Search snippets and the 12 entries in the pilot are not evidence of whole-lecture coverage.

## Passage-level record model

Record one atomic claim per unit, with a stable ID and: GA; date; lecture and edition; URL; passage/paragraph cue; normalized organ and exact term; spiritual hierarchy or planet, where explicitly named; relation type; developmental scale; accurate editorial paraphrase; text status; original German review; cautions; compare-group; reviewer and date. Do not store lengthy copyrighted source text.

Suggested typed relations: `begins_development_on`, `transforms_during`, `fashioned_by`, `sustained_by`, `planetary_correspondence`, `organ_member_relation`, `sense_organ_analogy`, `metamorphosis`, `process_correspondence`, `sleep_activity`, `between_lives`, `therapeutic_claim`, `editorial_comparison`, `open_question`.

Evidence progression: `lead` → `located` → `selected_passage_checked` → `lecture_audited` → `translation_checked` → `reviewed`. `disputed` marks unresolved textual or interpretive differences. A selected-passage check never proves a full-lecture audit.

## Reading and extraction order

1. **High-yield proof of method:** entire-lecture audit of GA 314 (Oct. 27, 1922, a.m./p.m.) and GA 316 (Jan. 3, 4 and 7, 1924). Produce complete mention tables and a liver/heart comparative dossier.
2. **GA 313:** all nine lectures; distinguish head/chest/metabolism, astral/etheric relations and sleep processes.
3. **GA 315:** eight lectures; segregate metamorphosis of the larynx from therapeutic claims about kidneys, lungs and liver.
4. **Remaining GA 314, GA 316 and GA 317:** every listed item, including lectures where organ references are incidental. Include infant and childhood head/organ reflections.
5. **Cross-volume audit:** compare each organ against GA 128 and the existing organ-evolution v2 source register. Expand to the broader GA corpus with explicit coverage metrics.

## First comparison clusters

- **Liver:** Jupiter symbolism, Saturn-beings reference, food-value or material-sense function, the I/liver-gallbladder organization, and liver processes reflected in the head. These are different *types of claims*.
- **Heart:** Sun symbolism, Leo/first hierarchy origin, inner spiritual sense organ, rhythmic system, sleep activity, and future evolution.
- **Kidneys:** Venus correspondence, relation to astral organization, early-life head modulation, excretion imagery in GA 315, and between-lives statements.
- **Bones / muscles / inner organs:** cosmic versus earthly formative activity; elemental and higher hierarchies; forms and methods of cognition; Malkuth only as a distinct comparison framework.
- **Larynx / ear / chest:** organ metamorphosis, senses' cosmological history, speech and future change.

## Editorial and safety checks

No exclusive organ-to-being assignment without an explicit organ-naming passage. Do not confuse a cosmic planetary stage with a modern planet, or symbolic correspondence with an origin date. Preserve disagreements, chronology, literal-versus-metaphorical language, stenographic uncertainty and translation variants. Historical medical and disability-related statements must be attributed and contextualized; they are not evidence-based treatment advice.

## Acceptance tests

- Every indexed claim has a directly linked original lecture and a precise passage cue.
- All 61 catalogue entries receive an auditable reviewed/unreviewed status; only full-lecture inspection counts toward lecture coverage.
- Comparison dossiers preserve distinct causal, symbolic, temporal and psychological schemas.
- No duplicate verbatim archive mirror; links lead readers to RSArchive.
- Changes are versioned in this repository, keeping stable IDs.

## Pilot dataset

[research/organ-passages-ga313-317-pilot.json](../research/organ-passages-ga313-317-pilot.json) contains **12 passage-level seed records** from five GA volumes, each labelled `selected_passage_checked` and `full_lecture_audited: false`. These begin the concordance, but do not establish completeness.

**Next execution milestone:** finish *five complete lectures* before scaling the methodology. Then draft cross-linked **liver** and **heart** dossiers with a claims matrix and reconciliation notes.
