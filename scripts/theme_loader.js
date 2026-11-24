// Theme loader for portfolio template
// Loads theme from CSV file and applies it automatically

class ThemeLoader {
    constructor() {
        this.loadAndApplyTheme();
    }
    
    async loadAndApplyTheme() {
        try {
            const response = await fetch('./data/csv/active_theme.csv');
            if (!response.ok) {
                console.warn('active_theme.csv not found, using default theme');
                return;
            }
            
            const csvText = await response.text();
            const themes = this.parseCSV(csvText);
            
            // Find the active theme (first row in CSV)
            if (themes.length > 0) {
                const activeTheme = themes[0];
                this.applyTheme(activeTheme);
                console.log(`✓ Applied theme: ${activeTheme.theme_name}`);
            }
        } catch (error) {
            console.warn('Could not load theme:', error);
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
    
    applyTheme(theme) {
        // Remove any existing theme stylesheets
        document.querySelectorAll('link[data-theme]').forEach(link => {
            link.remove();
        });
        
        // Apply new theme if it has a CSS file
        if (theme.theme_file && theme.theme_file.trim()) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = theme.theme_file;
            link.setAttribute('data-theme', theme.theme_name);
            document.head.appendChild(link);
        }
        
        // Update body class for theme-specific styling
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme.theme_name}`);
        
        // Apply background images
        this.applyBackgroundImages(theme);
        
        // Update meta theme-color for mobile browsers
        this.updateThemeColor(theme.theme_name);
    }
    
    applyBackgroundImages(theme) {
        // Apply navbar background image
        if (theme.navbar_bg_image && theme.navbar_bg_image.trim()) {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.style.backgroundImage = `url('${theme.navbar_bg_image}')`;
                navbar.style.backgroundSize = 'cover';
                navbar.style.backgroundPosition = 'center';
                navbar.style.backgroundRepeat = 'no-repeat';
                navbar.classList.add('navbar-with-bg-image');
            }
        }
        
        // Apply page background image
        if (theme.page_bg_image && theme.page_bg_image.trim()) {
            document.body.style.backgroundImage = `url('${theme.page_bg_image}')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';
            document.body.classList.add('body-with-bg-image');
        }
        
        // Apply profile header background image
        if (theme.profile_bg_image && theme.profile_bg_image.trim()) {
            setTimeout(() => {
                const profileHeader = document.querySelector('header');
                if (profileHeader) {
                    profileHeader.style.backgroundImage = `url('${theme.profile_bg_image}')`;
                    profileHeader.style.backgroundSize = 'cover';
                    profileHeader.style.backgroundPosition = 'center';
                    profileHeader.style.backgroundRepeat = 'no-repeat';
                    profileHeader.style.borderRadius = '15px';
                    profileHeader.style.padding = '3rem 2rem';
                    profileHeader.style.marginBottom = '2rem';
                    profileHeader.classList.add('header-with-bg-image');
                    
                    // Add overlay for better text readability
                    const overlay = document.createElement('div');
                    overlay.className = 'bg-overlay';
                    overlay.style.position = 'absolute';
                    overlay.style.top = '0';
                    overlay.style.left = '0';
                    overlay.style.width = '100%';
                    overlay.style.height = '100%';
                    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
                    overlay.style.borderRadius = '15px';
                    overlay.style.zIndex = '1';
                    
                    profileHeader.style.position = 'relative';
                    profileHeader.style.color = 'white';
                    profileHeader.appendChild(overlay);
                    
                    // Ensure content is above overlay
                    const content = profileHeader.querySelector('.d-flex');
                    if (content) {
                        content.style.position = 'relative';
                        content.style.zIndex = '2';
                    }
                }
            }, 500);
        }
    }

    updateThemeColor(themeName) {
        const themeColors = {
            'light': '#ffffff',
            'dark': '#1a1a1a',
            'blue': '#1e3a8a',
            'green': '#166534'
        };
        
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }
        metaTheme.content = themeColors[themeName] || themeColors.light;
    }
}

// Initialize theme loader immediately
document.addEventListener('DOMContentLoaded', () => {
    new ThemeLoader();
});
