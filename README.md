# Portfolio Template

A simple, customizable portfolio template for GitHub Pages inspired by Academic Pages.

![License Badge](https://img.shields.io/badge/license-MIT-blue.svg)

## Live Demo

Check out the live demo: [Portfolio Template](https://leleonp.github.io)

## Features

- 🎨 **Pre-deployment Themes** - Choose from Light, Dark, Blue, or Green themes
- 📝 **Blog System** - Write blog posts in Markdown with tags and filtering
- 📊 **CSV Content Management** - Manage all content with simple CSV files
- 🛠️ **Automatic Configuration** - Edit `config.json` for instant updates
- 📱 **Responsive Design** - Works perfectly on all devices
- 🚀 **Easy Deployment** - One-click GitHub Pages deployment
- 🔍 **Blog Search** - Built-in search and filtering for blog posts
- 🌐 **Social Media Integration** - Automatically hide/show social links

## Screenshots

### Light Theme
![Light Theme Screenshot](img/screenshots/light-theme.png)

### Dark Theme
![Dark Theme Screenshot](img/screenshots/dark-theme.png)

### Blog System
![Blog Screenshot](img/screenshots/blog.png)

## Getting Started

### 1. Use This Template

1. **Register a GitHub account** if you don't have one and confirm your e-mail (required!)
2. **Click the "Use this template" button** in the top right
3. **Name your repository** as `[your-github-username].github.io` for automatic GitHub Pages deployment

### 2. Basic Configuration

Edit the main configuration file:

**`config.json`**
```json
{
  "site": {
    "title": "John Doe Portfolio",
    "description": "A portfolio showcasing my work and skills",
    "author": "John Doe"
  },
  "profile": {
    "name": "John Doe",
    "title": "Data Scientist · Machine Learning Engineer",
    "about": "Passionate data scientist with 5+ years of experience in machine learning and AI."
  },
  "social": {
    "github": "johndoe",
    "linkedin": "john-doe-123",
    "email": "john.doe@example.com",
    "orcid": "0000-0000-0000-0000",
    "scholar": "abc123def",
    "twitter": "johndoe"
  },
  "navigation": [
    {"name": "Home", "url": "./index.html"},
    {"name": "Education", "url": "./education.html"},
    {"name": "Experience", "url": "./experience.html"},
    {"name": "Publications", "url": "./publications.html"},
    {"name": "Skills", "url": "./skills.html"},
    {"name": "Blog", "url": "./blog.html"}
  ]
}
```

### 3. Choose Your Theme with Background Images

**Before deployment**, select your theme and optionally add background images by editing:

**`data/active_theme.csv`**
```csv
theme_name,theme_file,navbar_bg_image,page_bg_image,profile_bg_image
nature,themes/nature.css,img/backgrounds/navbar-nature.jpg,img/backgrounds/page-nature.jpg,img/backgrounds/profile-nature.jpg
```

**Available themes:**
- `light,,,` - Clean light theme (default)
- `dark,themes/dark.css,,` - Professional dark theme  
- `blue,themes/blue.css,,` - Blue accent theme
- `green,themes/green.css,,` - Green accent theme
- `nature,themes/nature.css,navbar-bg.jpg,page-bg.jpg,profile-bg.jpg` - Nature theme with backgrounds
- `gradient,themes/gradient.css,navbar-bg.jpg,page-bg.jpg,profile-bg.jpg` - Modern gradient theme

**Background Image Options:**
- `navbar_bg_image` - Background for navigation bar
- `page_bg_image` - Full page background image  
- `profile_bg_image` - Background for profile header section

**Upload your background images to:**
```
img/backgrounds/
├── navbar-nature.jpg        # Navbar background
├── page-nature.jpg          # Page background  
├── profile-nature.jpg       # Profile header background
├── navbar-gradient.jpg      # Alternative navbar bg
├── page-gradient.jpg        # Alternative page bg
└── profile-gradient.jpg     # Alternative profile bg
```

### 4. Add Your Content

Upload your profile image and assets to the `img/` directory, then update your content using CSV files:

## Content Management

### Profile & Images

1. **Replace profile image**: Upload your photo as `img/profile_picture.jpeg`
2. **Add logos**: Upload company/institution logos to `img/` directory
3. **Add skill icons**: Upload programming language icons to `img/programming/`

### CSV Content Files

All content is managed through CSV files in the `data/` directory:

#### Blog Posts (`data/blog_posts.csv`)
```csv
title,date,tags,excerpt,markdown_file
My First ML Project,2024-01-15,machine learning;python;tutorial,Building my first neural network from scratch,first-ml-project.md
Data Visualization Tips,2024-01-10,visualization;python;matplotlib,Essential tips for creating compelling data visualizations,data-viz-tips.md
```

**Then create Markdown files in `posts/` directory:**
- `posts/first-ml-project.md`
- `posts/data-viz-tips.md`

#### Experience (`data/experience.csv`)
```csv
company,role,start_date,end_date,description,logo
Google,Data Scientist,2022-01,Present,Developed ML models for product recommendations using TensorFlow and Python,img/google-logo.png
Microsoft,Software Engineer,2020-06,2021-12,Built scalable web applications using React and Node.js,img/microsoft-logo.png
```

#### Education (`data/education.csv`)
```csv
institution,degree,start_date,end_date,logo
Stanford University,M.S. Computer Science,2018-09,2020-05,img/stanford-logo.png
UC Berkeley,B.S. Mathematics,2014-09,2018-05,img/berkeley-logo.png
```

#### Publications (`data/publications.csv`)
```csv
category,title,authors,journal,year,doi,url
Journal Articles,Deep Learning for Computer Vision,John Doe et al.,Nature Machine Intelligence,2023,10.1038/s42256-023-00001-1,https://nature.com/articles/example
Conference Papers,Scalable ML Systems,John Doe,NeurIPS 2022,2022,,https://papers.nips.cc/example
```

### Blog System

The portfolio includes a powerful blog system with Markdown support:

#### Writing Blog Posts

1. **Add entry to CSV**:
   ```csv
   title,date,tags,excerpt,markdown_file
   Advanced Python Tips,2024-01-20,python;programming;advanced,Master these advanced Python techniques,advanced-python.md
   ```

2. **Create Markdown file** (`posts/advanced-python.md`):
   ```markdown
   # Advanced Python Tips
   
   *January 20, 2024*
   
   In this post, I'll share some advanced Python techniques that have improved my coding efficiency.
   
   ## List Comprehensions vs Generator Expressions
   
   ```python
   # List comprehension
   squares = [x**2 for x in range(10)]
   
   # Generator expression
   squares_gen = (x**2 for x in range(10))
   ```
   
   ## Context Managers
   
   Custom context managers make resource management elegant:
   
   ```python
   from contextlib import contextmanager
   
   @contextmanager
   def timer():
       start = time.time()
       yield
       print(f"Elapsed: {time.time() - start:.2f}s")
   
   with timer():
       # Your code here
       time.sleep(1)
   ```
   ```

#### Blog Features

- **Markdown Support**: Write posts in Markdown with syntax highlighting
- **Tag Filtering**: Automatically generated tag filters
- **Search**: Built-in search functionality
- **Responsive Design**: Mobile-friendly layout
- **Modal Display**: Posts open in clean reading modals

## File Management

### Downloadable Files

Upload any files (PDFs, presentations, code) to the `files/` directory:

```
files/
├── cv.pdf                    # Your CV/resume
├── research-paper.pdf        # Publications
├── presentation.pptx         # Conference slides
├── code-sample.zip           # Source code
└── portfolio-demo.mp4        # Demo videos
```

**Access your files:**
- CV: `https://[username].github.io/files/cv.pdf`
- Papers: `https://[username].github.io/files/research-paper.pdf`

### Images and Assets

```
img/
├── profile_picture.jpeg      # Your profile photo
├── favicon.ico              # Site icon
├── company-logos/           # Employer logos
│   ├── google.png
│   └── microsoft.png
├── university-logos/        # Institution logos
│   ├── stanford.png
│   └── berkeley.png
└── programming/             # Skill icons
    ├── python.png
    ├── javascript.png
    └── react.png
```

## Customization

### Adding Custom Sections

1. **Create new HTML file**:
   ```bash
   cp experience.html projects.html
   ```

2. **Update navigation in `config.json`**:
   ```json
   "navigation": [
     {"name": "Projects", "url": "./projects.html"}
   ]
   ```

3. **Create data file** (`data/projects.csv`):
   ```csv
   name,description,technologies,url,image
   Portfolio Website,Personal portfolio built with HTML/CSS/JS,HTML;CSS;JavaScript,https://github.com/johndoe/portfolio,img/portfolio.png
   ML Classifier,Image classification using TensorFlow,Python;TensorFlow;CNN,https://github.com/johndoe/ml-classifier,img/ml-project.png
   ```

### Social Media Configuration

The template automatically shows/hides social media icons based on your configuration:

**Show specific platforms:**
```json
"social": {
  "github": "johndoe",        // Will show GitHub icon
  "linkedin": "john-doe",     // Will show LinkedIn icon
  "email": "john@example.com", // Will show email icon
  "orcid": "",                // Hidden (empty)
  "scholar": "",              // Hidden (empty)
  "twitter": "your-x-username" // Will show X (formerly Twitter) icon
}
```

**X (formerly Twitter) Configuration:**
- Add your X username to the `twitter` field in `config.json`.
- The X icon will link to `https://x.com/[your-x-username]`.

### Navigation Customization

Customize which pages appear in navigation:

```json
"navigation": [
  {"name": "Home", "url": "./index.html"},
  {"name": "About", "url": "./about.html"},
  {"name": "Projects", "url": "./projects.html"},
  {"name": "Contact", "url": "./contact.html"}
]
```

## Deployment

### GitHub Pages (Recommended)

1. **Push your changes** to the repository
2. **Go to Settings** → Pages
3. **Select source**: Deploy from branch `main`
4. **Your site will be available** at `https://[username].github.io`

### Local Development

**Using Python:**
```bash
python3 -m http.server 4000
# Visit http://localhost:4000
```

**Using Node.js:**
```bash
npx http-server -p 4000
# Visit http://localhost:4000
```

**Using VS Code Live Server:**
1. Install Live Server extension
2. Right-click `index.html` → "Open with Live Server"

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
├── config.json           # Site configuration
├── style.css             # Main stylesheet
├── data/                 # CSV data files
│   ├── active_theme.csv   # Theme selection
│   ├── blog_posts.csv     # Blog posts
│   ├── publications.csv   # Publications
│   ├── experience.csv     # Work experience
│   ├── education.csv      # Education history
│   └── skills.csv         # Skills (optional)
├── scripts/              # JavaScript functionality
│   ├── config_loader.js  # Auto-configuration
│   ├── csv_loader.js     # CSV content loading
│   ├── blog.js           # Blog functionality
│   └── theme_loader.js   # Theme system
├── themes/               # CSS themes
│   ├── dark.css         # Dark theme
│   ├── blue.css         # Blue theme
│   └── green.css        # Green theme
├── posts/               # Blog post Markdown files
├── files/               # Downloadable files
└── img/                 # Images and assets
```

## Advanced Features

### Theme System

Themes are set **before deployment** and apply to all users:

1. **Edit `data/active_theme.csv`**
2. **Choose from available themes**
3. **Deploy** - all visitors see the same theme

### Blog Search and Filtering

The blog system includes:
- **Real-time search** across post titles and content
- **Tag-based filtering** with automatically generated filter buttons
- **Responsive design** that works on all devices
- **Markdown rendering** with syntax highlighting

### CSV-Driven Content

All content is managed through CSV files, making it easy to:
- **Bulk update** information
- **Version control** your content
- **Collaborate** with others
- **Import/export** data

## Troubleshooting

### Common Issues

**Configuration not loading:**
- Ensure `config.json` has valid JSON syntax
- Check browser console for errors
- Serve from web server (not `file://`)

**CSV content not showing:**
- Verify CSV file format and headers
- Check file paths are correct
- Look for JavaScript errors in console

**Theme not applying:**
- Check `data/active_theme.csv` format
- Ensure theme CSS file exists
- Verify no syntax errors in theme file

**Blog posts not displaying:**
- Check `data/blog_posts.csv` format
- Ensure Markdown files exist in `posts/` directory
- Verify file permissions

### Debug Steps

1. **Open browser console** (F12)
2. **Check for JavaScript errors**
3. **Verify file accessibility** by opening CSV files directly
4. **Test locally** before deploying

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT License. See [LICENSE](LICENSE) for details.

## Credits

- **Template by**: [leleonp](https://github.com/leleonp)
- **Inspired by**: [Academic Pages](https://github.com/academicpages/academicpages.github.io)
- **Icons**: [Bootstrap Icons](https://icons.getbootstrap.com/)
- **Framework**: [Bootstrap 5](https://getbootstrap.com/)
- **Markdown**: [Marked.js](https://marked.js.org/)

---

## Quick Start Checklist

- [ ] Edit `config.json` with your information
- [ ] Choose theme in `data/active_theme.csv`
- [ ] Upload profile image to `img/profile_picture.jpeg`
- [ ] Add experience to `data/experience.csv`
- [ ] Add education to `data/education.csv`
- [ ] Add publications to `data/publications.csv`
- [ ] Write blog posts in `posts/` directory
- [ ] Update `data/blog_posts.csv`
- [ ] Upload files to `files/` directory
- [ ] Enable GitHub Pages in repository settings

**Star ⭐ this repo if it helped you create an amazing portfolio!**

Feel free to fork, modify, and share!
