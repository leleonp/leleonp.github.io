// Theme Switcher System for leleonp.github.io
(function() {
  const THEMES = [
    { id: '1_slate_teal', name: '1. Slate & Teal Científico (Default)', accent: '#0d9488', bg: '#0f172a' },
    { id: '2_nordic_navy', name: '2. Nordic Navy & Deep Blue', accent: '#2563eb', bg: '#0f172a' },
    { id: '3_emerald_biotech', name: '3. Emerald & Biotech Green', accent: '#059669', bg: '#064e3b' },
    { id: '4_minimal_indigo', name: '4. Modern Indigo & Graph', accent: '#6366f1', bg: '#1e1b4b' },
    { id: '5_deep_cyan', name: '5. Oceanic Deep Cyan', accent: '#0891b2', bg: '#082f49' },
    { id: '6_graphite_amber', name: '6. Academic Graphite & Amber', accent: '#d97706', bg: '#1c1917' },
    { id: '7_royal_purple', name: '7. Royal Violet & Slate', accent: '#7c3aed', bg: '#2e1065' },
    { id: '8_midnight_crimson', name: '8. Midnight & Crimson Tech', accent: '#e11d48', bg: '#0f172a' },
    { id: '9_forest_copper', name: '9. Forest & Warm Copper', accent: '#d97706', bg: '#14532d' },
    { id: '10_dark_executive', name: '10. Executive Obsidian Dark', accent: '#38bdf8', bg: '#030712' }
  ];

  function getStoredTheme() {
    return localStorage.getItem('user_theme') || '1_slate_teal';
  }

  function applyTheme(themeId) {
    if (!THEMES.some(t => t.id === themeId)) {
      themeId = '1_slate_teal';
    }
    
    let themeLink = document.getElementById('custom-theme-link');
    if (!themeLink) {
      themeLink = document.createElement('link');
      themeLink.id = 'custom-theme-link';
      themeLink.rel = 'stylesheet';
      document.head.appendChild(themeLink);
    }
    
    themeLink.href = 'themes/' + themeId + '.css';
    localStorage.setItem('user_theme', themeId);

    // Update active state in UI if rendered
    const menu = document.getElementById('theme-switcher-menu');
    if (menu) {
      menu.querySelectorAll('.theme-option').forEach(el => {
        const check = el.querySelector('.theme-check');
        if (el.getAttribute('data-theme') === themeId) {
          el.classList.add('active', 'fw-bold');
          if (check) check.style.display = 'inline-block';
        } else {
          el.classList.remove('active', 'fw-bold');
          if (check) check.style.display = 'none';
        }
      });
    }

    const currentThemeLabel = document.getElementById('current-theme-label');
    if (currentThemeLabel) {
      const current = THEMES.find(t => t.id === themeId);
      if (current) currentThemeLabel.textContent = current.name.split('.')[1] || current.name;
    }
  }

  function renderThemeSwitcher() {
    const menu = document.getElementById('theme-switcher-menu');
    if (!menu) return;

    const currentTheme = getStoredTheme();
    menu.innerHTML = `
      <li class="dropdown-header text-uppercase small fw-bold" style="letter-spacing: 0.05em; color: var(--accent-color, #0d9488);">
        <i class="bi bi-palette me-1"></i> Paletas Profesionales
      </li>
      <li><hr class="dropdown-divider my-1"></li>
    `;

    THEMES.forEach(theme => {
      const li = document.createElement('li');
      const isActive = theme.id === currentTheme;
      li.innerHTML = `
        <a class="dropdown-item d-flex align-items-center justify-content-between py-2 theme-option ${isActive ? 'active fw-bold' : ''}" 
           href="javascript:void(0);" 
           data-theme="${theme.id}"
           style="font-size: 0.88rem;">
          <div class="d-flex align-items-center">
            <span class="d-inline-block rounded-circle me-2 border" 
                  style="width: 14px; height: 14px; background: ${theme.accent}; border-color: ${theme.bg} !important;"></span>
            <span>${theme.name}</span>
          </div>
          <i class="bi bi-check-lg theme-check ms-2" style="display: ${isActive ? 'inline-block' : 'none'};"></i>
        </a>
      `;
      li.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        applyTheme(theme.id);
      });
      menu.appendChild(li);
    });

    // Add a link to themes_preview.html
    const divider = document.createElement('li');
    divider.innerHTML = '<hr class="dropdown-divider my-1">';
    menu.appendChild(divider);

    const previewLink = document.createElement('li');
    previewLink.innerHTML = `
      <a class="dropdown-item py-2 text-primary d-flex align-items-center" href="themes_preview.html" style="font-size: 0.88rem;">
        <i class="bi bi-layout-wtf me-2"></i> <strong>Ver Variantes y Catálogo</strong>
      </a>
    `;
    menu.appendChild(previewLink);
  }

  // Expose global API
  window.setTheme = applyTheme;
  window.getAvailableThemes = () => THEMES;

  // Immediate execution on load to prevent flash
  applyTheme(getStoredTheme());

  // Listen for navbar DOM insertion
  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getStoredTheme());
    renderThemeSwitcher();
  });

  // Also hook into DOMNodeInserted or periodic check for dynamic navbar load
  const observer = new MutationObserver(() => {
    if (document.getElementById('theme-switcher-menu') && !document.querySelector('.theme-option')) {
      renderThemeSwitcher();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
