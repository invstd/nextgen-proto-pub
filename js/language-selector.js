/**
 * Language Selector Controller
 * 
 * Handles language selection functionality:
 * - Opens/closes dropdown menu
 * - Stores selected language in localStorage
 * - Updates UI to reflect selected language
 * - Closes dropdown when clicking outside
 */
class LanguageSelector {
  constructor() {
    this.storageKey = 'selectedLanguage';
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.languages = {
      en: 'English',
      de: 'Deutsch',
      no: 'Norsk'
    };
    
    // Don't auto-initialize - let init() be called explicitly with the right prefix
    // This allows us to create instances for different selectors (main vs gate)
    this.selectorPrefix = '';
    this._buttonClickHandler = null;
    this._documentClickHandler = null;
    this._documentKeydownHandler = null;
  }

  init(selectorPrefix = '') {
    // Allow custom prefix for multiple instances (e.g., 'gate-' for password gate)
    const prefix = selectorPrefix ? `${selectorPrefix}-` : '';
    const button = document.getElementById(`language-selector-${prefix}btn`);
    const dropdown = document.getElementById(`language-selector-${prefix}dropdown`);
    const currentLabel = document.getElementById(`language-selector-${prefix}current`);
    
    if (!button || !dropdown || !currentLabel) {
      console.warn(`Language selector elements not found (prefix: ${prefix})`);
      return;
    }

    // Store prefix for this instance
    this.selectorPrefix = selectorPrefix;
    
    // Remove old event listeners if they exist (for re-initialization)
    // Only remove if button exists (safety check)
    if (this._buttonClickHandler && button) {
      button.removeEventListener('click', this._buttonClickHandler);
    }
    if (this._documentClickHandler) {
      document.removeEventListener('click', this._documentClickHandler);
    }
    if (this._documentKeydownHandler) {
      document.removeEventListener('keydown', this._documentKeydownHandler);
    }
    
    // Set initial state
    this.updateUI(selectorPrefix);
    
    // Create bound handlers to allow removal later
    // Store prefix in closure to ensure it's used correctly
    const storedPrefix = selectorPrefix;
    this._buttonClickHandler = (e) => {
      e.stopPropagation();
      // Use stored prefix from when handler was created
      this.toggleDropdown(storedPrefix);
    };
    
    // Use a unique identifier for document listeners to avoid conflicts
    // Store prefix in closure for document handlers too
    const documentPrefix = prefix; // Use the calculated prefix for element IDs
    this._documentClickHandler = (e) => {
      // Only handle if this is for our specific selector
      const currentButton = document.getElementById(`language-selector-${documentPrefix}btn`);
      const currentDropdown = document.getElementById(`language-selector-${documentPrefix}dropdown`);
      if (currentButton && currentDropdown && 
          !currentButton.contains(e.target) && !currentDropdown.contains(e.target)) {
        this.closeDropdown(storedPrefix);
      }
    };
    
    this._documentKeydownHandler = (e) => {
      // Only handle Escape if our dropdown is open
      const currentDropdown = document.getElementById(`language-selector-${documentPrefix}dropdown`);
      if (currentDropdown && e.key === 'Escape') {
        // Check if dropdown is visible (aria-hidden="false")
        const isOpen = currentDropdown.getAttribute('aria-hidden') === 'false';
        if (isOpen) {
          this.closeDropdown(storedPrefix);
        }
      }
    };
    
    // Button click handler
    button.addEventListener('click', this._buttonClickHandler);

    // Option click handlers (re-bind each time since options might change)
    const options = dropdown.querySelectorAll('.language-selector__option');
    options.forEach(option => {
      // Remove old listener if it exists
      if (option._optionClickHandler) {
        option.removeEventListener('click', option._optionClickHandler);
      }
      option._optionClickHandler = (e) => {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang');
        if (lang) {
          this.selectLanguage(lang);
        }
      };
      option.addEventListener('click', option._optionClickHandler);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', this._documentClickHandler);

    // Close dropdown on Escape key
    document.addEventListener('keydown', this._documentKeydownHandler);
  }

  toggleDropdown(selectorPrefix = '') {
    // Use provided prefix or fall back to stored prefix
    const prefix = selectorPrefix || this.selectorPrefix || '';
    const actualPrefix = prefix ? `${prefix}-` : '';
    const button = document.getElementById(`language-selector-${actualPrefix}btn`);
    const dropdown = document.getElementById(`language-selector-${actualPrefix}dropdown`);
    
    if (!button || !dropdown) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
      this.closeDropdown(prefix);
    } else {
      this.openDropdown(prefix);
    }
  }

  openDropdown(selectorPrefix = '') {
    const prefix = selectorPrefix ? `${selectorPrefix}-` : '';
    const button = document.getElementById(`language-selector-${prefix}btn`);
    const dropdown = document.getElementById(`language-selector-${prefix}dropdown`);
    
    if (!button || !dropdown) return;

    button.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-hidden', 'false');
  }

  closeDropdown(selectorPrefix = '') {
    const prefix = selectorPrefix ? `${selectorPrefix}-` : '';
    const button = document.getElementById(`language-selector-${prefix}btn`);
    const dropdown = document.getElementById(`language-selector-${prefix}dropdown`);
    
    if (!button || !dropdown) return;

    button.setAttribute('aria-expanded', 'false');
    dropdown.setAttribute('aria-hidden', 'true');
  }

  selectLanguage(lang) {
    if (!this.languages[lang]) {
      console.warn(`Language "${lang}" not supported`);
      return;
    }

    this.currentLanguage = lang;
    this.storeLanguage(lang);
    this.updateUI(this.selectorPrefix);
    this.closeDropdown(this.selectorPrefix);
    
    // Also update the other language selector instance if it exists
    if (this.selectorPrefix === '' && window.languageSelectorGateInstance) {
      window.languageSelectorGateInstance.currentLanguage = lang;
      window.languageSelectorGateInstance.updateUI('gate-');
    } else if (this.selectorPrefix === 'gate-' && window.languageSelectorInstance) {
      window.languageSelectorInstance.currentLanguage = lang;
      window.languageSelectorInstance.updateUI();
    }
    
    // Update all translations in the UI
    if (window.updateTranslations) {
      window.updateTranslations(lang);
    }
    
    // Dispatch custom event for language change
    const event = new CustomEvent('languageChanged', {
      detail: { language: lang, label: this.languages[lang] }
    });
    document.dispatchEvent(event);
  }

  updateUI(selectorPrefix = '') {
    const prefix = selectorPrefix ? `${selectorPrefix}-` : '';
    const currentLabel = document.getElementById(`language-selector-${prefix}current`);
    // Find options in the same container as the current label
    const container = currentLabel?.closest('.language-selector');
    const options = container ? container.querySelectorAll('.language-selector__option') : document.querySelectorAll('.language-selector__option');
    
    if (currentLabel) {
      currentLabel.textContent = this.languages[this.currentLanguage];
    }

    // Update selected state in dropdown
    options.forEach(option => {
      const lang = option.getAttribute('data-lang');
      const isSelected = lang === this.currentLanguage;
      option.setAttribute('aria-selected', isSelected);
    });
  }

  getStoredLanguage() {
    try {
      return localStorage.getItem(this.storageKey);
    } catch (error) {
      console.warn('Could not read from localStorage:', error);
      return null;
    }
  }

  storeLanguage(lang) {
    try {
      localStorage.setItem(this.storageKey, lang);
    } catch (error) {
      console.warn('Could not write to localStorage:', error);
    }
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  getCurrentLanguageLabel() {
    return this.languages[this.currentLanguage];
  }
}

// Initialize language selector when DOM is ready
// Store instance globally so it can be re-initialized if needed
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.languageSelectorInstance = new LanguageSelector();
    // Initialize with default prefix (empty string) for main selector
    window.languageSelectorInstance.init('');
  });
} else {
  window.languageSelectorInstance = new LanguageSelector();
  // Initialize with default prefix (empty string) for main selector
  window.languageSelectorInstance.init('');
}

