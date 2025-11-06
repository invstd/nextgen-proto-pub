/**
 * Password Authentication System
 * 
 * Protects the prototype behind a password gate.
 * Uses sessionStorage to persist authentication during the browser session.
 * 
 * Note: This is client-side protection only. For production use,
 * consider server-side authentication or a service like Netlify with password protection.
 */

class PasswordAuth {
  constructor() {
    // Password configuration - CHANGE THIS PASSWORD
    // In production, you might want to use environment variables or a config file
    this.correctPassword = 'Mellon'; // Change this to your desired password
    
    // Storage key for authentication
    this.authKey = 'wow_prototype_authenticated';
    this.passwordKey = 'wow_prototype_password_hash';
    
    // Check if already authenticated
    this.isAuthenticated = this.checkAuthentication();
    
    // Initialize
    this.init();
  }
  
  init() {
    if (this.isAuthenticated) {
      this.grantAccess();
    } else {
      this.showPasswordGate();
      this.setupPasswordForm();
      
      // Initialize password gate language selector
      this.initPasswordGateLanguageSelector();
    }
  }
  
  /**
   * Initialize password gate language selector
   * Tries multiple times to ensure it initializes properly
   */
  initPasswordGateLanguageSelector() {
    const tryInit = (attempt = 0) => {
      // Check if LanguageSelector class is available
      if (typeof LanguageSelector === 'undefined') {
        if (attempt < 10) {
          // Retry if LanguageSelector class not loaded yet
          setTimeout(() => tryInit(attempt + 1), 100);
        } else {
          console.warn('LanguageSelector class not available after 10 attempts');
        }
        return;
      }
      
      // Check if gate button exists
      const gateButton = document.getElementById('language-selector-gate-btn');
      const gateDropdown = document.getElementById('language-selector-gate-dropdown');
      const gateCurrent = document.getElementById('language-selector-gate-current');
      
      if (!gateButton || !gateDropdown || !gateCurrent) {
        if (attempt < 5) {
          // Retry if elements not found yet (DOM might not be ready)
          setTimeout(() => tryInit(attempt + 1), 100);
        } else {
          console.warn('Password gate language selector elements not found after 5 attempts');
        }
        return;
      }
      
      // All elements found, initialize
      // Note: pass 'gate' not 'gate-' because init() adds the dash automatically
      if (window.languageSelectorGateInstance) {
        // Re-initialize existing instance with the gate prefix
        window.languageSelectorGateInstance.init('gate');
      } else {
        // Create new instance for gate selector
        window.languageSelectorGateInstance = new LanguageSelector();
        window.languageSelectorGateInstance.init('gate');
      }
    };
    
    // Start initialization attempt
    tryInit();
  }
  
  /**
   * Check if user is already authenticated
   */
  checkAuthentication() {
    try {
      const authenticated = sessionStorage.getItem(this.authKey);
      const storedHash = sessionStorage.getItem(this.passwordKey);
      
      // Verify both the auth flag and password hash match
      if (authenticated === 'true' && storedHash === this.hashPassword(this.correctPassword)) {
        return true;
      }
      
      // Clear invalid session data
      this.clearAuthentication();
      return false;
    } catch (error) {
      console.warn('Could not check authentication:', error);
      return false;
    }
  }
  
  /**
   * Show password gate and hide main content
   * CSS handles the visibility, we just ensure the class is not present
   */
  showPasswordGate() {
    // Remove authenticated class if present (shouldn't be, but just in case)
    document.body.classList.remove('password-authenticated');
    // CSS will handle showing the gate and hiding content
  }
  
  /**
   * Grant access - hide gate and show main content
   * CSS handles the visibility based on the class
   */
  grantAccess() {
    // Add class to body to allow CSS to show content and hide gate
    document.body.classList.add('password-authenticated');
    
    // Initialize or re-initialize main language selector after authentication
    // This ensures it works even if elements were hidden during initial load
    this.initMainLanguageSelector();
  }
  
  /**
   * Initialize main language selector after authentication
   * Re-initializes if already exists, or creates new instance
   */
  initMainLanguageSelector() {
    const tryInit = (attempt = 0) => {
      if (typeof LanguageSelector !== 'undefined') {
        const mainButton = document.getElementById('language-selector-btn');
        if (mainButton) {
          if (window.languageSelectorInstance) {
            // Re-initialize existing instance (no prefix for main selector)
            window.languageSelectorInstance.init('');
          } else {
            // Create new instance if it doesn't exist
            window.languageSelectorInstance = new LanguageSelector();
            // Note: constructor already calls init(), but we ensure it uses default prefix
            window.languageSelectorInstance.init('');
          }
        } else if (attempt < 5) {
          // Retry if button not found yet (might be in a component that loads later)
          setTimeout(() => tryInit(attempt + 1), 100);
        }
      } else if (attempt < 10) {
        // Retry if LanguageSelector class not loaded yet
        setTimeout(() => tryInit(attempt + 1), 100);
      }
    };
    
    // Start initialization attempt
    tryInit();
  }
  
  /**
   * Setup password form submission
   */
  setupPasswordForm() {
    const form = document.getElementById('password-form');
    const input = document.getElementById('password-input');
    const error = document.getElementById('password-error');
    
    if (!form || !input) return;
    
    // Update translations for password gate elements
    this.updatePasswordGateTranslations();
    
    // Listen for language changes
    document.addEventListener('languageChanged', () => {
      this.updatePasswordGateTranslations();
    });
    
    // Focus input on load
    setTimeout(() => input.focus(), 100);
    
    // Enable/disable submit button based on input value
    const submitButton = document.getElementById('password-submit-btn');
    const updateButtonState = () => {
      if (submitButton) {
        const hasValue = input.value.trim().length > 0;
        submitButton.disabled = !hasValue;
        // Toggle button--disabled class for design system consistency
        if (hasValue) {
          submitButton.classList.remove('button--disabled');
        } else {
          submitButton.classList.add('button--disabled');
        }
      }
    };
    
    // Update button state on input change
    input.addEventListener('input', updateButtonState);
    input.addEventListener('paste', () => {
      // Handle paste events with a slight delay
      setTimeout(updateButtonState, 10);
    });
    
    // Initialize button state
    updateButtonState();
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const password = input.value.trim();
      
      // Clear previous error
      if (error) {
        error.textContent = '';
        error.classList.remove('password-gate__error--visible');
      }
      
      // Validate password
      if (password === this.correctPassword) {
        this.authenticate();
        this.grantAccess();
      } else {
        // Show error
        if (error) {
          const errorText = window.t ? window.t('passwordGate.error') : 'Incorrect password. Please try again.';
          error.textContent = errorText;
          error.classList.add('password-gate__error--visible');
        }
        
        // Clear input and refocus
        input.value = '';
        input.focus();
        
        // Add shake animation
        input.classList.add('password-gate__input--shake');
        setTimeout(() => {
          input.classList.remove('password-gate__input--shake');
        }, 500);
      }
    });
    
    // Allow Enter key to submit
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        form.dispatchEvent(new Event('submit'));
      }
    });
  }
  
  /**
   * Authenticate user and store in sessionStorage
   */
  authenticate() {
    try {
      sessionStorage.setItem(this.authKey, 'true');
      sessionStorage.setItem(this.passwordKey, this.hashPassword(this.correctPassword));
    } catch (error) {
      console.error('Could not store authentication:', error);
    }
  }
  
  /**
   * Clear authentication (logout)
   */
  clearAuthentication() {
    try {
      sessionStorage.removeItem(this.authKey);
      sessionStorage.removeItem(this.passwordKey);
    } catch (error) {
      console.error('Could not clear authentication:', error);
    }
  }
  
  /**
   * Simple hash function for password verification
   * Note: This is not cryptographically secure, just for basic obfuscation
   */
  hashPassword(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  }
  
  /**
   * Update password gate translations
   */
  updatePasswordGateTranslations() {
    if (!window.updateTranslations) return;
    
    const gate = document.getElementById('password-gate');
    if (!gate) return;
    
    // Update all data-i18n elements
    gate.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = window.t ? window.t(key) : null;
      if (translation) {
        element.textContent = translation;
      }
    });
    
    // Update placeholder attributes
    gate.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.getAttribute('data-i18n-placeholder');
      const translation = window.t ? window.t(key) : null;
      if (translation) {
        element.setAttribute('placeholder', translation);
      }
    });
  }
  
  /**
   * Logout function (can be called from console: window.passwordAuth.logout())
   */
  logout() {
    this.clearAuthentication();
    window.location.reload();
  }
}

// Initialize password auth when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.passwordAuth = new PasswordAuth();
  });
} else {
  window.passwordAuth = new PasswordAuth();
}

