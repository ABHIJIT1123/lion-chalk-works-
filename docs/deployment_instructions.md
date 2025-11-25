# Deployment Instructions - Lion Chalk Works

## 1. Overview
This is a static HTML5/CSS3 website requiring no backend processing. It can be hosted on any standard web server (Apache, Nginx) or static hosting service (Netlify, Vercel, GitHub Pages).

## 2. File Structure
Ensure all files are uploaded maintaining the following structure:
```
/ (Root)
├── index.html
├── about.html
├── products.html
├── contact.html
├── css/
│   ├── main.css
│   └── print.css
└── assets/
    ├── logo.svg
    ├── products/
    ├── hero/
    └── icons/
```

## 3. Assets
**Important**: The current images are placeholders. Before going live, you must replace the files in the `assets/` directory with real product photography.
*   **Product Images**: Should be 4:3 aspect ratio (e.g., 800x600px).
*   **Hero Images**: Should be high resolution (1920x1080px recommended).

## 4. Customization
*   **Contact Info**: Edit `contact.html` and the footer in all files to update phone numbers or addresses if they change.
*   **Map**: To enable the interactive map in `contact.html`, replace the placeholder div with a Google Maps Embed iframe.

## 5. SEO
*   Meta descriptions are included in the `<head>` of each page.
*   Update these descriptions in the HTML files to refine search engine targeting.

## 6. Browser Support
The site uses modern CSS (Grid, Flexbox, Custom Properties) and supports:
*   Chrome (latest)
*   Firefox (latest)
*   Safari (latest)
*   Edge (latest)
