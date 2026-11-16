# Chronology research checkpoint · v0.3

**Latest research revision:** The main-branch commit containing this checkpoint. The preceding verified milestone is [48261405](https://github.com/infinix8/rudolf-steiner-atlas/commit/48261405a364f1585cfed5556976f41bc1363a0e). The v0.2 integration base is [3515ed67](https://github.com/infinix8/rudolf-steiner-atlas/commit/3515ed67febc6b63fd85561f2462ae1add0b8179).

## Current evidence and coverage

- [Cumulative research concordance](STEINER_CHRONOLOGY_RESEARCH_CONCORDANCE.md) and [structured audit](../research/steiner-earth-culture-audit-v03.json). The audit records 75 passage-backed findings, 104 relationships, dossiers for all seven Earth epochs and seven post-Atlantean periods, an Old Saturn heart supplement and four unchecked source leads. Findings include new details and better evidence for existing entries.
- [Explorer index](../research/steiner-hierarchical-chronology-events-v03.json). All 231 v0.2 IDs remain. V0.3 adds 45 entries and attaches audit evidence to 35 earlier entries, reaching 276 entries and 47 source-register records. The seven cosmic dossiers retain their v0.2 dataset.
- Targeted research across 13 GA volumes and 27 English or English-labelled source views. Two GA 346 views represent the same lecture, while one of those views prints §12 in German. Four German-only views supplied additional spot checks. Eleven finding records include German checks. This session completed zero whole source-view or whole-volume audits.
- The [coverage table](STEINER_CHRONOLOGY_RESEARCH_CONCORDANCE.md#corpus-coverage) and the structured `coverage_ledger` give available edition-level denominators. The structured `sources` array records exact passage scopes, dates and URLs. Those scopes describe targeted reading. The overall corpus denominator remains undetermined.
- The relationship tally includes 41 directly stated links, 20 cross-passage links, 29 reciprocal organ links across 12 dossiers, 11 editorial crosswalks and three unresolved comparison links. Eight of 13 comparison records remain open. Five have a qualified distinction.
- First-pass coverage includes GA 11 III–X selections, GA 13 IV §§69–115 and VI §§3–8 selections, GA 104 III, VIII, IX and XI selections, GA 104a Oslo II-9 §§1–13, GA 106 I §§12–14, GA 110 VIII §§6–8, GA 121 III §§17–23 selections, GA 181 30 July §§2–10, GA 184 IV period arithmetic, GA 185 I §§4–5 and VIII §§3–7, GA 186 VII §§17–23 and §§40–42, GA 201 XII §§5–11 and §19, and GA 346 VI §§8–27 selections and VII §§2–18 selections.

## Distinctions to preserve

- GA 11 Atlantean phases overlap. GA 13 IV §88 and §97 distinguish early Ahrimanic fear from later sensory and postmortem distortion. The named Atlantean phases do not give an exact calendar for the processes in GA 13.
- GA 13 IV §77 and GA 104 IX §7 place and attribute early soul-member formation differently. German GA 13 has `Bewusstseinsseele` for Adams's “spiritual soul.” Keep early formation, the Atlantean I-soul threshold, the 333 CE placement in GA 346 VII and the fifth cultural period's soul emphasis distinct.
- GA 110 VIII §§6–8 puts an early heart germ in Old Saturn and relates it to Leo. GA 104 IX §§20–22 describes a rudiment leading toward the physical heart in the Atlantean lion group-soul account. The comparison is open. The canonical [organ dossier manifest](../research/organ-current.json) still controls organ research versions.
- GA 201 XII distinguishes a cultural sequence and a Christological current. GA 346 VI distinguishes intersecting archangelic cycles, permits another use of the Ephesus image, and qualifies strict numerical regularity in the consciousness-soul age. Keep the derived calendar labels approximate.
- Philadelphia is within the post-Atlantean set of seven cultures. The war succeeds its seventh culture and precedes both projected Earth epochs. GA 104 XI's later states of form and condition of life still belong to Earth. GA 104a II-9 §6 contains a marked source gap. The complete seal and trumpet concordance remains open.

## Exact next batch

1. [GA 346 VII, 11 September 1924](https://rsarchive.org/Lectures/GA346/English/SOL/19240911.html) at §19. Read to the end and proceed through [VIII](https://rsarchive.org/Lectures/GA346/English/SOL/19240912.html) to XII. Compare the VII dating phrases in §§3 and 14 across the German and another English view. Retain critical attribution for sectarian claims in context.
2. Compare German [GA 104 IX, 26 June 1908](https://rsarchive.org/Lectures/GA104/English/SOL/19080626p01.html), especially the parallels to SOL §§6–8 and §§19–22. Then start [X, 27 June](https://rsarchive.org/Lectures/GA104/English/SOL/19080627p01.html) §1 and extract the later Earth structure. GA 104 VIII remains open after §8 and IX after §22.
3. Compare the [Hindes translation of GA 104a Oslo II-9](https://rsarchive.org/Lectures/ReadApoc/19090518p01.html) at the parallel to SOL §6, then continue to Oslo II-10 from its first paragraph. Build a matching table for the seal and trumpet images using each lecture's own scale.
4. Begin the full [GA 121 I, 7 June 1910](https://rsarchive.org/Lectures/GA121/English/SOL/19100607p01.html) at §1, then II, then III at §1 around the existing selections. Resume GA 11 IX at §1 for the early substance sequence and GA 11 X with §§1–2, 7–8 before full-volume collation. Compare GA 110 IX on heart, Leo and neighboring structures using the existing organ audit.

## Files and validation

- Research and continuation: `docs/CHRONOLOGY_RESEARCH_RESUME.md`, `docs/STEINER_CHRONOLOGY_RESEARCH_CONCORDANCE.md`, `research/steiner-earth-culture-audit-v03.json`, `research/steiner-hierarchical-chronology-events-v03.json`.
- Research navigation and cross-links: `atlas/chronology-celestial.js`, `atlas/chronology-dial.js`, `atlas/organs.js`.
- Project index and integrity validator: `README.md`, `tools/validate_chronology.py`. Run it alongside the repository's integrity checks before committing the next snapshot. Only the consolidated integration revision triggers Pages under the existing path-filtered workflow.
