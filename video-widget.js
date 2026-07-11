/**
 * Floating Video Widget
 * A reusable component for displaying a video in the bottom-left corner
 * with fullscreen, play/pause, and close functionality.
 *
 * Usage:
 *   new VideoWidget({
 *     videoSrc: 'https://example.com/video.mp4',
 *     title: 'Video Title',
 *     storageKey: 'video-widget-closed' // for persistence
 *   });
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
    } else {
      // Fallback for browsers that don't support fullscreen
      // Just expand the widget to fill the screen
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

  // Clear closed state on page load (so it always shows when user comes back)
  static clearClosedState(storageKey) {
    sessionStorage.removeItem(storageKey);
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

// Auto-initialize if data attributes are present
document.addEventListener('DOMContentLoaded', () => {
  const videoWidget = document.querySelector('[data-video-widget]');
  if (videoWidget) {
    const videoSrc = videoWidget.dataset.videoSrc;
    const poster = videoWidget.dataset.videoPoster || null;
    const title = videoWidget.dataset.videoTitle || 'Video';
    const storageKey = videoWidget.dataset.storageKey || 'video-widget-closed';

    // Clear closed state so widget always shows on fresh page load
    sessionStorage.removeItem(storageKey);

    if (videoSrc) {
      new VideoWidget({
        videoSrc,
        poster,
        title,
        storageKey
      });
    }
  }
});
