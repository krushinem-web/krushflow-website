# KrushFlow Website

A modern, high-converting digital marketing agency website built with a fiery dark theme and glassmorphism design.

## 🔥 Features

- **Fiery Dark Theme**: Orange (#f97316), red, and yellow gradients on dark zinc backgrounds
- **Glassmorphism Effects**: Frosted glass cards with backdrop blur
- **Fully Responsive**: Mobile-first design that looks great on all devices
- **Smooth Animations**: Scroll-triggered animations and interactive elements
- **Results-Driven Layout**: Inspired by top-performing agency websites
- **SEO Optimized**: Semantic HTML and proper meta tags

## 🚀 Quick Start

### Local Development

1. Clone this repository
2. Open `index.html` in your browser, or
3. Run a local server:
   ```bash
   python3 -m http.server 8080
   ```
4. Visit `http://localhost:8080`

### Deploy to Railway

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/krushflow.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `krushflow` repository
   - Railway will auto-detect the configuration and deploy
   - Your site will be live at `your-project.railway.app`

## 📁 Project Structure

```
krushflow-prototype/
├── index.html           # Main HTML file
├── styles.css          # All styling with CSS variables
├── script.js           # Interactive features
├── railway.json        # Railway deployment config
├── nixpacks.toml       # Nixpacks build config
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── PROTOTYPE_SUMMARY.md # Detailed feature documentation
```

## 🎨 Customization

### Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --brand-orange: #f97316;
    --brand-red: #ef4444;
    --brand-yellow: #fbbf24;
    /* ... more variables */
}
```

### Content

1. **Hero Section**: Update headline and CTA in `index.html`
2. **Services**: Modify the 6 service cards
3. **Testimonials**: Replace with real client testimonials
4. **Contact Info**: Update phone number and email throughout

### Sections

The website includes:
- Fixed Navigation Bar
- Hero Section with Lead Capture
- Trust Bar (Review Badges)
- Results/Case Studies Section
- Services Grid
- Testimonials Section
- CTA Section
- Footer

## 🔧 Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, Grid, Flexbox
- **Vanilla JavaScript**: No frameworks, pure JS
- **Python**: Simple HTTP server for deployment

## 📝 Next Steps

### For GoHighLevel Deployment

1. Copy `styles.css` content to GHL Custom CSS
2. Recreate layout in GHL Site Builder
3. Add Custom HTML elements for complex components
4. Integrate GHL forms for lead capture
5. Connect Stripe for payments

### For Further Development

- [ ] Add contact form backend
- [ ] Integrate with CRM (GoHighLevel)
- [ ] Add blog section
- [ ] Create service detail pages
- [ ] Add case study pages
- [ ] Implement analytics tracking
- [ ] Add cookie consent banner
- [ ] Set up email marketing integration

## 🌐 Live Preview

Current sandbox preview: https://8080-imi88m05zqrnlxoza9srs-062698ad.us2.manus.computer

## 📞 Support

For questions or support, contact: hello@krushflow.com

## 📄 License

© 2026 KrushFlow. All rights reserved.

---

Built with 🔥 by KrushFlow
