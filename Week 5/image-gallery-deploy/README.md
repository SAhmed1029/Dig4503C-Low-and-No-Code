# Image Gallery - React

A beautiful, interactive image gallery built with React Hooks featuring filtering and search capabilities.

## Features

- **Category Filtering**: Filter images by Nature, Urban, Art, or view All
- **Search Functionality**: Search images by title or category in real-time
- **Modal View**: Click any image to view it in fullscreen modal
- **Image Counter**: Shows how many images match your current filters
- **Responsive Grid**: Automatically adapts to different screen sizes
- **Beautiful Animations**: Smooth hover effects and transitions
- **No Results Feedback**: Helpful message when no images match filters
- **Real Images**: Uses Unsplash for high-quality placeholder images

## React Hooks Used

- **useState**: Managing state for images, filters, search, and modal
- **useEffect**: Automatic filtering when category or search changes

## Deploy to Netlify

### Option 1: Drag and Drop (Easiest!)
1. Visit [Netlify Drop](https://app.netlify.com/drop)
2. Drag the `image-gallery-deploy` folder into the drop zone
3. Your image gallery will be live instantly!

### Option 2: GitHub Integration
1. Push this folder to GitHub:
   ```bash
   git add image-gallery-deploy
   git commit -m "Add image gallery app"
   git push
   ```
2. Go to [Netlify](https://app.netlify.com)
3. Click "New site from Git"
4. Choose your repository
5. Set the base directory to `image-gallery-deploy`
6. Click "Deploy site"

### Option 3: Netlify CLI
```bash
# Install Netlify CLI (if not already installed)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Navigate to this folder
cd image-gallery-deploy

# Deploy to production
netlify deploy --prod
```

## Local Development

Simply open `index.html` in your browser. No build process or npm install required!

## Technologies Used

- React 18
- React Hooks (useState, useEffect)
- Unsplash Images API (via direct URLs)
- CSS Grid Layout
- Babel Standalone (for JSX transformation)
- CSS3 Animations

## How to Use

1. **Browse**: View all 12 beautiful images in the gallery
2. **Filter by Category**: Click "Nature", "Urban", or "Art" to filter
3. **Search**: Type in the search box to find specific images
4. **View Fullscreen**: Click any image to open it in a modal
5. **Close Modal**: Click the X button or outside the image to close
6. **Combine Filters**: Use category filter AND search together

## Customization

### Add Your Own Images

Edit the `imageData` array in `index.html` (around line 242):

```javascript
const imageData = [
    {
        id: 1,
        title: "Your Image Title",
        category: "nature", // or "urban" or "art"
        url: "https://your-image-url.com/image.jpg"
    },
    // Add more images...
];
```

### Add More Categories

1. Update the `categories` array (around line 263):
   ```javascript
   const categories = ['all', 'nature', 'urban', 'art', 'new-category'];
   ```

2. Add images with the new category:
   ```javascript
   { id: 13, title: "New Image", category: "new-category", url: "..." }
   ```

## Image Sources

Images are loaded from Unsplash, a free stock photo service. The URLs include `?w=600` to optimize loading performance.

## Performance

- Uses production builds of React for better performance
- Optimized image sizes (600px width)
- Efficient filtering with React hooks
- Smooth CSS animations

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Mobile browsers
