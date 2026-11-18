#!/usr/bin/env python3
"""Pack approved planetary-stage story mockups into 4×2 WebP scene sprites.

Requires Pillow: pip install pillow
Usage:
  python scripts/build_painted_story_sprites.py --source-dir /path/to/mockups

Each generated sprite has exactly four columns and two rows, matching
atlas/chronology-story-vivid.js and the .scene-picture background-position logic.
Stage cards are separate interactive HTML overlays; text is NOT taken from
inside the generated mockups.
"""
import argparse
from pathlib import Path

from PIL import Image, ImageOps

# Curated pixel bounds in the approved 1672×941 stage-specific concept images.
# Crop out page headers, navigation, descriptions and overprinted title ribbons.
SOURCES = {
    "cos-saturn": (
        "old_saturn_the_warmth_condition.png",
        [(257, 526), (535, 794), (801, 1059), (1065, 1323)],
        [(248, 385), (520, 642)],
    ),
    "cos-sun": (
        "old_sun_an_evolutionary_atlas.png",
        [(255, 507), (517, 779), (788, 1041), (1051, 1303)],
        [(202, 371), (493, 637)],
    ),
    "cos-moon": (
        "the_steiner_atlas_old_moon_chronology.png",
        [(263, 525), (534, 793), (798, 1059), (1066, 1329)],
        [(224, 394), (523, 678)],
    ),
    "cos-earth": (
        "earth_the_human_i_and_moral_freedom.png",
        [(251, 534), (539, 814), (820, 1089), (1094, 1364)],
        [(246, 382), (523, 666)],
    ),
    "cos-jupiter": (
        "rudolf_steiner_atlas_future_jupiter.png",
        [(256, 527), (537, 792), (800, 1075), (1080, 1327)],
        [(228, 388), (522, 674)],
    ),
    "cos-venus": (
        "future_venus_the_evolutionary_atlas.png",
        [(305, 563), (562, 818), (819, 1074), (1076, 1334)],
        [(232, 388), (526, 665)],
    ),
    "cos-vulcan": (
        "the_steiner_atlas_future_vulcan.png",
        [(278, 532), (538, 797), (802, 1059), (1066, 1328)],
        [(251, 406), (548, 681)],
    ),
}


def make_sprites(source_dir: Path, output_dir: Path, cell_width=420, cell_height=250):
    output_dir.mkdir(parents=True, exist_ok=True)
    missing = [name for name, (name, _, _) in SOURCES.items()
               if not (source_dir / name).is_file()]
    if missing:
        raise FileNotFoundError(
            "The following approved images are missing from the supplied folder:\n  "
            + "\n  ".join(missing)
        )

    for stage, (filename, columns, rows) in SOURCES.items():
        # Each card's mockup ribbon/printed caption is excluded from these ROIs.
        # Scene titles, source citations and expansion markers remain HTML UI elements.
        with Image.open(source_dir / filename) as image:
            if image.size != (1672, 941):
                raise ValueError(f"{filename}: expected 1672×941, got {image.size}")
            rgb = image.convert("RGB")
            sprite = Image.new("RGB", (cell_width * 4, cell_height * 2))
            for row, (top, bottom) in enumerate(rows):
                for col, (left, right) in enumerate(columns):
                    crop = rgb.crop((left, top, right, bottom))
                    crop = ImageOps.fit(
                        crop, (cell_width, cell_height),
                        method=Image.Resampling.LANCZOS
                    )
                    sprite.paste(crop, (col * cell_width, row * cell_height))
        destination = output_dir / f"{stage}-eight-scenes.webp"
        sprite.save(destination, "WEBP", quality=83, method=6)
        print(f"{stage}: 8 artwork crops -> {destination} ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-dir", required=True, type=Path)
    parser.add_argument("--output-dir", default=Path("atlas/story-scenes"), type=Path)
    args = parser.parse_args()
    make_sprites(args.source_dir, args.output_dir)
