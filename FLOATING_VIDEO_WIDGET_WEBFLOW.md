# Floating Video Widget for Webflow
## Complete Setup Guide

### Overview
This floating video widget displays a video in the bottom-left corner of the page with play/pause, fullscreen, and close functionality. It reappears on page refresh.

---

## Step 1: Add CSS to Webflow

**Location:** Project Settings → Custom Code → Head Code

```css
/* ==================== Floating Video Widget ==================== */

.video-widget {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 320px;
  max-width: calc(100% - 40px);
  background: #000;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 1000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: slideIn 0.3s ease-out;
}

.video-widget.is-expanded {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  max-width: 100%;
  border-radius: 0;
  bottom: auto;
  left: auto;
}

.video-widget__container {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  background: #000;
  overflow: hidden;
}

.video-widget__video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}

.video-widget__controls {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.video-widget__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.video-widget__btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.video-widget__btn:active {
  background: rgba(255, 255, 255, 0.3);
}

.video-widget__btn svg {
  width: 18px;
  height: 18px;
  display: block;
}

.video-widget__btn--play svg {
  width: 16px;
  height: 16px;
}

.video-widget__info {
  flex: 1;
  min-width: 0;
}

.video-widget__title {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.video-widget__close {
  margin-left: auto;
}

/* Expanded state adjustments */
.video-widget.is-expanded .video-widget__controls {
  padding: 16px 20px;
  border-top: none;
  background: rgba(0, 0, 0, 0.9);
  justify-content: space-between;
}

.video-widget.is-expanded .video-widget__info {
  order: -1;
  flex: 1;
}

.video-widget.is-expanded .video-widget__title {
  font-size: 16px;
  font-weight: 600;
}

/* Mobile adjustments */
@media (max-width: 480px) {
  .video-widget:not(.is-expanded) {
    width: calc(100% - 40px);
    max-width: 280px;
  }

  .video-widget:not(.is-expanded) .video-widget__title {
    font-size: 12px;
  }
}

/* Accessibility */
.video-widget__btn:focus-visible {
  outline: 2px solid #1a77f2;
  outline-offset: -2px;
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## Step 2: Add JavaScript to Webflow

**Location:** Project Settings → Custom Code → Footer Code

```html
<script>
/**
 * Floating Video Widget
 * A reusable component for displaying a video in the bottom-left corner
 * with fullscreen, play/pause, and close functionality.
 */

class VideoWidget {
  constructor(options = {}) {
    this.videoSrc = options.videoSrc;
    this.poster = options.poster || null;
    this.title = options.title || 'Video';
    this.storageKey = options.storageKey || 'video-widget-closed';
    this.videoElement = null;
    this.widgetElement = null;

    // Check if user previously closed this widget
    if (this.isClosed()) {
      return;
    }

    this.init();
  }

  init() {
    this.createWidget();
    this.attachEventListeners();
  }

  createWidget() {
    // Create main widget container
    this.widgetElement = document.createElement('div');
    this.widgetElement.className = 'video-widget';
    this.widgetElement.innerHTML = `
      <div class="video-widget__container">
        <video
          class="video-widget__video"
          controlsList="nodownload"
          preload="metadata"
          playsinline
          ${this.poster ? `poster="${this.poster}"` : ''}
        >
          <source src="${this.videoSrc}" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <div class="video-widget__controls">
        <button class="video-widget__btn video-widget__btn--play" aria-label="Play/Pause">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
        <div class="video-widget__info">
          <p class="video-widget__title">${this.title}</p>
        </div>
        <button class="video-widget__btn" aria-label="Fullscreen" data-action="fullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        </button>
        <button class="video-widget__btn video-widget__close" aria-label="Close" data-action="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(this.widgetElement);
    this.videoElement = this.widgetElement.querySelector('video');
  }

  attachEventListeners() {
    const playBtn = this.widgetElement.querySelector('.video-widget__btn--play');
    const fullscreenBtn = this.widgetElement.querySelector('[data-action="fullscreen"]');
    const closeBtn = this.widgetElement.querySelector('[data-action="close"]');

    // Play/Pause button
    playBtn.addEventListener('click', () => {
      if (this.videoElement.paused) {
        this.videoElement.play();
      } else {
        this.videoElement.pause();
      }
      this.updatePlayButton();
    });

    // Update button state on video events
    this.videoElement.addEventListener('play', () => this.updatePlayButton());
    this.videoElement.addEventListener('pause', () => this.updatePlayButton());

    // Fullscreen button
    fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());

    // Close button
    closeBtn.addEventListener('click', () => this.close());

    // Handle ESC key to exit fullscreen
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.widgetElement.classList.remove('is-expanded');
      }
    });

    // Double-click to fullscreen
    this.videoElement.addEventListener('dblclick', () => this.toggleFullscreen());

    // Set initial button state
    this.updatePlayButton();
  }

  updatePlayButton() {
    const playBtn = this.widgetElement.querySelector('.video-widget__btn--play');
    const isPlaying = !this.videoElement.paused;

    if (isPlaying) {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"/>
          <rect x="14" y="4" width="4" height="16"/>
        </svg>
      `;
      playBtn.setAttribute('aria-label', 'Pause');
    } else {
      playBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      `;
      playBtn.setAttribute('aria-label', 'Play');
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  enterFullscreen() {
    this.widgetElement.classList.add('is-expanded');

    if (this.videoElement.requestFullscreen) {
      this.videoElement.requestFullscreen().catch(err => {
        console.warn('Fullscreen request failed:', err);
        this.widgetElement.classList.remove('is-expanded');
      });
    }
  }

  exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    this.widgetElement.classList.remove('is-expanded');
  }

  close() {
    this.widgetElement.style.animation = 'slideIn 0.3s ease-out reverse';
    setTimeout(() => {
      this.widgetElement.remove();
      this.markClosed();
    }, 300);
  }

  markClosed() {
    // Store in sessionStorage - widget will reappear after page refresh
    sessionStorage.setItem(this.storageKey, 'true');
  }

  isClosed() {
    // Check if closed in current session only
    return sessionStorage.getItem(this.storageKey) === 'true';
  }

  // Public methods
  show() {
    if (this.widgetElement) {
      this.widgetElement.style.display = 'block';
      sessionStorage.removeItem(this.storageKey);
    }
  }

  hide() {
    if (this.widgetElement) {
      this.widgetElement.style.display = 'none';
    }
  }

  destroy() {
    if (this.widgetElement) {
      this.widgetElement.remove();
      this.widgetElement = null;
      this.videoElement = null;
    }
  }
}

// Initialize widget when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Clear closed state so widget always shows on fresh page load
  sessionStorage.removeItem('dsg-video-closed');

  // Create the widget
  new VideoWidget({
    videoSrc: 'https://dsg-chatbot.netlify.app/dsg-avatar-ny.mp4',
    poster: 'https://dsg-chatbot.netlify.app/dsg-avatar-poster.jpg',
    title: 'DSG is here to help you!',
    storageKey: 'dsg-video-closed'
  });
});
</script>
```

---

## Step 3: Customize for Your Needs

### Change Video Source
Update these lines in the JavaScript:
```javascript
videoSrc: 'https://YOUR-VIDEO-URL.mp4',
poster: 'https://YOUR-POSTER-IMAGE.jpg',
title: 'Your Video Title',
storageKey: 'your-unique-key'
```

### Change Position
In CSS, modify the `.video-widget` class:
```css
/* Bottom-left (default) */
bottom: 20px;
left: 20px;

/* Bottom-right */
bottom: 20px;
left: auto;
right: 20px;

/* Top-left */
top: 20px;
bottom: auto;
left: 20px;

/* Top-right */
top: 20px;
bottom: auto;
right: 20px;
```

### Change Size
Modify in CSS:
```css
.video-widget {
  width: 320px;  /* Change this (400px, 500px, etc.) */
  max-width: calc(100% - 40px);
}
```

### Change Border Radius
```css
.video-widget {
  border-radius: 12px;  /* Make 0 for square, 20px for rounder */
}
```

---

## Video Requirements

- **Format:** MP4 (H.264 video codec)
- **Host:** Must be HTTPS (HTTP will NOT work)
- **Size:** Keep under 10MB for optimal performance
- **Aspect Ratio:** 16:9 recommended
- **Duration:** 15-60 seconds ideal

### Hosting Options
- AWS S3 + CloudFront
- Cloudflare Stream
- Bunny CDN
- Netlify
- Your own server with HTTPS

---

## Features

✅ Play/Pause controls
✅ Fullscreen/Expand capability
✅ Close button
✅ Poster thumbnail
✅ Reappears on page refresh
✅ Mobile responsive
✅ Accessibility support
✅ Smooth animations
✅ Double-click fullscreen

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

---

## Support & Troubleshooting

**Video not playing?**
- Ensure video URL is HTTPS
- Check video format is MP4 with H.264
- Verify CORS headers allow access

**Widget not appearing?**
- Check browser console for errors
- Ensure JavaScript is added to Footer Code
- Verify CSS is added to Head Code

**Fullscreen not working?**
- Some mobile browsers restrict fullscreen
- Check browser permissions

---

## Implementation Notes

1. The widget reappears on **page refresh** (not on new page visit)
2. Users can close it, but it will show again when they reload
3. All controls are keyboard accessible
4. No external dependencies required
5. Works alongside existing Webflow elements

---

## Quick Webflow Checklist

- [ ] Add CSS to Project Settings → Custom Code → Head Code
- [ ] Add JavaScript to Project Settings → Custom Code → Footer Code
- [ ] Update video URL to your hosted video
- [ ] Update poster image URL
- [ ] Update title text
- [ ] Test on desktop and mobile
- [ ] Publish to live site

Done! Your floating video widget is ready to use in Webflow. 🚀
