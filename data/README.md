# Data CSV layout (status and guidance)

Status: This README was updated to reflect the current CSV-driven loaders in the project. The project loads data from `data/csv/*.csv` (see `scripts/csv_loader.js`) and injects HTML on several pages (publications, experience, education, skills, files/downloads, awards).

Location
--------
Put CSVs under:

  data/csv/

Core CSV files (used by loaders)
--------------------------------
- `education.csv` — columns: id, person_id, institution, degree, start_date, end_date, logo, description
- `experience.csv` — columns: id, person_id, company, role, start_date, end_date, logo, description
- `publications.csv` — columns: id, person_id, title, authors, journal, year, doi, url, category
- `skills.csv` — columns: id, person_id, category, name, description, icon
- `downloads.csv` — columns: category,title,description,file_path
- `awards.csv` — columns: id, person_id, award, year, organization, description, url (optional)

Notes on `awards.csv`
--------------------
- The CSV loader (`scripts/csv_loader.js`) expects `awards.csv` to contain rows with at least `award`, `year`, and `organization` (or `issuer`).
- Adding a `url` or `link` column will let the loader render a "View" link for the award.

Best practices
--------------
- Use consistent header names and include all columns even if some values are empty; the loader tolerates missing fields but consistent headers make editing easier.
- Prefer ISO dates (YYYY) in `year` columns for easy sorting.
- Avoid duplicate rows; the downloads loader deduplicates on `file_path` but awards loader will render duplicates as-is.

Troubleshooting
---------------
- If a page doesn't update after editing CSV, try a hard refresh (Cmd+Shift+R) to bypass caching.
- Check browser console for fetch errors (404 for missing CSVs) or JS exceptions.
