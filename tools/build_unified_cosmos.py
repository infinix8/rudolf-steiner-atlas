"""Build or verify the Living Cosmos research tables and graph."""
import argparse
import csv
import io
import json
import re
from collections import Counter, defaultdict
from datetime import date
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "docs/research/unified-macrocosm-microcosm"
MATRICES = {
    "cosmic": "COSMIC_EVOLUTION_MATRIX",
    "spheres": "PLANETARY_SPHERES_MATRIX",
    "hierarchies": "SPIRITUAL_HIERARCHIES_MATRIX",
    "constitution": "HUMAN_CONSTITUTION_MATRIX",
    "organs": "ORGAN_CORRESPONDENCE_MATRIX",
    "soul": "SOUL_FACULTY_MATRIX",
    "history": "HISTORICAL_EPOCH_MATRIX",
    "journey": "KARMA_AND_PLANETARY_JOURNEY",
    "intelligence": "PLANETARY_INTELLIGENCE_MATRIX",
    "sun-christ": "SUN_AND_CHRIST_MATRIX",
    "zodiac": "ZODIAC_MATRIX",
    "comparisons": "CONTRADICTIONS_LEDGER",
}
CLASSES = {
    "A": "Direct statement",
    "B": "Cross-passage synthesis",
    "C": "Tentative inference",
    "D": "Open or context-dependent",
}
AXES = ("stage", "sphere", "hierarchy", "member", "organ", "system", "faculty",
        "epoch", "being", "oracle", "zodiac", "process")


def tsv(name):
    with (DATA / f"{name}.tsv").open(encoding="utf-8", newline="") as handle:
        return list(csv.DictReader(handle, delimiter="\t"))


def index(rows):
    result = {}
    for row in rows:
        assert row["id"] and row["id"] not in result, row["id"]
        result[row["id"]] = row
    return result


def csv_text(rows):
    stream = io.StringIO(newline="")
    writer = csv.DictWriter(stream, fieldnames=rows[0], lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return stream.getvalue()


def build():
    nodes = index(tsv("ENTITIES"))
    for node in nodes.values():
        assert node["kind"] in AXES and node["label"], node
        route = node.pop("route")
        if route:
            assert (ROOT / "atlas" / urlsplit(route).path).is_file(), route
            node["route"] = route
        x, y = node.pop("x"), node.pop("y")
        if x and y:
            node["figure"] = [float(x), float(y)]

    sources = index(tsv("SOURCE_VIEWS"))
    for item in sources.values():
        url = urlsplit(item["url"])
        assert url.scheme == "https" and url.hostname == "rsarchive.org", item
        assert item["language"] in {"en", "de"} and item["title"], item
        if item["date"]:
            date.fromisoformat(item["date"])

    edges = index(tsv("RELATIONSHIPS"))
    crosswalk = index(tsv("MATRIX_CONTEXT"))
    assert crosswalk.keys() <= edges.keys(), crosswalk.keys() - edges.keys()
    by_matrix = defaultdict(list)
    by_source = defaultdict(list)
    for edge in edges.values():
        assert edge["class"] in CLASSES and edge["dataset"] in MATRICES, edge["id"]
        assert re.fullmatch(r"[a-z]+(?:_[a-z]+)*", edge["type"]), edge["type"]
        assert edge["claim"] and edge["qualification"] and edge["context"], edge["id"]
        axes = [edge["from"], edge["to"]]
        if edge["id"] in crosswalk:
            axes.extend(crosswalk[edge["id"]]["entities"].split("|"))
        edge["matrix_context"] = list(dict.fromkeys(axes[2:]))
        citations = []
        for pointer in edge.pop("evidence").split("|"):
            source_id, location = pointer.split("@")
            source = sources[source_id]
            assert re.fullmatch(r"\d+(?:–\d+)?(?:,\d+(?:–\d+)?)*", location), pointer
            citations.append({"source": source_id, "location": location})
            by_source[(source_id, location)].append({"id": edge["id"], "claim": edge["claim"]})
        assert citations, edge["id"]
        if edge["class"] == "B":
            assert len({(c["source"], c["location"]) for c in citations}) >= 2, edge["id"]
        edge["evidence"] = citations
        row = {key: edge[key] for key in ("id", "from", "type", "to", "context", "class")}
        row.update({kind: " | ".join(nodes[key]["label"] for key in dict.fromkeys(axes)
                                     if nodes[key]["kind"] == kind) for kind in AXES})
        for field in ("ga", "title", "date", "url", "language"):
            row[field] = " | ".join(sources[c["source"]][field] or "N/A" for c in citations)
        row["location"] = " | ".join(c["location"] for c in citations)
        row["paraphrase"] = edge["claim"]
        row["interpretation_qualification"] = edge["qualification"]
        by_matrix[edge["dataset"]].append(row)

    ledger = [
        {**sources[key], "location": loc, "claim_ids": " | ".join(c["id"] for c in claims),
         "selected_paraphrases": " | ".join(c["claim"] for c in claims)}
        for (key, loc), claims in sorted(by_source.items())
    ]
    assert {key for key, _ in by_source} == sources.keys()
    graph = {
        "schema_version": 1, "evidence_classes": CLASSES,
        "datasets": MATRICES,
        "nodes": list(nodes.values()), "edges": list(edges.values()),
        "sources": list(sources.values()),
    }
    outputs = {f"{name}.csv": csv_text(by_matrix[key]) for key, name in MATRICES.items()}
    outputs["PRIMARY_SOURCE_LEDGER.csv"] = csv_text(ledger)
    outputs["KNOWLEDGE_GRAPH.json"] = json.dumps(graph, ensure_ascii=False, indent=2) + "\n"
    print(
        f"{len(nodes)} entities, {len(edges)} relationships, "
        f"{len(sources)} source views in {len({s['ga'] for s in sources.values()})} GA volumes, "
        f"{len(ledger)} source-location records"
    )
    print("Evidence", dict(sorted(Counter(e["class"] for e in edges.values()).items())))
    print("Datasets", {key: len(rows) for key, rows in by_matrix.items()})
    return outputs


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify committed output without writing")
    args = parser.parse_args()
    for name, content in build().items():
        path = DATA / name
        if args.check:
            assert path.read_text(encoding="utf-8") == content, f"Regenerate {path}"
        else:
            path.write_text(content, encoding="utf-8")


if __name__ == "__main__":
    main()
