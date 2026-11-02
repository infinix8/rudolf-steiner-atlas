# Iteration 5 — depth-oriented source research and navigation

**Date:** 2 November 2026  
**Repository:** `infinix8/rudolf-steiner-atlas`

## Editorial purpose

The Rudolf Steiner Atlas adds **fine-grained concept navigation, source-qualified relationships and original study guides** above the Rudolf Steiner Archive and the Rudolf Steiner Archiv bibliography. The primary source archives continue to host the texts, not the atlas.

## Committed research and development

### 1. Closer reading, not just broader search

- Expanded the independently structured source-linked graph from **116 to 142 relationships**.
- Increased linked original archive pages from **27 to 30**, using directly opened chapters:
  - [GA 4, *The Philosophy of Freedom*, "Moral Imagination"](https://rsarchive.org/Books/GA004/English/RSP1964/GA004_c12.html);
  - [GA 9, *Theosophy*, "Re-Embodiment of the Spirit and Destiny"](https://rsarchive.org/Books/GA009/English/AP1971/GA009_c02.html);
  - [GA 9, *Theosophy*, "The Three Worlds"](https://rsarchive.org/Books/GA009/English/AP1971/GA009_c03.html).
- Added passage-linked distinctions among moral intuition, moral imagination, moral technique, and ethical individualism; esoteric preparation and personal independence; memory, biography and reincarnation in Steiner's argument; soul-world versus spiritland, and between temporary postmortem attachments and karmic claims.
- Recorded **60 cross-domain relationships** in total. Each source record identifies the work, English edition where known, exact page URL, selected passage cues and a clear declaration that the full work and other translations remain unaudited.

### 2. Research depth audit across all 150 subdomains

New source-coverage dashboard `atlas/coverage.html` has **three deliberately non-equivalent evidence statuses**:

| Status | Subdomains | Meaning |
|---|---:|---|
| Direct | 40 | This subdomain itself has at least one passage-linked graph relation |
| Child only | 39 | One or more descendant concepts have a graph relation; the broader subdomain is *not* certified |
| None | 71 | Neither the subdomain nor its descendants currently have graph-attached source evidence |
| Total | 150 | Exactly the initial subdomain count |

The [full 150-subdomain coverage table](SUBDOMAIN_EVIDENCE_COVERAGE.md) is reproducible via `python tools/report_subdomain_coverage.py --write` and validated by `--check` in CI. These numbers quantify the editorial graph's present gaps, **not the real coverage of all Steiner writings**.

### 3. Navigable chronology with no invented dates

New `atlas/timeline.html` presents the **18 dated lectures** in the 30-page source corpus in original chronological order. The **12 authored book and essay source pages** lacking a lecture date are shown separately. A modern English translation year is *not* used as the original event or publication date. Readers can filter by research domain, original work, lecture year and topic keywords. Original reading is opened at the archive.

### 4. Five detailed, original editorial source guides

Created `research/concept-dossiers-v1.json` with **five analytical dossiers and 17 original source-linked sections**:

1. **Human constitution:** ninefold, sevenfold, fourfold and distinct physiological uses of 'threefold'.
2. **Karma and biography:** memory, deeds, repeated earthly lives, after-death descriptions, and stronger limits on claims about illness and destiny.
3. **Freedom and initiatory training:** why the purposes and terminology of GA 4 and GA 10 should not be automatically equated.
4. **Worldview framework:** twelve orientations, seven moods, three tones, and symbolic correspondences in GA 151.
5. **Goethe and Goetheanum:** Goethe's plant metamorphosis, Steiner's research method, and his explicit architectural application.

Each dossier includes question-led synthesis, precise source locators linked to the original archive, canonical concept IDs, graph relations, contested or unproven claims, and questions for future study. They **do not** reproduce the original texts or claim to be Steiner-authored reading sequences.

### 5. Reproducibility and interface checks

- Added `tools/report_subdomain_coverage.py` and a checked report.
- Added `tools/validate_dossiers.py` to verify dossier/source/node/edge integrity and the presence of actual research sections.
- Extended GitHub Actions checks to all new source-focused pages.
- Expanded browser smoke tests to the subdomain dashboard, chronology and dossier reading flows, including desktop/mobile.
- Navigation among concepts, primary-source guide, evidence graph, coverage dashboard, chronology and dossiers is integrated into the static Atlas.
- Original source texts remain solely with RS Archive and other original repositories; no bulk harvesting, copying or shadow publication.

## Source and historical safeguards

All graph source references mean **selected passages inspected**, not complete original work reviews or collated German/English editions. Discussions of spiritual hierarchies, karma, reincarnation, spiritual medicine, and cosmic evolution are attributed to **Steiner's historical teachings**, not asserted as independently established science. Medical claims never justify foregoing qualified care or assigning blame for an illness.

## Research status and next priorities

The 26 large topic domains now have at least one graph incidence, but **71 subdomains remain without graph evidence**. Next iterations should:

- Prioritize original chapters and dated lectures for those 71 subdomains, documenting exact terms and passage context.
- Study the original German wherever available and trace alternate English translations, especially for human constitution and esoteric terminology.
- Add **chronological concept histories**, not just a chronological list of source dates: distinguish direct changes in Steiner's account, different contexts, and translation variants.
- Continue examining the original 30 broad proposed links: **4 exact matches, 1 only narrower evidence, 25 without matching evidence**. Never promote them by conceptual similarity alone.
- Expand dossier format to more disciplines, including epistemology, Christology, sciences, healing, pedagogy, social threefolding and arts.
- Test full keyboard traversal, focus, screen readers, contrast, mobile responsiveness and original source URLs before any deployment.

The Atlas is still a **local static prototype committed to GitHub**, not yet a public website. Future iterations occur in active sessions, not autonomously in the background.
