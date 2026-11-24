// Education data loader - handles loading and displaying education from CSV

class EducationLoader extends BaseDataLoader {
    constructor() {
        super('education.csv', 'section');
    }

    renderData(educationData, section) {
        this.clearExistingCards(section);
        
        educationData.forEach(edu => {
            const cardHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-sm-3 text-center mb-3 mb-sm-0">
                            <img src="${edu.logo || 'img/default-institution.png'}" alt="${edu.institution} logo" class="img-fluid" style="max-width: 80px;">
                        </div>
                        <div class="col-md-10 col-sm-9">
                            <h4>${edu.institution}</h4>
                            <p class="fw-bold mb-1">${edu.degree}</p>
                            <p class="text-muted">${edu.start_date} - ${edu.end_date}</p>
                        </div>
                    </div>
                </div>
            `;
            section.appendChild(this.createCard(cardHTML));
        });
    }
}

// Initialize education loader
new EducationLoader();
        
        // Create cards for each education entry (newest first)
        educationData.forEach(edu => {
            const card = document.createElement('div');
            card.className = 'card mb-4';
            card.innerHTML = `
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 col-sm-3 text-center mb-3 mb-sm-0">
                            <img src="${edu.logo || 'img/default-institution.png'}" alt="${edu.institution} logo" class="img-fluid" style="max-width: 80px;">
                        </div>
                        <div class="col-md-10 col-sm-9">
                            <h4>${edu.institution}</h4>
                            <p class="fw-bold mb-1">${edu.degree}</p>
                            <p class="text-muted">${edu.start_date} - ${edu.end_date}</p>
                        </div>
                    </div>
                </div>
            `;
            educationSection.appendChild(card);
        });
    }
}

// Initialize education loader
new EducationLoader();
