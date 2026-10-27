# VBoS Statistics Dashboard

An interactive dashboard of the Vanuatu Bureau of Statistics (VBoS) statistical tables. It has English and French versions, and you can install it as an app on a computer or phone.

**How it works.** The CSV files in this repository are the data. Every push to GitHub runs `build.py` (Python), which:
- checks every CSV,
- builds the website,
- publishes the website on GitHub Pages.

Updating a CSV on GitHub therefore updates the live dashboard about two minutes later.

## Features

- **Menu:** a sidebar lists every table, grouped by section (Production, Communication, Energy, Price Indices, Government Finance, Overseas Trade, Tourism, Exchange Rates, Transport, Employment).
- **Overview page:** headline indicators, each with its change on a year earlier, plus highlight charts.
- **Charts:** a bar or line chart for every table.
- **Filters:**
  - frequency (annual or quarterly)
  - the table's own categories
  - unit, when a table mixes units
  - year range
  - which series to show
- **Downloads:**
  - chart as PNG
  - filtered data as CSV
  - full table as CSV
  - every table at once (**All data** button)
- **Languages:** English / French switch (EN | FR).
- **Install app:** installs the dashboard on a computer or phone (it's a Progressive Web App). The installed app works offline with the last data viewed.
- **Brand colours:** taken from the VBoS logo (navy `#265069`, teal `#3C6F72`, orange `#FAAF40`, gold `#DB9A38`, red `#EF4136`).
- **Symbols:** the published table symbols are kept: `-` nil, `n.a.` not available, `r` revised, `p` provisional.

## Folder layout

```
1.Production/ … 10.Employment/   ← the data: one CSV per table (edit these)
config/dashboard.json            ← which CSV is which table, titles, filters, headline indicators
config/labels.json               ← English/French labels for categories and units
site/                            ← the web app (HTML, CSS, JavaScript, icons)
build.py                         ← checks the data and builds the site into _site/
.github/workflows/deploy.yml     ← GitHub Actions: build and publish on every push
```

## Updating the data (every quarter)

1. Replace the CSV in its folder with the new version. Keep the same file name and columns, and add the new quarter's rows.
2. Upload it to GitHub, either:
   - **On the GitHub website:** open the folder, click **Add file → Upload files**, drop in the CSV and click **Commit changes**; or
   - **With Git / GitHub Desktop:** commit the changed file and push to `main`.
3. Open the **Actions** tab on GitHub. The "Build and publish dashboard" run checks the files and publishes the site in about two minutes.
   - A **green tick** means the dashboard is updated.
   - A **red cross** means a file has a problem. Open the run, then the **Check data and build site** step. It lists the file and the line, for example `line 57: unrecognised quarter '5th'`. The live dashboard stays on the previous version until you fix it.

### CSV format

One row per value, in "long" format:

| column | example | notes |
|---|---|---|
| `frequency` | `Annual` / `Quarterly` | |
| `period` | `2025` / `2025-Q3` | rebuilt from year and quarter |
| `year` | `2025` | |
| `quarter` | `3` | empty for annual rows |
| category columns | `product`, `port`, … | as named in `config/dashboard.json` |
| `unit` | `VT million` | |
| `value` | `1234.5` | empty when not available |
| `flag` | `revised` | optional: `nil`, `not available`, `revised`, `provisional`, `estimate`, … |

Table 1.1 uses a different layout (`Year, Period, Commodity, Location, Indicator, Unit, Value`), and the build handles it as it is.

### Adding a new table

1. Put the CSV in the right folder.
2. Add an entry to `datasets` in `config/dashboard.json`:
   - `id`, `table`, `section`, `file` and `title` (English and French);
   - `filters`: category columns chosen one at a time from a drop-down;
   - `series`: the category column drawn as separate bars or lines;
   - `chart`: `bar` or `line`.
3. Add French labels for any new category values to `config/labels.json`. The build lists any that are missing.

## Previewing on your computer

```bash
pip install -r requirements.txt
python build.py --serve
```

Then open http://localhost:8000.

## First-time GitHub setup

1. Create an empty repository on GitHub, for example `vbos-dashboard`.
2. Push this folder:
   ```bash
   git remote add origin https://github.com/<your-account>/vbos-dashboard.git
   git push -u origin main
   ```
3. On GitHub, go to **Settings → Pages**, and under **Build and deployment → Source** choose **GitHub Actions**.
4. The first run publishes the dashboard at `https://<your-account>.github.io/vbos-dashboard/`. It is also shown in **Settings → Pages**.
5. Optional: put the repository link in `config/dashboard.json` → `site.repo_url`.
