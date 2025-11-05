/**
 * Vehicle Selection Step Controller with Session Persistence
 * 
 * This controller manages the two-step vehicle selection flow:
 * - Step 1: Brand selection
 * - Step 2: Model, Year, and Engine Type selection
 * 
 * Session Persistence:
 * - Uses sessionStorage to preserve selections across page refreshes
 * - State persists during browser session (clears when tab closes)
 * - Selections are restored automatically when returning to the page
 * 
 * Future: Consider localStorage for cross-session persistence
 * or integrate with backend API for permanent storage
 */
class VehicleSelectionController {
  constructor() {
    this.storageKey = 'vehicleSelectionState';
    this.currentStep = 1;
    this.selectedBrand = null;
    this.selectedBrandLogo = null;
    this.selectedModel = null;
    this.selectedYear = null;
    this.selectedEngineType = null;
    this.vehicleData = null; // Store loaded vehicle data
    this.activeNavigationStep = null; // Track which step is active in navigation (null = auto-detect)
    this.previousButtonState = null; // Track previous button state for animation
    this.loadState();
    this.loadVehicleData().then(() => {
      this.init();
    });
  }

  // Load vehicle data from JSON file
  async loadVehicleData() {
    try {
      // Get base path for GitHub Pages subdirectory deployment
      const basePath = window.__basePath || '';
      const jsonPath = basePath + 'assets/data/vehicles.json';
      const response = await fetch(jsonPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.vehicleData = await response.json();
      console.log('Vehicle data loaded successfully');
    } catch (error) {
      console.error('Error loading vehicle data:', error);
      // Fallback to empty data structure
      this.vehicleData = { brands: {} };
    }
  }

  // Save current state to sessionStorage
  saveState() {
    const state = {
      currentStep: this.currentStep,
      selectedBrand: this.selectedBrand,
      selectedBrandLogo: this.selectedBrandLogo,
      selectedModel: this.selectedModel,
      selectedYear: this.selectedYear,
      selectedEngineType: this.selectedEngineType
    };
    sessionStorage.setItem(this.storageKey, JSON.stringify(state));
  }

  // Load state from sessionStorage
  loadState() {
    try {
      // Check for AI-selected vehicle first (highest priority)
      const aiVehicleSelection = sessionStorage.getItem('aiVehicleSelection');
      if (aiVehicleSelection) {
        const aiSelection = JSON.parse(aiVehicleSelection);
        this.selectedBrand = aiSelection.brand;
        this.selectedBrandLogo = aiSelection.logo;
        this.selectedModel = aiSelection.model;
        this.selectedYear = aiSelection.year;
        this.selectedEngineType = null; // Engine type always starts unselected
        this.currentStep = 2; // Go directly to step 2
        // Clear the AI selection flag so it doesn't override manual selections
        sessionStorage.removeItem('aiVehicleSelection');
        return; // Skip loading regular state when AI selection is present
      }
      
      const savedState = sessionStorage.getItem(this.storageKey);
      if (savedState) {
        const state = JSON.parse(savedState);
        this.currentStep = state.currentStep || 1;
        this.selectedBrand = state.selectedBrand || null;
        this.selectedBrandLogo = state.selectedBrandLogo || null;
        this.selectedModel = state.selectedModel || null;
        this.selectedYear = state.selectedYear || null;
        this.selectedEngineType = state.selectedEngineType || null;
      }
    } catch (error) {
      console.error('Error loading vehicle selection state:', error);
      // Reset to defaults on error
      this.currentStep = 1;
      this.selectedBrand = null;
      this.selectedBrandLogo = null;
    }
  }

  // Clear saved state (useful for "New Selection" or reset)
  clearState() {
    sessionStorage.removeItem(this.storageKey);
    this.currentStep = 1;
    this.selectedBrand = null;
    this.selectedBrandLogo = null;
    this.selectedModel = null;
    this.selectedYear = null;
    this.selectedEngineType = null;
  }

  init() {
    this.bindEvents();
    // Restore UI state if we have saved state
    if (this.currentStep === 2 && this.selectedBrand) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        this.updateUI();
      }, 100);
    }
    
    // Listen for language changes and re-render UI
    document.addEventListener('languageChanged', () => {
      if (this.currentStep === 2) {
        this.updateUI();
      }
    });
  }

  bindEvents() {
    // Brand card click handlers
    const brandCards = document.querySelectorAll('.brand-card');
    brandCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const brandName = card.querySelector('.brand-card__name').textContent;
        const brandLogo = card.querySelector('.brand-card__logo img')?.src || null;
        this.selectBrand(brandName, brandLogo);
      });
    });

    // Back button click handler
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        this.goToStep1();
      });
    }
  }

  selectBrand(brandName, brandLogo) {
    this.selectedBrand = brandName;
    this.selectedBrandLogo = brandLogo;
    this.selectedModel = null; // Reset model when brand changes
    this.selectedYear = null; // Reset year when brand changes
    this.selectedEngineType = null; // Reset engine type when brand changes
    this.saveState();
    this.goToStep2();
  }

  selectModel(modelName) {
    this.selectedModel = modelName;
    this.selectedYear = null; // Reset year when model changes
    this.selectedEngineType = null; // Reset engine type when model changes
    this.saveState();
    this.updateUI(); // Refresh UI to show selected model and update year column
  }

  // Helper method to replace SVG img with inline SVG
  async replaceSVGImage(imgElement) {
    try {
      const imgURL = imgElement.src;
      const response = await fetch(imgURL);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch SVG: ${response.status}`);
      }

      const svgText = await response.text();
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      
      const parserError = svgDoc.querySelector('parsererror');
      if (parserError) {
        throw new Error(`SVG parsing error: ${parserError.textContent}`);
      }

      const svgElement = svgDoc.querySelector('svg');
      if (!svgElement) {
        throw new Error('No SVG element found in the file');
      }

      // Preserve attributes from the original image
      const attrs = ['id', 'class', 'alt', 'title', 'width', 'height'];
      attrs.forEach(attrName => {
        const attrValue = imgElement.getAttribute(attrName);
        if (attrValue) {
          svgElement.setAttribute(attrName, attrValue);
        }
      });

      // Replace the image with the SVG
      imgElement.replaceWith(svgElement);
    } catch (error) {
      console.error('Failed to replace SVG image:', error);
    }
  }

  // Create a selection tile element
  async createSelectionTile(tile) {
    const tileElement = document.createElement('div');
    tileElement.className = `selection-tile selection-tile--${tile.state}`;
    
    // Create badge
    const badge = document.createElement('div');
    badge.className = `badge badge--${tile.badgeVariant.toLowerCase()}`;
    const badgeContent = document.createElement('div');
    badgeContent.className = 'badge__content';
    
    if (tile.badgeVariant === 'Success') {
      // Success badge shows checkmark icon
      const badgeIcon = document.createElement('div');
      badgeIcon.className = 'badge__icon';
      badgeIcon.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      badgeContent.appendChild(badgeIcon);
    } else {
      // Default and Disabled badges show text
      const badgeText = document.createElement('span');
      badgeText.className = 'badge__text';
      badgeText.textContent = tile.badgeText;
      badgeContent.appendChild(badgeText);
    }
    
    badge.appendChild(badgeContent);
    tileElement.appendChild(badge);
    
    // Create content
    const content = document.createElement('div');
    content.className = 'selection-tile__content';
    
    const label = document.createElement('p');
    label.className = 'selection-tile__label';
    label.textContent = tile.label;
    
    const subtext = document.createElement('p');
    subtext.className = 'selection-tile__subtext';
    subtext.textContent = tile.subtext;
    
    content.appendChild(label);
    content.appendChild(subtext);
    tileElement.appendChild(content);
    
    // Create arrow right icon - only for active state
    if (tile.state === 'active') {
      const arrowIcon = document.createElement('div');
      arrowIcon.className = 'selection-tile__chevron';
      const arrowImg = document.createElement('img');
      const basePath = window.__basePath || '';
      arrowImg.src = basePath + 'assets/icons/arrow-right.svg';
      arrowImg.className = 'svg icon';
      arrowImg.alt = 'Arrow right';
      arrowImg.width = 24;
      arrowImg.height = 24;
      arrowIcon.appendChild(arrowImg);
      tileElement.appendChild(arrowIcon);
      
      // Replace the img with inline SVG immediately
      await this.replaceSVGImage(arrowImg);
    }
    
    return tileElement;
  }

  // Create a small variant selection tile (no badge, no chevron)
  createSmallSelectionTile(tile) {
    const tileElement = document.createElement('div');
    tileElement.className = `selection-tile selection-tile--small selection-tile--${tile.state}`;
    
    // Small tiles only have content (no badge, no chevron)
    const content = document.createElement('div');
    content.className = 'selection-tile__content';
    
    const label = document.createElement('p');
    label.className = 'selection-tile__label';
    label.textContent = tile.label;
    
    const subtext = document.createElement('p');
    subtext.className = 'selection-tile__subtext';
    subtext.textContent = tile.subtext;
    
    content.appendChild(label);
    content.appendChild(subtext);
    tileElement.appendChild(content);
    
    return tileElement;
  }

  goToStep1() {
    this.currentStep = 1;
    // Don't clear brand selection, just go back to step 1
    this.saveState();
    this.updateUI();
  }

  goToStep2() {
    this.currentStep = 2;
    this.saveState();
    this.updateUI();
  }

  updateUI() {
    const header = document.querySelector('.vehicle-selection__header');
    const step1Content = document.querySelector('.vehicle-selection__brands');
    const step2Content = document.getElementById('step2-content');

    if (this.currentStep === 1) {
      // Show Step 1: Brand selection
      header.className = 'vehicle-selection__header';
      step1Content.style.display = 'block';
      step2Content.style.display = 'none';
      
      // Restore original header content if it was changed
      // Check if header currently has only back button
      if (header.querySelector('.back-button') && !header.querySelector('.action-buttons')) {
        // Reload page to restore original header (Nunjucks components)
        // TODO: In future, cache original header HTML to avoid reload
        window.location.reload();
      }
    } else {
      // Show Step 2: Model/Year selection
      header.className = 'vehicle-selection__header vehicle-selection__header--step2';
      step1Content.style.display = 'none';
      step2Content.style.display = 'flex';
      
      // Create reset button dynamically
      const resetText = window.t ? window.t('vehicleSelection.reset') : 'Reset';
      const basePath = window.__basePath || '';
      header.innerHTML = `
        <button class="button button--outlined back-button" id="back-button" aria-label="${resetText} to brand selection">
          <img src="${basePath}assets/icons/restart.svg" class="svg icon" alt="${resetText}" width="24" height="24">
          ${resetText}
        </button>
      `;
      
      // Replace SVG image with inline SVG for proper styling
      const resetIcon = header.querySelector('#back-button img.svg');
      if (resetIcon) {
        this.replaceSVGImage(resetIcon);
      }
      
      // Re-bind events for the back button
      this.bindEvents();
      
      // Update step 2 Control column with brand logo and selection tiles
      const controlContainer = step2Content.querySelector('.step2-container--control');
      if (controlContainer) {
        // Clear existing content (except structure)
        const existingLogo = controlContainer.querySelector('.step2-brand-logo');
        const existingTiles = controlContainer.querySelector('.step2-selection-tiles');
        const existingPlaceholder = controlContainer.querySelector('.step2-placeholder');
        
        if (existingLogo) existingLogo.remove();
        if (existingTiles) existingTiles.remove();
        if (existingPlaceholder) existingPlaceholder.remove();
        
        // Create brand logo section at the top
        if (this.selectedBrandLogo) {
          const brandLogoSection = document.createElement('div');
          brandLogoSection.className = 'step2-brand-logo';
          
          const brandLogoImg = document.createElement('img');
          brandLogoImg.src = this.selectedBrandLogo;
          brandLogoImg.alt = `${this.selectedBrand} logo`;
          brandLogoImg.className = 'step2-brand-logo__image';
          brandLogoSection.appendChild(brandLogoImg);
          
          controlContainer.appendChild(brandLogoSection);
        }
        
        // Create selection tiles container
        const tilesContainer = document.createElement('div');
        tilesContainer.className = 'step2-selection-tiles selection-tile-container';
        
        // Get active step to determine tile states
        const activeStep = this.getActiveStep();
        
        // Create 4 selection tiles with dynamic states
        // Badge shows Success if selection exists (even when active), Default if no selection, Disabled if not available
        const tiles = [
          { 
            label: 'Brand', 
            subtext: this.selectedBrand || '', 
            state: activeStep === 'brand' ? 'active' : (this.selectedBrand ? 'completed' : 'active'), 
            badgeText: '1', 
            badgeVariant: this.selectedBrand ? 'Success' : 'Default',
            step: 'brand'
          },
          { 
            label: 'Model', 
            subtext: this.selectedModel || '', 
            state: activeStep === 'model' ? 'active' : (this.selectedModel ? 'completed' : 'active'), 
            badgeText: '2', 
            badgeVariant: this.selectedModel ? 'Success' : 'Default',
            step: 'model'
          },
          { 
            label: 'Year', 
            subtext: this.selectedYear || '', 
            state: activeStep === 'year' ? 'active' : (this.selectedModel && activeStep !== 'model' ? (this.selectedYear ? 'completed' : 'active') : 'disabled'), 
            badgeText: '3', 
            badgeVariant: this.selectedYear ? 'Success' : (this.selectedModel && activeStep !== 'model' ? 'Default' : 'Disabled'),
            step: 'year'
          },
          { 
            label: 'Engine type', 
            subtext: this.selectedEngineType || '', 
            state: activeStep === 'engineType' ? 'active' : (this.selectedYear && activeStep !== 'model' && activeStep !== 'year' ? (this.selectedEngineType ? 'completed' : 'active') : 'disabled'), 
            badgeText: '4', 
            badgeVariant: this.selectedEngineType ? 'Success' : (this.selectedYear && activeStep !== 'model' && activeStep !== 'year' ? 'Default' : 'Disabled'),
            step: 'engineType'
          }
        ];
        
        // Create tiles asynchronously and add them when ready
        const tilePromises = tiles.map(async (tile) => {
          const tileElement = await this.createSelectionTile(tile);
          
          // Add click handler to navigate to this step (if not disabled)
          if (tile.state !== 'disabled') {
            tileElement.style.cursor = 'pointer';
            tileElement.addEventListener('click', () => {
              this.navigateToStep(tile.step);
            });
          }
          
          return tileElement;
        });
        
        Promise.all(tilePromises).then(tileElements => {
          tileElements.forEach(tileElement => {
            tilesContainer.appendChild(tileElement);
          });
          // Append container after tiles are ready
          controlContainer.appendChild(tilesContainer);
        });
      }
      
      // Update step 2 Selection column - shows the ACTIVE selection step
      const selectionContainer = step2Content.querySelector('.step2-container--selection');
      if (selectionContainer && this.vehicleData && this.selectedBrand) {
        // Clear existing content
        selectionContainer.innerHTML = '';
        
        // Determine which step is active based on current state
        let activeStep = this.getActiveStep();
        
        // Show appropriate content based on active step
        if (activeStep === 'model') {
          this.renderModelSelection(selectionContainer);
        } else if (activeStep === 'year') {
          this.renderYearSelection(selectionContainer);
        } else if (activeStep === 'engineType') {
          this.renderEngineTypeSelection(selectionContainer);
        }
      }
      
      // Update step 2 Summary column - shows summary of selections made
      const summaryContainer = step2Content.querySelector('.step2-container--summary');
      if (summaryContainer) {
        // Check if all selections are complete
        const allComplete = !!(this.selectedBrand && 
                               this.selectedModel && 
                               this.selectedYear && 
                               this.selectedEngineType);
        
        if (allComplete && this.selectedBrand) {
          // Show and render summary when all selections are complete
          summaryContainer.classList.add('step2-container--summary--visible');
          this.renderSelectionSummary(summaryContainer);
        } else {
          // Hide summary when selections are incomplete
          summaryContainer.classList.remove('step2-container--summary--visible');
          // Render banner instead of summary
          this.renderSelectionBanner(summaryContainer);
        }
      }
    }
  }

  // Render model selection in Selection column
  renderModelSelection(container) {
    container.innerHTML = '';
    
    const brandData = this.vehicleData.brands[this.selectedBrand];
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'step2-selection__title step2-selection__title--animate';
    title.textContent = window.t ? window.t('vehicleSelection.chooseModel') : 'Choose model:';
    container.appendChild(title);
    
    // Create wrapper for tiles to allow button to stay at bottom
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'step2-selection-content';
    
    if (!brandData || !brandData.models) {
      const placeholder = document.createElement('div');
      placeholder.className = 'step2-placeholder';
      const noModelsText = window.t ? window.t('vehicleSelection.noModelsFound') : 'No models found for';
      placeholder.innerHTML = `<p>${noModelsText} ${this.selectedBrand}</p>`;
      contentWrapper.appendChild(placeholder);
      container.appendChild(contentWrapper);
      return;
    }
    
    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'selection-tile-container';
    
    const modelNames = Object.keys(brandData.models).sort();
    
    modelNames.forEach((modelName, index) => {
      const modelData = brandData.models[modelName];
      const tileState = this.selectedModel === modelName ? 'active' : 'completed';
      
      const years = modelData.years || [];
      const yearRange = years.length > 0 
        ? `${Math.min(...years)}-${Math.max(...years)}`
        : '';
      
      const tile = {
        label: modelName,
        subtext: yearRange,
        state: tileState
      };
      
      const tileElement = this.createSmallSelectionTile(tile);
      tileElement.classList.add('step2-selection-tile--animate');
      tileElement.style.animationDelay = `${0.1 + (index * 0.05)}s`;
      tileElement.addEventListener('click', () => {
        this.selectModel(modelName);
      });
      
      tilesContainer.appendChild(tileElement);
    });
    
    contentWrapper.appendChild(tilesContainer);
    container.appendChild(contentWrapper);
  }

  // Render year selection in Selection column
  renderYearSelection(container) {
    container.innerHTML = '';
    
    const brandData = this.vehicleData.brands[this.selectedBrand];
    const modelData = brandData?.models?.[this.selectedModel];
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'step2-selection__title step2-selection__title--animate';
    title.textContent = window.t ? window.t('vehicleSelection.chooseYear') : 'Choose year:';
    container.appendChild(title);
    
    // Create wrapper for tiles to allow button to stay at bottom
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'step2-selection-content';
    
    if (!modelData || !modelData.years || modelData.years.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'step2-placeholder';
      const noYearsText = window.t ? window.t('vehicleSelection.noYearsFound') : 'No years found for';
      placeholder.innerHTML = `<p>${noYearsText} ${this.selectedModel}</p>`;
      contentWrapper.appendChild(placeholder);
      container.appendChild(contentWrapper);
      return;
    }
    
    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'selection-tile-container';
    
    const sortedYears = [...modelData.years].sort((a, b) => b - a);
    
    sortedYears.forEach((year, index) => {
      const tileState = this.selectedYear === year ? 'active' : 'completed';
      
      const tile = {
        label: year.toString(),
        subtext: '',
        state: tileState
      };
      
      const tileElement = this.createSmallSelectionTile(tile);
      tileElement.classList.add('step2-selection-tile--animate');
      tileElement.style.animationDelay = `${0.1 + (index * 0.05)}s`;
      tileElement.addEventListener('click', () => {
        this.selectYear(year);
      });
      
      tilesContainer.appendChild(tileElement);
    });
    
    contentWrapper.appendChild(tilesContainer);
    container.appendChild(contentWrapper);
  }

  // Render engine type selection in Selection column
  renderEngineTypeSelection(container) {
    container.innerHTML = '';
    
    const brandData = this.vehicleData.brands[this.selectedBrand];
    const modelData = brandData?.models?.[this.selectedModel];
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'step2-selection__title step2-selection__title--animate';
    title.textContent = window.t ? window.t('vehicleSelection.chooseEngineType') : 'Choose engine type:';
    container.appendChild(title);
    
    // Create wrapper for tiles to allow button to stay at bottom
    const contentWrapper = document.createElement('div');
    contentWrapper.className = 'step2-selection-content';
    
    if (!modelData || !modelData.engineTypes || modelData.engineTypes.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.className = 'step2-placeholder';
      const noEngineTypesText = window.t ? window.t('vehicleSelection.noEngineTypesFound') : 'No engine types found for';
      placeholder.innerHTML = `<p>${noEngineTypesText} ${this.selectedModel}</p>`;
      contentWrapper.appendChild(placeholder);
      container.appendChild(contentWrapper);
      return;
    }
    
    const tilesContainer = document.createElement('div');
    tilesContainer.className = 'selection-tile-container';
    
    modelData.engineTypes.forEach((engineType, index) => {
      const tileState = this.selectedEngineType === engineType ? 'active' : 'completed';
      
      const tile = {
        label: engineType,
        subtext: '',
        state: tileState
      };
      
      const tileElement = this.createSmallSelectionTile(tile);
      tileElement.classList.add('step2-selection-tile--animate');
      tileElement.style.animationDelay = `${0.1 + (index * 0.05)}s`;
      tileElement.addEventListener('click', () => {
        this.selectEngineType(engineType);
      });
      
      tilesContainer.appendChild(tileElement);
    });
    
    contentWrapper.appendChild(tilesContainer);
    container.appendChild(contentWrapper);
  }

  // Render selection summary in Summary column
  renderSelectionSummary(container) {
    container.innerHTML = '';
    
    // Add title
    const title = document.createElement('h2');
    title.className = 'step2-summary__title step2-summary__title--animate';
    title.textContent = window.t ? window.t('vehicleSelection.selectionSummary') : 'Selection summary:';
    container.appendChild(title);
    
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'step2-summary';
    
    // Always show brand if selected
    if (this.selectedBrand) {
      const brandItem = document.createElement('div');
      brandItem.className = 'step2-summary__item step2-summary__item--animate';
      brandItem.style.animationDelay = '0.1s';
      const brandLabel = window.t ? window.t('vehicleSelection.brand') : 'Brand';
      brandItem.innerHTML = `
        <div class="step2-summary__label">${brandLabel}</div>
        <div class="step2-summary__value">${this.selectedBrand}</div>
      `;
      summaryContainer.appendChild(brandItem);
    }
    
    // Show model if selected
    if (this.selectedModel) {
      const modelItem = document.createElement('div');
      modelItem.className = 'step2-summary__item step2-summary__item--animate';
      modelItem.style.animationDelay = '0.2s';
      const modelLabel = window.t ? window.t('vehicleSelection.model') : 'Model';
      modelItem.innerHTML = `
        <div class="step2-summary__label">${modelLabel}</div>
        <div class="step2-summary__value">${this.selectedModel}</div>
      `;
      summaryContainer.appendChild(modelItem);
    }
    
    // Show year if selected
    if (this.selectedYear) {
      const yearItem = document.createElement('div');
      yearItem.className = 'step2-summary__item step2-summary__item--animate';
      yearItem.style.animationDelay = '0.3s';
      const yearLabel = window.t ? window.t('vehicleSelection.year') : 'Year';
      yearItem.innerHTML = `
        <div class="step2-summary__label">${yearLabel}</div>
        <div class="step2-summary__value">${this.selectedYear}</div>
      `;
      summaryContainer.appendChild(yearItem);
    }
    
    // Show engine type if selected
    if (this.selectedEngineType) {
      const engineItem = document.createElement('div');
      engineItem.className = 'step2-summary__item step2-summary__item--animate';
      engineItem.style.animationDelay = '0.4s';
      const engineTypeLabel = window.t ? window.t('vehicleSelection.engineType') : 'Engine Type';
      engineItem.innerHTML = `
        <div class="step2-summary__label">${engineTypeLabel}</div>
        <div class="step2-summary__value">${this.selectedEngineType}</div>
      `;
      summaryContainer.appendChild(engineItem);
    }
    
    // Show placeholder if nothing is selected yet
    if (!this.selectedBrand) {
      const placeholder = document.createElement('div');
      placeholder.className = 'step2-placeholder';
      placeholder.innerHTML = `<p>Your selections will appear here</p>`;
      summaryContainer.appendChild(placeholder);
    }
    
    container.appendChild(summaryContainer);
    
    // Add confirmation button after summary items
    this.renderConfirmationButton(container);
  }

  // Render banner in Summary column when selections are incomplete
  async renderSelectionBanner(container) {
    container.innerHTML = '';
    
    const banner = document.createElement('div');
    banner.className = 'step2-banner';
    
    const bannerText = window.t ? window.t('vehicleSelection.bannerText') : 'Choose Model, Year and Engine type to proceed.';
    const proTip = window.t ? window.t('vehicleSelection.proTip') : 'Pro tip,';
    const proTipText = window.t ? window.t('vehicleSelection.proTipText') : 'If you need help with vehicle selection, try using the photo recognition with AI Assistant';
    
    const basePath = window.__basePath || '';
    banner.innerHTML = `
      <div class="step2-banner__content">
        <p class="step2-banner__text">${bannerText}</p>
        <div class="step2-banner__pro-tip">
          <img src="${basePath}assets/icons/info.svg" alt="Info" class="svg icon step2-banner__pro-tip-icon" width="20" height="20">
          <div class="step2-banner__pro-tip-content">
            <span class="step2-banner__pro-tip-label">${proTip}</span>
            <p class="step2-banner__pro-tip-text">
              ${proTipText} <a href="#" class="step2-banner__ai-link" id="banner-ai-link">${window.t ? window.t('vehicleSelection.aiAssistantLink') : 'AI Assistant'}</a>.
            </p>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(banner);
    
    // Replace SVG image with inline SVG for proper styling
    const infoIcon = banner.querySelector('.step2-banner__pro-tip-icon');
    if (infoIcon) {
      await this.replaceSVGImage(infoIcon);
    }
    
    // Add click handler for AI Assistant link
    const aiLink = banner.querySelector('#banner-ai-link');
    if (aiLink) {
      aiLink.addEventListener('click', (e) => {
        e.preventDefault();
        // Open AI Assistant drawer (same as FAB)
        if (window.aiAssistant && typeof window.aiAssistant.open === 'function') {
          window.aiAssistant.open();
        } else {
          // Fallback: trigger FAB click
          const fab = document.querySelector('.ai-fab');
          if (fab) {
            fab.click();
          }
        }
      });
    }
  }

  // Render confirmation button in Summary column
  renderConfirmationButton(container) {
    // Check if all selections are complete (convert to boolean)
    const allComplete = !!(this.selectedBrand && 
                           this.selectedModel && 
                           this.selectedYear && 
                           this.selectedEngineType);
    
    // Check previous state before removing existing button
    const existingButton = container.querySelector('.step2-confirmation-button');
    let wasDisabled = false;
    
    if (existingButton) {
      // Check actual button state
      wasDisabled = existingButton.disabled || existingButton.classList.contains('button--disabled');
    } else {
      // If no existing button, check our tracked state
      // Only treat as disabled if previousState was explicitly false (not null)
      wasDisabled = this.previousButtonState === false;
    }
    
    // Detect if button just transitioned from disabled to enabled
    const isNowEnabled = allComplete === true;
    const shouldAnimate = wasDisabled && isNowEnabled;
    
    // Debug logging
    console.log('renderConfirmationButton:', {
      allComplete,
      previousState: this.previousButtonState,
      wasDisabled,
      isNowEnabled,
      shouldAnimate,
      existingButton: !!existingButton
    });
    
    // Remove any existing button container first
    const existingButtonContainer = container.querySelector('.step2-confirmation-button-container');
    if (existingButtonContainer) {
      existingButtonContainer.remove();
    }
    
    // Update previous state AFTER checking but BEFORE creating new button
    const previousStateBeforeUpdate = this.previousButtonState;
    this.previousButtonState = allComplete;
    
    // Create button container
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'step2-confirmation-button-container step2-confirmation-button-container--animate';
    buttonContainer.style.animationDelay = '0.5s';
    
    // Create confirmation button
    const confirmButton = document.createElement('button');
    const buttonClasses = `button button--filled step2-confirmation-button${!allComplete ? ' button--disabled' : ''}`;
    
    confirmButton.className = buttonClasses;
    confirmButton.textContent = window.t ? window.t('vehicleSelection.confirmSelection') : 'Confirm selection';
    confirmButton.disabled = !allComplete;
    confirmButton.setAttribute('aria-label', 'Confirm vehicle selection');
    
    // Add click handler
    confirmButton.addEventListener('click', () => {
      this.handleConfirmation();
    });
    
    buttonContainer.appendChild(confirmButton);
    container.appendChild(buttonContainer);
    
    // Add animation class after DOM is updated (for transition detection)
    if (shouldAnimate) {
      console.log('Button animation triggered: wasDisabled =', wasDisabled, 'isNowEnabled =', isNowEnabled);
      // Use requestAnimationFrame to ensure button is rendered before animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Small additional delay to ensure button is fully rendered
          setTimeout(() => {
            confirmButton.classList.add('step2-confirmation-button--pulse');
            console.log('Animation class added');
            
            // Remove animation class after animation completes
            confirmButton.addEventListener('animationend', () => {
              confirmButton.classList.remove('step2-confirmation-button--pulse');
              console.log('Animation completed');
            }, { once: true });
          }, 50);
        });
      });
    }
  }

  // Handle confirmation button click
  handleConfirmation() {
    // TODO: Implement confirmation logic
    console.log('Vehicle selection confirmed:', {
      brand: this.selectedBrand,
      model: this.selectedModel,
      year: this.selectedYear,
      engineType: this.selectedEngineType
    });
    // In the future, this could:
    // - Navigate to next step/screen
    // - Submit data to backend
    // - Show success message
    // etc.
  }

  // Get the currently active step based on selections or manual navigation
  getActiveStep() {
    // If manually set via navigation, use that
    if (this.activeNavigationStep) {
      return this.activeNavigationStep;
    }
    
    // Otherwise auto-detect based on selections
    if (!this.selectedModel) {
      return 'model';
    } else if (!this.selectedYear) {
      return 'year';
    } else if (!this.selectedEngineType) {
      return 'engineType';
    } else {
      // All selections complete - stay on engine type (last step)
      return 'engineType';
    }
  }

  // Navigate to a specific step (allows going back)
  navigateToStep(step) {
    if (step === 'brand') {
      // Go back to Step 1 (brand selection)
      this.selectedBrand = null;
      this.selectedBrandLogo = null;
      this.selectedModel = null;
      this.selectedYear = null;
      this.selectedEngineType = null;
      this.activeNavigationStep = null;
      this.currentStep = 1;
      this.saveState();
      this.updateUI();
    } else if (step === 'model') {
      // Go to model selection, reset downstream
      this.selectedModel = null;
      this.selectedYear = null;
      this.selectedEngineType = null;
      this.activeNavigationStep = 'model';
      this.saveState();
      this.updateUI();
    } else if (step === 'year') {
      // Go to year selection, reset downstream
      this.selectedYear = null;
      this.selectedEngineType = null;
      this.activeNavigationStep = 'year';
      this.saveState();
      this.updateUI();
    } else if (step === 'engineType') {
      // Go to engine type selection
      this.selectedEngineType = null;
      this.activeNavigationStep = 'engineType';
      this.saveState();
      this.updateUI();
    }
  }

  selectModel(modelName) {
    this.selectedModel = modelName;
    this.selectedYear = null; // Reset year when model changes
    this.selectedEngineType = null; // Reset engine type when model changes
    this.activeNavigationStep = null; // Clear manual navigation, auto-detect next step
    this.saveState();
    this.updateUI(); // Refresh UI to show selected model and update year column
  }

  selectYear(year) {
    this.selectedYear = year;
    this.selectedEngineType = null; // Reset engine type when year changes
    this.activeNavigationStep = null; // Clear manual navigation, auto-detect next step
    this.saveState();
    this.updateUI(); // Refresh UI to show selected year and update columns
  }

  selectEngineType(engineType) {
    this.selectedEngineType = engineType;
    this.activeNavigationStep = null; // Clear manual navigation
    this.saveState();
    this.updateUI(); // Refresh UI to show selected engine type
  }
}

// Initialize when DOM is ready
let vehicleSelectionController = null;
document.addEventListener('DOMContentLoaded', () => {
  vehicleSelectionController = new VehicleSelectionController();
  // Make it globally accessible for AI assistant integration
  window.vehicleSelectionController = vehicleSelectionController;
});
