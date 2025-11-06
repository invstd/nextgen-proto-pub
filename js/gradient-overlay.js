/**
 * Gradient Overlay Controller
 * Manages top and bottom gradient overlays based on scroll position
 */

class GradientOverlayController {
  constructor(options = {}) {
    // Allow custom container and gradient selectors for reusability
    this.containerSelector = options.containerSelector || '.vehicle-selection__brands';
    this.topGradientId = options.topGradientId || 'gradient-top';
    this.bottomGradientId = options.bottomGradientId || 'gradient-bottom';
    this.waitForAuth = options.waitForAuth !== false; // Default to true for backward compatibility
    
    this.brandsContainer = document.querySelector(this.containerSelector);
    this.topGradient = document.getElementById(this.topGradientId);
    this.bottomGradient = document.getElementById(this.bottomGradientId);
    
    if (!this.brandsContainer || !this.topGradient || !this.bottomGradient) {
      console.warn('Gradient overlay elements not found', {
        container: this.containerSelector,
        topGradient: this.topGradientId,
        bottomGradient: this.bottomGradientId
      });
      return;
    }
    
    // Wait for password authentication if needed, otherwise initialize immediately
    if (this.waitForAuth) {
      this.waitForAuthentication();
    } else {
      this.init();
    }
  }
  
  waitForAuthentication() {
    // Check if already authenticated (password gate removed) or no password gate exists
    if (document.body.classList.contains('password-authenticated') || 
        !document.getElementById('password-gate')) {
      // No password gate or already authenticated, initialize immediately
      this.init();
      return;
    }
    
    // Wait for password authentication
    // Use MutationObserver to watch for body class changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          if (document.body.classList.contains('password-authenticated')) {
            observer.disconnect();
            // Small delay to ensure layout is complete after gate removal
            setTimeout(() => {
              this.init();
            }, 50);
          }
        }
      });
    });
    
    // Start observing body for class changes
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    // Fallback: also check after a delay in case observer doesn't fire
    // Or if password gate doesn't exist, initialize anyway
    setTimeout(() => {
      if (!this.initialized) {
        const passwordGate = document.getElementById('password-gate');
        if (document.body.classList.contains('password-authenticated') || !passwordGate) {
          observer.disconnect();
          this.init();
        }
      }
    }, 1000);
  }
  
  init() {
    this.initialized = true;
    
    // Position gradients relative to the brands container
    this.positionGradients();
    
    // Initial state - wait for layout to be complete
    // Use multiple requestAnimationFrame calls to ensure DOM is fully laid out
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Double-check after a small delay to ensure scrollHeight is accurate
        setTimeout(() => {
          this.positionGradients();
          this.updateGradients();
        }, 100);
      });
    });
    
    // Also update on window load to catch any late-loading content
    window.addEventListener('load', () => {
      this.positionGradients();
      this.updateGradients();
    });
    
    // Listen for scroll events
    this.brandsContainer.addEventListener('scroll', this.updateGradients.bind(this));
    
    // Listen for resize events
    window.addEventListener('resize', () => {
      this.positionGradients();
      this.updateGradients();
    });
    
    // Use IntersectionObserver to detect when container becomes visible
    const visibilityObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Container is visible, update gradients
          this.positionGradients();
          this.updateGradients();
        }
      });
    }, { threshold: 0 });
    
    visibilityObserver.observe(this.brandsContainer);
  }
  
  positionGradients() {
    // Check if container is visible before positioning
    const containerRect = this.brandsContainer.getBoundingClientRect();
    
    // If container has zero dimensions, it's not visible yet
    if (containerRect.width === 0 || containerRect.height === 0) {
      return;
    }
    
    // Position top gradient at the top of the brands container
    this.topGradient.style.top = `${containerRect.top}px`;
    this.topGradient.style.left = `${containerRect.left}px`;
    this.topGradient.style.width = `${containerRect.width}px`;
    
    // Position bottom gradient at the bottom of the brands container
    this.bottomGradient.style.top = `${containerRect.bottom - 60}px`;
    this.bottomGradient.style.left = `${containerRect.left}px`;
    this.bottomGradient.style.width = `${containerRect.width}px`;
  }
  
  updateGradients() {
    const container = this.brandsContainer;
    
    // Check if container is visible
    const containerRect = container.getBoundingClientRect();
    if (containerRect.width === 0 || containerRect.height === 0) {
      return;
    }
    
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Check if content is scrollable
    const isScrollable = scrollHeight > clientHeight;
    
    // Calculate scroll thresholds
    const scrollThreshold = 20; // pixels from top/bottom
    const isAtTop = scrollTop <= scrollThreshold;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;
    
    // Show/hide top gradient
    if (isAtTop || !isScrollable) {
      this.topGradient.classList.add('gradient-overlay--hidden');
    } else {
      this.topGradient.classList.remove('gradient-overlay--hidden');
    }
    
    // Show/hide bottom gradient
    // Show bottom gradient if there's scrollable content and we're not at the bottom
    if (isAtBottom || !isScrollable) {
      this.bottomGradient.classList.add('gradient-overlay--hidden');
    } else {
      this.bottomGradient.classList.remove('gradient-overlay--hidden');
    }
  }
}

// Initialize when DOM is ready
// Default usage: waits for password authentication if password gate exists
document.addEventListener('DOMContentLoaded', () => {
  new GradientOverlayController();
});

// Example: For reuse on other containers without password gate:
// new GradientOverlayController({
//   containerSelector: '.my-custom-container',
//   topGradientId: 'my-top-gradient',
//   bottomGradientId: 'my-bottom-gradient',
//   waitForAuth: false  // Skip password gate check
// });
