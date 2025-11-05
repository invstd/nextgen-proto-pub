/**
 * Gradient Overlay Controller
 * Manages top and bottom gradient overlays based on scroll position
 */

class GradientOverlayController {
  constructor() {
    this.brandsContainer = document.querySelector('.vehicle-selection__brands');
    this.topGradient = document.getElementById('gradient-top');
    this.bottomGradient = document.getElementById('gradient-bottom');
    
    if (!this.brandsContainer || !this.topGradient || !this.bottomGradient) {
      console.warn('Gradient overlay elements not found');
      return;
    }
    
    this.init();
  }
  
  init() {
    // Position gradients relative to the brands container
    this.positionGradients();
    
    // Initial state
    this.updateGradients();
    
    // Listen for scroll events
    this.brandsContainer.addEventListener('scroll', this.updateGradients.bind(this));
    
    // Listen for resize events
    window.addEventListener('resize', this.positionGradients.bind(this));
  }
  
  positionGradients() {
    const containerRect = this.brandsContainer.getBoundingClientRect();
    
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
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight;
    const clientHeight = container.clientHeight;
    
    // Calculate scroll thresholds
    const scrollThreshold = 20; // pixels from top/bottom
    const isAtTop = scrollTop <= scrollThreshold;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;
    
    // Show/hide top gradient
    if (isAtTop) {
      this.topGradient.classList.add('gradient-overlay--hidden');
    } else {
      this.topGradient.classList.remove('gradient-overlay--hidden');
    }
    
    // Show/hide bottom gradient
    if (isAtBottom) {
      this.bottomGradient.classList.add('gradient-overlay--hidden');
    } else {
      this.bottomGradient.classList.remove('gradient-overlay--hidden');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GradientOverlayController();
});
