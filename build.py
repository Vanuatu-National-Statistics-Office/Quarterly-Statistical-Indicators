"""Build the VBoS statistics dashboard.

Reads every CSV listed in config/dashboard.json, checks it, and writes a static website
to _site/ that GitHub Pages serves. Run it locally to preview before pushing:

    python build.py            # check the data and build _site/
    python build.py --serve    # build, then open http://localhost:8000
"""
import argparse
import gzip
import hashlib
import http.server
import io
import json
import re
import shutil
import sys
import zipfile
from datetime import datetime, timezone
from functools import partial
from pathlib import Path

import pandas as pd
import plotly

ROOT = Path(__file__).resolve().parent
CONFIG_DIR = ROOT / "config"
SITE_SRC = ROOT / "site"
OUT = ROOT / "_site"

KNOWN_FLAGS = ("nil", "not available", "revised", "provisional", "estimate",
               "partial year", "suspected error", "no exports", "blank in source")


class DataError(Exception):
    pass


def parse_quarter(text):
    """'1st', '2nd ', 'Q3', '4', '2nd[p]' -> 1..4; '' -> None."""
    text = str(text).strip()
    if text == "":
        return None
    m = re.match(r"^(?:Q)?([1-4])(?:st|nd|rd|th)?\b", text, re.IGNORECASE)
    if not m:
        raise ValueError(f"unrecognised quarter '{text}'")
    return int(m.group(1))


def parse_frequency(text):
    t = str(text).strip().lower()
    if t.startswith("a"):
        return "Annual"
    if t.startswith("q"):
        return "Quarterly"
    raise ValueError(f"unrecognised frequency '{text}'")


def parse_value(text):
    t = str(text).strip().replace(",", "")
    if t == "":
        return None
    return float(t)


def load_dataset(cfg):
    """Read one CSV and return it in the standard long layout, or raise DataError."""
    path = ROOT / cfg["file"]
    if not path.exists():
        raise DataError(f"file not found: {cfg['file']}")

    df = pd.read_csv(path, dtype=str, keep_default_na=False, encoding="utf-8-sig")
    df.columns = [c.strip() for c in df.columns]
    df = df.rename(columns=cfg.get("rename", {}))
    df = df.drop(columns=[c for c in cfg.get("drop", []) if c in df.columns])
    df = df.apply(lambda col: col.str.strip())

    # Files laid out as Year + Period ("Annual", "1st", ...) instead of frequency/period/year/quarter.
    if cfg.get("layout") == "year_period":
        is_annual = df["period"].str.lower().str.startswith("annual")
        df["frequency"] = is_annual.map({True: "Annual", False: "Quarterly"})
        df["quarter"] = df["period"].where(~is_annual, "")

    dims = cfg["filters"] + [cfg["series"]]
    required = ["frequency", "year", "quarter", "unit", "value"] + dims
    missing = [c for c in required if c not in df.columns]
    if missing:
        raise DataError(f"missing column(s) {missing}; found {list(df.columns)}")
    if "flag" not in df.columns:
        df["flag"] = ""

    problems = []
    rows = []
    for i, r in enumerate(df.to_dict("records"), start=2):  # line 1 is the header
        try:
            freq = parse_frequency(r["frequency"])
            year = int(float(r["year"]))
            quarter = parse_quarter(r["quarter"]) if freq == "Quarterly" else None
            if freq == "Quarterly" and quarter is None:
                raise ValueError("quarterly row without a quarter")
            value = parse_value(r["value"])
        except ValueError as e:
            problems.append(f"line {i}: {e}")
            continue
        rows.append({
            "frequency": freq,
            "period": str(year) if quarter is None else f"{year}-Q{quarter}",
            "year": year, "quarter": quarter,
            **{d: r[d] for d in dims},
            "unit": r["unit"], "value": value, "flag": r["flag"],
        })
    if problems:
        shown = "\n    ".join(problems[:15])
        more = f"\n    ... and {len(problems) - 15} more" if len(problems) > 15 else ""
        raise DataError(f"{len(problems)} unreadable row(s):\n    {shown}{more}")

    out = pd.DataFrame(rows)
    dupes = out[out.duplicated(["frequency", "period"] + dims, keep=False)]
    if len(dupes):
        sample = dupes.head(5)[["period"] + dims].to_string(index=False)
        raise DataError(f"{len(dupes)} duplicated row(s) for the same period and categories:\n{sample}")
    return out, dims


def warnings_for(df, cfg, labels):
    """Things worth a look that should not stop the build."""
    w = []
    unknown_flags = sorted({f for f in df["flag"] if f and not f.lower().startswith(KNOWN_FLAGS)})
    if unknown_flags:
        w.append(f"flags not in the symbols list (shown as *): {unknown_flags}")
    untranslated = sorted({v for d in cfg["filters"] + [cfg["series"]] for v in df[d].unique()
                           if v not in labels["values"]} |
                          {u for u in df["unit"].unique() if u not in labels["values"]})
    if untranslated:
        w.append(f"no French label in config/labels.json for: {untranslated}")
    for name, default in cfg.get("defaults", {}).items():
        if default not in set(df[name]):
            w.append(f"default {name} '{default}' is not in the data")
    return w


def decimals_by_unit(df):
    """Decimal places to display for each unit, from the most precise value in the file (max 3)."""
    out = {}
    for unit, values in df.groupby("unit")["value"]:
        places = [len(f"{v:.6f}".rstrip("0").split(".")[1]) for v in values.dropna()]
        out[unit] = min(max(places, default=0), 3)
    return out


def compact(df, dims):
    """Rows as short arrays to keep the JSON small: [freq, year, quarter, *dims, unit, value, flag]."""
    out = []
    for r in df.itertuples(index=False):
        # pandas turns missing numbers into NaN, which is not valid JSON.
        q = None if pd.isna(r.quarter) else int(r.quarter)
        v = None if pd.isna(r.value) else float(r.value)
        if v is not None and v.is_integer():
            v = int(v)
        out.append(["A" if r.frequency == "Annual" else "Q", int(r.year), q,
                    *[getattr(r, d) for d in dims], r.unit, v, r.flag])
    return out


def build():
    config = json.loads((CONFIG_DIR / "dashboard.json").read_text(encoding="utf-8"))
    labels = json.loads((CONFIG_DIR / "labels.json").read_text(encoding="utf-8"))
    labels.pop("_comment", None)

    if OUT.exists():
        shutil.rmtree(OUT)
    shutil.copytree(SITE_SRC, OUT)
    (OUT / "data").mkdir()
    (OUT / "downloads").mkdir()
    (OUT / "vendor").mkdir()

    errors, datasets = 0, []
    print(f"Checking {len(config['datasets'])} tables\n")
    for cfg in config["datasets"]:
        name = f"Table {cfg['table']:<4} {cfg['file']}"
        try:
            df, dims = load_dataset(cfg)
        except DataError as e:
            errors += 1
            print(f"  ERROR  {name}\n         {e}\n")
            continue
        n_q = (df["frequency"] == "Quarterly").sum()
        latest = df[df["value"].notna()].sort_values(["year", "quarter"], na_position="first")["period"].iloc[-1]
        print(f"  ok     {name}  ({len(df)} rows, {n_q} quarterly, latest {latest})")
        for msg in warnings_for(df, cfg, labels):
            print(f"         note: {msg}")

        csv_name = f"vbos_table_{cfg['table'].replace('.', '_')}.csv"
        out_csv = df.astype({"quarter": "Int64"})
        out_csv["value"] = out_csv["value"].map(
            lambda v: "" if pd.isna(v) else (str(int(v)) if float(v).is_integer() else f"{v:g}"))
        out_csv.to_csv(OUT / "downloads" / csv_name, index=False, encoding="utf-8-sig")
        public = {k: v for k, v in cfg.items() if k not in ("file", "rename", "drop", "layout")}
        datasets.append({**public, "dims": dims, "csv": f"downloads/{csv_name}",
                         "decimals": decimals_by_unit(df), "rows": compact(df, dims)})

    if errors:
        print(f"\n{errors} table(s) could not be read. Fix the file(s) above and run again.")
        sys.exit(1)

    built = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%MZ")
    payload = {"built": built, "site": config["site"], "sections": config["sections"],
               "datasets": datasets, "labels": labels,
               "headlines": config["headlines"], "overview_charts": config["overview_charts"]}
    data_json = json.dumps(payload, ensure_ascii=False, separators=(",", ":"), allow_nan=False)
    (OUT / "data" / "dashboard.json").write_text(data_json, encoding="utf-8")

    with zipfile.ZipFile(OUT / "downloads" / "vbos_dashboard_data.zip", "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted((OUT / "downloads").glob("*.csv")):
            z.write(f, f.name)

    # Plotly's JavaScript ships inside the Python package, so the site needs no CDN and works offline.
    shutil.copy(Path(plotly.__file__).parent / "package_data" / "plotly.min.js", OUT / "vendor")

    # A new version string makes installed apps fetch the new files.
    digest = hashlib.sha256(data_json.encode())
    for f in ("index.html", "app.js", "styles.css"):
        digest.update((OUT / f).read_bytes())
    sw = OUT / "sw.js"
    sw.write_text(sw.read_text(encoding="utf-8").replace("__VERSION__", digest.hexdigest()[:12]),
                  encoding="utf-8")

    (OUT / ".nojekyll").touch()
    print(f"\nBuilt {OUT.relative_to(ROOT)}/ at {built}: {len(datasets)} tables, "
          f"{sum(len(d['rows']) for d in datasets)} rows.")


class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    """Local preview server. Compresses responses like GitHub Pages does; on some Windows
    machines large uncompressed responses over localhost get cut off."""

    def send_head(self):
        path = Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / "index.html"
        if (not path.is_file() or path.stat().st_size > 1_000_000
                or "gzip" not in self.headers.get("Accept-Encoding", "")):
            return super().send_head()
        body = gzip.compress(path.read_bytes())
        self.send_response(200)
        self.send_header("Content-Type", self.guess_type(str(path)))
        self.send_header("Content-Encoding", "gzip")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache")
        self.end_headers()
        return io.BytesIO(body)

    def log_message(self, *args):
        pass


def serve(port):
    handler = partial(PreviewHandler, directory=str(OUT))
    with http.server.ThreadingHTTPServer(("", port), handler) as httpd:
        print(f"Serving on http://localhost:{port}  (Ctrl+C to stop)")
        httpd.serve_forever()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--serve", action="store_true", help="preview the site after building")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    build()
    if args.serve:
        serve(args.port)
