// Skills data loader - handles loading and displaying skills from CSV

class SkillsLoader extends BaseDataLoader {
    constructor() {
        super('skills.csv', 'section:last-child');
    }

    renderData(skillsData, section) {
        this.renderSoftSkills(skillsData);
        this.renderTechnicalSkills(skillsData, section);
    }

    renderSoftSkills(skillsData) {
        const softSkillsList = document.querySelector('.card ul');
        if (softSkillsList) {
            softSkillsList.innerHTML = '';
            skillsData.filter(skill => skill.type === 'soft').forEach(skill => {
                const li = document.createElement('li');
                li.innerHTML = `<span class="text-primary fs-4 align-middle">●</span>
                    <b>${skill.name}:</b> ${skill.description}`;
                softSkillsList.appendChild(li);
            });
        }
    }

    renderTechnicalSkills(skillsData, skillsSection) {
        const technicalSkills = skillsData.filter(skill => skill.type === 'technical');
        
        // Group technical skills by category
        const skillCategories = technicalSkills.reduce((groups, skill) => {
            const category = skill.category || 'Other';
            if (!groups[category]) groups[category] = [];
            groups[category].push(skill);
            return groups;
        }, {});
        
        // Clear existing technical skill cards
        skillsSection.querySelectorAll('.card').forEach(card => card.remove());
        
        // Create cards for each category (newest first)
        Object.entries(skillCategories).forEach(([category, skills]) => {
            const cardHTML = `
                <div class="card-body">
                    <h3 class="card-title">${category}</h3>
                    <div class="row text-center">
                        ${skills.map(skill => `
                            <div class="col-6 col-md-3 mb-3">
                                <img src="${skill.icon || './img/programming/default.png'}" width="50" alt="${skill.name} logo">
                                <div>${skill.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            skillsSection.appendChild(this.createCard(cardHTML));
        });
    }
}

// Initialize skills loader
new SkillsLoader();
                    <h3 class="card-title">${category}</h3>
                    <div class="row text-center">
                        ${skills.map(skill => `
                            <div class="col-6 col-md-3 mb-3">
                                <img src="${skill.icon || './img/programming/default.png'}" width="50" alt="${skill.name} logo">
                                <div>${skill.name}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            skillsSection.appendChild(card);
        });
    }
}

// Initialize skills loader
new SkillsLoader();
