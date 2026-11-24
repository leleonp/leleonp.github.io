// Content generation script for portfolio template
// Run with: node scripts/generate_content.js

const fs = require('fs');
const path = require('path');

// Helper function to parse CSV
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const row = {};
        headers.forEach((header, index) => {
            row[header] = values[index] || '';
        });
        data.push(row);
    }
    return data;
}

// Load configuration
function loadConfig() {
    try {
        const configPath = path.join(__dirname, '../config.json');
        return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    } catch (error) {
        console.error('Error loading config.json:', error.message);
        return null;
    }
}

// Update publications.html with CSV data
function updatePublications() {
    try {
        const csvPath = path.join(__dirname, '../data/csv/publications.csv');
        const htmlPath = path.join(__dirname, '../publications.html');
        
        if (!fs.existsSync(csvPath)) {
            console.log('publications.csv not found, skipping...');
            return;
        }
        
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const publications = parseCSV(csvData);
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Group by category
        const categories = {};
        publications.forEach(pub => {
            if (!categories[pub.category]) {
                categories[pub.category] = [];
            }
            categories[pub.category].push(pub);
        });
        
        let accordionHTML = '';
        Object.keys(categories).forEach((category, index) => {
            const categoryId = category.toLowerCase().replace(/\s+/g, '');
            const icon = getIconForCategory(category);
            
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
        
        // Replace the accordion content
        const accordionStart = '<div class="accordion mb-4" id="pubAccordion">';
        const accordionEnd = '</div>';
        const startIndex = htmlContent.indexOf(accordionStart);
        const endIndex = htmlContent.indexOf(accordionEnd, startIndex) + accordionEnd.length;
        
        if (startIndex !== -1 && endIndex !== -1) {
            const newAccordion = accordionStart + accordionHTML + '\n</div>';
            htmlContent = htmlContent.substring(0, startIndex) + newAccordion + htmlContent.substring(endIndex);
            fs.writeFileSync(htmlPath, htmlContent);
            console.log('✓ Updated publications.html with CSV data');
        }
        
    } catch (error) {
        console.error('Error updating publications:', error.message);
    }
}

// Update experience.html with CSV data
function updateExperience() {
    try {
        const csvPath = path.join(__dirname, '../data/csv/experience.csv');
        const htmlPath = path.join(__dirname, '../experience.html');
        
        if (!fs.existsSync(csvPath)) {
            console.log('experience.csv not found, skipping...');
            return;
        }
        
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const experiences = parseCSV(csvData);
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        let cardsHTML = '';
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
        
        // Replace content between section tags
        const sectionStart = '<section>';
        const sectionEnd = '</section>';
        const startIndex = htmlContent.indexOf(sectionStart);
        const endIndex = htmlContent.indexOf(sectionEnd, startIndex) + sectionEnd.length;
        
        if (startIndex !== -1 && endIndex !== -1) {
            const newSection = `<section>
        <h2 class="mb-4">Experience</h2>${cardsHTML}
    </section>`;
            htmlContent = htmlContent.substring(0, startIndex) + newSection + htmlContent.substring(endIndex);
            fs.writeFileSync(htmlPath, htmlContent);
            console.log('✓ Updated experience.html with CSV data');
        }
        
    } catch (error) {
        console.error('Error updating experience:', error.message);
    }
}

// Update education.html with CSV data
function updateEducation() {
    try {
        const csvPath = path.join(__dirname, '../data/csv/education.csv');
        const htmlPath = path.join(__dirname, '../education.html');
        
        if (!fs.existsSync(csvPath)) {
            console.log('education.csv not found, skipping...');
            return;
        }
        
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const education = parseCSV(csvData);
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        let cardsHTML = '';
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
        
        // Replace content between section tags
        const sectionStart = '<section>';
        const sectionEnd = '</section>';
        const startIndex = htmlContent.indexOf(sectionStart);
        const endIndex = htmlContent.indexOf(sectionEnd, startIndex) + sectionEnd.length;
        
        if (startIndex !== -1 && endIndex !== -1) {
            const newSection = `<section>
        <h2 class="mb-4">Education</h2>${cardsHTML}
    </section>`;
            htmlContent = htmlContent.substring(0, startIndex) + newSection + htmlContent.substring(endIndex);
            fs.writeFileSync(htmlPath, htmlContent);
            console.log('✓ Updated education.html with CSV data');
        }
        
    } catch (error) {
        console.error('Error updating education:', error.message);
    }
}

// Update skills.html with CSV data
function updateSkills() {
    try {
        const csvPath = path.join(__dirname, '../data/csv/skills.csv');
        const htmlPath = path.join(__dirname, '../skills.html');
        
        if (!fs.existsSync(csvPath)) {
            console.log('skills.csv not found, skipping...');
            return;
        }
        
        const csvData = fs.readFileSync(csvPath, 'utf8');
        const skills = parseCSV(csvData);
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
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
        
        // Replace all sections
        const containerStart = '<div class="container mb-5">';
        const containerEnd = '</div>';
        const footerStart = '<footer';
        
        const startIndex = htmlContent.indexOf(containerStart);
        const footerIndex = htmlContent.indexOf(footerStart);
        
        if (startIndex !== -1 && footerIndex !== -1) {
            const headerSection = htmlContent.substring(htmlContent.indexOf('<header'), htmlContent.indexOf('</header>') + 9);
            const newContainer = `<div class="container mb-5">
    ${headerSection}
${skillsHTML}
</div>

`;
            htmlContent = htmlContent.substring(0, startIndex) + newContainer + htmlContent.substring(footerIndex);
            fs.writeFileSync(htmlPath, htmlContent);
            console.log('✓ Updated skills.html with CSV data');
        }
        
    } catch (error) {
        console.error('Error updating skills:', error.message);
    }
}

// Helper function to get icon for publication category
function getIconForCategory(category) {
    const iconMap = {
        'Journal Articles': 'bi bi-journal-text',
        'Book Chapters': 'bi bi-book',
        'Preprints': 'bi bi-file-earmark-text',
        'Patents': 'bi bi-award'
    };
    return iconMap[category] || 'bi bi-file-text';
}

// Main function
function generateContent() {
    console.log('Generating content from CSV files...');
    
    updatePublications();
    updateExperience();
    updateEducation();
    updateSkills();
    
    console.log('Content generation complete!');
}

// Run the script
if (require.main === module) {
    generateContent();
}

module.exports = {
    generateContent,
    updatePublications,
    updateExperience,
    updateEducation,
    updateSkills
};
