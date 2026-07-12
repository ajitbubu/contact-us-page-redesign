# Floating Video Widget - Quick Copy-Paste Code for Webflow

## COPY & PASTE THESE IN WEBFLOW

---

## 📍 Location 1: CSS Code

**Go to:** Project Settings → Custom Code → **Head Code**

Copy everything below:

```css
/* ==================== Floating Video Widget ==================== */
.video-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
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
  padding-bottom: 56.25%;
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
@media (max-width: 480px) {
  .video-widget:not(.is-expanded) {
    width: calc(100% - 40px);
    max-width: 280px;
  }
  .video-widget:not(.is-expanded) .video-widget__title {
    font-size: 12px;
  }
}
.video-widget__btn:focus-visible {
  outline: 2px solid #1a77f2;
  outline-offset: -2px;
}
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

## 📍 Location 2: JavaScript Code

**Go to:** Project Settings → Custom Code → **Footer Code**

Copy everything below:

```html
<script>
class VideoWidget {
  constructor(options = {}) {
    this.videoSrc = options.videoSrc;
    this.poster = options.poster || null;
    this.title = options.title || 'Video';
    this.storageKey = options.storageKey || 'video-widget-closed';
    this.videoElement = null;
    this.widgetElement = null;

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
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>
        <div class="video-widget__info">
          <p class="video-widget__title">${this.title}</p>
        </div>
        <button class="video-widget__btn" aria-label="Fullscreen" data-action="fullscreen">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
        </button>
        <button class="video-widget__btn video-widget__close" aria-label="Close" data-action="close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
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

    playBtn.addEventListener('click', () => {
      if (this.videoElement.paused) {
        this.videoElement.play();
      } else {
        this.videoElement.pause();
      }
      this.updatePlayButton();
    });

    this.videoElement.addEventListener('play', () => this.updatePlayButton());
    this.videoElement.addEventListener('pause', () => this.updatePlayButton());

    fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    closeBtn.addEventListener('click', () => this.close());

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.widgetElement.classList.remove('is-expanded');
      }
    });

    this.videoElement.addEventListener('dblclick', () => this.toggleFullscreen());
    this.updatePlayButton();
  }

  updatePlayButton() {
    const playBtn = this.widgetElement.querySelector('.video-widget__btn--play');
    const isPlaying = !this.videoElement.paused;

    if (isPlaying) {
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      playBtn.setAttribute('aria-label', 'Pause');
    } else {
      playBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
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
    sessionStorage.setItem(this.storageKey, 'true');
  }

  isClosed() {
    return sessionStorage.getItem(this.storageKey) === 'true';
  }

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

document.addEventListener('DOMContentLoaded', () => {
  sessionStorage.removeItem('dsg-video-closed');

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

## 🎯 CUSTOMIZE THESE VALUES

In the JavaScript code, find this section and update:

```javascript
new VideoWidget({
  videoSrc: 'https://YOUR-VIDEO-URL.mp4',           // ← Change this
  poster: 'https://YOUR-POSTER-IMAGE-URL.jpg',      // ← Change this
  title: 'Your Video Title Here',                   // ← Change this
  storageKey: 'your-unique-storage-key'             // ← Change this (keep it unique)
});
```

---

## ✅ WEBFLOW SETUP CHECKLIST

1. [ ] Go to **Project Settings**
2. [ ] Click **Custom Code**
3. [ ] Paste CSS in **Head Code**
4. [ ] Paste JavaScript in **Footer Code**
5. [ ] Update video URL, poster URL, and title
6. [ ] Publish changes
7. [ ] Test on your site

---

## Video URLs (Replace with your own)

Your video should be:
- ✅ HTTPS (not HTTP)
- ✅ MP4 format
- ✅ H.264 codec
- ✅ Under 10MB

### Hosting Options:
- Netlify
- AWS S3 + CloudFront
- Cloudflare Stream
- Bunny CDN
- Your own server (HTTPS required)

---

## That's it! 🚀

Your floating video widget is ready to use in Webflow!
