# Painted scene restoration — asset publishing checklist

The 18 November 2026 screenshot showed SVG silhouettes instead of the **approved vivid story-scene paintings**. That was a visual-deliverable error, not merely a CSS issue.

## Design decisions

- Preserve the existing eight source-linked story moments per stage and the interactive, always-visible time dial.
- Never put the entire AI-generated screenshot behind interactive controls: it duplicates menus and printed labels, and scales poorly on mobile.
- Instead, crop the **56 paintings** from the seven approved 1672×941 stage concept images, packed as seven 4×2 WebP sprite sheets.
- \`scripts/build_painted_story_sprites.py\` describes the source filenames and crop bounds and writes seven files into \`atlas/story-scenes/\`.
- \`chronology-story-vivid.js\` first renders the existing authored SVG images, probes for a WebP sprite for the selected stage, and atomically switches all eight cards and the expanded-view artwork after the WebP loads. No broken image UI while a stage file is absent.
- The text remains native HTML and accessible. Image-specific text and detail links come from \`story-visual-index.json\` and the cumulative source index, not from the rendered mockup image.
- Stages retain their research caveat: these are artistic representations of claims attributed to Steiner, not observational evidence.

## Asset status

**As of this commit, the seven 4×2 WebP image files have not been uploaded.** Therefore the live page still shows its existing SVG pictures. Do not represent the artwork conversion as completed until the output WebP files are actually committed and verified via GitHub Pages.

## Source mockup names

- \`old_saturn_the_warmth_condition.png\`
- \`old_sun_an_evolutionary_atlas.png\`
- \`the_steiner_atlas_old_moon_chronology.png\`
- \`earth_the_human_i_and_moral_freedom.png\`
- \`rudolf_steiner_atlas_future_jupiter.png\`
- \`future_venus_the_evolutionary_atlas.png\`
- \`the_steiner_atlas_future_vulcan.png\`

Run one batch conversion, inspect the sprites, commit seven WebP assets together, and verify source/output delivery in Pages. No additional GitHub Actions workflow is necessary.

## Mobile adjustments already deployed

The site has a breakpoint at 1260 CSS pixels to handle mobile browsers forcing a desktop viewport: move stage tabs into a scrollable row, present two generous image columns and one column at narrow phone widths, move research sidebars beneath the story, and shorten the fixed dial so it remains accessible. Asset painting resolution should be reviewed on an actual handset after packaging.


## Mobile layout hotfix — 18 November 2026, follow-up

After the phone screenshot revealed a squeezed desktop-like composition, an additional
coarse-pointer and compact-layout safeguard has been staged in
`chronology-story-vivid.css` and `chronology-story-vivid.js`. On touch/mobile
layouts, this makes the planetary selector a horizontal strip, presents a single
full-width story-card column, moves the notes below the story, and replaces the
cropped curved dial on very narrow screens with a horizontally scrollable
always-visible planet selector. Arrows and tapping stage buttons still navigate.

The curated source-image crop bounds in `scripts/build_painted_story_sprites.py`
were also tightened to remove printed title banners baked into some approved
mockups, especially Earth, Jupiter and Vulcan. The conversion script must be run
against the approved images and its seven WebP outputs verified before the
approved artwork can be considered live.

**Scope note:** these changes fix interaction and responsive layout. They do not
replace the current SVG artwork by themselves. The generated WebP files still
must be uploaded to `atlas/story-scenes/`. Do not report them as published
unless the binary files are confirmed in the repository and live delivery.
