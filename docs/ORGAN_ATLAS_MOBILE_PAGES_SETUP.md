# Organ Atlas mobile preview — GitHub Pages release guide

**Status: v1 files committed, site activation not yet verified.** Research repository: `infinix8/rudolf-steiner-atlas` (private). Research phase: 29, 5 November 2026.

## What was built

- [Single-file mobile preview](../atlas/mobile-preview.html): Heart and Liver, each with Overview, Development, Connections, Sources; responsive layout, offline interface, direct RS Archive links, and clearly attributed historical teaching claims.
- [Curated Pages deployment workflow](../.github/workflows/publish-organ-atlas.yml): copies **only** `atlas/mobile-preview.html` as `index.html`, plus a `.nojekyll` marker, into the Pages artifact. It does **not** publish the private research JSON, manuscripts, internal notes, or other repository files.
- Research records and the existing 40-dossier explorer remain in the canonical private repository.

## Activate once on a mobile phone

1. Open **Chrome** on Android (rather than relying on the GitHub app's code preview). Sign in to GitHub as the administrator of `infinix8/rudolf-steiner-atlas`.
2. Go to **https://github.com/infinix8/rudolf-steiner-atlas/settings/pages**. If the mobile site hides the repository settings, use Chrome's **Desktop site** option.
3. In **Build and deployment → Source**, select **GitHub Actions**, then save if prompted.
4. Go to the repository **Actions** tab. Select **Publish public Organ Atlas preview** and choose **Run workflow** → branch **main**, if it has not already run automatically.
5. When the Pages deployment is successful, open **https://infinix8.github.io/rudolf-steiner-atlas/** in Chrome. Add to home screen from Chrome's menu if desired.
6. Test Heart/Liver switching, four tabs, small-screen layout and primary-source links.

**Important:** The URL above is the expected default project Pages address, **not** a verified live deployment until GitHub Pages is enabled and the workflow succeeds. Use the Pages settings screen or workflow result to confirm the actual published URL.

## Private repository plan limitation

GitHub currently supports Pages in private repositories on GitHub Pro, Team or Enterprise plans, not GitHub Free. This is a **GitHub** billing condition, separate from ChatGPT subscription. If GitHub refuses Pages for this private repository, do **not** make the canonical research repository public merely to deploy the preview. Instead, use a separate **public, publish-only repository** containing just this curated HTML file. GitHub Free supports Pages from public repositories. That separate publication repository can be created in GitHub UI and used without exposing private research files.

## Preview locally without Pages

- On a desktop computer: download `atlas/mobile-preview.html` and open it in a browser; no server is required.
- On Android: download that HTML file from GitHub (browser view / raw download if available), then open the saved file in a browser or HTML viewer that supports JavaScript. Some Android browsers/file managers restrict opening downloaded local HTML; GitHub Pages is the recommended easy route.
- The GitHub mobile app is for repository browsing and may show the HTML as code rather than execute the page.

## Editorial / security checklist

- The site is a historical, explicitly attributed explanation of Steiner's teachings, not medical advice or clinical facts.
- Never copy private research JSON/manuscripts into the Pages artifact without explicit review.
- Links to the Rudolf Steiner Archive require internet; the page's structure and tabs run without external libraries.
- The earlier `atlas/organs.html` 40-dossier tool is still a research-first local browser, not included in this public preview.
- No GA/paragraph link proves an exhaustive bilingual independent certification; source checks and unresolved comparisons remain in the research checkpoint.

## Next implementation work

Review the first Heart/Liver version on Android, improve content hierarchy and graphics based on actual feedback, then introduce a source-resolving presentation model. Eventually expand to 40 curated organ pages, guided study paths, cosmic-stage explorer, hierarchy matrix and source-level comparisons.
