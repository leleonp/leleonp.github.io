// Automatic CSV loader for portfolio template
// This script loads CSV files and updates content automatically

class CSVLoader {
    constructor() {
        this.loadCSVContent();
    }
    
    async loadCSVContent() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        try {
            switch(currentPage) {
                case 'publications.html':
                    await this.loadPublications();
                    break;
                case 'experience.html':
                    await this.loadExperience();
                    break;
                case 'education.html':
                    await this.loadEducation();
                    break;
                case 'skills.html':
                    await this.loadSkills();
                    break;
                case 'awards.html':
                    await this.loadAwards();
                    break;
            }
        } catch (error) {
            console.warn('CSV files not found or invalid, using template placeholders');
        }
    }
    
    async loadPublications() {
        try {
            const response = await fetch('./data/csv/publications.csv');
            if (!response.ok) return;
            
            const csvText = await response.text();
            const publications = this.parseCSV(csvText);
            
            if (publications.length > 0) {
                this.updatePublicationsHTML(publications);
                console.log('✓ Loaded publications from CSV');
            }
        } catch (error) {
            console.warn('Could not load publications.csv');
        }
    }
    
    async loadExperience() {
        try {
            const response = await fetch('./data/csv/experience.csv');
            if (!response.ok) return;
            
            const csvText = await response.text();
            const experiences = this.parseCSV(csvText);
            
            if (experiences.length > 0) {
                this.updateExperienceHTML(experiences);
                console.log('✓ Loaded experience from CSV');
            }
        } catch (error) {
            console.warn('Could not load experience.csv');
        }
    }
    
    async loadEducation() {
        try {
            const response = await fetch('./data/csv/education.csv');
            if (!response.ok) return;
            
            const csvText = await response.text();
            const education = this.parseCSV(csvText);
            
            if (education.length > 0) {
                this.updateEducationHTML(education);
                console.log('✓ Loaded education from CSV');
            }
        } catch (error) {
            console.warn('Could not load education.csv');
        }
    }
    
    async loadAwards() {
        try {
            const response = await fetch('./data/csv/awards.csv');
            if (!response.ok) return;

            const csvText = await response.text();
            const awards = this.parseCSV(csvText);

            if (awards.length > 0) {
                this.updateAwardsHTML(awards);
                console.log('✓ Loaded awards from CSV');
            }
        } catch (error) {
            console.warn('Could not load awards.csv');
        }
    }

    updateAwardsHTML(awards) {
        let cardsHTML = '';
        awards.forEach(a => {
            const title = a.award || a.title || 'Award';
            const org = a.organization || a.issuer || '';
            const year = a.year || '';
            const desc = a.description || '';
            const link = (a.url || a.link || '').trim();

            cardsHTML += `
            <article class="col-md-6">
                <div class="card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${org}${org && year ? ' — ' : ''}${year}</h6>
                        <p class="card-text">${desc}</p>
                        ${link ? `<a href="${link}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline-primary">View</a>` : ''}
                    </div>
                </div>
            </article>`;
        });

        const section = document.querySelector('#awards-container') || document.querySelector('section.row.g-3');
        if (section) {
            section.innerHTML = cardsHTML;
        }
    }

    async loadSkills() {
        try {
            const response = await fetch('./data/csv/skills.csv');
            if (!response.ok) return;
            
            const csvText = await response.text();
            const skills = this.parseCSV(csvText);
            
            if (skills.length > 0) {
                this.updateSkillsHTML(skills);
                console.log('✓ Loaded skills from CSV');
            }
        } catch (error) {
            console.warn('Could not load skills.csv');
        }
    }
    
    // Enhanced CSV parsing function with reverse option
    parseCSV(csvText, reverseOrder = true) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];
        
        const headers = lines[0].split(',').map(h => h.trim());
        const dataRows = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });
        
        // Reverse the data to show newest entries first
        return reverseOrder ? dataRows.reverse() : dataRows;
    }
    
    updatePublicationsHTML(publications) {
        // Group by category
        const categories = {};
        publications.forEach(pub => {
            if (!categories[pub.category]) {
                categories[pub.category] = [];
            }
            categories[pub.category].push(pub);
        });
        
        let accordionHTML = '';
        Object.keys(categories).forEach((category) => {
            const categoryId = category.toLowerCase().replace(/\s+/g, '');
            const icon = this.getIconForCategory(category);
            
            accordionHTML += `
  <div class="accordion-item">
    <h2 class="accordion-header" id="heading${categoryId}">
      <button class="accordion-button category collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${categoryId}" aria-expanded="false" aria-controls="collapse${categoryId}">
        <i class="${icon} me-2"></i> ${category}
      </button>
    </h2>
    <div id="collapse${categoryId}" class="accordion-collapse collapse" aria-labelledby="heading${categoryId}" data-bs-parent="#pubAccordion">
      <div class="accordion-body p-0">`;
            
            categories[category].forEach(pub => {
                const link = pub.url || (pub.doi ? `https://doi.org/${pub.doi}` : '#');
                const linkText = pub.doi || pub.url || 'Link';
                
                accordionHTML += `
        <div class="pub-border p-3">
            <div class="title_pub">${pub.title}</div>
            <div class="authors">${pub.authors}</div>
            <div class="journal">${pub.journal}, <span class="year">${pub.year}</span></div>
            <a href="${link}">${linkText}</a>
        </div>`;
            });
            
            accordionHTML += `
      </div>
    </div>
  </div>`;
        });
        
        const accordion = document.querySelector('#pubAccordion');
        if (accordion) {
            accordion.innerHTML = accordionHTML;
        }
    }
    
    updateExperienceHTML(experiences) {
        let cardsHTML = `
        <h2 class="mb-4">Experience</h2>`;
        
        experiences.forEach(exp => {
            cardsHTML += `
        <div class="card mb-4">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2 col-sm-3 text-center mb-3 mb-sm-0">
                        <img src="${exp.logo}" alt="${exp.company} logo" class="img-fluid" style="max-width: 80px;">
                    </div>
                    <div class="col-md-10 col-sm-9">
                        <h4>${exp.company}</h4>
                        <p class="fw-bold mb-1">${exp.role}</p>
                        <p class="text-muted">${exp.start_date} – ${exp.end_date}</p>
                        <p>${exp.description}</p>
                    </div>
                </div>
            </div>
        </div>`;
        });
        
        const section = document.querySelector('section');
        if (section) {
            section.innerHTML = cardsHTML;
        }
    }
    
    updateEducationHTML(education) {
        let cardsHTML = `
        <h2 class="mb-4">Education</h2>`;
        
        education.forEach(edu => {
            cardsHTML += `
        <div class="card mb-4">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-2 col-sm-3 text-center mb-3 mb-sm-0">
                        <img src="${edu.logo}" alt="${edu.institution} logo" class="img-fluid" style="max-width: 80px;">
                    </div>
                    <div class="col-md-10 col-sm-9">
                        <h4>${edu.institution}</h4>
                        <p class="fw-bold mb-1">${edu.degree}</p>
                        <p class="text-muted">${edu.start_date} - ${edu.end_date}</p>
                    </div>
                </div>
            </div>
        </div>`;
        });
        
        const section = document.querySelector('section');
        if (section) {
            section.innerHTML = cardsHTML;
        }
    }
    
    updateSkillsHTML(skills) {
        // Group by category
        const categories = {};
        const softSkills = [];
        
        skills.forEach(skill => {
            if (skill.category === 'Soft Skills') {
                softSkills.push(skill);
            } else {
                if (!categories[skill.category]) {
                    categories[skill.category] = [];
                }
                categories[skill.category].push(skill);
            }
        });
        
        let skillsHTML = '';
        
        // Soft skills section
        if (softSkills.length > 0) {
            skillsHTML += `
    <section class="mb-5">
        <h2 class="mb-4">Soft Skills</h2>
        <div class="card">
            <div class="card-body">
                <ul class="mb-0" style="list-style-type: none;">`;
            
            softSkills.forEach(skill => {
                skillsHTML += `
                    <li><span class="text-primary fs-4 align-middle">●</span>
                        <b>${skill.name}:</b> ${skill.description}
                    </li>`;
            });
            
            skillsHTML += `
                </ul>
            </div>
        </div>
    </section>`;
        }
        
        // Technical skills section
        skillsHTML += `
    <section>
        <h2 class="mb-4">Technical Skills</h2>`;
        
        Object.keys(categories).forEach(category => {
            skillsHTML += `
        <div class="card mb-4">
            <div class="card-body">
                <h3 class="card-title">${category}</h3>
                <div class="row text-center">`;
            
            categories[category].forEach(skill => {
                skillsHTML += `
                    <div class="col-6 col-md-3 mb-3">
                        <img src="${skill.icon}" width="50" alt="${skill.name} logo">
                        <div>${skill.name}</div>
                    </div>`;
            });
            
            skillsHTML += `
                </div>
            </div>
        </div>`;
        });
        
        skillsHTML += `
    </section>`;
        
        // Find the container and replace content after header
        const container = document.querySelector('.container.mb-5');
        const header = container.querySelector('header');
        if (container && header) {
            // Remove everything after header
            let nextSibling = header.nextElementSibling;
            while (nextSibling) {
                const toRemove = nextSibling;
                nextSibling = nextSibling.nextElementSibling;
                toRemove.remove();
            }
            
            // Add new content
            container.insertAdjacentHTML('beforeend', skillsHTML);
        }
    }
    
    getIconForCategory(category) {
        const iconMap = {
            'Journal Articles': 'bi bi-journal-text',
            'Book Chapters': 'bi bi-book',
            'Preprints': 'bi bi-file-earmark-text',
            'Patents': 'bi bi-award'
        };
        return iconMap[category] || 'bi bi-file-text';
    }
}

// Initialize CSV loader after DOM is ready and config is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for config loader to finish
    setTimeout(() => {
        console.log('Loading CSV content...');
        new CSVLoader();
    }, 500);
});

// CSV loader utility functions for portfolio template

// Enhanced CSV parsing function with reverse option
function parseCSV(csvText, reverseOrder = true) {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const dataRows = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        return row;
    });
    
    // Reverse the data to show newest entries first
    return reverseOrder ? dataRows.reverse() : dataRows;
}

// Load and parse CSV file with reverse ordering
async function loadCSVData(filename, reverseOrder = true) {
    try {
        // Add cache busting to ensure fresh data
        const response = await fetch(`data/csv/${filename}?t=${Date.now()}`);
        if (!response.ok) throw new Error(`Failed to load ${filename}`);
        const csvText = await response.text();
        return parseCSV(csvText, reverseOrder);
    } catch (error) {
        console.error(`Error loading ${filename}:`, error);
        return [];
    }
}

// Legacy function for backward compatibility
function loadCSV(filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(','));
            callback(rows);
        })
        .catch(error => console.error(`Error loading CSV file (${filePath}):`, error));
}

// Example usage: Load blog posts dynamically
document.addEventListener('DOMContentLoaded', () => {
    loadCSV('data/csv/blog_posts.csv', rows => {
        // Process and display blog posts
        console.log('Blog posts loaded:', rows);
        // ...existing code for rendering blog posts...
    });
});
