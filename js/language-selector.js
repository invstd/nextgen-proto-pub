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

  init() {
    const button = document.getElementById('language-selector-btn');
    const dropdown = document.getElementById('language-selector-dropdown');
    const currentLabel = document.getElementById('language-selector-current');
    
    if (!button || !dropdown || !currentLabel) {
      console.warn('Language selector elements not found');
      return;
    }

    // Set initial state
    this.updateUI();
    
    // Button click handler
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleDropdown();
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
        this.closeDropdown();
      }
    });

    // Close dropdown on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeDropdown();
      }
    });
  }

  toggleDropdown() {
    const button = document.getElementById('language-selector-btn');
    const dropdown = document.getElementById('language-selector-dropdown');
    
    if (!button || !dropdown) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    
    if (isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    const button = document.getElementById('language-selector-btn');
    const dropdown = document.getElementById('language-selector-dropdown');
    
    if (!button || !dropdown) return;

    button.setAttribute('aria-expanded', 'true');
    dropdown.setAttribute('aria-hidden', 'false');
  }

  closeDropdown() {
    const button = document.getElementById('language-selector-btn');
    const dropdown = document.getElementById('language-selector-dropdown');
    
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
    this.updateUI();
    this.closeDropdown();
    
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

  updateUI() {
    const currentLabel = document.getElementById('language-selector-current');
    const options = document.querySelectorAll('.language-selector__option');
    
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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LanguageSelector();
  });
} else {
  new LanguageSelector();
}

