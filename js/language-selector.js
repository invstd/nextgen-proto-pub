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
    
    this.init();
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
    
    // Set initial state
    this.updateUI(selectorPrefix);
    
    // Button click handler
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown(this.selectorPrefix);
    });

    // Option click handlers
    const options = dropdown.querySelectorAll('.language-selector__option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        const lang = option.getAttribute('data-lang');
        if (lang) {
          this.selectLanguage(lang);
        }
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!button.contains(e.target) && !dropdown.contains(e.target)) {
        this.closeDropdown(this.selectorPrefix);
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown(this.selectorPrefix);
      }
    });
  }

  toggleDropdown(selectorPrefix = '') {
    const prefix = selectorPrefix ? `${selectorPrefix}-` : '';
    const button = document.getElementById(`language-selector-${prefix}btn`);
    const dropdown = document.getElementById(`language-selector-${prefix}dropdown`);
    
    if (!button || !dropdown) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
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
  });
} else {
  window.languageSelectorInstance = new LanguageSelector();
}

