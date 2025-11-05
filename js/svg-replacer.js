/**
 * Modern SVG Replacer - Replaces img.svg elements with inline SVG
 * Modernized from jQuery version for 2024
 * 
 * Usage: Add 'svg' class to img elements you want to replace
 * <img src="/assets/icons/car.svg" class="svg" alt="Car">
 */

class SVGReplacer {
  constructor(options = {}) {
    this.options = {
      selector: options.selector || 'img.svg',
      debug: options.debug || false,
      preserveAttributes: options.preserveAttributes || ['id', 'class', 'alt', 'title'],
      addReplacedClass: options.addReplacedClass !== false, // default true
      ...options
    };
  }

  /**
   * Replace all SVG images with inline SVG
   */
  async replaceAll() {
    const images = document.querySelectorAll(this.options.selector);
    
    if (this.options.debug) {
      console.info(`SVGReplacer: Found ${images.length} SVG images to replace`);
    }

    // Process all images concurrently for better performance
    const promises = Array.from(images).map(img => this.replaceImage(img));
    
    try {
      await Promise.all(promises);
      if (this.options.debug) {
        console.info('SVGReplacer: All SVG replacements completed');
      }
    } catch (error) {
      console.error('SVGReplacer: Error during SVG replacement:', error);
    }
  }

  /**
   * Replace a single image with inline SVG
   */
  async replaceImage(imgElement) {
    const imgURL = imgElement.src;
    
    if (this.options.debug) {
      console.info(`SVGReplacer: Processing ${imgURL}`);
    }

    try {
      // Fetch the SVG content
      const response = await fetch(imgURL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
      }

      const svgText = await response.text();
      
      // Parse the SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      
      // Check for parsing errors
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error(`SVG parsing error: ${parserError.textContent}`);
      }

      const svgElement = svgDoc.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found in the file');
      }

      // Preserve attributes from the original image
      this.preserveAttributes(imgElement, svgElement);
      
      // Add replaced class if enabled
      if (this.options.addReplacedClass) {
        svgElement.classList.add('replaced-svg');
      }

      // Clean up XML namespaces (modern approach)
      this.cleanupNamespaces(svgElement);

      // Replace the image with the SVG
      imgElement.replaceWith(svgElement);

      if (this.options.debug) {
        console.info(`SVGReplacer: Successfully replaced ${imgURL}`);
      }

    } catch (error) {
      console.error(`SVGReplacer: Failed to replace ${imgURL}:`, error);
      // Don't throw - continue with other images
    }
  }

  /**
   * Preserve attributes from img to svg
   */
  preserveAttributes(imgElement, svgElement) {
    this.options.preserveAttributes.forEach(attrName => {
      const attrValue = imgElement.getAttribute(attrName);
      if (attrValue) {
        svgElement.setAttribute(attrName, attrValue);
      }
    });
  }

  /**
   * Clean up XML namespaces that might cause issues
   */
  cleanupNamespaces(svgElement) {
    // Remove common problematic namespaces
    const namespacesToRemove = [
      'xmlns:a',
      'xmlns:xlink',
      'xmlns:ev'
    ];

    namespacesToRemove.forEach(ns => {
      svgElement.removeAttribute(ns);
    });

    // Ensure proper SVG namespace
    if (!svgElement.hasAttribute('xmlns')) {
      svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }
  }
}

/**
 * Auto-initialize when DOM is ready
 */
function initSVGReplacer(options = {}) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const replacer = new SVGReplacer(options);
      replacer.replaceAll();
    });
  } else {
    // DOM is already ready
    const replacer = new SVGReplacer(options);
    replacer.replaceAll();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SVGReplacer, initSVGReplacer };
}

// Auto-initialize with default options
initSVGReplacer({
  debug: true, // Enable debug logging
  selector: 'img.svg' // Target images with 'svg' class
});
