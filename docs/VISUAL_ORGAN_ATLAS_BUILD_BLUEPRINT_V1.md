# Visual Organ Atlas — Implementation Blueprint v1

**Repository:** [Rudolf Steiner Atlas](https://github.com/infinix8/rudolf-steiner-atlas)
**Research baseline:** phase 29, 5 November 2026.
**Purpose:** turn source-verified organ research into a visual-first, progressively deeper, mobile-friendly learning experience. This file is an implementation specification and a record of the first working body-map pilot, not a claim that all requested views are complete.

## 1. Present implementation and remaining scope

**Implemented and committed in this iteration:**
- [Interactive human-body map](../atlas/body.html): responsive front-facing schematic, eight selectable organ regions, searchable button alternatives, system filter, organ preview, selection highlighting and accessible direct routes.
- [Eight-organ navigation dataset](../research/organ-body-map-v1.json): canonical organ dossier IDs, names, system, related terms, provenance-sensitive status and destination.
- [Guided Heart/Liver preview](../atlas/mobile-preview.html): Overview, Development, Connections, Sources; direct original Steiner source links.
- [40-organ research index](../atlas/organs.html): all existing dossiers, reachable for organs without a polished guided page.
- The [combined homepage](../site/index.html), existing thematic Atlas and organ research index now link to the body map.
- GitHub Pages and Chromium smoke workflows remain manual-only. **No GitHub Actions workflow was run as part of this implementation.**

**Not yet implemented:** reusable eight-layer organ-detail template, mini body locator for every organ page, full source-resolving visual networks, cosmic overlays and all 40 polished guides. No new deployment has been started. The committed body map will become live after one manual release.

## 2. Information architecture and navigation

Published routes:

| Path | Purpose |
| --- | --- |
| / | Unified public homepage |
| /atlas/index.html | Thematic Steiner Atlas: 6 regions, 26 domains, nested taxonomy |
| /atlas/body.html | New clickable human map — preferred organ entry |
| /atlas/mobile-preview.html#heart/overview | Existing guided Heart page |
| /atlas/mobile-preview.html#liver/overview | Existing guided Liver page |
| /atlas/organs.html?organ=organ-heart | Full Heart source-linked research dossier |
| /atlas/agency.html | Named hierarchy, stage, activity comparison |
| /atlas/graph.html | Evidence-linked concept relationships |
| /atlas/sources.html | Original-source guide |

**Future standardized destination:** /atlas/organ-detail.html?organ=organ-heart&layer=overview . Existing preview hashes and older dossier links must keep working.

User journey: Atlas homepage → interactive body → select organ (highlight + preview) → open guided page (Heart/Liver) or source-linked dossier → choose level of explanation → original passage if desired → back to body/thematic Atlas.

A single map selection must never unexpectedly open a page. The preview CTA performs navigation. Selection is replicated with keyboard-reachable labeled buttons to avoid making an SVG drawing the only access path.

## 3. Human figure and hotspot system

**Artwork:** SVG viewBox 0 0 360 640, stylized neutral front figure; simple shapes, ivory silhouette and muted organ colors. Position and size are explicitly schematic—not medical anatomy, not asserted Steiner correspondences. Kidney positions are moved forward for navigational visibility.

Initial organs:

| Canonical ID | Display | Region | Current click destination | Research condition |
| --- | --- | --- | --- | --- |
| organ-brain | Brain | Head | Research dossier | Passage-linked |
| organ-lungs | Lungs | Chest | Research dossier | Passage-linked |
| organ-heart | Heart | Chest | Guided Heart | Guided pilot |
| organ-liver | Liver | Upper abdomen, anatomical right | Guided Liver | Guided pilot |
| organ-stomach | Stomach | Upper abdomen, anatomical left | Research index | Indexed; substantive dossier relations pending |
| organ-spleen | Spleen | Lateral left abdomen | Research index | Indexed; substantive dossier relations pending |
| organ-kidneys | Kidneys | Abdominal region, schematic | Research dossier | Passage-linked |
| organ-intestines | Intestines | Abdomen | Research dossier | Passage-linked |

A small tap target may be difficult for spleen or heart; the adjacent name list is a full-function alternative. Future enhancements may add invisible 44px equivalent interaction targets, label leaders, or magnification without losing meaningful anatomical placement.

Future display modes: front/back; bodily systems; cosmic stages; physical/etheric/astral/I associations; agency roles. These are **different filters over checked propositions**, never proof of a single hierarchy assigned to each organ.

## 4. Organ-page architecture: eight layers

The reusable organ page is mobile-first: headline + mini highlighted body locator + one-line essence + 3–5 key chips. Show only a short explanation before optional layers.

| ID | Visible label | Visual module | Rule |
| --- | --- | --- | --- |
| overview | At a glance | 2-minute summary, 3–5 illustrated idea cards | Every significant claim has direct checked evidence |
| body | In the organism | Highlighted locator, present physical context | Modern anatomy separated from Steiner's speculative medical theory |
| interpretation | Steiner's account | Member/function cards, inward-sense diagrams | Attribution and context required; no imagined hierarchy |
| evolution | Evolution | Stage timeline with source cues | Planetary embodiments, recapitulation and present planet separate |
| agencies | Beings & activity | Beings × stage × action × target matrix | Named beings only if explicitly named |
| connections | Connections | Small clickable relation network | Typed sourced edges, not word association |
| sources | Original sources | GA/date/genre/paragraph, checked German status, outgoing links | Exact source anchor and verified review status |
| questions | Open questions | Apparent conflicts, gaps and textual issues | Preserve disagreement, never silently reconcile |

Three reader depths:
1. **Quick** — concise explanation, locator, 3–5 key ideas and key original links.
2. **Explore** — evolution, agency, member roles, relational graphics and comparisons.
3. **Research** — candidate claim IDs, GA/source cue, translation note, conflicts and audit status.

All visual modules require textual equivalents for screen readers and a no-JS/fallback link when possible. Avoid long scrolls of undifferentiated claims.

## 5. Content blueprint: HEART

**Canonical ID:** organ-heart. **One-line essence:** Steiner discusses the heart across primordial dispositions, rhythm, warmth, inward sense and spiritual images of conscience.

| Visual block | Carefully separated interpretation | Checked source anchor |
| --- | --- | --- |
| Primordial disposition | First heart rudiment on Old Saturn; not a modern anatomical heart | [GA 110 IX §8](https://rsarchive.org/Lectures/GA110/English/SOL/19090418a01.html) |
| Earth recapitulation | Later heart-centered warmth/branching organization as Earth repeats earlier states | [GA 102 V §§9, 21–24](https://rsarchive.org/Lectures/GA102/English/SOL/19080316p01.html) |
| Rhythmic organization | Rhythmic equilibrium understood through head/metabolic influence | [GA 313, 13 Apr 1921 §3](https://rsarchive.org/Lectures/GA313/English/SOL/19210413.html) |
| Claimed inner sense | Heart as inward sense for astral and I-related organization | [GA 316, 3 Jan 1924 §§15–16](https://rsarchive.org/Medicine/YoungDoctors/19240103p01.html) |
| Warmth and conscience | Warmth relation and speculative conscience/future disposition claims | [GA 205, 2 Jul 1921 §§13–16, 21](https://rsarchive.org/Lectures/GA205/English/SOL/19210702p01.html) |

**Hero chips:** warmth, rhythmic system, blood, inward sense, conscience. Each chip links to a distinct explanation, never a uniform causal claim.

**Primary comparison:** Old Saturn *first disposition* versus Earth *recapitulation*. Show them as parallel sourced cards with explicit context labels. No modern anatomy is said to exist on Old Saturn.

**Open questions:** named hierarchies versus present sustaining activity; Sun symbolism versus genesis; complete German comparison; broader reconciliation across sources.

**Safety:** GA 205 denies cardiac pumping, which is medically false. Preserve this source fact and a clear critical note; do not imply clinical evidence.

## 6. Content blueprint: LIVER

**Canonical ID:** organ-liver. **One-line essence:** Steiner relates the liver to nourishment, purported inward perception, a Jupiter correspondence, developing head relationships and willing.

| Visual block | Carefully separated interpretation | Checked source anchor |
| --- | --- | --- |
| Planetary correspondence | "Inner Jupiter" provisionally invoked as analogy, not origin on physical Jupiter | [GA 128, 21 Mar 1911 §11](https://rsarchive.org/Lectures/GA128/English/SOL/19110321p01.html) |
| Nourishment | Claimed inner sense of food value | [GA 316, 3 Jan 1924 §§13–16](https://rsarchive.org/Medicine/YoungDoctors/19240103p01.html) |
| Liver–gall and I | Warmth/I and early-childhood head reflection are broader liver–gall relations | [GA 314, 27 Oct 1922 morning](https://rsarchive.org/Lectures/FundAnthro/19221027a01.html) and [afternoon §10](https://rsarchive.org/Lectures/GA314/English/MP1986/19221027p01.html) |
| Will and movement | Esoteric assertion about a child's intention becoming action; not clinical diagnosis | [GA 317, 25 Jun 1924 §§7, 21](https://rsarchive.org/Lectures/GA317/English/SOL/19240625.html) |
| Water, memory, future | Distinct element and spiritual-development images | [GA 205, 2 Jul 1921 §§5, 10, 21](https://rsarchive.org/Lectures/GA205/English/SOL/19210702p01.html) |

**Hero chips:** nourishment, liver–gall, Jupiter analogy, water element, will, head.

**Primary comparison:** Jupiter planetary analogy vs water-element relation. Different predicates; do not fuse into a statement that Jupiter literally produced the liver out of water.

**Open questions:** GA 102 Saturn-beings vs Jupiter analogy, organ versus wider liver–gall scope, source translation, unsupported diagnoses.

**Safety:** Liver-related assertions about childhood neurology, disability or disease are historical propositions, not established medical mechanisms.

## 7. Data and engineering contract

Already created:
- [Visual body map JSON](../research/organ-body-map-v1.json) with stable canonical dossier IDs and status: guided / research_dossier / index_only.
- [Body map HTML](../atlas/body.html) reads the JSON and renders selection, filter and preview.
- Existing [organ current manifest](../research/organ-current.json) and [40 dossier JSON](../research/organ-comparative-dossiers-v29.json) must not be replaced or truncated.

Proposed next:
- research/organ-atlas-guides-v1.json: reviewed short and long presentation content keyed by dossier ID.
- research/organ-visual-connections-v1.json: graph-edge specifications with source claim IDs and relationship predicates.
- atlas/organ-detail.html, atlas/organ-detail.js, atlas/organ-detail.css: reusable eight-layer organ renderer.
- tools/validate_visual_organ_atlas.py: schema, route and source integrity checks.

**Sample content model** (not a verified claim; placeholders must never display as verified source):

    {
      "id": "organ-heart",
      "title": "Heart",
      "layers": [
        {
          "id": "evolution",
          "description": "Human-edited summary",
          "cards": [
            {
              "relation_type": "first_rudiment",
              "temporal_framework": "Old Saturn",
              "evidence_ids": [],
              "editorial_status": "draft"
            }
          ]
        }
      ]
    }

The eventual evidence resolver follows: guide card → stable claim/dossier ID → GA/date/exact cue/edition → original archive URL → checked German status. If a reference is absent, show an evidence gap. Do not invent source IDs or count alternate translations as independent events. Research facts are historical attributions, not scientifically verified findings.

## 8. Acceptance criteria and low-cost test procedure

**Body map:**
- Exactly eight map entities with unique canonical IDs and valid routes.
- Eight SVG hotspots and eight equivalent textual controls are visible/keyboard accessible.
- Click/tap selects without leaving the page; preview CTA navigates.
- Search and system filtering update the organ list; selection persists predictably.
- Heart and Liver reach guided pages; remaining organs reach their existing source-linked or indexed dossier.
- Front-position sketch is labeled schematic, not a medically exact depiction.
- The default screen prioritizes organ shapes and visual navigation over paragraphs.

**Organ detail V1.1:**
- Heart/Liver each have eight layer slots; if a slot lacks checked content, show "research pending".
- Every source-qualified diagram edge has the claim cue and exact archive source.
- Old Saturn and Earth recapitulation stay distinct; Jupiter analogy and water correspondence stay distinct.
- Do not invent exclusive builders of organs.
- Modern factual anatomy and speculative historical therapies are explicitly distinguished.
- A mini body locator and mobile-friendly cards replace walls of text.
- Full existing 40-dossier navigation and thematic Atlas links remain available.

**Testing without GitHub Actions:** use local syntax checks, JSON validation, a localhost static web server and desktop/mobile browser inspection. Confirm no missing JSON or broken deep links, keyboard access and readable mobile tap targets. A manually run browser smoke test is optional and should be reserved for a release milestone.

## 9. Build order and GitHub Actions budget

1. **V1 body map — committed:** SVG body, eight hotspots, filter and preview, routes and homepage integration.
2. **V1.1 reusable detail page:** build eight-layer card/diagram rendering, initially Heart and Liver, retaining old routes.
3. **V1.2 rich connections:** sourced timelines and focused connection networks, click-through to exact GA passages.
4. **V1.3 expand curated content:** lungs, kidneys, brain and spleen, with honest sparse states.
5. **V2 broader 40-dossier presentation:** add systems, back view, research-aware overlays, guided study paths.

**Publishing must remain manual-only.** Both known workflow definitions use workflow_dispatch without automatic push triggers. Multiple research/design commits can be batched; **run one Pages workflow only when the version is ready**. No deployment was initiated by these GitHub edits.

## 10. Governing references

[Research resume](ORGAN_CONCORDANCE_RESUME.md) · [Version 29 findings](ORGAN_CONCORDANCE_SESSION_V29.md) · [Cumulative manuscript](Steiner_Organ_Evolution_Research_Atlas_v29.md) · [Original presentation blueprint](ATLAS_ORGAN_PRESENTATION_BLUEPRINT.md) · [Publication guide](ATLAS_PUBLICATION_GUIDE.md).

Steiner's original books/lectures remain at [RS Archive](https://rsarchive.org/), while this Atlas contains independent editorial maps, summaries, source cues and connections rather than a second text archive.
