// Blog functionality for portfolio template

class BlogManager {
    constructor() {
        this.posts = [];
        this.filteredPosts = [];
        this.currentTag = 'all';
        this.loadBlogPosts();
        this.initializeEventListeners();
        this.loadMarkdownLibrary();
    }
    
    async loadMarkdownLibrary() {
        try {
            // Load marked.js for Markdown parsing
            if (typeof marked === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
                script.onload = () => {
                    console.log('✓ Markdown library loaded');
                };
                document.head.appendChild(script);
            }
        } catch (error) {
            console.warn('Could not load Markdown library:', error);
        }
    }
    
    async loadBlogPosts() {
        try {
            const response = await fetch('./data/csv/blog_posts.csv');
            if (!response.ok) {
                console.warn('blog_posts.csv not found, using template posts');
                return;
            }
            
            const csvText = await response.text();
            this.posts = this.parseCSV(csvText);
            this.filteredPosts = [...this.posts];
            
            this.renderPosts();
            this.renderTagFilters();
            console.log('✓ Loaded blog posts from CSV');
        } catch (error) {
            console.warn('Could not load blog_posts.csv');
        }
    }
    
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const posts = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = this.parseCSVLine(lines[i]);
            const post = {};
            headers.forEach((header, index) => {
                post[header] = values[index] || '';
            });
            
            // Parse tags
            post.tagsArray = post.tags ? post.tags.split(';').map(t => t.trim()) : [];
            posts.push(post);
        }
        
        // Sort by date (newest first)
        return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    
    renderPosts() {
        const container = document.getElementById('blogContainer');
        const noResults = document.getElementById('noResults');
        
        if (this.filteredPosts.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }
        
        noResults.style.display = 'none';
        
        let html = '';
        this.filteredPosts.forEach(post => {
            const formattedDate = this.formatDate(post.date);
            const tagsHtml = post.tagsArray.map(tag => 
                `<span class="badge bg-secondary me-1">${tag}</span>`
            ).join('');
            
            html += `
            <article class="card mb-4 blog-post" data-tags="${post.tagsArray.join(',')}">
                <div class="card-body">
                    <h3 class="card-title">${post.title}</h3>
                    <div class="text-muted mb-2">
                        <small>
                            <i class="bi bi-calendar"></i> ${formattedDate} | 
                            <i class="bi bi-tag"></i> ${tagsHtml}
                        </small>
                    </div>
                    <p class="card-text">${post.excerpt}</p>
                    ${post.markdown_file ? `<button class="btn btn-primary" onclick="window.blogManager.openMarkdownPost('${post.markdown_file}', '${post.title}')">Read More</button>` : ''}
                </div>
            </article>`;
        });
        
        container.innerHTML = html;
        
        // Make this instance globally accessible
        window.blogManager = this;
    }
    
    async openMarkdownPost(markdownFile, title) {
        try {
            // Fetch the markdown file
            const response = await fetch(`./posts/${markdownFile}`);
            if (!response.ok) {
                throw new Error(`Could not load ${markdownFile}`);
            }
            
            const markdownContent = await response.text();
            
            // Convert markdown to HTML
            let htmlContent = markdownContent;
            if (typeof marked !== 'undefined') {
                htmlContent = marked.parse(markdownContent);
            } else {
                // Fallback: simple markdown-like formatting
                htmlContent = this.simpleMarkdownToHtml(markdownContent);
            }
            
            // Create and show modal with the content
            this.showMarkdownModal(title, htmlContent);
            
        } catch (error) {
            console.error('Error loading markdown post:', error);
            alert('Could not load the blog post. Please try again later.');
        }
    }
    
    simpleMarkdownToHtml(markdown) {
        // Basic markdown conversion for fallback
        return markdown
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img alt="$1" src="$2" class="img-fluid">')
            .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/\n\n/gim, '</p><p>')
            .replace(/^(.*)$/gim, '<p>$1</p>')
            .replace(/```([^`]*)```/gim, '<pre><code>$1</code></pre>');
    }
    
    showMarkdownModal(title, htmlContent) {
        // Remove existing modal if any
        const existingModal = document.getElementById('markdownModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Create modal HTML
        const modalHTML = `
        <div class="modal fade" id="markdownModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <article class="markdown-content">
                            ${htmlContent}
                        </article>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
        
        // Add modal to page
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('markdownModal'));
        modal.show();
        
        // Remove modal from DOM when closed
        document.getElementById('markdownModal').addEventListener('hidden.bs.modal', function() {
            this.remove();
        });
    }
    
    initializeEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput && searchBtn) {
            const performSearch = () => {
                const query = searchInput.value.toLowerCase();
                this.filterPosts(query, this.currentTag);
            };
            
            searchInput.addEventListener('input', performSearch);
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') performSearch();
            });
        }
        
        // Tag filtering
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-tag]')) {
                const tag = e.target.getAttribute('data-tag');
                this.currentTag = tag;
                
                // Update active tag button
                document.querySelectorAll('[data-tag]').forEach(btn => {
                    btn.classList.remove('active');
                });
                e.target.classList.add('active');
                
                const query = searchInput ? searchInput.value.toLowerCase() : '';
                this.filterPosts(query, tag);
            }
        });
    }
    
    filterPosts(searchQuery = '', tag = 'all') {
        this.filteredPosts = this.posts.filter(post => {
            const matchesSearch = !searchQuery || 
                post.title.toLowerCase().includes(searchQuery) ||
                post.excerpt.toLowerCase().includes(searchQuery) ||
                post.tagsArray.some(t => t.toLowerCase().includes(searchQuery));
            
            const matchesTag = tag === 'all' || post.tagsArray.includes(tag);
            
            return matchesSearch && matchesTag;
        });
        
        this.renderPosts();
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}

// Initialize blog manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.location.pathname.includes('blog.html')) {
            console.log('Initializing blog functionality...');
            new BlogManager();
        }
    }, 500);
});
