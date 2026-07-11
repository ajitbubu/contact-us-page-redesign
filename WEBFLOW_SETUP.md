# Video Widget Setup for Webflow

This guide explains how to add the floating video widget to your Webflow contact page.

## Features

- ✅ Floating video player positioned at bottom-left corner
- ✅ Play/Pause controls
- ✅ Fullscreen/expand capability
- ✅ Close button with smooth animation
- ✅ Persistent across page navigation (closes only when user explicitly closes it)
- ✅ Responsive design (adapts to mobile screens)
- ✅ Accessibility support (keyboard navigation, ARIA labels)

## Option 1: Direct Implementation (Recommended for Webflow)

### Step 1: Add Custom CSS to Webflow

1. Go to your Webflow project settings
2. Navigate to **Custom Code** → **Head Code**
3. Add a `<style>` tag with the CSS content from `styles/video-widget.css`

**OR** link to an external CSS file:
```html
<link rel="stylesheet" href="https://your-domain.com/video-widget.css">
```

### Step 2: Add Custom JavaScript to Webflow

1. Go to your Webflow project settings
2. Navigate to **Custom Code** → **Footer Code**
3. Copy and paste the entire content from `video-widget.js`

### Step 3: Initialize the Widget

Add this code to your page's **Custom Code** → **Footer Code** (after the VideoWidget class):

```javascript
// Initialize the video widget
new VideoWidget({
  videoSrc: 'https://your-domain.com/your-video.mp4',  // Replace with your video URL
  title: 'Galaxy S26 Ultra',  // Replace with your video title
  storageKey: 'contact-video-closed'  // Unique key for persistence
});
```

---

## Option 2: Data Attributes (Alternative)

If you prefer using data attributes, add this to your page's body tag in Webflow:

```html
<body data-video-widget 
      data-video-src="https://your-domain.com/your-video.mp4" 
      data-video-title="Galaxy S26 Ultra">
```

Then add the `VideoWidget` class code to your page footer, and it will auto-initialize.

---

## Customization

### Change Video Source

```javascript
new VideoWidget({
  videoSrc: 'https://your-domain.com/new-video.mp4',
  title: 'Your Video Title'
});
```

### Customize Styling

You can modify the CSS variables and styles in `video-widget.css`:

- **Position**: Change `bottom: 20px; left: 20px;` to adjust placement
- **Size**: Change `width: 320px;` to adjust dimensions
- **Colors**: Modify background colors (currently using `#000` for black)
- **Border radius**: Change `border-radius: 12px;` for more/less rounded corners

### Programmatic Control

Once initialized, you can control the widget via JavaScript:

```javascript
const widget = new VideoWidget({
  videoSrc: 'https://example.com/video.mp4',
  title: 'My Video'
});

// Show the widget
widget.show();

// Hide the widget
widget.hide();

// Destroy the widget
widget.destroy();
```

---

## Persistence Behavior

The widget uses `sessionStorage` to track whether the user closed it:

- **On page load**: Widget appears (unless user closed it previously)
- **User closes widget**: Stored in `sessionStorage` with key `contact-video-closed`
- **Page refresh**: Widget doesn't reappear (user closed it in this session)
- **New browser tab/window**: Widget reappears (new session)
- **Browser closed**: Storage clears (new session next time)

### Changing Persistence Strategy

If you want the widget to always appear (ignore previous closes):

1. Remove the `isClosed()` check in the `init()` method, OR
2. Use `localStorage` instead of `sessionStorage` for longer persistence:

```javascript
// In video-widget.js, change:
sessionStorage.setItem(this.storageKey, 'true');
// To:
localStorage.setItem(this.storageKey, 'true');
```

---

## Video Requirements

- **Format**: MP4 (H.264 video codec recommended)
- **Host**: Must be HTTPS-hosted on a CDN or your server
- **Size**: Keep under 5MB for optimal performance (consider video compression)
- **Dimensions**: 16:9 aspect ratio recommended (will be constrained to this)
- **Duration**: Recommended 15-30 seconds for promotional content

### Video Hosting Options
- AWS S3 + CloudFront
- Cloudflare Stream
- Vimeo Pro (with CDN)
- Your own server with CDN

---

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Graceful degradation: On older browsers, the video will display but fullscreen may not work.

---

## Troubleshooting

### Widget Not Appearing
- Check console for errors: Right-click → Inspect → Console tab
- Verify video URL is accessible and HTTPS
- Ensure JavaScript code is in the page footer (not head)

### Fullscreen Not Working
- Some browsers require user interaction before fullscreen
- Mobile browsers may have fullscreen restrictions
- Check browser console for error messages

### Video Not Playing
- Verify video format is MP4 with H.264 codec
- Check CORS headers (video must be accessible from your domain)
- Try using a different CDN

### Widget Persists After Close
- Clear browser cache/cookies
- Check if using `localStorage` vs `sessionStorage`
- Verify storage key is correct

---

## Advanced: Multiple Videos

To add multiple video widgets on different pages:

```javascript
// Page 1
new VideoWidget({
  videoSrc: 'https://example.com/intro.mp4',
  title: 'Product Intro',
  storageKey: 'video-intro-closed'
});

// Page 2
new VideoWidget({
  videoSrc: 'https://example.com/demo.mp4',
  title: 'Product Demo',
  storageKey: 'video-demo-closed'
});
```

Each uses a different `storageKey`, so users can close one without affecting others.

---

## CSS Customization Examples

### Make Larger
```css
.video-widget {
  width: 480px; /* Changed from 320px */
}
```

### Position Bottom-Right Instead
```css
.video-widget {
  left: auto;
  right: 20px;
}
```

### Darker Shadow
```css
.video-widget {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}
```

### Different Corner Radius
```css
.video-widget {
  border-radius: 20px;
}
```

---

## Support & Debugging

### Enable Console Logging
Add this to the VideoWidget class for debugging:

```javascript
console.log('VideoWidget initialized:', {
  videoSrc: this.videoSrc,
  title: this.title,
  isClosed: this.isClosed()
});
```

### Clear Storage (for testing)
Run in browser console:
```javascript
sessionStorage.clear();
location.reload();
```

---

## Performance Notes

- Lazy-loads video metadata (doesn't download full video until user plays)
- Uses `object-fit: contain` to prevent distortion
- Minimal CSS animations (only on widget appear/disappear)
- No external dependencies required
- File size: ~8KB JS + ~2KB CSS (minified)

---

## Next Steps

1. **Replace video URL** with your actual video link
2. **Update title** to match your video
3. **Test on mobile** to ensure responsive layout
4. **A/B test** placement (bottom-left vs. bottom-right)
5. **Monitor analytics** to see user engagement with the widget
