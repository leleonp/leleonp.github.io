// Experience data loader - handles loading and displaying experience from CSV

class ExperienceLoader extends BaseDataLoader {
    constructor() {
        super('experience.csv', 'section');
    }

    renderData(experienceData, section) {
        this.clearExistingCards(section);
        
        experienceData.forEach(exp => {
            const cardHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-sm-3 text-center mb-3 mb-sm-0">
                            <img src="${exp.logo || 'img/default-company.png'}" alt="${exp.company} logo" class="img-fluid" style="max-width: 80px;">
                        </div>
                        <div class="col-md-10 col-sm-9">
                            <h4>${exp.company}</h4>
                            <p class="fw-bold mb-1">${exp.role}</p>
                            <p class="text-muted">${exp.start_date} – ${exp.end_date}</p>
                            <p>${exp.description}</p>
                        </div>
                    </div>
                </div>
            `;
            section.appendChild(this.createCard(cardHTML));
        });
    }
}

// Initialize experience loader
new ExperienceLoader();
        // Create cards for each experience entry (newest first)
        experienceData.forEach(exp => {
            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-sm-3 text-center mb-3 mb-sm-0">
                            <img src="${exp.logo || 'img/default-company.png'}" alt="${exp.company} logo" class="img-fluid" style="max-width: 80px;">
                        </div>
                        <div class="col-md-10 col-sm-9">
                            <h4>${exp.company}</h4>
                            <p class="fw-bold mb-1">${exp.role}</p>
                            <p class="text-muted">${exp.start_date} – ${exp.end_date}</p>
                            <p>${exp.description}</p>
                        </div>
                    </div>
                </div>
            `;
            experienceSection.appendChild(card);
        });
    }
}

// Initialize experience loader
new ExperienceLoader();
