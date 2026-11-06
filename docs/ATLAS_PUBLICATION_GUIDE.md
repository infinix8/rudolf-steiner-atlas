# Rudolf Steiner Atlas — publishing guide

**Current release mode (6 November 2026): selective automatic GitHub Pages publication from the `main` branch.** Manual publication remains available.

- [Live Atlas](https://infinix8.github.io/rudolf-steiner-atlas/)
- [Publishing workflow](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/publish-organ-atlas.yml)
- [Workflow source](../.github/workflows/publish-organ-atlas.yml)
- [Browser smoke tests](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/browser-smoke.yml) (still manual-only)

## What triggers publication

When a commit is pushed or merged into `main`, a single Pages release starts if it changes files in any of these paths:

| Path | Why it triggers publication |
| --- | --- |
| `site/**` | Combined website homepage |
| `atlas/**` | Thematic, organ, human evolution, and cosmic HTML/CSS/JS |
| `research/*.json` | Published JSON research datasets consumed by the site |
| `taxonomy/**` | Published taxonomy navigation/data |
| `assets/**` | Published images, mind maps, and other assets |
| `.github/workflows/publish-organ-atlas.yml` | Changes to the publishing configuration itself |

Only pushes to `main` publish. Pushes to feature branches and pull requests do not publish. Changes confined to `docs/`, `tests/`, `tools/`, or Markdown research notes do **not** trigger a Pages release. Note that `docs/*.md` files are still bundled into the website when a qualifying publication subsequently happens. For a documentation-only update that must be live immediately, use the manual **Run workflow** option.

**Avoid `[skip ci]`, `[ci skip]`, `[no ci]`, `[skip actions]`, and `[actions skip]` in website/data commits**: GitHub will skip their push-triggered publication. A manual run can still publish those changes. Historical commits used `[skip ci]` to conserve runs, but it must not be used for an automatically published site change.

## Reliability and resource controls

The existing publication is one Ubuntu job with a ten-minute timeout. `concurrency.cancel-in-progress: true` prevents multiple queued releases from deploying stale site versions. Each release runs pre-upload checks for required website files, organ-map dependencies, visual organ provenance and synchronized embedded JSON snapshots for the human/cosmic explorer. A failed check stops publication before an artifact is deployed.

The repository already has a separate `validate.yml` integrity workflow for pushes and pull requests. It is **not** a prerequisite job for Pages: the publishing workflow applies its own checks before deployment. The much heavier Chromium browser smoke test remains **manual only**, so routine publication does not need browser installation. No release is scheduled on a timer.

On public repositories, standard GitHub-hosted Actions runner usage generally does not draw from the private-repository free minutes allocation, but Actions concurrency, storage, Pages limits, policies, and transient failures still apply. Automatic publication is selective, not unlimited.

## What the site publishes

The unified homepage at `https://infinix8.github.io/rudolf-steiner-atlas/` links to the following key sections:

| Public path | Purpose |
| --- | --- |
| `/` | Combined Atlas homepage |
| `/atlas/index.html` | Thematic Atlas |
| `/atlas/body.html` | Illustrated, clickable human body |
| `/atlas/organ-detail.html?organ=organ-heart&layer=overview` | Source-linked Heart guide (five other guides also available) |
| `/atlas/organs.html` | Organ concordance |
| `/atlas/agency.html` | Hierarchies, cosmic stages, and agencies |
| `/atlas/evolution-story.html` | Animated human evolutionary history |
| `/atlas/human-evolution.html` | 21-stage comparative matrix |
| `/atlas/cosmic-evolution.html` | Old Saturn, Old Sun, Old Moon, Earth and future conditions |
| `/atlas/graph.html` | Evidence graph |
| `/atlas/sources.html` | Source index |
| `/atlas/coverage.html` | Research coverage |

The workflow assembles `site/index.html` as the deployed `index.html`, copies `atlas/`, published `research/*.json`, `taxonomy/`, `docs/*.md`, and `assets/`, verifies local dependencies, and uploads one Pages artifact.

## Check publication status or publish manually

1. Open [GitHub Actions → Publish Rudolf Steiner Atlas](https://github.com/infinix8/rudolf-steiner-atlas/actions/workflows/publish-organ-atlas.yml).
2. For normal `main` website/data changes, confirm that the automatic `push` run completes successfully. You do **not** need to tap anything.
3. If it fails, read the job log; avoid repeatedly launching redundant releases.
4. To republish manually, choose **Run workflow**, select `main`, and run it once.
5. Check the [live website](https://infinix8.github.io/rudolf-steiner-atlas/). GitHub Pages may take some time to serve the newer release.

The original Rudolf Steiner works remain at their respective archives. The site is an independent editorial research atlas, not a source of established medical or prehistoric claims.
