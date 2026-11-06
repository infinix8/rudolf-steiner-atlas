# Anatomy artwork credits — Visual Organ Atlas

**Art source:** DataBase Center for Life Science (DBCLS), **Togo Picture Gallery**, *202403 human anatomy organs* (March 2024).

- Original work: [202403 human anatomy organs.svg — Wikimedia Commons file record](https://commons.wikimedia.org/wiki/File:202403_human_anatomy_organs.svg).
- Original record DOI: [10.7875/togopic.2024.040](https://doi.org/10.7875/togopic.2024.040).
- Original file source: [DBCLS archive SVG](https://dbarchive.biosciencedbc.jp/data/togo-pic/image/202403_human_anatomy_organs.svg).
- License: [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).
- Required credit from the original DBCLS Togo Picture Gallery licensing page: **© 2016 DBCLS TogoTV / CC-BY-4.0**; see [DBCLS original license](https://dbarchive.biosciencedbc.jp/en/togo-pic/lic.html).
- Attribution displayed in the body map and both detailed organ guides. This work is **not** affiliated with, supported by, or endorsed by DBCLS.

## Adaptation and use

The base anatomy SVG is preserved as a distinct static graphic rather than pretending the whole SVG's shapes have individually audited organ annotations. The Rudolf Steiner Atlas places its **own** clickable numbered position markers, selection rings, preview controls, text labels and accessibility alternatives **over** the medical drawing. Color saturation is subtly softened for the Atlas palette, without changing organ geometry. The mini locators on Heart and Liver pages reuse the same illustration with a separate highlighted ring.

The illustrator depicts front-facing adult human anatomy. Kidney and spleen positioning on our eight-item navigation is approximate because the chosen artwork does not clearly isolate those structures. The research explorer's textual organ list is the fully accessible fallback. This is an anatomical illustration for navigation, not a diagnostic image or source validating Steiner's spiritual/medical teachings.

## Hosting and release policy

The original SVG is an open **CC BY 4.0** asset, not a file authored by the Atlas.

- The existing manual-only Pages publish workflow retrieves it **once per manually requested release** to `dist/atlas/media/dbcls-human-anatomy-organs.svg` and checks that it parses as SVG. If the DBCLS archive is temporarily unavailable, it retries with the Wikimedia Commons original-file mirror. No separate Actions run is created.
- In the source repository before publishing, the HTML image has a remote DBCLS fallback. After a successful Pages release, the published HTML uses the local cached file from the deployment artifact. Thus the live site does not depend on per-visitor third-party hotlinking.
- Do not remove attribution when distributing the image independently, copying the site, or making modifications. Preserve the CC BY 4.0 license link and identify adaptations.
- The public repo may contain other independently licensed material. This document describes **only** the DBCLS art and the Atlas overlay, not the licensing of the complete Steiner Atlas research.

## Files

- `atlas/body.html`: large professional body illustration and six overlaid labeled callouts plus two explicitly non-depicted list links.
- `atlas/organ-detail.html` and `atlas/organ-detail.css`: common detailed-plate mini locators for Heart and Liver.
- `research/organ-body-map-v1.json`: canonical organ routes and status.
- `.github/workflows/publish-organ-atlas.yml`: one manual, static site artifact with the credited anatomy SVG.

**Source/license verified 6 November 2026.** The Wikimedia Commons file record still shows a license-review-needed marker; the originating DBCLS archive's own license page independently states CC BY 4.0, and its original attribution convention is followed here.
