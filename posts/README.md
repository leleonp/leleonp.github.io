# Portfolio Template

A simple, customizable portfolio template for GitHub Pages inspired by Academic Pages.

![License Badge](https://img.shields.io/badge/license-MIT-blue.svg)

## Live Demo

Check out the live demo: [Portfolio Template](https://leleonp.github.io/portfolio_template/)

## Features

- 🎨 **Multiple Themes** - Light and dark themes available
- 🔍 **Global Search** - Search across all content with Ctrl+K
- 📝 **Blog System** - Write blog posts with tags and categories
- 📊 **CSV Content Management** - Manage content with CSV files
- 🛠️ **Automatic Configuration** - Edit `config.json` for instant updates
- 📱 **Responsive Design** - Works on all devices
- 🚀 **Easy Deployment** - One-click GitHub Pages deployment

## Screenshots

### Home Page
![Home Page Screenshot](img/screenshots/home.png)

### Blog with Search
![Blog Screenshot](img/screenshots/blog.png)

### Dark Theme
![Dark Theme Screenshot](img/screenshots/dark-theme.png)

## Getting Started

1. **Register a GitHub account** if you don't have one and confirm your e-mail (required!)
2. **Click the "Use this template" button** in the top right.
3. **On the "New repository" page**, enter your public repository name as `[your GitHub username].github.io`, which will also be your website's URL.
4. **Configure your portfolio:**
   - Edit `config.json` with your personal information, social links, and site settings
   - Update CSV files in the `data/` directory with your content
   - Upload profile image and other assets
5. **Upload files** to the `files/` directory for download links
6. **Enable GitHub Pages** in repository settings

## File Management

### Files Directory

Upload any files (PDFs, ZIPs, presentations, etc.) to the `files/` directory:

```
files/
├── cv.pdf                    # Your CV/resume
├── research-paper.pdf        # Publications
├── presentation.pptx         # Conference slides
└── portfolio-source.zip      # Source code
```

**Access your files:**
- CV: `https://[username].github.io/files/cv.pdf`
- Papers: `https://[username].github.io/files/research-paper.pdf`
- Any file: `https://[username].github.io/files/filename.ext`

## Configuration System

### Quick Setup with config.json

```json
{
  "site": {
    "title": "Your Name Portfolio",
    "description": "A portfolio showcasing your work and skills",
    "author": "Your Name"
  },
  "profile": {
    "name": "Your Name",
    "title": "Your Profession · Your Specialty",
    "about": "Brief description about yourself"
  },
  "social": {
    "github": "your-github-username",
    "linkedin": "your-linkedin-id",
    "email": "your.email@example.com"
  }
}
```

### CSV Content Management

Manage your content with structured CSV files:

#### Blog Posts (`data/blog_posts.csv`)
```csv
title,date,tags,excerpt,slug
My First Post,2024-01-15,web;tutorial,Getting started with web development,first-post
```

#### Publications (`data/publications.csv`)
```csv
category,title,authors,journal,year,doi,url
Journal Articles,Paper Title,Your Name,Nature,2024,10.1000/example,https://example.com
```

#### Experience (`data/experience.csv`)
```csv
company,role,start_date,end_date,description,logo
Google,Software Engineer,2022-01,Present,Developed web apps,img/google.png
```

## Advanced Features

### Blog System

Create blog posts by:
1. Adding entries to `data/blog_posts.csv`
2. Creating individual post files in `posts/` directory
3. Using tags for categorization and filtering

**Blog Features:**
- Search functionality
- Tag-based filtering
- Responsive design
- SEO-friendly URLs

### Global Search

Press `Ctrl+K` (or `Cmd+K` on Mac) to open global search:
- Searches across all content types
- Publications, blog posts, experience
- Powered by Lunr.js for fast client-side search

### Theming

Switch between light and dark themes:

```html
<!-- Add to <head> for dark theme -->
<link rel="stylesheet" href="themes/dark.css">
```

**Creating Custom Themes:**
1. Copy `themes/dark.css`
2. Modify CSS variables
3. Save as `themes/your-theme.css`

## Running Locally

### Using Python (Recommended)
```bash
python3 -m http.server 4000
# Visit http://localhost:4000
```

### Using Node.js
```bash
npm run serve-node
```

### Using Docker
```bash
docker compose up
# Visit http://localhost:4000
```

### VS Code DevContainer
Use `F1 > DevContainer: Reopen in Container` for instant development environment.

## Customization Examples

### Adding a New Section

1. **Create HTML file:**
   ```bash
   cp experience.html projects.html
   ```

2. **Update navigation in `config.json`:**
   ```json
   "navigation": [
     {"name": "Projects", "url": "./projects.html"}
   ]
   ```

3. **Create data file:**
   ```csv
   # data/projects.csv
   name,description,url,technologies
   Portfolio Site,Personal website,https://github.com/user/site,HTML;CSS;JS
   ```

### Creating Blog Posts

1. **Add to CSV:**
   ```csv
   title,date,tags,excerpt,slug
   Advanced CSS Tips,2024-01-20,css;tutorial,Master these CSS techniques,advanced-css
   ```

2. **Create post file:**
   ```html
   <!-- posts/advanced-css.html -->
   <!DOCTYPE html>
   <html>
   <!-- Include standard head and navigation -->
   <body>
     <article>
       <h1>Advanced CSS Tips</h1>
       <p>Your blog content here...</p>
     </article>
   </body>
   </html>
   ```

### Custom Styling

```css
/* Custom theme */
:root {
  --primary-color: #your-brand-color;
  --secondary-color: #your-accent-color;
}

.card {
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
```

## File Structure

```
portfolio_template/
├── index.html              # Home page
├── blog.html              # Blog with search/filtering
├── education.html          # Education section
├── experience.html         # Experience section
├── skills.html            # Skills section
├── publications.html       # Publications section
├── navbar.html            # Shared navigation
├── 404.html              # Custom 404 page
├── config.json           # Site configuration
├── style.css             # Main stylesheet
├── data/                 # CSV data files
│   ├── blog_posts.csv
│   ├── publications.csv
│   ├── experience.csv
│   ├── education.csv
│   └── skills.csv
├── scripts/              # JavaScript functionality
│   ├── config_loader.js  # Auto-configuration
│   ├── csv_loader.js     # CSV content loading
│   ├── blog.js           # Blog functionality
│   └── search.js         # Global search
├── themes/               # CSS themes
│   └── dark.css         # Dark theme
├── posts/               # Individual blog posts
├── files/               # Downloadable files
├── img/                 # Images and assets
└── .devcontainer/       # VS Code setup
```

## Troubleshooting

### Configuration Not Loading
- Ensure `config.json` has valid JSON syntax
- Check browser console for errors
- Serve from web server (not file://)

### CSV Content Not Showing
- Verify CSV file format and headers
- Check file paths are correct
- Look for JavaScript errors in console

### Search Not Working
- Ensure Lunr.js loads properly
- Check network connectivity
- Verify CSV files are accessible

### Files Not Accessible
- Upload files to `files/` directory
- Use relative paths: `files/filename.ext`
- Check file permissions

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## License

MIT License. See [LICENSE](LICENSE).

## Credits

Template by [leleonp](https://github.com/leleonp/portfolio_template).  
Inspired by [Academic Pages](https://github.com/academicpages/academicpages.github.io).  
Search powered by [Lunr.js](https://lunrjs.com/).

---

**Star ⭐ this repo if it helped you create an amazing portfolio!**
Feel free to fork, modify, and share!
