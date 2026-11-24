// Navigation and social links loader from CSV

class NavigationLoader {
    constructor() {
        this.navigationConfig = [];
        this.configData = null;
        this.initialized = false;
        this.loading = false; // Prevent multiple simultaneous loads
        this.init();
    }

    async init() {
        if (this.loading) return; // Prevent multiple simultaneous initializations
        this.loading = true;
        
        try {
            // Load navbar first, then social config, then navigation configuration
            await this.loadNavbar();
            await this.loadSocialConfig();
            await this.loadConfig();
            // Wait for theme to be applied and then show navbar and highlight active link
            await this.waitForThemeAndShowNavbar();
        } finally {
            this.loading = false;
        }
    }

    // Wait until a theme appears applied (body has a theme- class or documentElement[data-theme])
    // then ensure active link highlighting runs and unhide the navbar to avoid flashes.
    waitForThemeAndShowNavbar(timeout = 2500) {
        const start = Date.now();
        const navbar = document.getElementById('navbar');

        return new Promise(resolve => {
            const check = () => {
                const themeApplied = Array.from(document.body.classList).some(c => c.startsWith('theme-')) || document.documentElement.hasAttribute('data-theme');
                if (themeApplied || (Date.now() - start) >= timeout) {
                    try {
                        // Run highlight to ensure aria-current and .active are set
                        this.highlightActivePage();
                        // Unhide navbar to avoid color flash
                        if (navbar) {
                            navbar.style.visibility = '';
                            navbar.style.opacity = '1';
                        }
                    } catch (e) {
                        // ignore
                    }
                    resolve(themeApplied);
                } else {
                    setTimeout(check, 100);
                }
            };
            // Hide navbar while waiting (defensive)
            if (navbar) {
                try { navbar.style.visibility = 'hidden'; navbar.style.opacity = '0'; } catch(e){}
            }
            check();
        });
    }

    async loadNavbar() {
        try {
            const response = await fetch('./navbar.html');
            if (!response.ok) throw new Error('Could not load navbar');
            
            const navbarHtml = await response.text();
            const navbarContainer = document.getElementById('navbar');
            if (navbarContainer) {
                navbarContainer.innerHTML = navbarHtml;
                // Defensive: make sure navbar is at least visible after injection; theme-wait will refine visibility
                try { navbarContainer.style.visibility = ''; navbarContainer.style.opacity = '1'; } catch (e) {}
                console.log('✓ Navbar loaded and unhidden');
            }
        } catch (error) {
            console.warn('Error loading navbar:', error);
        }
    }

    async loadConfig() {
        if (this.initialized) return;
        
        try {
            const response = await fetch('./data/csv/navigation_config.csv');
            if (!response.ok) {
                console.warn('navigation_config.csv not found, using default navigation');
                this.highlightActivePage();
                return;
            }

            const csvText = await response.text();
            this.navigationConfig = this.parseCSV(csvText);
            
            this.updateNavigation();
            this.initialized = true;
            console.log('✓ Navigation updated from CSV');
            
        } catch (error) {
            console.warn('Error loading navigation config:', error);
            this.highlightActivePage();
        }
    }

    async loadSocialConfig() {
        try {
            const response = await fetch('./config.json');
            if (!response.ok) {
                console.warn('config.json not found, social links will not be loaded');
                return;
            }
            
            const configText = await response.text();
            this.configData = JSON.parse(configText);
            console.log('✓ Config loaded for social links');
        } catch (error) {
            console.warn('Error loading config:', error);
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

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

    updateNavigation() {
        // Clear any existing navigation to prevent duplication
        const existingPages = document.querySelector('.navbar-nav.me-auto');
        if (existingPages) {
            existingPages.innerHTML = '';
        }

        // Update pages from CSV
        const pages = this.navigationConfig
            .filter(item => item.type === 'page' && item.enabled === 'true')
            .sort((a, b) => parseInt(a.order) - parseInt(b.order));

        const navbarNav = document.querySelector('.navbar-nav.me-auto');
        if (navbarNav && pages.length > 0) {
            pages.forEach(page => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.innerHTML = `<a class="nav-link" href="${page.url}"><i class="${page.icon} me-1"></i> ${page.name}</a>`;
                navbarNav.appendChild(li);
            });
        }

        // Update social links from config.json
        this.updateSocialLinks();

        // Highlight active page
        this.highlightActivePage();
    }

    updateSocialLinks() {
        if (!this.configData || !this.configData.social) {
            console.warn('No social config data available');
            return;
        }

        // Clear existing social links
        const allNavbars = document.querySelectorAll('.navbar-nav');
        if (allNavbars.length >= 2) {
            allNavbars[1].innerHTML = '';
        }

        // Convert config social data to array and filter enabled ones
        const socialLinks = [];
        const socialConfig = this.configData.social;

        Object.keys(socialConfig).forEach(platform => {
            const config = socialConfig[platform];
            if (config.enabled) {
                socialLinks.push({
                    platform,
                    ...config,
                    url: this.generateSocialUrl(platform, config),
                    icon: this.getSocialIcon(platform),
                    name: this.getSocialName(platform)
                });
            }
        });

        // Sort by order
        socialLinks.sort((a, b) => (a.order || 999) - (b.order || 999));

        console.log(`Found ${socialLinks.length} enabled social links:`, socialLinks.map(s => s.name));

        // Find or create social nav container
        const allNavElements = document.querySelectorAll('.navbar-nav');
        let socialNav = null;
        
        if (allNavElements.length >= 2) {
            socialNav = allNavElements[1];
        } else if (allNavElements.length === 1) {
            const navbar = document.querySelector('.navbar-nav').parentElement;
            socialNav = document.createElement('ul');
            socialNav.className = 'navbar-nav ms-auto';
            navbar.appendChild(socialNav);
            console.log('Created new social nav container');
        }

        if (socialNav && socialLinks.length > 0) {
            socialNav.innerHTML = '';
            
            let addedCount = 0;
            socialLinks.forEach(social => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                li.innerHTML = `<a class="nav-link" href="${social.url}" title="${social.name}" target="_blank" rel="noopener noreferrer"><i class="${social.icon}"></i></a>`;
                socialNav.appendChild(li);
                addedCount++;
            });
            
            console.log(`✓ Added ${addedCount} social links to navbar`);
        }
    }

    generateSocialUrl(platform, config) {
        switch (platform) {
            case 'github':
                return `https://github.com/${config.username}`;
            case 'linkedin':
                return `https://linkedin.com/in/${config.username}`;
            case 'email':
                return `mailto:${config.address}`;
            case 'orcid':
                return `https://orcid.org/${config.id}`;
            case 'scholar':
                return `https://scholar.google.com/citations?user=${config.id}`;
            case 'twitter':
                return `https://x.com/${config.username}`;
            case 'mastodon':
                return `https://${config.instance}/@${config.username}`;
            case 'bluesky':
                return `https://bsky.app/profile/${config.handle}`;
            default:
                return '#';
        }
    }

    getSocialIcon(platform) {
        const icons = {
            github: 'bi-github',
            linkedin: 'bi-linkedin',
            email: 'bi-envelope',
            orcid: 'bi-person-badge',
            scholar: 'bi-mortarboard',
            twitter: 'bi-twitter-x',
            mastodon: 'bi-mastodon',
            bluesky: 'bi-cloud'
        };
        return icons[platform] || 'bi-link';
    }

    getSocialName(platform) {
        const names = {
            github: 'GitHub',
            linkedin: 'LinkedIn',
            email: 'Email',
            orcid: 'ORCID',
            scholar: 'Google Scholar',
            twitter: 'X',
            mastodon: 'Mastodon',
            bluesky: 'Bluesky'
        };
        return names[platform] || platform;
    }

    highlightActivePage() {
        // Robust active-link detection:
        // - normalize link hrefs via URL() to handle ./, absolute, and relative forms
        // - set aria-current="page" on the active link for accessibility
        // - retry briefly if the navbar is still being injected dynamically
        const getCurrent = () => window.location.pathname.split('/').pop() || 'index.html';

        const markLinks = () => {
            const navLinks = document.querySelectorAll('.navbar-nav.me-auto .nav-link');
            if (!navLinks || navLinks.length === 0) return false;

            const current = getCurrent();
            navLinks.forEach(link => {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
                const href = link.getAttribute('href') || '';
                try {
                    const resolved = new URL(href, window.location.href);
                    const linkPath = resolved.pathname.split('/').pop() || 'index.html';
                    if (linkPath === current || (current === '' && linkPath === 'index.html')) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                } catch (e) {
                    // fallback: simple replacement
                    const linkPath = href.replace('./', '');
                    if (linkPath === current || (current === '' && linkPath === 'index.html')) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    }
                }
            });
            return true;
        };

        // Try immediately; if navbar not present yet, retry a few times
        if (markLinks()) return;
        let attempts = 0;
        const retryId = setInterval(() => {
            attempts += 1;
            if (markLinks() || attempts >= 6) clearInterval(retryId);
        }, 100);
    }
}

// Global singleton instance to prevent multiple initializations
window.NavigationLoaderInstance = window.NavigationLoaderInstance || null;

// Initialize only once across all pages
document.addEventListener('DOMContentLoaded', () => {
    if (!window.NavigationLoaderInstance) {
        window.NavigationLoaderInstance = new NavigationLoader();
        console.log('✓ Navigation loader initialized (singleton)');
    } else {
        // If instance exists, just highlight the active page for this page
        window.NavigationLoaderInstance.highlightActivePage();
        console.log('✓ Using existing navigation loader instance');
    }
});

// Also handle page visibility changes (when navigating back)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && window.NavigationLoaderInstance) {
        // Page became visible again, ensure navigation is consistent
        setTimeout(() => {
            if (window.NavigationLoaderInstance.initialized) {
                window.NavigationLoaderInstance.highlightActivePage();
            }
        }, 100);
    }
});
