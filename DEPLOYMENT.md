# Static Deployment Guide

This guide explains how to build and deploy the J.J Thai Spa website to a static hosting environment.

## Building for Production

### 1. Build the Static Files

Run the build command to create optimized production files:

```bash
npm run build
```

This will:
- Compile all TypeScript/TSX files to JavaScript
- Bundle and minify all code
- Optimize assets (images, CSS, etc.)
- Generate static HTML files
- Create a `dist/` directory with all production files

### 2. Preview the Build Locally (Optional)

Before deploying, you can preview the production build locally:

```bash
npm run preview
```

This starts a local server serving the built files from the `dist/` directory.

---

## Deployment Options

### Option 1: Traditional Web Server (Apache, Nginx, etc.)

**Steps:**
1. Build the project: `npm run build`
2. Upload the entire `dist/` folder to your web server
3. Point your web server's document root to the `dist/` directory

**Example Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name jjthaispa.com;
    root /var/www/jjthaispa/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**Example Apache Configuration (.htaccess):**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$">
    Header set Cache-Control "max-age=31536000, public, immutable"
</FilesMatch>
```

---

### Option 2: Netlify

**Steps:**
1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy!

**Alternative: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

### Option 3: Vercel

**Steps:**
1. Install Vercel CLI: `npm install -g vercel`
2. Build the project: `npm run build`
3. Deploy: `vercel --prod`

Or connect your GitHub repository to Vercel for automatic deployments.

---

### Option 4: GitHub Pages

**Steps:**
1. Build the project: `npm run build`
2. Install gh-pages: `npm install -D gh-pages`
3. Add to `package.json`:
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```
4. Deploy: `npm run deploy`

---

### Option 5: AWS S3 + CloudFront

**Steps:**
1. Build the project: `npm run build`
2. Create an S3 bucket configured for static website hosting
3. Upload the `dist/` folder contents to the bucket
4. (Optional) Set up CloudFront CDN for better performance
5. Configure bucket policy for public access

**AWS CLI Example:**
```bash
# Build
npm run build

# Sync to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache (if using)
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

## Build Output Structure

After running `npm run build`, your `dist/` folder will contain:

```
dist/
├── index.html              # Main HTML file
├── assets/                 # Bundled JS, CSS, and assets
│   ├── index-[hash].js    # Main JavaScript bundle
│   ├── index-[hash].css   # Compiled CSS
│   └── [other assets]
├── favicon.svg            # Favicon
├── logo-gold.png          # Logo files
├── logo-green.png
└── logo-white.png
```

---

## Important Notes

### Environment Variables

If you're using environment variables (like `GEMINI_API_KEY`):
- **Client-side variables** must be prefixed with `VITE_` to be included in the build
- Set them in your hosting platform's environment settings
- For local builds, they're read from `.env.local`

### Single Page Application (SPA) Routing

Since this is a React SPA, ensure your server is configured to:
- Serve `index.html` for all routes
- This allows client-side routing to work properly

### HTTPS

Always deploy with HTTPS enabled for:
- Security
- Better SEO
- Required for modern web features

### Performance Optimization

The build process automatically:
- ✅ Minifies JavaScript and CSS
- ✅ Optimizes images
- ✅ Tree-shakes unused code
- ✅ Code-splits for better loading
- ✅ Generates source maps (for debugging)

---

## Quick Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test with `npm run preview`
- [ ] Verify all assets load correctly
- [ ] Check responsive design
- [ ] Test all interactive features
- [ ] Configure server for SPA routing
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure caching headers
- [ ] Set up custom domain (if applicable)
- [ ] Test on multiple browsers
- [ ] Monitor for errors after deployment

---

## Troubleshooting

**Build fails:**
- Check for TypeScript errors: `npm run build`
- Ensure all dependencies are installed: `npm install`
- Clear cache: `rm -rf node_modules dist && npm install`

**Assets not loading:**
- Verify base path in `vite.config.ts` if deploying to a subdirectory
- Check that asset paths use absolute URLs (starting with `/`)

**Blank page after deployment:**
- Check browser console for errors
- Verify server is configured for SPA routing
- Ensure all environment variables are set

---

## Need Help?

For more information:
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vite Configuration](https://vitejs.dev/config/)
