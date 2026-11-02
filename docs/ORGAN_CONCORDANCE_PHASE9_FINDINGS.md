# Organ concordance — Phase 9: six-lecture source census, waking/sleeping distribution, organ differentiation

**As of 2026-11-02.** Primary texts: GA 313, April 11–13, 1921, and GA 317, June 26–28, 1924. This is a source-grounded scholarly reconstruction of **Steiner's stated esoteric system**, not evidence for it as medical science.

## Audit status without false completeness

| GA/date | English numbered sections | Have sampled source passages checked (cumulative v8–v9) | Number located but not substantively inspected |
|---|---:|---:|---:|
| GA 313, 11 Apr 1921 | 21 | 13 | 8 |
| GA 313, 12 Apr 1921 | 30 | 20 | 10 |
| GA 313, 13 Apr 1921 | 20 | 12 | 8 |
| GA 317, 26 Jun 1924 | 33 | 15 | 18 |
| GA 317, 27 Jun 1924 | 26 | 14 | 12 |
| GA 317, 28 Jun 1924 | 34 | 15 | 19 |
| **Total** | **164** | **89** | **75** |

**Important:** A selected-passage check does not mean the full section has been exhaustively decomposed into every organ claim. The [164-section census](../research/organ-section-census-ga313-ga317-v9.json) explicitly stores `number_located_only` for the other 75. The [23 refined claims](../research/organ-clarifications-ga313-ga317-v9.json) largely overlap or refine the earlier GA 313/317 phase-8 selections; they must not be counted as 23 previously unknown independent passages. German originals remain uncollated.

The separate 61-entry GA 313–317 overall corpus ledger remains **6 complete numbered-English-section audits elsewhere, 1 unnumbered thematic review, 9 selected-passage reviews (six of these revisited in phase 9), 45 not reviewed, and zero certified exhaustive bilingual atomic-claim concordances**. See [coverage ledger v8](../research/organ-corpus-ledger-ga313-317-v8.json).

## Finding A. Not one organ, one spiritual 'owner': GA 313 I

[Original](https://rsarchive.org/Lectures/GA313/English/SOL/19210411.html), especially §§4–11, 16–19.

Steiner distinguishes the head as a zone where the **physical organization** has primary activity and etheric/astral/I organizations have their **imprints**; the chest as primary physical–etheric interplay plus astral/I imprints; and limb-metabolism as primary physical–etheric–astral interplay with an I imprint. These are **predominance or mode-of-activity statements**, not assertions of the other spiritual members being absent.

In §17 he explicitly mentions **heart and liver** as bodily organs differentiated by head-directed formative forces. His silica discussion distinguishes a *material expression* in the head from a supposed *force-process* strongest in the limbs (§11); it should be indexed under `formative_process` rather than `organ_cosmic_origin`. He proposes in §19 that detected chemical presence may have different meanings in constructive tissue and excreted material; specific silica and magnesium theories are not established biomedical mechanisms.

## Finding B. The etheric organization must itself be differentiated: GA 313 II

[Original](https://rsarchive.org/Lectures/GA313/English/SOL/19210412.html), §§2–11.

Steiner warns against visualizing the etheric body as one shapeless mist, comparing that mistake with treating **stomach, heart and liver** as a single anatomical blur (§3). He distinguishes warmth, light, chemical and life ethers (§§4–5) and says the **eye** has become organized through light and that the fluid organization of the head is a permeable etheric imprint (§7). He describes warmth/light forces associated with the head and chemical/life forces rising from the lower organism (§§8–10). Those are esoteric descriptions, not experimentally demonstrated physics.

**Critical correction:** In §26 he *qualifies* the common statement that astral body and I simply leave the body during sleep. He specifically describes a redistribution: a loosening from **head and respiratory** organization and deeper participation in **metabolic and circulatory** organization. Record this as `sleep_region_specific_reorganization`. It is not proof that particular Angels/Archangels tend those organs; no such assignments are established in this passage.

The lecture's §25 table **I–death; astral–illness; etheric–health; physical–nutrition** is a fourfold esoteric explanatory schema, **not valid etiology of illness**. His nearby assertions about malnutrition, poison, sulfur/phosphorus and arsenic are historical medical claims only and cannot be presented as treatment instructions.

## Finding C. The rhythmic chest as meeting region: GA 313 III

[Original](https://rsarchive.org/Lectures/GA313/English/SOL/19210413.html), §§1–15.

The chest organs are described as intimate physical–etheric cooperation that is reached by influences from the **head, metabolism and outer world**. The fact that it is an interaction-zone matters more to Steiner's argument than a one-to-one map of a single organ and its spiritual 'owner'. He speculates about delayed effects of worries, hasty thinking, recurring hunger and thirst on circulatory and respiratory rhythms (§§7–8). These proposed etiologies are not established diagnoses.

A consequential error appears in §14: Steiner treats germs as indicators rather than primary causes of infection. Infectious pathogens do cause infectious diseases. The concordance must preserve this as a *historical erroneous assertion* rather than repeat it in the voice of present-day medicine.

## Finding D. Brain and eye as meeting points: GA 317 II–III

[Lecture II](https://rsarchive.org/Lectures/GA317/English/SOL/19240626.html), §§12–16, 21–25; [Lecture III](https://rsarchive.org/Lectures/GA317/English/SOL/19240627.html), §§7–11.

In the second lecture, Steiner says living thoughts already inhabit the *world ether* and that the **brain/nervous system** is a reflecting organ that converts them to ordinary subjective thought. This is a metaphysical *cognitive reflection* account, not a planetary origin date, and his account of nerve breakdown is not accepted neuroscience. He applies a separate educational 'next-higher-member' schema to educator and child (§§21–23), and gives a medically unsupported liver/etheric explanation of difficulty translating intention into action (§25).

In the third lecture, the **I** allegedly enters direct relation with terrestrial forces, especially gravity, and the **astral body** with warmth, light, chemical and life ether. The **eye** is used as an especially outward-open organ of interaction (§11). Again, this does not identify an exclusive named hierarchy as the eye's builder.

## Finding E. Organ surfaces, pain, epilepsy, and invalid character readings: GA 317 III–IV

[Lecture III](https://rsarchive.org/Lectures/GA317/English/SOL/19240627.html), especially §§12–14,22; [Lecture IV](https://rsarchive.org/Lectures/GA317/English/SOL/19240628.html), §§3–7,14.

Steiner proposes two opposing supersensible 'organ-boundary' cases: astral/I **retention or congestion** inside an organ, and excessive **permeability/outflow** through its surface. He applies these to seizures, pain, secretions and bedwetting. These are **scientifically unsupported or incorrect medical explanations** and must not guide clinical care.

The historical phrenological attribution of moral character to skull form or organ action in GA 317 III §22 is invalid and stigmatizing. The database flags it as `historical_false_character_etiology` and requires contextual cautions in any display.

## Data model improvements and comparison method

The same organ can legitimately have distinct `relation_type` values:
- `earliest_cosmic_rudiment` (e.g., heart/Leo/hierarchies in GA 110);
- `primary_vs_imprint` (GA 313 I, head/chest/limbs);
- `organ_differentiation` (GA 313 I, heart/liver);
- `four_ether_distribution` (GA 313 II);
- `sleep_region_specific_reorganization` (GA 313 II);
- `cognition_reflection` (GA 317 II brain);
- `sensory_world_interface` (GA 317 III eye);
- `organ_boundary_retention`, `organ_boundary_outflow` and `historical_unsupported_etiology` (GA 317 III–IV).

These are *distinct explanatory frames*, and a single title or organ-name tag does not make them synonyms or contradictions. Any future conflict judgment needs explicit same-organ, same-relation, same-time-frame evidence. Maintain exact source URL, lecture date, English section cue and unresolved German status.

## Next execution milestone

1. Read all **75 remaining numbered sections** in this six-lecture group; log no-organ sections as carefully as positives.
2. Split multi-assertion passages into canonical atomic claims; record duplicate/overlap/contradiction adjudication against v8 data.
3. Collate every section against the German original, using direct linked version information.
4. Audit the 45 as-yet-unreviewed entries in GA 313–317, particularly organ-formation and spiritual-agency passages.
5. Produce stable organ-level views for *heart, liver, brain, eye and chest* without mirroring Rudolf Steiner Archive texts.

This report is an editorial reading aid to original Steiner works, not a medical reference.
