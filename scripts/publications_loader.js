// Publications data loader - handles loading and displaying publications from CSV

class PublicationsLoader extends BaseDataLoader {
    constructor() {
        super('publications.csv', '#pubAccordion');
    }

    renderData(publicationsData, accordionContainer) {
        // Group publications by category
        const groupedPubs = publicationsData.reduce((groups, pub) => {
            const category = pub.category || 'Other';
            if (!groups[category]) groups[category] = [];
            groups[category].push(pub);
            return groups;
        }, {});
        
        // Clear existing accordion items
        accordionContainer.innerHTML = '';
        
        // Create accordion items for each category
        Object.entries(groupedPubs).forEach(([category, pubs], index) => {
            const accordionItem = this.createAccordionItem(category, pubs, index);
            accordionContainer.appendChild(accordionItem);
        });
    }

    createAccordionItem(category, pubs, index) {
        const accordionItem = document.createElement('div');
        accordionItem.className = 'accordion-item';
        accordionItem.innerHTML = `
            <h2 class="accordion-header" id="heading${index}">
                <button class="accordion-button category collapsed" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#collapse${index}" 
                        aria-expanded="false" aria-controls="collapse${index}">
                    <i class="bi bi-journal-text me-2"></i> ${category}
                </button>
            </h2>
            <div id="collapse${index}" class="accordion-collapse collapse" 
                 aria-labelledby="heading${index}" data-bs-parent="#pubAccordion">
                <div class="accordion-body p-0">
                    ${pubs.map(pub => `
                        <div class="pub-border p-3">
                            <div class="title_pub">${pub.title}</div>
                            <div class="authors">${pub.authors}</div>
                            <div class="journal">${pub.journal}, <span class="year">${pub.year}</span></div>
                            <a href="${pub.url || pub.doi}">${pub.doi || pub.url}</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        return accordionItem;
    }
}

// Initialize publications loader
new PublicationsLoader();
                                <div class="title_pub">${pub.title}</div>
                                <div class="authors">${pub.authors}</div>
                                <div class="journal">${pub.journal}, <span class="year">${pub.year}</span></div>
                                <a href="${pub.url || pub.doi}">${pub.doi || pub.url}</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            accordionContainer.appendChild(accordionItem);
        });
    }
}

// Initialize publications loader
new PublicationsLoader();
