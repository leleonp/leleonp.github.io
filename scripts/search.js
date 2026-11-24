// Global search functionality using Lunr.js

class GlobalSearch {
    constructor() {
        this.searchIndex = null;
        this.documents = [];
        this.isInitialized = false;
        this.initializeSearch();
    }

    async initializeSearch() {
        try {
            // Load Lunr.js
            if (typeof lunr === 'undefined') {
                await this.loadLunr();
            }

            await this.buildSearchIndex();
            this.setupSearchUI();
            this.isInitialized = true;
            console.log('✓ Global search initialized');
        } catch (error) {
            console.warn('Could not initialize global search:', error);
        }
    }

    async loadLunr() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://unpkg.com/lunr/lunr.js';
            script.onload = resolve;
            script.onerror = () => {
                console.warn('Failed to load Lunr.js');
                resolve(); // Don't reject, allow fallback
            };
            document.head.appendChild(script);
        });
    }

    async buildSearchIndex() {
        try {
            // Collect content from all pages
            await this.collectContent();

            // Build Lunr index if library is available
            if (typeof lunr !== 'undefined') {
                this.searchIndex = lunr(function () {
                    this.ref('id');
                    this.field('title', { boost: 10 });
                    this.field('content', { boost: 5 });
                    this.field('tags');
                    this.field('type');

                    this.documents.forEach(doc => {
                        this.add(doc);
                    }, this);
                }.bind(this));
            }
        } catch (error) {
            console.warn('Could not build search index:', error);
        }
    }

    async collectContent() {
        const content = [];
        let id = 0;

        // Add CSV content
        await this.addCSVContent(content, id);

        this.documents = content;
    }

    async addCSVContent(content, startId) {
        let id = startId;

        try {
            // Add blog posts
            const blogResponse = await fetch('./data/csv/blog_posts.csv');
            if (blogResponse.ok) {
                const blogText = await blogResponse.text();
                const posts = this.parseCSV(blogText);
                posts.forEach(post => {
                    content.push({
                        id: id++,
                        title: post.title || 'Untitled Post',
                        content: post.excerpt || '',
                        type: 'blog',
                        url: post.markdown_file ? `posts/${post.markdown_file}` : 'blog.html',
                        tags: post.tags || ''
                    });
                });
            }

            // Add experience
            const expResponse = await fetch('./data/csv/experience.csv');
            if (expResponse.ok) {
                const expText = await expResponse.text();
                const experiences = this.parseCSV(expText);
                experiences.forEach(exp => {
                    content.push({
                        id: id++,
                        title: `${exp.role || 'Position'} at ${exp.company || 'Company'}`,
                        content: exp.description || '',
                        type: 'experience',
                        url: 'experience.html'
                    });
                });
            }

            // Add education
            const eduResponse = await fetch('./data/csv/education.csv');
            if (eduResponse.ok) {
                const eduText = await eduResponse.text();
                const education = this.parseCSV(eduText);
                education.forEach(edu => {
                    content.push({
                        id: id++,
                        title: `${edu.degree || 'Degree'} at ${edu.institution || 'Institution'}`,
                        content: `${edu.degree || ''} ${edu.institution || ''}`,
                        type: 'education',
                        url: 'education.html'
                    });
                });
            }

        } catch (error) {
            console.warn('Error loading CSV content for global search:', error);
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            data.push(row);
        }
        return data;
    }

    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current.trim());
        return result;
    }

    setupSearchUI() {
        // Add search modal to the page
        this.createSearchModal();

        // Add keyboard shortcut (Ctrl+K or Cmd+K)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openSearchModal();
            }
        });
    }

    createSearchModal() {
        const modalHTML = `
        <div class="modal fade" id="searchModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Search Portfolio</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="text" class="form-control mb-3" id="globalSearchInput" 
                               placeholder="Search publications, blog posts, experience...">
                        <div id="searchResults"></div>
                    </div>
                </div>
            </div>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Setup search input listener
        const searchInput = document.getElementById('globalSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }

        try {
            if (this.searchIndex && typeof lunr !== 'undefined') {
                const results = this.searchIndex.search(query);
                this.renderSearchResults(results);
            } else {
                console.warn('Search index not available');
            }
        } catch (error) {
            console.warn('Search error:', error);
        }
    }

    renderSearchResults(results) {
        const container = document.getElementById('searchResults');

        if (results.length === 0) {
            container.innerHTML = '<p class="text-muted">No results found.</p>';
            return;
        }

        let html = '';
        results.slice(0, 10).forEach(result => {
            const doc = this.documents.find(d => d.id.toString() === result.ref);
            if (doc) {
                const typeIcon = this.getTypeIcon(doc.type);
                html += `
                <div class="border-bottom pb-2 mb-2">
                    <div class="d-flex align-items-center">
                        <i class="${typeIcon} me-2"></i>
                        <div>
                            <h6 class="mb-1">
                                <a href="${doc.url}" class="text-decoration-none">${doc.title}</a>
                            </h6>
                            <small class="text-muted">${doc.content.substring(0, 150)}...</small>
                        </div>
                    </div>
                </div>`;
            }
        });

        container.innerHTML = html;
    }

    getTypeIcon(type) {
        const icons = {
            'publication': 'bi bi-journal-text',
            'blog': 'bi bi-file-text',
            'experience': 'bi bi-briefcase',
            'education': 'bi bi-mortarboard',
            'page': 'bi bi-file-earmark'
        };
        return icons[type] || 'bi bi-file';
    }

    openSearchModal() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            setTimeout(() => {
                const input = document.getElementById('globalSearchInput');
                if (input) {
                    input.focus();
                    input.value = '';
                    document.getElementById('searchResults').innerHTML = '';
                }
            }, 300);
        }
    }
}

// Initialize global search
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        new GlobalSearch();
    }, 1000); // Wait for other scripts to load
});
        
        const results = this.documents.filter(doc => {
            const searchText = `${doc.title} ${doc.content} ${doc.tags}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });
        
        this.renderFallbackResults(results);
    }
    
    renderSearchResults(results) {
        const container = document.getElementById('searchResults');
        
        if (results.length === 0) {
            container.innerHTML = '<p class="text-muted">No results found.</p>';
            return;
        }
        
        let html = '';
        results.slice(0, 10).forEach(result => {
            const doc = this.documents.find(d => d.id.toString() === result.ref);
            if (doc) {
                const typeIcon = this.getTypeIcon(doc.type);
                html += `
                <div class="border-bottom pb-2 mb-2">
                    <div class="d-flex align-items-center">
                        <i class="${typeIcon} me-2"></i>
                        <div>
                            <h6 class="mb-1">
                                <a href="${doc.url}" class="text-decoration-none">${doc.title}</a>
                            </h6>
                            <small class="text-muted">${doc.content.substring(0, 150)}...</small>
                        </div>
                    </div>
                </div>`;
            }
        });
        
        container.innerHTML = html;
    }
    
    renderFallbackResults(results) {
        const container = document.getElementById('searchResults');
        
        if (results.length === 0) {
            container.innerHTML = '<p class="text-muted">No results found.</p>';
            return;
        }
        
        let html = '';
        results.slice(0, 10).forEach(doc => {
            const typeIcon = this.getTypeIcon(doc.type);
            html += `
            <div class="border-bottom pb-2 mb-2">
                <div class="d-flex align-items-center">
                    <i class="${typeIcon} me-2"></i>
                    <div>
                        <h6 class="mb-1">
                            <a href="${doc.url}" class="text-decoration-none">${doc.title}</a>
                        </h6>
                        <small class="text-muted">${doc.content.substring(0, 150)}...</small>
                    </div>
                </div>
            </div>`;
        });
        
        container.innerHTML = html;
    }
    
    getTypeIcon(type) {
        const icons = {
            'publication': 'bi bi-journal-text',
            'blog': 'bi bi-file-text',
            'experience': 'bi bi-briefcase',
            'education': 'bi bi-mortarboard',
            'page': 'bi bi-file-earmark'
        };
        return icons[type] || 'bi bi-file';
    }
    
    openSearchModal() {
        const modal = document.getElementById('searchModal');
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.show();
            setTimeout(() => {
                const input = document.getElementById('globalSearchInput');
                if (input) { (input) {
                    input.focus();                    input.focus();












});    }, 1000); // Delay to ensure all scripts and content are loaded        new GlobalSearch();    setTimeout(() => {document.addEventListener('DOMContentLoaded', () => {}    }        }            }, 500);                }                }
            }, 500);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GlobalSearch();
});
