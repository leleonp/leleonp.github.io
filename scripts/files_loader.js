// Load downloads from data/csv/downloads.csv and render into files.html

async function fetchText(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fetch failed: ${url} status ${res.status}`);
    return await res.text();
}

function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        const vals = lines[i].split(',');
        const row = {};
        headers.forEach((h, idx) => row[h] = (vals[idx]||'').trim());
        rows.push(row);
    }
    return rows;
}

function renderDownloads(downloads) {
    const container = document.getElementById('downloads-container');
    if (!container) return;

    if (!downloads || downloads.length === 0) {
        container.innerHTML = `<div class="alert alert-info">No downloads available.</div>`;
        return;
    }

    // Deduplicate by file_path (keep first occurrence)
    const seen = new Map();
    downloads.forEach(d => {
        const key = (d.file_path || d.file || d.title || '').trim();
        if (!key) return;
        if (!seen.has(key)) seen.set(key, d);
    });

    // Group by category preserving insertion order
    const categories = new Map();
    for (const d of seen.values()) {
        const cat = (d.category || 'Other').trim();
        if (!categories.has(cat)) categories.set(cat, []);
        categories.get(cat).push(d);
    }

    let html = '';
    // Render each category: grid if many items, centered single if only one
    for (const [cat, items] of categories.entries()) {
        if (items.length === 1) {
            const item = items[0];
            const filePath = item.file_path || item.file || '#';
            const title = item.title || item.name || filePath.split('/').pop();
            const desc = item.description || '';
            html += `<section class="mb-4"><h3 class="mb-3">${cat}</h3><div class="download-single-wrapper"><div class="download-single">`;
            html += `
                <article class="download-card">
                    <div class="download-meta">
                        <h5 class="mb-1">${title}</h5>
                        <p class="text-muted small mb-2">${desc}</p>
                    </div>
                    <div class="download-actions">
                        <a class="btn btn-sm btn-primary" href="${filePath}" download>
                            <i class="bi bi-download me-1"></i> Download
                        </a>
                    </div>
                </article>`;
            html += `</div></div></section>`;
        } else {
            html += `<section class="mb-4"><h3 class="mb-3">${cat}</h3><div class="downloads-grid">`;
            items.forEach(item => {
                const filePath = item.file_path || item.file || '#';
                const title = item.title || item.name || filePath.split('/').pop();
                const desc = item.description || '';
                html += `
                    <article class="download-card">
                        <div class="download-meta">
                            <h5 class="mb-1">${title}</h5>
                            <p class="text-muted small mb-2">${desc}</p>
                        </div>
                        <div class="download-actions">
                            <a class="btn btn-sm btn-primary" href="${filePath}" download>
                                <i class="bi bi-download me-1"></i> Download
                            </a>
                        </div>
                    </article>`;
            });
            html += `</div></section>`;
        }
    }

    container.innerHTML = html;
}

async function loadDownloads() {
    try {
        // Try CSV first
        const csv = await fetchText('./data/csv/downloads.csv');
        const downloads = parseCSV(csv);
        if (downloads.length > 0) {
            renderDownloads(downloads);
            console.log('✓ Loaded downloads from CSV');
            return;
        }
    } catch (err) {
        console.warn('downloads.csv not found or parse error, falling back to files/ directory', err.message);
    }

    // Fallback: list files/ directory by attempting to fetch known files index (simple approach)
    try {
        const list = [];
        // We'll attempt to fetch a small set of likely files in /files by reading the folder listing via HTTP (http-server will render index)
        const indexHtml = await fetchText('./files/');
        // crude parse: look for hrefs to files
        const hrefs = Array.from(indexHtml.matchAll(/href=\"([^\"]+)\"/g)).map(m => m[1]);
        hrefs.forEach(h => {
            if (h.endsWith('/')) return; // skip dirs
            list.push({ category: 'Files', title: h, file_path: `files/${h}` });
        });
        if (list.length > 0) {
            renderDownloads(list);
            console.log('✓ Loaded downloads from files/ directory listing');
            return;
        }
    } catch (err) {
        console.warn('Could not list files/ directory over HTTP', err.message);
    }

    // Nothing found
    renderDownloads([]);
}

// Initialize after DOM and other loaders are ready
window.addEventListener('DOMContentLoaded', () => {
    // Slight delay to allow csv_loader operations and navbar injection
    setTimeout(loadDownloads, 200);
});
