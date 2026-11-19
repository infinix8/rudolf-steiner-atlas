# Rudolf Steiner Atlas — Archive-First Experience Master Plan

**Date:** 19 November 2026  
**Status:** Proposed execution roadmap, based on repository audit; not an implementation-complete claim  
**Audit baseline:** main at 20e89f22201e3f034aade9ee46c409944697059b (latest observed commit before this document)  
**Primary source library:** https://rsarchive.org/  
**Public Atlas:** https://infinix8.github.io/rudolf-steiner-atlas/  
**Purpose of this plan:** Define a coherent reader-facing experience *over* the Rudolf Steiner Archive, preserving the Atlas's source-verified research and existing visual prototypes.

> **North star:** A curious visitor should be able to start with a question, experience a vivid and comprehensible explanation, understand how the idea connects to other themes, and reach the exact original book/lecture at RSArchive without knowing GA numbers or navigating research machinery.

## 0. Non-negotiable product decisions

1. **The Atlas is a guide, not a competing archive.** RSArchive remains the place to read complete source texts, compare translations, search the corpus and explore official archive listings. The Atlas adds guided discovery, explanatory diagrams, structured conceptual navigation, connections, and provenance.
2. **Source fidelity before spectacle.** Illustrations and animations interpret attributed Steiner concepts; they are not evidence. Every substantive teaching statement links to the best available exact source and openly shows verification limits.
3. **Progressive disclosure.** Initial pages are simple and image-led; deeper layers expose relationships, debates, translations, detailed citations and research coverage. Never dump the 1,006-node taxonomy on a first-time reader.
4. **One coherent Atlas, many modes of exploration.** The chronology, body map, theme browser, reading paths, knowledge graph and original-source index should interlink, not feel like separate websites.
5. **Preserve all previous work.** Keep stable IDs, current JSON datasets, manuscripts, source ledgers and named POCs. Introduce an integrated primary experience, mark older POCs as labs/experiments, and retire routes only after regression testing and redirects.
6. **Desktop and phone are both first-class.** Minimize control density, avoid clipped dial/desktop rail layouts on phones, and test actual interactions rather than CSS alone.
7. **Low-cost publishing.** Reuse the selective GitHub Pages workflow, do not introduce new scheduled workflows or build infrastructure unnecessarily. Documentation-only commits should not trigger Pages deployment.

## 1. What exists: evidence-based audit

### Current repository inventory (19 November 2026)

| Area | Observed implementation | Opportunity / qualification |
| --- | --- | --- |
| Homepage | site/index.html: six visual world cards, concept search, visual journey links, source/research menu | Helpful beginning, but not yet a single guided product with clear reader levels and consistent transitions |
| Thematic navigator | atlas/index.html + app.js + explore.*; six regions, 26 domains, 150 subdomains, approx. 1,006 taxonomy nodes | Valuable comprehensive reference; hierarchy and dense options require a curated beginner layer |
| Reading paths | atlas/study-paths.json: eight editorial paths, 41 total steps; atlas/journey.* | Working step navigation; expand each step into a short, image-led explanation with a stronger source handoff |
| Cosmic/evolution POCs | chronology-celestial, chronology-dial, chronology-time-dial, chronology-story, chronology-story-vivid, human-evolution, evolution-story, cosmic-evolution | Multiple overlapping entry points; select one primary chronology experience while preserving prototypes in a separate laboratory |
| Illustrated cosmic stories | atlas/story-scenes/story-visual-index.json: seven planetary conditions × eight curated moments = 56; seven SVG sheets **and seven WebP sheets are present in repository**, latest commit added painted assets | Audit actual rendered WebP mapping, crop fidelity, image meaning, responsive scene layout and live deployment; do not rely on older notes saying assets are missing |
| Body/organ map | atlas/body.html, organ-detail.*, organs.*, compare-organs.html, research/organ-atlas-guides-v*.json | Deep and differentiated layers; connect directly to concepts, evolution timelines and archive citations |
| Research data | Research manifests, v29 organ dossiers, chronology v0.5 event index, audited relations, knowledge graph and multiple ledgers | Substantial evidence base; keep counts separated by dataset and review level; do not present it as full corpus coverage |
| Sources/evidence | atlas/sources.*, graph.*, coverage.*, app.js source markers; research/archive-topic-crosswalk.json | Links to originals and evidence badges exist; source handoff and research statuses need one reusable component and clearer language everywhere |
| Delivery | Static HTML/CSS/JS/JSON; .github/workflows/publish-organ-atlas.yml; .github/workflows/validate.yml; manual Chromium smoke suite | Fits low-cost Pages. Keep data-driven static architecture, improve consistency, performance and regression coverage |

### Research scope that should remain visible

- The chronology v0.5 checkpoint records **380 indexed entries, 182 findings, 227 graph edges and 69 source views** in its own chronology datasets. These are scoped research figures, not total claims about the whole Atlas or all GA texts.
- The organ project has extensive cumulative research including the v29 dataset and 40 comparative dossiers. Preserve review warnings, different edition/source views and unclosed comparisons.
- Research status is not spiritual, historical or scientific truth status. A **reviewed passage** means an interpreter checked a particular text and attribution; it does not validate the underlying esoteric claim as empirical fact.

### Observed risks and unverified areas

**Confirmed from code and layout architecture**
- The homepage, thematic explorer, concept page, journey reader and chronology views are separate pages with distinct navigation and presentation models.
- Homepage and nav menus expose many overlapping exploratory pages. An unfamiliar reader may not know which chronology is canonical or where to begin.
- Concept search primarily operates on the project's editorial taxonomy, not the archive's full corpus. This distinction is disclosed, but should become explicit at the search control.
- The story viewer uses image sprites and fallback logic; 56 visual moments exist, but the research-to-explanation-to-source trail requires systematic QA scene by scene.
- Source verification labels vary across data/view types; a unified evidence display must be designed before scaling new content.
- Some old roadmap and artwork status notes are historical snapshots, not current release truth.

**Not established by this static audit**
- Whether the latest GitHub Pages release has deployed every WebP image and current commit.
- Real-world mobile visual quality, interaction hit targets, screen-reader output, performance metrics, and external link health.
- A full GA-by-GA coverage denominator or a comprehensive independent second source review.

**Audit limitation:** The public GitHub Pages URL could not be opened by the inspection web tool in this audit. Repository code, data, commits and source-archive policies were inspected. Perform browser-based public-page QA before calling the live experience verified.

## 2. Readers and their main jobs

| Reader type | Starting need | Atlas job |
| --- | --- | --- |
| Curious newcomer | "What does Steiner teach about the human being?" | Accessible 60-second orientation, visual map, key terms, three starter paths |
| Thematic learner | "How do the Sun, Moon and human I relate?" | Theme hub, illustrated story, related concepts, direct sources |
| Returning reader | "Continue my exploration" | Bookmark and progress without an account, links preserving location |
| Serious researcher | "Where exactly does he say this? Does he say it differently elsewhere?" | GA/date/edition, evidence scope, source comparison, graph provenance |
| Mobile visitor | "Understand one idea in a few minutes" | Fast one-column cards, thumb-safe navigation, minimal repeated chrome |

Target jobs-to-be-done:
1. Start without knowing anthroposophical vocabulary.
2. Move from big picture to selected detail in at most three deliberate actions.
3. Understand a topic through an original illustration plus a brief plain-language account.
4. Discover why two concepts are connected and what kind of relationship that is.
5. Read the identified primary page and return to the same Atlas position.
6. Identify uncertainty, competing translations and editorial interpretation clearly.

## 3. Information architecture: proposed primary navigation

**Primary navigation should have five simple destinations**, not one item per POC:

1. **Discover** — engaging front door, questions, featured stories, six theme worlds, search.
2. **Explore Themes** — visual thematic hubs with a shared page template; one selected branch at a time.
3. **Journey Through Time** — one designated chronology explorer; nested stage drill-down with persistent contextual dial.
4. **Explore the Human Being** — interactive body map, human constitution, organ dossiers, source-rich comparative views.
5. **Find the Sources** — Atlas concept/source finder plus a clearly differentiated exit to RSArchive full-text search.

A compact **Research tools** entry remains for expert users: evidence graph, coverage, source registries, comparison lenses, taxonomy index, historical experiments and data method. Existing old POC URLs continue to work, collected behind a "Design lab / earlier explorations" page rather than appearing equally primary.

### The three ways into every concept

- **Question-led:** "Why is human freedom significant?" → short answer-in-context → image/diagram → concept connections → original sources.
- **World-led:** six attractive thematic regions → one focused visual theme hub → curated concept cards → same concept page.
- **Time/body-led:** stage in chronology or organ hotspot → explanatory scene → related ideas → same concept page.

All paths converge on the **same canonical concept ID and evidence records**. Avoid parallel hand-written summaries that diverge.

### Site map (target)

Discover  
├─ Choose a question / suggested topic / search Atlas concepts  
├─ Six visual worlds → Theme hub → Concept story → Sources / Connections  
├─ Start a guided journey → Illustrated steps → Concept story  
├─ Journey through time → Cosmic stage → Earth epoch → cultural period → stage scenes → Sources  
├─ Explore the human being → Body map / Human constitution → Organ guide → Sources  
└─ Advanced research → Graph / Coverage / Source registry / Comparisons / Legacy POCs

## 4. Standard reader experience (component design)

### 4.1 Discover / home

**Above the fold:** one concise "Explore Steiner's ideas, then read the original" promise, a welcoming image or gentle animated diagram, and **three prominent choices**: Explore a theme / Travel through time / Explore the human being. Do not require users to choose among 15 competing experiments.

Below: question chips ("What is the I?", "Why is love central?", "How does human consciousness evolve?", "How do Sun and Moon differ?"), six visually distinct theme worlds, a *Featured path* and one accessible search box.

Search must visibly have two modes:
- **Search the Atlas** — curated concept labels, aliases, prompts, related terms (local data).
- **Search original texts on RSArchive** — explicit outbound handoff to RSArchive; do not suggest that local search covers all Steiner texts. Use only source-supported search query URLs if verified, otherwise open the archive search interface and explain the user must search there.

### 4.2 Theme hub

Structure: (a) vivid hero image, (b) "in one minute" original summary, (c) 4–8 curated image-backed entry points, (d) most important relationships, (e) choose beginner/deeper explanation, (f) recommended guided paths, (g) source gateway and evidence status. Expand to all taxonomy branches only when requested.

Each theme should convey one visual grammar and one **central map**, such as:
- Thinking and freedom: interactive path from perception → thinking → moral intuition.
- The human being: layered physical/etheric/astral/I visualization, clearly presented as Steiner's schema.
- Cosmos and evolution: nested cosmic stages and historical epochs with the approved bottom dial.
- Spiritual beings: hierarchy/agency relationships, not unsupported exclusive organ-builders.
- Karma and biography: concept flow across a life narrative; avoid deterministic claims about individuals.
- Arts and applied fields: clickable examples for education, agriculture, architecture, eurythmy and others.

These are design orientations, not a replacement for the existing six canonical region groupings. Map specific experiences to present domain IDs after editorial review.

### 4.3 Reusable concept story

**One concept, one canonical URL/ID, five expandable layers:**

1. **At a glance** (30–80 original words): plain-language summary with "In Steiner's account…" framing.
2. **See it**: a relevant illustration/diagram or an explicit "visual not available" state.
3. **Explore it**: 3–7 story beats, each with title, one short paragraph, optional image hotspot.
4. **Connections**: typed, explained edges (influences / precedes / transforms / contrasts / analogy / co-mentioned). Show the *why*, not just related names.
5. **Read original / research notes**: source cards with GA number, lecture date or book chapter, title, edition/translation, status, precise page link and unresolved comparisons.

Visible navigation: breadcrumb, progress within a story, "Previous / Next / Back to theme", and source-open-in-new-tab so the Atlas position is retained. Shareable state in URL; not only browser session state.

### 4.4 Image-led story scenes (priority experience)

Reuse existing 56 curated cosmic scenes and the always-visible time dial:
- Large, rich picture; small marker/title; tap to expand the native-text interpretation.
- Expandable card shows **What is depicted? / Why it matters? / What changed from previous phase? / Linked original source(s)**.
- One image may represent a *symbolic interpretation*; never imply it literally documents prehistoric/future events.
- Offer a "Read the story" sequence and a "Compare stages" alternate mode.
- Display **inherited / newly introduced / intensified / diminishing / future consequence** where source-backed and applicable.
- Preserve the corrected cosmic arc: 1 → 2–3 descending, 4 Earth as turning point, 5–7 ascending. Distinguish nested timelines and avoid treating 7 planetary stages as modern astronomical planets.
- When drilling to Lemuria, Atlantis, and post-Atlantean cultural epochs, keep the global context and provide a visible "Up one level" path; do not swap timelines without explanation.
- Verify WebP sprite positions, scene mapping, crops, alt text and target links for all 56 stories. Keep SVG fallback as a graceful degraded experience until replaced deliberately.
- Focus on meaningful original art with palette/subjects specific to each passage; do not use repeated generic stock-looking art.

### 4.5 Human being and organ exploration

Keep the CC BY attributed anatomy artwork and organ hotspots. Add a layer selector that consistently separates:
- Anatomy (contemporary descriptive facts, properly distinguished);
- Steiner's historical/spiritual interpretation;
- Cosmic or evolutionary stage;
- Participating hierarchies (only stated relationships);
- Human I / astral / etheric / physical interactions;
- Cross-organ comparisons;
- Exact cited evidence and open questions.

Select an organ → immediately reveal an accessible short summary and a clear next action; the detailed organ dossier stays one layer deeper. Provide keyboard/screen-reader alternatives to every hotspot and avoid a solely tiny anatomy-based tap target.

### 4.6 Source handoff

Every significant source-backed statement should offer a consistent **Read at RSArchive** link and nearby provenance, for example:

**GA 13 · An Outline of Esoteric Science · chapter/section · translation/edition · Reviewed passage / Located page / GA lead / Contested** → **Read original**

Research status and text status must remain different:
- "Reviewed" means a passage was consulted for an accurately attributed paraphrase.
- "Located" means a relevant page was found, but the particular claim is not fully reviewed.
- "GA lead" is a possible relevant volume, not a passage citation.
- "Contested" requires visible explanation, not merely a warning icon.

Where multiple translations are recorded, link each known version separately; use the original archive's own compare-view feature instead of building or copying a translation reader. The external source opens in a new tab/window where appropriate, retaining the Atlas stage/context.

## 5. Visual and interaction design system

### Experience qualities

**Vivid, sophisticated, accessible, calm and playful where useful.** Visual delight must improve understanding; movement never becomes the only way to access information.

- Consistent typography, spacing, card hierarchy, source badges and neutral research notices.
- Purposeful custom illustrations: scene art for narratives, layered maps for structures, diagrams for causal/temporal relationships.
- Motion that explains: dial rotation, staged reveal, highlight a relation, compare two states; no long blocking animations.
- Touch targets at least 44×44 CSS px for key controls, functional keyboard focus, reduced-motion support, adequate contrast, and alt text that explains the image's instructional role.
- One-column phone story layout, usable fixed bottom control without obscuring text, safe-area padding, no accidental sideways page scrolling, accessible expansion controls.
- Progressive image loading, WebP sizing/resolution variants only when needed, SVG/semantic-HTML fallbacks, no external image hotlinking without rights.
- Avoid placing paragraphs of text inside raster images. Keep headings, captions, source and hotspot labels in HTML.

### Interactivity that's genuinely useful

**Must-have:** stage/organ navigation, source expansion, typed relation highlights, bookmark/share deep links, narrated-by-text visual sequence, compare before/after, breadcrumbs, search.

**Should-have:** reading progress (on-device, optional), recently visited topics, simple "show beginner detail / show research detail" toggle, vocabulary tooltips, compare up to two stages/organs.

**Later experiments:** adaptive recommended routes, freeform concept graph journeys, optional audio narration, playful self-check questions. Avoid extrinsic scores or gamification that imply scholarly authority.

Privacy: no account required; a lightweight local-only bookmark/progress mechanism is preferable to collection of user profiles. Do not send reading history or sensitive research interests to third parties.

## 6. Provenance, rights and research safeguards

- Respect RSArchive Terms (June 12, 2026): https://rsarchive.org/Legal/Terms.html. They limit automated access, scraping, text/data mining and content reuse; do not crawl/harvest/mirror RSArchive, use it as an automated AI corpus feed, or extract texts into this repository without explicit authorization. Keep a link-out model.
- Attribute and link to the archive prominently near sourced materials; do not imply affiliation or endorsement. RSArchive/Steiner Online Library is separate from the Rudolf Steiner Archiv in Dornach.
- Images must be original, licensed, or sourced with compatible explicit rights; store artist, provenance, license and modification notes. Keep existing anatomy attribution.
- Distinguish **Steiner asserted X** from **science establishes X**. Handle medical, educational, racialized, discriminatory or historical material critically, including context and cautions, without censoring or treating unsupported claims as modern advice.
- Keep authored works, dated lecture transcriptions, edits, translations and editorial summaries clearly separated.
- Do not invent exact stage dates, hierarchies, passages, external URLs or events to fill visual gaps.
- Build a human-review trail for each claim. Mark a missing exact passage as incomplete even if a beautiful illustration exists.
- Editorial stories should attach to canonical source IDs and taxonomy IDs; don't maintain incompatible hard-coded descriptions across multiple POCs.

## 7. Technical target: static, integrated, data-driven

Retain GitHub Pages and existing plain browser stack for now. A framework rewrite is **not required** to validate the product design.

**Logical information model**
- **Canonical concept:** stable taxonomy ID, aliases, accessible introduction, domain, prerequisite concepts.
- **Claim/story beat:** durable ID, parent concept/stage/organ, attributed paraphrase, visual ID, review status, exact source IDs.
- **Source:** external URL, GA, work/lecture/date/chapter, version/edition/translator, reviewed range, status, last verified date.
- **Relationship:** from/to IDs, controlled relation type, brief reason, citations, reviewed/editorial flag.
- **Image:** asset path, scene crop or variant, alt text, depicted claim IDs, credit/rights.
- **Guided path:** path ID, ordered canonical IDs, estimated reading effort, progression notes.
- **UI route:** deep link to topic, stage, scene, organ, mode and selected reading step.

**Architecture rules**
- Use manifest-driven data loading and small reusable frontend modules for source cards, story cards, relation view, breadcrumbs and search. Avoid copy/paste of entire datasets into HTML.
- Preserve existing dataset versions and IDs. Add a mapping/adapter layer to new presentation schema rather than destructive migrations.
- Keep full research ledgers outside beginner UI. Display the short reviewed summary, then provide optional research detail.
- Permit a local curated search index over the project's *own* taxonomy, aliases and editor-authored descriptions. Do **not** fetch RSArchive corpus text to implement local search.
- Check internal links, canonical IDs, provenance fields, exact source URL validity where permitted, and story-index asset existence in CI.
- Run desktop and mobile Chromium smoke checks deliberately, without converting them into a high-frequency expensive release trigger.
- Keep GitHub Pages releases selective: make coherent batches, run the existing validators, one site/data commit per verified milestone.

## 8. Prioritized implementation program

### P0 — Quality and product map (first milestone; essential before additions)

**Goal:** Inventory and stabilize what is already there.

Tasks:
- [ ] Establish visual QA of deployed site and current main: homepage, all six theme hubs, concept page, guided journey, story page, body map and sources on 390px phone, mid-size tablet and desktop.
- [ ] Verify whether 20e89f2 WebP asset commit is on the public release; confirm all seven files load, all 56 sprite crop positions correspond to index records, and expanded image viewers work.
- [ ] Create a route and feature matrix: **primary** / **specialist** / **legacy POC**, with canonical destination and preservation policy.
- [ ] Audit top ten reader tasks and navigation loops. Identify places where the learner loses context, where "back" loses position, and where citations are obscured.
- [ ] Define exact source-label vocabulary and accessible badge styles; align existing source records without changing their meaning.
- [ ] Establish baseline mobile/desktop screenshots, load bytes, interaction errors, missing images and link health; distinguish measured metrics from estimates.
- [ ] Update stale artwork status notes and duplicate historical "manual-only" messages through a clearly dated current-state notice, preserving change history.

**Suggested files:** docs/ATLAS_PUBLICATION_GUIDE.md; docs/CHRONOLOGY_PAINTED_SCENE_RESTORATION.md (append note); tests/atlas-browser-smoke.mjs; a new audit checklist; site/index.html only when ready.  
**Exit:** Every existing primary journey has an observed starting/ending path; seven sprite files and 56 scenes are checked; no claim of deployed functionality is based solely on source code.

### P1 — One front door and common navigation (highest reader-facing priority)

**Goal:** Reduce confusion, give instant sense of direction.

Tasks:
- [ ] Redesign home around the three major visual explorations and "What would you like to understand?" prompts.
- [ ] Define a common masthead, breadcrumbs, reading-level indication, source action and context-preserving back link.
- [ ] Unify top-level naming; put old chronology POCs in design lab, preserve URLs.
- [ ] Create curated visual hubs for all six regions, with "Start here" and no more than 8 initial choices each.
- [ ] Separate local Atlas concept search from external archive full-text search.
- [ ] Provide one canonical route to each concept or stage and usable crosslinks from the existing body/chronology/graph.

**Suggested files:** site/index.html; atlas/explore.html/.js/.css; atlas/index.html; atlas/app.js; new shared UI script/CSS.  
**Exit:** A beginner can find (i) the human I, (ii) Old Moon, (iii) the heart and (iv) their source links in at most three meaningful navigation choices from home; no ambiguous equal-rank chronology options on primary nav.

### P2 — One flagship illustrated chronology journey

**Goal:** Turn the approved narrative-plus-dial design into the Atlas's first excellent end-to-end story experience.

Tasks:
- [ ] Designate atlas/chronology-story-vivid.html as initial flagship *candidate*, pending quality review; keep prior wheels and dials as experiments and optionally reuse approved interaction pieces.
- [ ] For each stage, make the persistent dial, large pictures, visible image titles and expandable meanings work without loss of place on mobile.
- [ ] Complete rigorous source/illustration/alt-text review of the existing 56 planetary story beats, with exact citation status.
- [ ] Add previous → inherited → new → transformed → future logic to each story where justified, then grow carefully into the nested Earth periods (Polarian/Hyperborean/Lemurian/Atlantean/post-Atlantean etc.) only with verified source stages.
- [ ] Add a "Zoom in / Up one level" hierarchy with a visible contextual breadcrumb, respecting descending/ascending arc.
- [ ] Permit stage comparison without manufacturing exact chronology where evidence lacks it.
- [ ] Record scene source, artwork asset and editorial caveat together in the curated index.
- [ ] Verify real mobile visibility with the bottom dial, safe areas, 44px targets, image crops and dialog close behavior.

**Suggested files:** atlas/chronology-story-vivid.*; atlas/story-scenes/story-visual-index.json; research/steiner-hierarchical-chronology-events-v05.json (adapter only if needed); tests/atlas-browser-smoke.mjs.  
**Exit:** On each of seven stages, all eight image cards open explanations, map to the intended image and evidence IDs, keep the dial usable on phone and lead to original archive records. No orphan scenes, broken citations or conceptual time-scale jumps.

### P3 — The reusable story/concept page and curated learning journeys

**Goal:** Make the image-first experience universal, not unique to chronology.

Tasks:
- [ ] Build one reusable concept story template with at-a-glance, picture, narrative beats, connections and primary sources.
- [ ] Create 6–10 exemplary high-impact concept stories spanning different regions: human I, etheric/astral/physical bodies, thinking/freedom, karma, Sun/Moon, love, spiritual hierarchies, heart/lungs, and at least one artistic/practical topic.
- [ ] Validate concise explanatory writing against exact source IDs; show source certainty and interpretation.
- [ ] Convert existing eight journeys/41 steps into structured short content with useful illustrations only where genuinely supportive.
- [ ] Connect story cards to full concept detail, research graph and archive links without manual duplication.
- [ ] Add local progress/resume and deep-linked step state; optional, respectful and reversible.

**Suggested files:** atlas/app.js; atlas/journey.*; atlas/study-paths.json; new research/concept-stories-v1.json; taxonomy adapters; shared components.  
**Exit:** Every exemplar supports three user levels: 1-minute overview, 5-minute story, deeper evidence; eight existing journeys continue to navigate and retain all 41 step IDs.

### P4 — Human/organ explorer and cross-theme connections

**Goal:** Make visual exploration reveal underlying coherence.

Tasks:
- [ ] Integrate body map with the new concept story template while preserving detailed organ dossiers.
- [ ] Improve accessible alternative organ selector and touch interaction; keep professional anatomical SVG with attribution.
- [ ] Expose source-backed hierarchy/stage/organ relationships with carefully typed, evidence-linked lines.
- [ ] Add comparative lenses: heart/lungs, Sun/Moon, etheric/astral, human I versus other principles; label analogies and contested links.
- [ ] Connect chronology scene concepts back to present human anatomy, consciousness and applications where verified.

**Suggested files:** atlas/body.html; atlas/organ-detail.*; atlas/agency.*; atlas/graph.*; research/organ-current.json; research/organ-atlas-guides-*.json.  
**Exit:** A reader can move from organ → attributed teaching → relevant cosmic stage → exact source → related concept and return, while every displayed relationship has a type and provenance.

### P5 — Research completion, discoverability and polish (ongoing)

**Goal:** Grow reliable coverage instead of merely increasing page count.

Tasks:
- [ ] Prioritize passage-level source verification of the most-viewed unsourced concepts; link precise GA/chapter/lecture records.
- [ ] Address known gaps in graph evidence, German/English variants, full-source-view review and outstanding comparisons per existing research resumes.
- [ ] Improve the editorial terminology index with aliases and multilingual variants *authored locally*, never scraped wholesale.
- [ ] Enhance research graph exploration with filters that explain relation type and distinguish sourced edges from editorial hypotheses.
- [ ] Complete accessibility audit, image/performance budget, visual regression and external-source handoff testing.
- [ ] Consider opt-in user feedback and anonymous aggregate usability analytics only after deciding privacy and operational requirements.
- [ ] Review IA quarterly as the corpus of first-hand evidence increases.

**Exit:** Coverage reports show a denominator and reliable evidence status; key routes and sources are auditable; visual performance remains good as curated content grows.

## 9. Recommended sequence of concrete GitHub implementation batches

| Batch | Priority | Result | Depends on | Done when |
| --- | --- | --- | --- | --- |
| A | P0 | Public-versus-main visual QA; 56-image verification; route inventory and screenshot log | Current repo/deployment | No unknown asset state or broken major entry routes |
| B | P1 | Clear homepage and unified navigation; experiment vault | A | 3-entry front door and common breadcrumbs validated |
| C | P1 | Source card / evidence badges shared across pages | A | Same provenance semantics on theme, story and organ pages |
| D | P2 | Seven-stage flagship story with accessible bottom dial | A, C | All 56 moments pass source/scene/mobile checks |
| E | P2 | Nested chronology drill-down and stage compare POC | D | Up/down level preserves location, no false chronological precision |
| F | P3 | Reusable story schema and first 6–10 concept narratives | B, C | Same canonical concept appears consistently through all entry paths |
| G | P3 | Image-led upgrades to eight study paths | F | All 41 steps and source exits work |
| H | P4 | Human organ integration and typed cross-theme visual paths | F, C | Organ → chronology → source loop works |
| I | P5 | Coverage expansion and systematic source QA | B–H | Measured verified evidence improves without inflating certainty |

Implement in small merged slices. Each website/data batch should ideally produce one validated Pages release rather than a cascade of cosmetic commits. Do not run manual browser action on every documentation update.

## 10. Acceptance checks for every shipped reader-facing slice

**Navigation**
- Can a first-time visitor tell what to click next without reading repository terminology?
- Can they return to their place after visiting a related concept or RSArchive?
- Is the URL shareable for the current stage/scene/organ/step?
- Are old public URLs intact?

**Learning**
- Is the introduction understandable without prior Steiner vocabulary?
- Does each image teach a distinct point and avoid unexplained mystical decoration?
- Are connections explained and typed, not merely listed?
- Can a reader find "what changed and why" between adjacent stages?

**Evidence**
- Is the teaching attributed?
- Can an exact original source be opened?
- Are GA lead, located page, reviewed passage, contested translation and editorial hypothesis honestly distinguishable?
- Are historic/medical claims identified as historical/esoteric interpretation where appropriate?

**Technical**
- Test narrow phone, touch, desktop, keyboard, reduced-motion, focus trap/escape for dialogs, alt text, and no horizontal scroll.
- Verify static build, source IDs, image asset paths, 56 story crops, internal links, safe external URLs and failure fallbacks.
- Check performance on a representative mid-range phone; record actual LCP/CLS/interaction measurements before setting aggressive numeric budgets.
- Run project validators and selective deployment checks before publication. Do not claim a successful release before checking the run and live output.

## 11. Sample design walkthrough: "Why is the human I important?"

**Home:** Reader taps "What makes human individuality special?"  
**Concept hero:** A visual of the human being's four members, not an unqualified anatomical chart. An 80-word summary explains that Steiner regards the I as distinctive for earthly human evolution.  
**Interactive scene:** Four layers are selectable: physical, etheric, astral, I. Each shows what it means in Steiner's terminology and what is *not* a modern scientific finding.  
**Contextual story:** Brief stages show the relation to earlier cosmic conditions, present moral freedom and future development.  
**Connections:** Thinking/freedom, love, Christ impulse, organs/blood, spiritual hierarchies — each link typed and verified separately.  
**Original evidence:** GA book/lecture/edition cards with direct RSArchive URLs, review status and open comparisons.  
**Next:** "Explore how the I relates to the heart" or "Continue to Earth's place in the cosmic story."  
**Return:** Atlas position and origin preserved.

This pattern is intentionally reusable for "Sun versus Moon", "How did consciousness change during Atlantis?", "Why do organs carry evolutionary history?" and "What does Steiner mean by love?"

## 12. Metrics and review cadence

Use **measured baselines** rather than invented current UX metrics:

- **First meaningful step:** visitor sees three clear paths and selects one.
- **Findability task completion:** percentage of test participants who can reach a specified concept and exact archive link.
- **Source handoff success:** a linked original page actually opens; bibliographic context is visible first.
- **Comprehension check:** after one story beat, a reader can state its central claim and recognize it as Steiner's account.
- **Mobile usability:** no off-screen control or horizontally clipped main text in test viewports; operable fixed dial.
- **Evidence integrity:** proportion of displayed factual teaching claims tied to exact source ID and review level; unresolved should stay visibly unresolved.
- **Visual integrity:** all 56 existing stage scenes map to deliberate assets and alt text; no broken sprite or viewer positions.

Baseline in P0; review after B/D/F/H. Do not optimize for total click count, animation engagement or raw graph size at the expense of learning and source fidelity.

## 13. Governance and project continuity

- Existing source-led research mandates and resumes stay authoritative for *research execution*, especially docs/WORK_TASK_COMPLETE_ORGAN_CONCORDANCE.md, docs/ORGAN_CONCORDANCE_RESUME.md, docs/CHRONOLOGY_RESEARCH_RESUME.md and docs/STEINER_CHRONOLOGY_RESEARCH_CONCORDANCE.md.
- This document governs **reader experience, presentation architecture and integration order**, not the validity of the esoteric assertions.
- Keep original POC files and prior plan docs accessible for comparison; only designate canonical user-facing views after tests and explicit decision.
- Each milestone records: reader problem, files/data changed, sources reviewed, visual QA and device widths, tests run, release commit and whether the public deployment was verified.
- When public page appearance differs from approved design, attach screenshot evidence, identify the exact component/asset mismatch and correct it rather than declaring a CSS-only fix.
- Avoid creating new parallel, uncontrolled content versions; centralize canonical IDs, cite the archive and preserve prior review notes.
- Before requesting any automated archive data ingestion, obtain explicit rights/permissions and review the source provider's current access policies.

## 14. Immediate next work order

**Do P0 then B/C then D, not a broader research-data expansion first.**

First, check main against deployed Pages on a real mobile layout, confirm 56 painted WebP scenes and every link/crop, classify redundant chronology prototypes, and fix any broken or misleading source handoffs. Then consolidate the home/navigation and consistent source evidence card. Only after that lock the immersive 7-stage story as a flagship and extend it to nested epochs. This produces a visible, coherent improvement early while leaving the deep research and earlier experiments safely intact.

### Source policies and reference documents

- Rudolf Steiner Archive: https://rsarchive.org/
- RSArchive search instructions: https://rsarchive.org/SearchInstructions.html
- RSArchive Topics: https://rsarchive.org/Topics.html
- RSArchive research/translation tools: https://rsarchive.org/blog/NewTools2026.html
- RSArchive Terms (12 June 2026): https://rsarchive.org/Legal/Terms.html
- Atlas existing architecture: docs/COMPLEMENTARY_ARCHITECTURE.md
- Atlas evidence method: docs/SOURCE_METHOD.md
- Existing thematic navigation: docs/VISUAL_THEME_NAVIGATION.md
- Existing vivid story implementation: docs/CHRONOLOGY_VIVID_STORY_POC_V2_2026-11-18.md
- Existing artwork restoration checklist (historical, now stale about missing WebPs): docs/CHRONOLOGY_PAINTED_SCENE_RESTORATION.md
- Current release process: docs/ATLAS_PUBLICATION_GUIDE.md
