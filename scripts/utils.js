// Shared utility functions for the portfolio template

/**
 * Parses a CSV text string into an array of objects.
 * @param {string} csvText The CSV content as a string.
 * @returns {Array<Object>} An array of objects representing the CSV rows.
 */
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        // Simple CSV line parser that handles quoted strings
        const values = (lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [])
            .map(v => v.trim())
            .map(v => v.startsWith('"') && v.endsWith('"') ? v.slice(1, -1) : v);

        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    return data;
}