# Image Setup Guide for LUXE

This guide explains how to add your original logo and brand pictures to the application.

## Folder Structure

The following directories have been created:

```
Frontend/public/images/
├── logos/          # Store all logo files here
│   ├── luxe-logo.png          (Main logo - transparent background recommended)
│   ├── luxe-logo-dark.png     (Dark version)
│   └── luxe-logo-light.png    (Light version)
├── brands/         # Store brand logo files here
│   ├── louis-vuitton.png
│   ├── chanel.png
│   ├── hermes.png
│   ├── rolex.png
│   ├── gucci.png
│   └── prada.png
└── products/       # Store product images here (for future use)
```

## Adding Your Images

### Step 1: Prepare Your Images
- Recommended format: PNG with transparent background for logos
- Alt format: SVG (vector graphics recommended for logos)
- Recommended size: 200x200px minimum for logos
- File naming: Use lowercase with hyphens (e.g., `louis-vuitton.png`)

### Step 2: Upload Your Files
1. Navigate to `Frontend/public/images/` folder
2. Add your LUXE logo files to `logos/` folder:
   - `luxe-logo.png` - Main version (required)
   - `luxe-logo-dark.png` - Dark background version (optional)
   - `luxe-logo-light.png` - Light background version (optional)

3. Add brand logos to `brands/` folder:
   - `louis-vuitton.png`
   - `chanel.png`
   - `hermes.png`
   - `rolex.png`
   - `gucci.png`
   - `prada.png`

### Step 3: Update Configuration (if needed)
The image paths are centralized in `src/config/images.js`. If you change file names or structure, update this file accordingly:

```javascript
export const IMAGES = {
  logo: '/images/logos/luxe-logo.png',
  brands: {
    luxe: '/images/logos/luxe-logo.png',
    louisVuitton: '/images/brands/louis-vuitton.png',
    // ... other brands
  }
};
```

## Fallback System

The application includes an automatic fallback system:
- If a local image fails to load, it will use the CDN/fallback URL
- All brand logos have fallback URLs from `1000logos.net`
- The LUXE logo falls back to `/logo.png` in the root public folder

## Image Optimization

For best performance:
- Compress PNG files (use TinyPNG or ImageOptim)
- Consider using WebP format for modern browsers
- Use SVG for vector logos (smaller file size)
- Recommended max size per image: 200KB

## Testing

1. Place your images in the appropriate folders
2. Start the development server: `npm run dev`
3. Check if images display correctly on:
   - Home page (hero section)
   - Our Brands section
   - Other pages that use the images

If images don't appear:
- Check browser console for 404 errors
- Verify file names match exactly (case-sensitive)
- Ensure files are in the correct subdirectory
- Check file permissions

## Adding Brand Images
If you want to add more luxury brands:
1. Add the image file to `Frontend/public/images/brands/`
2. Update the BRANDS array in `Home.jsx`
3. Add entry to `IMAGES.brands` in `src/config/images.js`
