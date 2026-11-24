// Configuration loader for portfolio template
// This script loads config.json and applies settings to the current page

console.log('🚀 Config loader script loaded');

function showLoadingState() {
    // Create loading overlay
    const loadingHTML = `
        <div id="configLoading" class="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
             style="background: rgba(255,255,255,0.9); z-index: 9999;">
            <div class="text-center">
                <div class="spinner-border text-primary mb-3" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mb-0">Loading profile data...</p>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

function hideLoadingState() {
    const loadingEl = document.getElementById('configLoading');
    if (loadingEl) {
        loadingEl.remove();
    }
}

function updateProfileContent() {
    console.log('📋 Starting profile update...');
    showLoadingState();
    
    fetch('./config.json')
        .then(response => {
            console.log('📡 Config fetch status:', response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch config.json: ${response.statusText}`);
            }
            return response.json();
        })
        .then(config => {
            console.log('✅ Config data loaded:', config);
            
            // navbar brand handling removed (left-side brand intentionally omitted)
            
            // Use requestAnimationFrame to ensure DOM is ready for manipulation
            requestAnimationFrame(() => {
                applyConfigToDOM(config);
                hideLoadingState();
            });
        })
        .catch(error => {
            console.error('❌ Error loading config:', error);
            hideLoadingState();
        });
}

function updateSocialLinks(config) {
    // Wait longer for navbar to be loaded and retry if needed
    const updateWithRetry = (attempt = 1) => {
        const maxAttempts = 20; // Further increased
        
        // Check if navbar exists AND has social links
        const navbar = document.querySelector('.navbar');
        const githubPlaceholder = document.querySelector('a[href*="[your-github-username]"]');
        const githubActual = document.querySelector('a[href*="github.com"]');
        
        if ((!navbar || (!githubPlaceholder && !githubActual)) && attempt < maxAttempts) {
            console.log(`🔄 Navbar/GitHub link not ready, retrying (${attempt}/${maxAttempts})...`);
            setTimeout(() => updateWithRetry(attempt + 1), 500); // Further increased delay
            return;
        }
        
        if (!navbar) {
            console.warn('❌ Navbar never loaded, skipping social links update');
            return;
        }

        console.log('🔧 Updating social links...');

        // Helper to extract value whether social is object or string
        const getVal = (val, key) => {
            if (!val) return '';
            if (typeof val === 'string') return val;
            return val[key] || val.username || val.id || val.address || '';
        };

        const ghVal = getVal(config.social?.github, 'username');
        const liVal = getVal(config.social?.linkedin, 'username');
        const emVal = getVal(config.social?.email, 'address');
        const orcVal = getVal(config.social?.orcid, 'id');
        const schVal = getVal(config.social?.scholar, 'id');
        const twVal = getVal(config.social?.twitter, 'username');
        const masVal = getVal(config.social?.mastodon, 'username');
        const bskVal = getVal(config.social?.bluesky, 'handle');

        // Update GitHub link - try multiple approaches for index.html
        if (ghVal) {
            let githubLink = document.querySelector('a[href*="[your-github-username]"]') ||
                             document.querySelector('a[title="GitHub"]') ||
                             document.querySelector('.bi-github')?.closest('a');
            
            if (githubLink) {
                githubLink.href = `https://github.com/${ghVal}`;
            }
        }

        // Update LinkedIn link
        if (liVal) {
            const linkedinLink = document.querySelector('a[href*="linkedin.com"]') ||
                                 document.querySelector('a[title="LinkedIn"]') ||
                                 document.querySelector('.bi-linkedin')?.closest('a');
            if (linkedinLink) {
                linkedinLink.href = `https://linkedin.com/in/${liVal}`;
            }
        }

        // Update Email link
        if (emVal) {
            const emailLink = document.querySelector('a[href^="mailto:"]') ||
                              document.querySelector('a[title="Email"]') ||
                              document.querySelector('.bi-envelope')?.closest('a');
            if (emailLink) {
                emailLink.href = `mailto:${emVal}`;
            }
        }

        // Update ORCID link
        const orcidLink = document.querySelector('a[href*="orcid.org"]') ||
                          document.querySelector('a[title="ORCID"]') ||
                          document.querySelector('.bi-person-badge')?.closest('a');
        if (orcVal) {
            if (orcidLink) {
                orcidLink.href = `https://orcid.org/${orcVal}`;
                orcidLink.closest('.nav-item').style.display = '';
            }
        } else if (orcidLink) {
            orcidLink.closest('.nav-item').style.display = 'none';
        }

        // Update Google Scholar link
        const scholarLink = document.querySelector('a[href*="scholar.google.com"]') ||
                            document.querySelector('a[title="Google Scholar"]') ||
                            document.querySelector('.bi-mortarboard')?.closest('a');
        if (schVal) {
            if (scholarLink) {
                scholarLink.href = `https://scholar.google.com/citations?user=${schVal}`;
                scholarLink.closest('.nav-item').style.display = '';
            }
        } else if (scholarLink) {
            scholarLink.closest('.nav-item').style.display = 'none';
        }

        // Update X/Twitter link
        const twitterLink = document.querySelector('a[href*="x.com"]') ||
                            document.querySelector('a[title="X"]') ||
                            document.querySelector('.bi-twitter-x')?.closest('a');
        if (twVal) {
            if (twitterLink) {
                twitterLink.href = `https://x.com/${twVal}`;
                twitterLink.closest('.nav-item').style.display = '';
            }
        } else if (twitterLink) {
            twitterLink.closest('.nav-item').style.display = 'none';
        }

        // Update Mastodon link
        const mastodonLink = document.querySelector('a[href*="mastodon.social"]') ||
                             document.querySelector('a[title="Mastodon"]') ||
                             document.querySelector('.bi-mastodon')?.closest('a');
        if (masVal) {
            if (mastodonLink) {
                mastodonLink.href = `https://mastodon.social/@${masVal}`;
                mastodonLink.closest('.nav-item').style.display = '';
            }
        } else if (mastodonLink) {
            mastodonLink.closest('.nav-item').style.display = 'none';
        }

        // Update Bluesky link
        const blueskyLink = document.querySelector('a[href*="bsky.app"]') ||
                            document.querySelector('a[title="Bluesky"]') ||
                            document.querySelector('.bi-cloud')?.closest('a');
        if (bskVal) {
            if (blueskyLink) {
                blueskyLink.href = `https://bsky.app/profile/${bskVal}`;
                blueskyLink.closest('.nav-item').style.display = '';
            }
        } else if (blueskyLink) {
            blueskyLink.closest('.nav-item').style.display = 'none';
        }

        console.log('✓ Social links updated from config.json');
    };
    
    updateWithRetry();
}

function applyConfigToDOM(config) {
    // navbar brand handling removed (left-side brand intentionally omitted)

    // Update social links
    updateSocialLinks(config);

    // Update name in h1 elements
    const h1Elements = document.querySelectorAll('h1');
    console.log('🔍 Found h1 elements:', h1Elements.length);
    
    h1Elements.forEach((el, index) => {
        console.log(`📝 h1[${index}] current text: "${el.textContent}"`);
        if (el.textContent.trim() === '[Your Name]' && config.profile?.name) {
            el.textContent = config.profile.name;
            console.log(`✏️ Updated h1[${index}] to: "${config.profile.name}"`);
        }
    });
    
    // Update title in h2 elements  
    const h2Elements = document.querySelectorAll('h2');
    console.log('🔍 Found h2 elements:', h2Elements.length);
    
    h2Elements.forEach((el, index) => {
        console.log(`📝 h2[${index}] current text: "${el.textContent}"`);
        if (el.textContent.trim() === '[Your Profession · Your Specialty]' && config.profile?.title) {
            el.textContent = config.profile.title;
            console.log(`✏️ Updated h2[${index}] to: "${config.profile.title}"`);
        }
    });
    
    // Update profile images
    const images = document.querySelectorAll('img[alt*="Profile picture"]');
    console.log('🔍 Found profile images:', images.length);
    
    images.forEach((img, index) => {
        if (config.profile?.image) {
            img.src = config.profile.image;
            img.alt = `Profile picture of ${config.profile.name}`;
            console.log(`✏️ Updated image[${index}] to: "${config.profile.image}"`);
        }
    });
    
    // Update about content on home page
    const aboutContent = document.getElementById('about-content');
    if (aboutContent && config.profile?.about) {
        aboutContent.textContent = config.profile.about;
        console.log('✏️ Updated about content');
    }
    
    // Update footer
    const footerP = document.querySelector('footer p');
    if (footerP && config.profile?.name) {
        const currentYear = new Date().getFullYear();
        footerP.innerHTML = `&copy; ${currentYear} ${config.profile.name}`;
        console.log('✏️ Updated footer');
    }
    
    console.log('🎉 Profile update completed!');
    
    // Set up observer for dynamic content that might load later
    setupContentObserver(config);
}

function setupContentObserver(config) {
    const observer = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any new nodes contain placeholder text
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const hasPlaceholder = node.textContent?.includes('[Your Name]') || 
                                             node.textContent?.includes('[Your Profession');
                        if (hasPlaceholder) {
                            shouldUpdate = true;
                        }
                    }
                });
            }
        });
        
        if (shouldUpdate) {
            console.log('🔄 New content detected, updating...');
            applyConfigToDOM(config);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Disconnect observer after 5 seconds to prevent memory leaks
    setTimeout(() => {
        observer.disconnect();
        console.log('🛑 Content observer disconnected');
    }, 5000);
}

// Multiple initialization points to catch content at different loading stages
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateProfileContent);
} else {
    // DOM already loaded
    updateProfileContent();
}

// Backup execution when window fully loads
window.addEventListener('load', () => {
    console.log('🌐 Window loaded, running backup update...');
    updateProfileContent();
});

// Special handling for index.html - monitor for navbar changes
if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
    // Monitor for navbar injection
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && 
                        (node.querySelector('.navbar') || node.classList?.contains('navbar'))) {
                        console.log('🏠 Navbar detected via mutation observer, updating config...');
                        setTimeout(() => updateProfileContent(), 100);
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Disconnect after 10 seconds
    setTimeout(() => observer.disconnect(), 10000);
}
