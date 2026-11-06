# Animated Evolutionary Journey — implementation checkpoint, 6 November 2026

The [new visual journey](../atlas/evolution-story.html) is the primary evolutionary history entry point from the [combined Atlas homepage](../site/index.html) and [thematic index](../atlas/index.html). The [original research matrix](../atlas/human-evolution.html) remains available and links into story mode. Both pages support direct `#stage=A4` links.

## Delivered

- A scene-based hero that changes atmosphere between the Lemurian, Atlantean, and Post-Atlantean epochs.
- An accessible, mobile-scrollable **21-milestone animated timeline** with play/pause, previous/next, drag-to-scrub, epoch jump controls, deep links, and keyboard arrow/Home/End navigation.
- Nine continuous **qualitative force/faculty rivers** rendered as lightweight SVG with moving current accents and an interactive per-milestone cursor. Tracks include higher guidance, formative will, Luciferic influence, pictorial memory, Atlantean life-force capacities, Ahrimanic influence, reflective judgment, Christ impulse, and consciousness soul.
- Inherited forces, rising capacities, diminishing capacities, spiritual agencies, events, prior-stage transition, evolutionary contribution, caveats, and direct sources change together as the milestone changes.
- Source dataset is embedded from [`research/human-evolution-concordance-v1.json`](../research/human-evolution-concordance-v1.json), allowing local-file use without a server. Lightweight HTML/CSS/SVG/JavaScript, no external frameworks or tracking.
- Animations do not automatically start the 21-stage playback. They honor `prefers-reduced-motion`; playback stops if the tab is hidden.

## Editorial safeguards

These strands are **qualitative editorial windows**, not measured spiritual intensities. Their location across the 21 comparative entries should not be understood as precise dates or definitive onset/termination. The display uses beginning-of-stage positions only to locate narrative discussion: for example, Ahrimanic involvement is broadly mid-Atlantean, not exclusively introduced at A4. The Lemurian seven are overlapping analytical milestones, not seven named Steiner sub-stages; Atlantean stages preserve historical esoteric labels rather than modern ethnic assertions; future post-Atlantean periods are projections. Original texts are linked, not reproduced.

## Deployment

Publishing remains **manual-only** via the already-existing combined Pages workflow, which copies all files under `atlas/`. No workflow edits, scheduled jobs, added dependencies, or deployments were performed in this milestone. The one consolidated commit message uses `[skip ci]` to suppress push validation runs on this commit. For later revisions, keep the embedded JSON consistent with the canonical research JSON and test the animations on phone and desktop.
