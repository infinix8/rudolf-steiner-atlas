> **Open medical SVG (6 November 2026):** The manual Pages workflow now retrieves and parses [DBCLS's CC BY 4.0 adult anatomy illustration](ANATOMY_ARTWORK_ATTRIBUTION.md) as a local page asset shared by the eight-organ body map and both detailed guided pages. It falls back to the Wikimedia Commons mirror if necessary. This occurs within the **same single manual publish job**, not an additional Actions run. No workflow is triggered by a research/design commit.

# Combined Rudolf Steiner Atlas — public publishing guide

**Release mode:** GitHub Pages, **manual-only**, from `main`.
**Release workflow:** [Publish Rudolf Steiner Atlas (manual release)](../.github/workflows/publish-organ-atlas.yml).
**Browser QA workflow:** [Atlas browser smoke tests](../.github/workflows/browser-smoke.yml), also **manual-only**.

## One published website, multiple entry points

The unified homepage at `https://infinix8.github.io/rudolf-steiner-atlas/` offers two main paths:

| Published path | Purpose |
| --- | --- |
| `/` | Unified guided homepage |
| `/atlas/index.html` | Original thematic Atlas: concepts and taxonomy |
| `/atlas/body.html` | Visual clickable eight-organ human-body map and discovery interface |
| `/atlas/organ-detail.html?organ=organ-heart&layer=overview` | New eight-layer Heart guide |
| `/atlas/organ-detail.html?organ=organ-liver&layer=overview` | New eight-layer Liver guide |
| `/atlas/mobile-preview.html` | Curated Heart/Liver guided organ experience |
| `/atlas/organs.html` | Full current 40-dossier organ concordance reader |
| `/atlas/agency.html` | Spiritual beings, stages and roles |
| `/atlas/graph.html` | Passage-qualified evidence graph |
| `/atlas/sources.html` | Primary-source index |
| `/atlas/coverage.html` | Research evidence coverage |
| `/atlas/timeline.html` | Dated lecture chronology |
| `/atlas/dossiers.html` | Thematic study dossiers |
| `/atlas/trajectories.html` | Context and trajectory comparisons |

The new visual Heart/Liver pages load `research/organ-atlas-guides-v1.json` and require `atlas/organ-detail.js` and `atlas/organ-detail.css`. The manual deployment validates these guide links with `python3 tools/validate_visual_organ_atlas.py`.

The visual body map loads `research/organ-body-map-v1.json`. The single manual publishing job checks that each mapped organ's target HTML file exists.

The site deploys the Atlas HTML, CSS and JavaScript; editorial research JSON; taxonomy and necessary supporting documents/assets. It keeps the original archive text at RSArchive and links outward.

The repository is currently **public**, so the same content and other repository files are browsable in GitHub. Public GitHub Pages access does not mean any of Steiner's esoteric or medical claims have been medically or scientifically verified.

## Publish changes on Android — only when needed

1. Make any desired research, taxonomy or presentation commits to `main`. **No publishing or Chromium test Actions start automatically from those commits under the two workflows listed above.**
2. When ready for a new public release, open [the workflow page](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/publish-organ-atlas.yml) in the mobile browser, signed in to GitHub.
3. Tap **Run workflow**, choose **main**, then **Run workflow** again. If the button isn't visible in the mobile UI, enable Chrome's **Desktop site**.
4. Wait for that one run to show **Success**. Open the [Atlas homepage](https://infinix8.github.io/rudolf-steiner-atlas/) and test the guided organ and thematic links. If a run fails, inspect its job log before rerunning.
5. Optional: run [Atlas browser smoke tests](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/browser-smoke.yml) **manually**, only for important UI changes. It installs Chromium and uses more Actions time than the lightweight publish job.

**The release workflow is deliberately separate from research commits.** You might accumulate a week's worth of edits and then trigger a *single* publication when ready. It has one Ubuntu job, 10-minute timeout, no scheduled event, no push event and no pull-request event. The browser test has one manual-only job, 15-minute timeout. The repository might contain other workflows not covered by these two; check the Actions list if usage rises unexpectedly.

## Build notes / source dependency model

The release workflow assembles the site from:
- `site/index.html` → `dist/index.html`
- `atlas/.` → `dist/atlas/`
- `research/*.json` → `dist/research/`
- `taxonomy/.` → `dist/taxonomy/`
- `docs/*.md` → `dist/docs/`
- `assets/.` → `dist/assets/`

The packaging step checks the main entry points, app scripts, taxonomy and all file paths listed in `research/organ-current.json` before it uploads a single `github-pages` artifact.

The whole static site can also be run locally from the repository root with `python -m http.server 8000` and opening `http://localhost:8000/site/` (standalone landing) or `http://localhost:8000/atlas/` (thematic Atlas). The published `/` route is supplied by the workflow's `dist/index.html`.

## Actions budget and maintenance policy

- **Never re-enable `push` triggers for deploy or browser smoke tests without intentional review.**
- Run a single manual publish for a deliberate release, not each changed file.
- Keep browser smoke tests manual or run them locally when practical.
- More GitHub commits do not cost Actions minutes on their own.
- A failed deployment can consume minutes; review logs before retrying repeatedly.
- GitHub Pages might report delays in making a successful new deployment visible, but do not start multiple runs unnecessarily.
- The expected URL is the standard project Pages route; confirm the actual URL and successful deployment in GitHub Pages settings.
