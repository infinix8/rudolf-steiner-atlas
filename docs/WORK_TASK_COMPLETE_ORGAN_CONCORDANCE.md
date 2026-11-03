# ChatGPT Work task: Rudolf Steiner Organ Evolution — complete source-linked concordance

**Latest continuation checkpoint (3 November 2026):** [Phase 19 resume](ORGAN_CONCORDANCE_RESUME.md). GA313 I–IX, GA315 I–VIII and GA317 I–XII have complete English source-view reviews. GA314 entries 1–4 and 7 are complete; entry 6 remains thematic. Corpus: **37 complete English source views, 1 thematic, 0 selected-only, 23 unread; 932 numbered source units plus one supplemental table**. Five GA315 VI units are Husemann/heading; preserve confirmed source-event aliases. Next: GA314 entry 5, 26 October 1922, first section, then remaining GA314/316. Latest cumulative manuscript is v19, preserving all v15 bytes.

**Task status:** Ready for a long-running ChatGPT Work handoff. This file is an executable research brief, not an assertion that a Work run has started.

**Canonical GitHub repository:** [infinix8/rudolf-steiner-atlas](https://github.com/infinix8/rudolf-steiner-atlas) (private; use the connected GitHub account). **Tracking issue:** [#14](https://github.com/infinix8/rudolf-steiner-atlas/issues/14). Keep this project separate from every BOTA repository.

## Mission

Continue building a comprehensive, eventually exhaustive, **passage-by-passage concordance of every Rudolf Steiner statement about human organs**, organ systems, spiritual hierarchies, cosmic evolution and planetary stages, etheric/astral/I relations, cognition, development, sleep, death/rebirth and organ metamorphosis. Work for as long as the session permits, maximizing verified primary-source research and committed improvements. Do not stop after planning, and do not invent completeness. When a time/resource limit occurs, finish by committing durable progress and explicitly marking where to resume.

**Source limitation:** For claims about Steiner's own teachings, use only **Steiner's original writings and recorded lectures**. Locate via [Rudolf Steiner Archive](https://rsarchive.org/) and authorized GA catalogs, using exact original lecture/chapter links, and ideally the original German text. Do not reproduce or scrape entire archive texts into the repository. Create concise original editorial paraphrases, indexes, comparison tables, passage-level references and crosslinks; this Atlas should *complement*, never mirror, RS Archive.

## Read existing state before research

- [Phase 11 findings](ORGAN_CONCORDANCE_PHASE11_FINDINGS.md)
- [v11 GA 313–317 corpus ledger](../research/organ-corpus-ledger-ga313-317-v11.json)
- [v11 six-lecture section census](../research/organ-section-census-ga313-ga317-v11.json)
- [v11 organ and system dossiers](../research/organ-comparative-dossiers-v11.json)
- [GA 313 III / GA 317 II 53-section review](../research/organ-paragraph-review-ga313-iii-ga317-ii-v11.json)
- [v11 atomic claims](../research/organ-atomic-claims-ga313iii-ga317ii-v11.json)
- [Source method](SOURCE_METHOD.md) and [content model](CONTENT_MODEL.md)
- [Research issue #14](https://github.com/infinix8/rudolf-steiner-atlas/issues/14) and previous phases' files.
- If the user attaches **Steiner_Organ_Evolution_Research_Atlas_v11.docx** or **v11.md**, preserve all prior chapters and citations in cumulative future revisions. The complete version 11 manuscript is not assumed to be committed in GitHub.

Baseline, as documented in v11: GA 313–317 contains 61 catalog entries; **10** lectures have complete numbered-English-section reviews, **one** has an unnumbered thematic sweep, **five** have selected-passage-only reviews, and **45** entries are unread. The targeted GA 313 I–III and GA 317 II–IV group comprises 164 numbered sections; **133** have received at least substantive review, **31** remain only located, and no complete original-German, bilingual exhaustive atomic-claim audit has been certified. These figures are the starting point, not evidence that any not-yet-inspected sections are reviewed.

## Immediate execution milestone (first, not last)

1. **Complete GA 317 Lecture III (27 June 1924) and IV (28 June 1924).** Read all numbered English sections, especially the **12 + 19** previously unreviewed sections. Do not rely on snippets. Record organ-related and context/zero-claim sections. Primary texts:
   - https://rsarchive.org/Lectures/GA317/English/SOL/19240627.html
   - https://rsarchive.org/Lectures/GA317/English/SOL/19240628.html
2. Compare high-impact passages with available original German versions, logging exact terms and translation ambiguities; do not mislabel limited spot checks as full German collation.
3. Produce an atomic claim dataset, where each independent claim has a stable ID, GA/date, section/paragraph cue, URL, organ or system, agent (only if named explicitly), claim predicate, temporal framework, concise paraphrase, evidence state, and caveats. Explicitly distinguish an organ's cosmic *origin*, spiritual *builder*, present *function*, *symbology*, sleep/wake relation, and alleged inter-incarnation role.
4. Reconcile duplicate or near-duplicate claims with v8–v11 datasets using `same_claim`, `overlap`, `different_context` and `apparent_conflict`; avoid adding every rephrasing as a unique discovery.
5. Update numbered-section audit ledger, overall GA 313–317 coverage ledger, organ dossiers, comparative research report and repository changelog; commit verified changes to GitHub. Keep #14 updated with specific completion metrics.

## Extend research vigorously after milestone

Proceed through all **45 unread** GA 313–317 catalogue entries, prioritizing GA 313 IV–IX, GA 315 V–VIII, GA 317 V–XII, and remaining GA 314/316 lectures. Then broaden to GA 128 (all lectures), 110, 102, 107, 205, 208, 218 and the wider medical and cosmological GA corpus. Check each full text, including sections with no organ-specific claims. Develop organ-specific dossiers on heart, liver, kidneys, lungs, spleen, brain, eyes, ears, bones, muscles, thyroid, larynx, digestive tract and endocrine/reproductive organs as the sources allow. For spiritual-agency claims, distinguish named ranks (Thrones/Cherubim/Seraphim, etc.) from generic *higher beings*; **never manufacture one-to-one angel-to-organ assignments**.

## Editorial quality rules

- Each claim must be attributed to Steiner; do not mistake his esoteric or speculative medical assertions for established anatomy, medical diagnosis, disability causation or treatment.
- Clearly flag incorrect medical statements about pathogens, cardiac pumping, epilepsy, inherited traits, etc., and harmful/stigmatizing disability explanations, without hiding them from historical study.
- Distinguish literal claims, symbolic correspondences, analogies, developmental stages and editorial inferences.
- Prefer exact source paragraph, lecture date and original German terminology when checked. Distinguish authored books from posthumously transcribed lectures.
- Keep stable IDs, auditable provenance, claim-level source links, explicit `not_reviewed` status, and correction history. **Do not invent quotations, section numbering, claims, GA references, edition metadata, or completion statistics.**
- Use a source-status ladder: `lead`, `located`, `selected_passage_checked`, `complete_English_section_review`, `German_spot_checked`, `bilingual_collated`, `atomic_claim_exhaustive_and_second_reviewed`. Do not advance status without doing the work.
- Never mirror copyrighted lecture bodies. Small accurate quotes when needed; otherwise concise original paraphrases and links.

## Persistent deliverables / success conditions

1. Commit every meaningful milestone to the **same Steiner repo**, not the BOTA repos, with source-linked Markdown reports and machine-readable JSON.
2. Expand the searchable knowledge graph and organ-dossier cross-references while maintaining the existing taxonomy's stable IDs.
3. Produce a **cumulative research manuscript**, extending version 11 rather than replacing it, in Markdown and DOCX when tools permit; if the source v11 document is unavailable, request it for a cumulative document rather than claiming to have preserved it.
4. At the end of each long Work execution, provide an honest status report with: source lectures checked; whole-English vs sampled vs German-verified; newly reconciled unique atomic claims; outstanding sources; files/commits; unresolved contradictions; and the **precise next resumption point**.
5. Continue across multiple iterations without stopping at a plan. Prioritize **completed source audits and connected evidence** over length, repetition, or inflated counts.

**Important operating distinction:** A ChatGPT Work task is an on-demand long-running research handoff, not a timed recurring automation. Running it must be initiated in ChatGPT Work by the user; saving this file alone does not start an agent.
