// Home page content loader from CSV

class HomeLoader {
    constructor() {
        this.homeContent = [];
        this.loadHomeContent();
    }
    
    async loadHomeContent() {
        try {
            const response = await fetch('./data/csv/home_content.csv');
            if (!response.ok) {
                console.warn('home_content.csv not found, using default content');
                return;
            }
            
            const csvText = await response.text();
            this.homeContent = this.parseCSV(csvText);
            
            this.updateHomeContent();
            console.log('✓ Home content loaded from CSV');
        } catch (error) {
            console.warn('Could not load home_content.csv');
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
        return data.sort((a, b) => parseInt(a.order) - parseInt(b.order));
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
    
    formatContent(content) {
        // Convert line breaks to HTML paragraphs
        return content
            .split('\n\n')
            .map(paragraph => paragraph.trim())
            .filter(paragraph => paragraph.length > 0)
            .map(paragraph => `<p>${paragraph}</p>`)
            .join('');
    }
    
    updateHomeContent() {
        const aboutSection = this.homeContent.find(item => item.section === 'about');
        if (aboutSection) {
            const aboutContent = document.querySelector('.card-body');
            if (aboutContent) {
                const formattedContent = this.formatContent(aboutSection.content);
                aboutContent.innerHTML = formattedContent;
            }
        }
        
        // Add additional sections if needed
        const skillsSection = this.homeContent.find(item => item.section === 'skills_summary');
        if (skillsSection) {
            const container = document.querySelector('.container .mb-5');
            if (container) {
                const skillsHTML = `
                <section class="mb-4">
                    <h2 class="mb-3">${skillsSection.title}</h2>
                    <div class="card">
                        <div class="card-body">
                            ${this.formatContent(skillsSection.content)}
                        </div>
                    </div>
                </section>`;
                container.insertAdjacentHTML('beforeend', skillsHTML);
            }
        }
        
        const contactSection = this.homeContent.find(item => item.section === 'contact');
        if (contactSection) {
            const container = document.querySelector('.container .mb-5');
            if (container) {
                const contactHTML = `
                <section class="mb-4">
                    <h2 class="mb-3">${contactSection.title}</h2>
                    <div class="card">
                        <div class="card-body">
                            ${this.formatContent(contactSection.content)}
                        </div>
                    </div>
                </section>`;
                container.insertAdjacentHTML('beforeend', contactHTML);
            }
        }
    }
}

// Initialize home loader only on index page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        setTimeout(() => {
            new HomeLoader();
        }, 500);
    }
});
