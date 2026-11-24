// Base data loader class - shared functionality for all CSV loaders

class BaseDataLoader {
    constructor(csvFileName, sectionSelector) {
        this.csvFileName = csvFileName;
        this.sectionSelector = sectionSelector;
        this.init();
    }

    async init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.loadData());
        } else {
            await this.loadData();
        }
    }

    async loadData() {
        try {
            const data = await loadCSVData(this.csvFileName, true);
            const section = document.querySelector(this.sectionSelector);
            
            if (data.length > 0 && section) {
                this.renderData(data, section);
            } else if (data.length === 0) {
                console.log(`No data found in ${this.csvFileName}, using static content`);
            }
        } catch (error) {
            console.error(`Error loading ${this.csvFileName}:`, error);
            console.log(`Using static content for ${this.csvFileName}`);
        }
    }

    clearExistingCards(section) {
        const existingCards = section.querySelectorAll('.card');
        existingCards.forEach(card => card.remove());
    }

    createCard(innerHTML) {
        const card = document.createElement('div');
        card.className = 'card mb-4';
        card.innerHTML = innerHTML;
        return card;
    }

    // Abstract method - must be implemented by subclasses
    renderData(data, section) {
        throw new Error('renderData method must be implemented by subclass');
    }
}
