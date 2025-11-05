// AI Assistant Controller
class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.isFullscreen = false;
        this.overlay = null;
        this.assistant = null;
        this.currentFilter = 'web'; // Default filter mode
        this.currentResponseData = null; // Store current response data
        this.currentResponseElement = null; // Store current response element
        
        this.init();
    }

    init() {
        // Create overlay
        this.createOverlay();
        
        // Create AI assistant element
        this.createAssistant();
        
        // Add event listeners
        this.addEventListeners();
        
        // Add new chat button listener
        this.addNewChatListener();
        
        // Add camera functionality
        this.addCameraListeners();
        
        // Listen for language changes
        document.addEventListener('languageChanged', () => {
            this.updateTranslations();
        });
        
        console.log('AI Assistant: Initialized');
    }
    
    updateTranslations() {
        // Update welcome message if it exists
        const welcome = document.querySelector('.ai-assistant__welcome');
        if (welcome) {
            const welcomeTitle = welcome.querySelector('.ai-assistant__welcome-title');
            const welcomeText = welcome.querySelector('.ai-assistant__welcome-text');
            if (welcomeTitle && window.t) {
                welcomeTitle.textContent = window.t('aiAssistant.welcomeTitle');
            }
            if (welcomeText && window.t) {
                welcomeText.textContent = window.t('aiAssistant.welcomeText');
            }
        }
        
        // Update any active processing states
        const processingState = document.getElementById('ai-processing-state');
        if (processingState && window.t) {
            const currentState = processingState.className.includes('searching') ? 'searching' :
                                processingState.className.includes('answering') ? 'answering' :
                                processingState.className.includes('finished') ? 'finished' : null;
            if (currentState) {
                const states = {
                    'searching': window.t('aiAssistant.searching'),
                    'answering': window.t('aiAssistant.answering'),
                    'finished': window.t('aiAssistant.done')
                };
                processingState.textContent = states[currentState];
            }
        }
    }
    
    parseVehicleFromPhotoAnalysis(messageElement) {
        // Extract vehicle info from the AI message
        // Format: "This is a photo of [Brand] [Model] [Year]"
        const content = messageElement.querySelector('.ai-message__content');
        if (!content) return null;
        
        const firstParagraph = content.querySelector('p');
        if (!firstParagraph) return null;
        
        const text = firstParagraph.textContent.trim();
        // Pattern: "This is a photo of" or "Dies ist ein Foto von" followed by brand model year
        const photoText = window.t ? window.t('aiAssistant.photoAnalysis') : 'This is a photo of';
        const match = text.match(new RegExp(photoText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s+(.+?)\\s+(\\d{4})', 'i'));
        
        if (match) {
            const brandModelPart = match[1].trim(); // "Fiat 500"
            const year = match[2]; // "2025"
            
            // Split brand and model (assume first word is brand, rest is model)
            const parts = brandModelPart.split(' ');
            const brand = parts[0]; // "Fiat"
            const model = parts.slice(1).join(' '); // "500"
            
            // Get logo path (standardize brand name for path)
            const brandLogoPath = this.getBrandLogoPath(brand);
            
            return {
                brand: brand,
                model: model,
                year: year,
                logo: brandLogoPath
            };
        }
        
        return null;
    }
    
    getBrandLogoPath(brandName) {
        // Map brand names to their logo paths
        // Standardize brand name (lowercase, replace spaces with hyphens)
        const normalizedBrand = brandName.toLowerCase().replace(/\s+/g, '-');
        // Get base path for GitHub Pages subdirectory deployment
        const basePath = window.__basePath || '';
        return basePath + `assets/brands/${normalizedBrand}.png`;
    }
    
    selectVehicleFromAI(brand, model, year, logo) {
        // Close the AI assistant
        this.close();
        
        // Check if we're on the vehicle selection page
        const isVehicleSelectionPage = document.querySelector('.vehicle-selection') !== null;
        
        if (!isVehicleSelectionPage) {
            // Navigate to vehicle selection page
            window.location.href = '/vehicle-selection/';
            // Note: The selections will be set after page loads via URL params or sessionStorage
            // For now, we'll use sessionStorage that the controller will pick up
            sessionStorage.setItem('aiVehicleSelection', JSON.stringify({
                brand: brand,
                model: model,
                year: year,
                logo: logo
            }));
            return;
        }
        
        // We're already on the vehicle selection page
        // Wait a bit for the controller to be ready if it's not yet
        const applySelection = () => {
            if (window.vehicleSelectionController) {
                const controller = window.vehicleSelectionController;
                
                // Wait for vehicle data to be loaded
                if (!controller.vehicleData) {
                    setTimeout(applySelection, 100);
                    return;
                }
                
                // Set the selections sequentially
                // First, set brand and logo
                controller.selectBrand(brand, logo);
                
                // Wait for UI to update and data to be ready, then set model
                setTimeout(() => {
                    // Verify the brand exists in vehicle data
                    if (controller.vehicleData && controller.vehicleData.brands && controller.vehicleData.brands[brand]) {
                        controller.selectModel(model);
                        
                        // Wait for UI to update, then set year
                        setTimeout(() => {
                            // Verify model exists and has the year
                            const brandData = controller.vehicleData.brands[brand];
                            if (brandData && brandData.models && brandData.models[model]) {
                                const modelData = brandData.models[model];
                                const years = modelData.years || [];
                                if (years.includes(parseInt(year))) {
                                    controller.selectYear(year);
                                    
                                    // The UI will automatically show engine type selection as the next step
                                    console.log('AI Assistant: Vehicle selection applied successfully');
                                } else {
                                    console.warn('AI Assistant: Year not found for model, using available years');
                                    if (years.length > 0) {
                                        controller.selectYear(years[0].toString());
                                    }
                                }
                            } else {
                                console.warn('AI Assistant: Model not found in vehicle data');
                            }
                        }, 150);
                    } else {
                        console.warn('AI Assistant: Brand not found in vehicle data, trying again...');
                        setTimeout(applySelection, 200);
                    }
                }, 150);
            } else {
                // Controller not ready yet, try again
                setTimeout(applySelection, 100);
            }
        };
        
        // Start applying selection after a short delay to ensure everything is ready
        setTimeout(applySelection, 100);
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'ai-assistant-overlay';
        this.overlay.id = 'ai-assistant-overlay';
        document.body.appendChild(this.overlay);
    }

    createAssistant() {
        // This will be populated by the Nunjucks template
        this.assistant = document.getElementById('ai-assistant');
        if (!this.assistant) {
            console.warn('AI Assistant: Assistant element not found');
            return;
        }
    }

    addEventListeners() {
        // FAB click to open
        const fab = document.querySelector('.ai-fab');
        if (fab) {
            fab.addEventListener('click', () => this.open());
        }

        // Close button
        const closeBtn = document.getElementById('ai-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Expand/collapse button
        const expandBtn = document.getElementById('ai-expand-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Overlay click to close
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.close());
        }

        // Input field enter key
        const inputField = document.getElementById('ai-input-field');
        if (inputField) {
            inputField.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSubmit();
                }
            });
        }

        // Submit button
        const submitBtn = document.getElementById('ai-submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.handleSubmit());
        }

        // Voice button (placeholder)
        const voiceBtn = document.getElementById('ai-voice-btn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.handleVoice());
        }

        // Image button (placeholder)
        const imageBtn = document.getElementById('ai-image-btn');
        if (imageBtn) {
            imageBtn.addEventListener('click', () => this.handleImage());
        }

        // Filter chip buttons
        this.addFilterListeners();
    }

    open() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.assistant.classList.add('ai-assistant--open');
        this.overlay.classList.add('ai-assistant-overlay--visible');
        
        // Focus input field
        setTimeout(() => {
            const inputField = document.getElementById('ai-input-field');
            if (inputField) {
                inputField.focus();
            }
        }, 300);
        
        console.log('AI Assistant: Opened');
    }

    close() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.isFullscreen = false;
        this.assistant.classList.remove('ai-assistant--open', 'ai-assistant--fullscreen');
        this.overlay.classList.remove('ai-assistant-overlay--visible');
        
        console.log('AI Assistant: Closed');
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        
        if (this.isFullscreen) {
            this.assistant.classList.add('ai-assistant--fullscreen');
        } else {
            this.assistant.classList.remove('ai-assistant--fullscreen');
        }
        
        console.log('AI Assistant: Fullscreen toggled:', this.isFullscreen);
    }

    handleSubmit() {
        const inputField = document.getElementById('ai-input-field');
        const message = inputField.value.trim();
        
        if (!message) return;
        
        console.log('AI Assistant: Submitting message:', message);
        
        // Add user message to conversation
        this.addMessage('user', message);
        
        // Clear input
        inputField.value = '';
        
        // Start AI processing with states
        this.startAIProcessing(message);
    }

    handleVoice() {
        console.log('AI Assistant: Voice input requested');
        // Placeholder for voice input functionality
        alert('Voice input feature coming soon!');
    }

    handleImage() {
        console.log('AI Assistant: Image upload requested');
        // Placeholder for image upload functionality
        alert('Image upload feature coming soon!');
    }

    addMessage(type, content) {
        const conversation = document.getElementById('ai-conversation');
        if (!conversation) return;
        
        // Remove welcome message if it exists
        const welcome = conversation.querySelector('.ai-assistant__welcome');
        if (welcome) {
            welcome.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ai-message--${type}`;
        
        if (type === 'user') {
            messageDiv.innerHTML = `
                <div class="ai-message__content">
                    <p>${content}</p>
                </div>
            `;
        } else {
            const basePath = window.__basePath || '';
            messageDiv.innerHTML = `
            <div class="ai-message__avatar">
                <img src="${basePath}assets/icons/ai-assistant-icon.svg" alt="AI Assistant" width="24" height="24" class="ai-icon ai-icon--small">
            </div>
                <div class="ai-message__content">
                    <p>${content}</p>
                </div>
            `;
        }
        
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
    }

    addFilterListeners() {
        const filterButtons = document.querySelectorAll('.ai-assistant__filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.setFilterMode(mode);
            });
        });
    }

    setFilterMode(mode) {
        // Update current filter
        this.currentFilter = mode;
        
        // Update button states (radio button behavior)
        const filterButtons = document.querySelectorAll('.ai-assistant__filter-btn');
        filterButtons.forEach(button => {
            button.classList.remove('ai-assistant__filter-btn--active');
            if (button.dataset.mode === mode) {
                button.classList.add('ai-assistant__filter-btn--active');
            }
        });
        
        console.log('AI Assistant: Filter mode changed to:', mode);
        
        // Apply filter to existing results (if any)
        this.updateExistingResults();
    }

    updateExistingResults() {
        // If we have existing results, update them based on new filter
        if (this.currentResponseData && this.currentResponseElement) {
            console.log('AI Assistant: Updating existing results for filter:', this.currentFilter);
            
            // Generate new response data for the current filter
            const newResponseData = this.generateAIResponse(''); // Use empty string since we're just switching filters
            
            // Update the summary section
            const summaryElement = this.currentResponseElement.querySelector('.ai-summary');
            if (summaryElement) {
                summaryElement.innerHTML = `
                    <h2 class="ai-summary__title">${newResponseData.summary.title}</h2>
                    <ul class="ai-summary__bullets">
                        ${newResponseData.summary.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                    </ul>
                    <div class="ai-summary__paragraphs">
                        ${newResponseData.summary.paragraphs.map(para => `<p>${para}</p>`).join('')}
                    </div>
                `;
            }
            
            // Update the results section
            this.updateResultsSection(newResponseData.results);
        }
    }

    updateResultsSection(results) {
        if (!this.currentResponseElement) return;
        
        // Remove existing results
        const existingVideoResults = this.currentResponseElement.querySelector('.ai-video-results');
        const existingSearchResults = this.currentResponseElement.querySelector('.ai-search-results');
        
        if (existingVideoResults) existingVideoResults.remove();
        if (existingSearchResults) existingSearchResults.remove();
        
        // Add new results based on filter type
        if (this.currentFilter === 'videos') {
            const videoResultsHTML = `
                <div class="ai-video-results">
                    <div class="ai-video-results__container">
                        ${results.map((result, index) => `
                            <div class="ai-video-card ai-result-item" data-video-id="${result.videoId}" style="opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);">
                                <div class="ai-video-card__thumbnail">
                                    <img src="${result.thumbnail}" alt="${result.title}" />
                                    <div class="ai-video-card__duration">${result.duration}</div>
                                    <div class="ai-video-card__play-button">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="ai-video-card__content">
                                    <h3 class="ai-video-card__title">${result.title}</h3>
                                    <div class="ai-video-card__meta">
                                        <span class="ai-video-card__source">${result.source}</span>
                                        <span class="ai-video-card__date">${result.date}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            this.currentResponseElement.insertAdjacentHTML('beforeend', videoResultsHTML);
            
            // Add click listeners for new video cards
            this.currentResponseElement.querySelectorAll('.ai-video-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const videoId = e.currentTarget.dataset.videoId;
                    this.openVideoPlayer(videoId);
                });
            });
            
            // Animate results one by one
            setTimeout(() => {
                this.animateResultsStaggered(this.currentResponseElement.querySelector('.ai-video-results'));
            }, 100);
        } else {
            const searchResultsHTML = `
                <div class="ai-search-results">
                    <div class="ai-search-results__content">
                        ${results.map(result => `
                            <div class="ai-search-result">
                                <h3 class="ai-search-result__title">${result.title}</h3>
                                <p class="ai-search-result__snippet">${result.snippet}</p>
                                <div class="ai-search-result__meta">
                                    <span class="ai-search-result__source">${result.source}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            this.currentResponseElement.insertAdjacentHTML('beforeend', searchResultsHTML);
            
            // Add click listeners for web/manual results
            this.currentResponseElement.querySelectorAll('.ai-search-result').forEach(result => {
                result.addEventListener('click', (e) => {
                    e.preventDefault();
                    const title = result.querySelector('.ai-search-result__title').textContent;
                    const snippet = result.querySelector('.ai-search-result__snippet').textContent;
                    const source = result.querySelector('.ai-search-result__source').textContent;
                    this.openContentModal(title, snippet, source, this.currentFilter);
                });
            });
        }
        
        // Scroll to results
        const conversation = document.getElementById('ai-conversation');
        if (conversation) {
            conversation.scrollTop = conversation.scrollHeight;
        }
    }

    startAIProcessing(userMessage) {
        // Add AI processing message with states
        const processingMessage = this.addProcessingMessage();
        
        // State 1: Searching (1-2 seconds)
        setTimeout(() => {
            this.updateProcessingState(processingMessage, 'searching');
        }, 500);
        
        // State 2: Answering (2-4 seconds)
        setTimeout(() => {
            this.updateProcessingState(processingMessage, 'answering');
        }, 2000);
        
        // State 3: Finished (4-6 seconds)
        setTimeout(() => {
            this.updateProcessingState(processingMessage, 'finished');
            this.showAIResponse(userMessage);
        }, 4000);
    }

    addProcessingMessage() {
        const conversation = document.getElementById('ai-conversation');
        if (!conversation) return null;
        
        // Remove welcome message if it exists
        const welcome = conversation.querySelector('.ai-assistant__welcome');
        if (welcome) {
            welcome.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'ai-message ai-message--ai ai-message--processing';
        
        const searchingText = window.t ? window.t('aiAssistant.searching') : 'Searching...';
        const basePath = window.__basePath || '';
        messageDiv.innerHTML = `
            <div class="ai-message__avatar">
                <img src="${basePath}assets/icons/ai-assistant-icon.svg" alt="AI Assistant" width="24" height="24" class="ai-icon ai-icon--small">
            </div>
            <div class="ai-message__content">
                <div class="ai-message__state" id="ai-processing-state">${searchingText}</div>
            </div>
        `;
        
        conversation.appendChild(messageDiv);
        conversation.scrollTop = conversation.scrollHeight;
        
        return messageDiv;
    }

    updateProcessingState(messageElement, state) {
        if (!messageElement) return;
        
        const stateElement = messageElement.querySelector('#ai-processing-state');
        if (!stateElement) return;
        
        const states = {
            'searching': window.t ? window.t('aiAssistant.searching') : 'Searching...',
            'answering': window.t ? window.t('aiAssistant.answering') : 'Answering...',
            'finished': window.t ? window.t('aiAssistant.done') : 'Done'
        };
        
        stateElement.textContent = states[state];
        stateElement.className = `ai-message__state ai-message__state--${state}`;
    }

    showAIResponse(userMessage) {
        // Generate AI response data
        const responseData = this.generateAIResponse(userMessage);
        
        // Add AI response with summary and results
        this.addAIResponse(responseData);
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    generateAIResponse(userMessage) {
        // Random content generation with all video examples
        const videoData = [
            {
                id: "m1hCdYtaKAU",
                title: "Fiat 500 Common Problems & Solutions",
                snippet: "Complete guide to Fiat 500 common problems and what to expect before purchasing.",
                duration: "15:32",
                date: "August 13, 2024"
            },
            {
                id: "_VsmZfYpu0s", 
                title: "Fiat 500 Engine Issues Explained",
                snippet: "Detailed breakdown of Fiat 500 engine problems and maintenance issues.",
                duration: "12:45",
                date: "June 15, 2020"
            },
            {
                id: "KuiKw7eu7es",
                title: "Fiat 500 Electrical Problems Guide", 
                snippet: "Professional mechanic explains common Fiat 500 electrical issues and solutions.",
                duration: "18:20",
                date: "March 8, 2024"
            },
            {
                id: "VwPm58zM2lE",
                title: "Fiat 500 Transmission Problems",
                snippet: "Complete guide to Fiat 500 transmission issues and repair solutions.",
                duration: "14:18", 
                date: "January 22, 2024"
            },
            {
                id: "_Kr-c8eBl5E",
                title: "Fiat 500 Brake System Issues",
                snippet: "Professional analysis of Fiat 500 brake problems and maintenance tips.",
                duration: "11:55",
                date: "November 30, 2023"
            },
            {
                id: "_Cm7fJO8_rQ",
                title: "Fiat 500 Suspension Problems", 
                snippet: "Detailed guide to Fiat 500 suspension issues and replacement procedures.",
                duration: "16:42",
                date: "October 15, 2023"
            }
        ];

        const problemTypes = [
            "Engine Problems", "Electrical Issues", "Transmission Problems", 
            "Brake System Issues", "Suspension Problems", "Cooling System Failures"
        ];

        const randomProblem = problemTypes[Math.floor(Math.random() * problemTypes.length)];
        const randomVideos = this.shuffleArray([...videoData]).slice(0, 3);
        
        // Helper function to replace placeholders in strings
        const replacePlaceholders = (str, replacements) => {
            let result = str;
            Object.keys(replacements).forEach(key => {
                result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
            });
            return result;
        };
        
        // Get translations
        const t = window.t || ((key) => key);
        const getSearchResults = (filter) => {
            const key = `aiAssistant.searchResults.${filter}`;
            const data = window.translations?.[window.currentLanguage || 'en']?.aiAssistant?.searchResults?.[filter];
            return data || window.translations?.en?.aiAssistant?.searchResults?.[filter];
        };
        
        // Generate response data based on current filter mode
        const responses = {
            'web': {
                summary: {
                    title: t('aiAssistant.searchResults.web.summaryTitle'),
                    bullets: getSearchResults('web')?.summaryBullets || [],
                    paragraphs: getSearchResults('web')?.summaryParagraphs || []
                },
                results: (getSearchResults('web')?.results || []).map(result => ({
                    title: result.title,
                    snippet: result.snippet,
                    source: "fiatforums.com",
                    url: "#"
                })).map((r, i) => {
                    if (i === 1) {
                        r.source = "fiatechinfo.com";
                    }
                    return r;
                })
            },
            'videos': {
                summary: {
                    title: `Fiat 500 ${randomProblem} - Video Guides`,
                    bullets: (getSearchResults('videos')?.summaryBullets || []).map(bullet => 
                        replacePlaceholders(bullet, { problem: randomProblem.toLowerCase() })
                    ),
                    paragraphs: (getSearchResults('videos')?.summaryParagraphs || []).map(para => 
                        replacePlaceholders(para, { problem: randomProblem.toLowerCase() })
                    )
                },
                results: randomVideos.map(video => ({
                    title: video.title,
                    snippet: video.snippet,
                    source: "YouTube",
                    duration: video.duration,
                    thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
                    videoId: video.id,
                    date: video.date
                }))
            },
            'manuals': {
                summary: {
                    title: t('aiAssistant.searchResults.manuals.summaryTitle'),
                    bullets: getSearchResults('manuals')?.summaryBullets || [],
                    paragraphs: getSearchResults('manuals')?.summaryParagraphs || []
                },
                results: (getSearchResults('manuals')?.results || []).map(result => ({
                    title: result.title,
                    snippet: result.snippet,
                    source: "Fiat Service Information",
                    url: "#"
                })).map((r, i) => {
                    if (i === 1) {
                        r.source = "Fiat Technical Service";
                    }
                    return r;
                })
            }
        };
        
        return responses[this.currentFilter] || responses['web'];
    }

    addAIResponse(responseData) {
        const conversation = document.getElementById('ai-conversation');
        if (!conversation) return;
        
        // Store current response data and element for filtering
        this.currentResponseData = responseData;
        
        // Create main AI response container
        const responseDiv = document.createElement('div');
        responseDiv.className = 'ai-response';
        this.currentResponseElement = responseDiv;
        
        // Add summary section
        responseDiv.innerHTML = `
            <div class="ai-summary">
                <h2 class="ai-summary__title">${responseData.summary.title}</h2>
                <ul class="ai-summary__bullets">
                    ${responseData.summary.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
                </ul>
                <div class="ai-summary__paragraphs">
                    ${responseData.summary.paragraphs.map(para => `<p>${para}</p>`).join('')}
                </div>
            </div>
        `;
        
        // Add results section based on filter type
        if (this.currentFilter === 'videos') {
            responseDiv.innerHTML += `
                <div class="ai-video-results">
                    <div class="ai-video-results__container">
                        ${responseData.results.map((result, index) => `
                            <div class="ai-video-card ai-result-item" data-video-id="${result.videoId}" style="opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);">
                                <div class="ai-video-card__thumbnail">
                                    <img src="${result.thumbnail}" alt="${result.title}" />
                                    <div class="ai-video-card__duration">${result.duration}</div>
                                    <div class="ai-video-card__play-button">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="ai-video-card__content">
                                    <h3 class="ai-video-card__title">${result.title}</h3>
                                    <div class="ai-video-card__meta">
                                        <span class="ai-video-card__source">${result.source}</span>
                                        <span class="ai-video-card__date">${result.date}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        } else {
            responseDiv.innerHTML += `
                <div class="ai-search-results">
                    <div class="ai-search-results__content">
                        ${responseData.results.map(result => `
                            <div class="ai-search-result">
                                <h3 class="ai-search-result__title">${result.title}</h3>
                                <p class="ai-search-result__snippet">${result.snippet}</p>
                                <div class="ai-search-result__meta">
                                    <span class="ai-search-result__source">${result.source}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        conversation.appendChild(responseDiv);
        
        // Add click listeners for interactive elements
        if (this.currentFilter === 'videos') {
            responseDiv.querySelectorAll('.ai-video-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const videoId = e.currentTarget.dataset.videoId;
                    this.openVideoPlayer(videoId);
                });
            });
            
            // Animate results one by one
            setTimeout(() => {
                this.animateResultsStaggered(responseDiv.querySelector('.ai-video-results'));
            }, 100);
        } else {
            // Add click listeners for web/manual results
            responseDiv.querySelectorAll('.ai-search-result').forEach(result => {
                result.addEventListener('click', (e) => {
                    e.preventDefault();
                    const title = result.querySelector('.ai-search-result__title').textContent;
                    const snippet = result.querySelector('.ai-search-result__snippet').textContent;
                    const source = result.querySelector('.ai-search-result__source').textContent;
                    this.openContentModal(title, snippet, source, this.currentFilter);
                });
            });
            
            // Animate results one by one
            setTimeout(() => {
                this.animateResultsStaggered(responseDiv.querySelector('.ai-search-results'));
            }, 100);
        }
        
        conversation.scrollTop = conversation.scrollHeight;
    }

    generateSearchResults(userMessage) {
        // Mock search results based on current filter mode
        const results = {
            'web': [
                {
                    title: "Common Engine Problems in Volvo Cars",
                    snippet: "Volvo engines are generally reliable but have recurring issues, particularly in certain models and engine types. High oil consumption affects T5 and T6 Drive-E engines (2011-2020) due to faulty piston rings.",
                    source: "volvoforums.com",
                    url: "#"
                },
                {
                    title: "Volvo Engine Diagnostic Procedures",
                    snippet: "Step-by-step diagnostic procedures for common Volvo engine issues including timing chain problems and fuel system diagnostics.",
                    source: "volvotechinfo.com",
                    url: "#"
                }
            ],
            'videos': [
                {
                    title: "Fiat 500 Common Problems & Solutions",
                    snippet: "Complete guide to Fiat 500 common problems and what to expect before purchasing.",
                    source: "YouTube",
                    duration: "15:32",
                    thumbnail: "https://img.youtube.com/vi/m1hCdYtaKAU/maxresdefault.jpg",
                    videoId: "m1hCdYtaKAU",
                    date: "August 13, 2024"
                },
                {
                    title: "Fiat 500 Engine Issues Explained",
                    snippet: "Detailed breakdown of Fiat 500 engine problems and maintenance issues.",
                    source: "YouTube", 
                    duration: "12:45",
                    thumbnail: "https://img.youtube.com/vi/_VsmZfYpu0s/maxresdefault.jpg",
                    videoId: "_VsmZfYpu0s",
                    date: "June 15, 2020"
                },
                {
                    title: "Fiat 500 Electrical Problems Guide",
                    snippet: "Professional mechanic explains common Fiat 500 electrical issues and solutions.",
                    source: "YouTube",
                    duration: "18:20",
                    thumbnail: "https://img.youtube.com/vi/KuiKw7eu7es/maxresdefault.jpg",
                    videoId: "KuiKw7eu7es",
                    date: "March 8, 2024"
                },
                {
                    title: "Fiat 500 Transmission Problems",
                    snippet: "Complete guide to Fiat 500 transmission issues and repair solutions.",
                    source: "YouTube",
                    duration: "14:18",
                    thumbnail: "https://img.youtube.com/vi/VwPm58zM2lE/maxresdefault.jpg",
                    videoId: "VwPm58zM2lE",
                    date: "January 22, 2024"
                },
                {
                    title: "Fiat 500 Brake System Issues",
                    snippet: "Professional analysis of Fiat 500 brake problems and maintenance tips.",
                    source: "YouTube",
                    duration: "11:55",
                    thumbnail: "https://img.youtube.com/vi/_Kr-c8eBl5E/maxresdefault.jpg",
                    videoId: "_Kr-c8eBl5E",
                    date: "November 30, 2023"
                },
                {
                    title: "Fiat 500 Suspension Problems",
                    snippet: "Detailed guide to Fiat 500 suspension issues and replacement procedures.",
                    source: "YouTube",
                    duration: "16:42",
                    thumbnail: "https://img.youtube.com/vi/_Cm7fJO8_rQ/maxresdefault.jpg",
                    videoId: "_Cm7fJO8_rQ",
                    date: "October 15, 2023"
                }
            ],
            'manuals': [
                {
                    title: "Volvo Service Manual - Engine Diagnostics",
                    snippet: "Official Volvo service procedures for engine diagnostic testing and troubleshooting common issues.",
                    source: "Volvo Service Information",
                    url: "#"
                },
                {
                    title: "Volvo Technical Bulletin - Oil Consumption",
                    snippet: "Manufacturer-approved procedures for addressing excessive oil consumption in Drive-E engines.",
                    source: "Volvo Technical Service",
                    url: "#"
                }
            ]
        };
        
        return results[this.currentFilter] || results['web'];
    }

    addSearchResults(results) {
        const conversation = document.getElementById('ai-conversation');
        if (!conversation) return;
        
        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'ai-search-results';
        
        if (this.currentFilter === 'videos') {
            // Video cards layout with staggered animation
            resultsDiv.innerHTML = `
                <div class="ai-video-results">
                    <div class="ai-video-results__container">
                        ${results.map((result, index) => `
                            <div class="ai-video-card ai-result-item" data-video-id="${result.videoId}" style="opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);">
                                <div class="ai-video-card__thumbnail">
                                    <img src="${result.thumbnail}" alt="${result.title}" />
                                    <div class="ai-video-card__duration">${result.duration}</div>
                                    <div class="ai-video-card__play-button">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                                        </svg>
                                    </div>
                                </div>
                                <div class="ai-video-card__content">
                                    <h3 class="ai-video-card__title">${result.title}</h3>
                                    <div class="ai-video-card__meta">
                                        <span class="ai-video-card__source">${result.source}</span>
                                        <span class="ai-video-card__date">${result.date}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            // Add click listeners for video cards
            resultsDiv.querySelectorAll('.ai-video-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const videoId = e.currentTarget.dataset.videoId;
                    this.openVideoPlayer(videoId);
                });
            });
        } else {
            // Regular results layout with staggered animation
            let resultsHTML = '<div class="ai-search-results__content">';
            
            results.forEach((result, index) => {
                resultsHTML += `
                    <div class="ai-search-result ai-result-item" style="opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);">
                        <h3 class="ai-search-result__title">${result.title}</h3>
                        <p class="ai-search-result__snippet">${result.snippet}</p>
                        <div class="ai-search-result__meta">
                            <span class="ai-search-result__source">${result.source}</span>
                            ${result.duration ? `<span class="ai-search-result__duration">${result.duration}</span>` : ''}
                        </div>
                    </div>
                `;
            });
            
            resultsHTML += '</div>';
            resultsDiv.innerHTML = resultsHTML;
        }
        
        conversation.appendChild(resultsDiv);
        conversation.scrollTop = conversation.scrollHeight;
        
        // Animate results one by one
        this.animateResultsStaggered(resultsDiv);
    }

    animateResultsStaggered(container) {
        const resultItems = container.querySelectorAll('.ai-result-item');
        
        resultItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 200); // 200ms delay between each item
        });
    }

    openVideoPlayer(videoId) {
        // Create video player modal
        const modal = document.createElement('div');
        modal.className = 'ai-video-modal';
        modal.innerHTML = `
            <div class="ai-video-modal__overlay"></div>
            <div class="ai-video-modal__content">
                <button class="ai-video-modal__close" aria-label="Close video">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                    </svg>
                </button>
                <div class="ai-video-modal__player">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.ai-video-modal__close');
        const overlay = modal.querySelector('.ai-video-modal__overlay');
        
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    openContentModal(title, snippet, source, contentType) {
        // Create content modal
        const modal = document.createElement('div');
        modal.className = 'ai-content-modal';
        
        const t = window.t || ((key) => key);
        
        // Generate content based on type
        const contentData = this.generateContentData(title, snippet, source, contentType);
        
        modal.innerHTML = `
            <div class="ai-content-modal__overlay"></div>
            <div class="ai-content-modal__content">
                <div class="ai-content-modal__header">
                    <div class="ai-content-modal__title-small">${title}</div>
                    <button class="ai-content-modal__close" aria-label="${t('aiAssistant.searchResults.modal.closeContent')}">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor"/>
                        </svg>
                    </button>
                </div>
                <div class="ai-content-modal__body">
                    <div class="ai-content-modal__source">${source}</div>
                    <div class="ai-content-modal__content-area">
                        ${contentData}
                    </div>
                </div>
                <div class="ai-content-modal__footer">
                    ${this.generateModalFooter(contentType)}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.ai-content-modal__close');
        const overlay = modal.querySelector('.ai-content-modal__overlay');
        
        const closeModal = () => {
            modal.remove();
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    generateModalFooter(contentType) {
        const t = window.t || ((key) => key);
        switch(contentType) {
            case 'web':
                return `
                    <button class="ai-content-modal__btn ai-content-modal__btn--primary">${t('aiAssistant.searchResults.modal.buttons.openFullArticle')}</button>
                    <button class="ai-content-modal__btn ai-content-modal__btn--secondary">${t('aiAssistant.searchResults.modal.buttons.saveForLater')}</button>
                `;
            case 'manuals':
                return `
                    <button class="ai-content-modal__btn ai-content-modal__btn--primary">${t('aiAssistant.searchResults.modal.buttons.downloadPdf')}</button>
                    <button class="ai-content-modal__btn ai-content-modal__btn--secondary">${t('aiAssistant.searchResults.modal.buttons.printSection')}</button>
                `;
            default:
                return `
                    <button class="ai-content-modal__btn ai-content-modal__btn--primary">${t('aiAssistant.searchResults.modal.buttons.viewFullContent')}</button>
                `;
        }
    }

    generateContentData(title, snippet, source, contentType) {
        const t = window.t || ((key) => key);
        const getModalContent = (type, key) => {
            const lang = window.currentLanguage || 'en';
            const data = window.translations?.[lang]?.aiAssistant?.searchResults?.modal?.[type];
            if (data && key && data[key] !== undefined) {
                return data[key];
            }
            const fallback = window.translations?.en?.aiAssistant?.searchResults?.modal?.[type];
            return (fallback && key) ? (fallback[key] || '') : '';
        };
        const replacePlaceholders = (str, replacements) => {
            let result = str;
            Object.keys(replacements).forEach(key => {
                result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), replacements[key]);
            });
            return result;
        };
        
        switch(contentType) {
            case 'web':
                const webContent = getModalContent('web', '');
                const titleLower = title.toLowerCase();
                return `
                    <div class="ai-content-web">
                        <div class="ai-content-web__preview">
                            <div class="ai-content-web__url">https://${source.toLowerCase()}</div>
                            <div class="ai-content-web__snippet">${snippet}</div>
                        </div>
                        <div class="ai-content-web__full-content">
                            <h2>${t('aiAssistant.searchResults.modal.web.fullArticleTitle')}</h2>
                            <p>${replacePlaceholders(t('aiAssistant.searchResults.modal.web.fullArticleIntro'), { title: titleLower })}</p>
                            <ul>
                                ${(getModalContent('web', 'fullArticleBullets') || []).map(bullet => `<li>${bullet}</li>`).join('')}
                            </ul>
                            <p>${t('aiAssistant.searchResults.modal.web.fullArticleConclusion')}</p>
                            
                            <h3>${t('aiAssistant.searchResults.modal.web.technicalAnalysis')}</h3>
                            <p>${t('aiAssistant.searchResults.modal.web.technicalAnalysisText')}</p>
                            
                            <h3>${t('aiAssistant.searchResults.modal.web.diagnosticProcedures')}</h3>
                            <p>${t('aiAssistant.searchResults.modal.web.diagnosticProceduresText')}</p>
                            <ol>
                                ${(getModalContent('web', 'diagnosticSteps') || []).map(step => `<li>${step}</li>`).join('')}
                            </ol>
                            
                            <h3>${t('aiAssistant.searchResults.modal.web.commonIssues')}</h3>
                            <p>${t('aiAssistant.searchResults.modal.web.commonIssuesText')}</p>
                            
                            <h3>${t('aiAssistant.searchResults.modal.web.prevention')}</h3>
                            <p>${t('aiAssistant.searchResults.modal.web.preventionText')}</p>
                            
                            <h3>${t('aiAssistant.searchResults.modal.web.advancedDiagnostics')}</h3>
                            <p>${t('aiAssistant.searchResults.modal.web.advancedDiagnosticsText')}</p>
                        </div>
                    </div>
                `;
            case 'manuals':
                return `
                    <div class="ai-content-manual">
                        <div class="ai-content-manual__header">
                            <div class="ai-content-manual__icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
                                </svg>
                            </div>
                            <div class="ai-content-manual__info">
                                <div class="ai-content-manual__type">${t('aiAssistant.searchResults.modal.manuals.officialServiceManual')}</div>
                                <div class="ai-content-manual__version">${t('aiAssistant.searchResults.modal.manuals.version')}</div>
                            </div>
                        </div>
                        <div class="ai-content-manual__content">
                            <h2>${title}</h2>
                            <div class="ai-content-manual__sections">
                                <div class="ai-content-manual__section">
                                    <h3>${t('aiAssistant.searchResults.modal.manuals.overview')}</h3>
                                    <p>${snippet}</p>
                                    <div style="margin: 16px 0; padding: 12px; background: #1a1a1a; border-radius: 6px; border-left: 3px solid #00D4FF;">
                                        <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">${t('aiAssistant.searchResults.modal.manuals.technicalReference')}</h4>
                                        <div style="background: #2a2a2a; padding: 8px; border-radius: 4px; margin: 8px 0;">
                                            <div style="width: 100%; height: 120px; background: #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #888; font-size: 12px;">
                                                ${t('aiAssistant.searchResults.modal.manuals.figureBallast')}
                                            </div>
                                        </div>
                                        <p style="margin: 0; font-size: 12px; color: #cccccc;">${t('aiAssistant.searchResults.modal.manuals.figureBallastDesc')}</p>
                                    </div>
                                </div>
                                <div class="ai-content-manual__section">
                                    <h3>${t('aiAssistant.searchResults.modal.manuals.requiredTools')}</h3>
                                    <ul>
                                        ${(getModalContent('manuals', 'tools') || []).map(tool => `<li>${tool}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="ai-content-manual__section">
                                    <h3>${t('aiAssistant.searchResults.modal.manuals.procedureSteps')}</h3>
                                    <ol>
                                        ${(getModalContent('manuals', 'procedureStepItems') || []).map(step => `<li>${step}</li>`).join('')}
                                    </ol>
                                    <div style="margin: 16px 0; padding: 12px; background: #1a1a1a; border-radius: 6px; border-left: 3px solid #00D4FF;">
                                        <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">${t('aiAssistant.searchResults.modal.manuals.wiringReference')}</h4>
                                        <div style="background: #2a2a2a; padding: 8px; border-radius: 4px; margin: 8px 0;">
                                            <div style="width: 100%; height: 100px; background: #333; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #888; font-size: 12px;">
                                                ${t('aiAssistant.searchResults.modal.manuals.figureSparkPlug')}
                                            </div>
                                        </div>
                                        <p style="margin: 0; font-size: 12px; color: #cccccc;">${t('aiAssistant.searchResults.modal.manuals.figureSparkPlugDesc')}</p>
                                    </div>
                                </div>
                                <div class="ai-content-manual__section">
                                    <h3>${t('aiAssistant.searchResults.modal.manuals.safetyPrecautions')}</h3>
                                    <p>${t('aiAssistant.searchResults.modal.manuals.safetyPrecautionsText')}</p>
                                    <ul>
                                        ${(getModalContent('manuals', 'safetyItems') || []).map(item => `<li>${item}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="ai-content-manual__section">
                                    <h3>${t('aiAssistant.searchResults.modal.manuals.technicalSpecs')}</h3>
                                    <p>${t('aiAssistant.searchResults.modal.manuals.technicalSpecsText')}</p>
                                    <ul>
                                        ${(getModalContent('manuals', 'specs') || []).map(spec => `<li>${spec}</li>`).join('')}
                                    </ul>
                                    <div style="margin: 16px 0; padding: 12px; background: #1a1a1a; border-radius: 6px; border-left: 3px solid #00D4FF;">
                                        <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">${t('aiAssistant.searchResults.modal.manuals.connectorReference')}</h4>
                                        <p style="margin: 0; font-size: 12px; color: #cccccc;">${t('aiAssistant.searchResults.modal.manuals.connectorReferenceDesc')}</p>
                                    </div>
                                </div>
                                <div class="ai-content-manual__section">
                                    <h3>${t('aiAssistant.searchResults.modal.manuals.troubleshooting')}</h3>
                                    <p>${t('aiAssistant.searchResults.modal.manuals.troubleshootingText')}</p>
                                    <ol>
                                        ${(getModalContent('manuals', 'troubleshootingItems') || []).map(item => `<li>${item}</li>`).join('')}
                                        <li>Rough idle: Check for vacuum leaks and sensor operation</li>
                                        <li>Starting problems: Verify battery, starter, and fuel system</li>
                                    </ol>
                                </div>
                                <div class="ai-content-manual__section">
                                    <h3>Maintenance Schedule</h3>
                                    <p>Follow the recommended maintenance intervals for optimal engine performance:</p>
                                    <ul>
                                        <li>Oil change: Every 5,000 miles or 6 months</li>
                                        <li>Air filter: Every 15,000 miles</li>
                                        <li>Spark plugs: Every 30,000 miles</li>
                                        <li>Timing belt: Every 60,000 miles</li>
                                    </ul>
                                    <div style="margin: 16px 0; padding: 12px; background: #1a1a1a; border-radius: 6px; border-left: 3px solid #00D4FF;">
                                        <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 14px;">Wiring Diagram Reference</h4>
                                        <p style="margin: 0; font-size: 12px; color: #cccccc;">Common connections diagram showing multiple electrical components (switches, lights, radio, clock) connected to common power (S205) and ground (G200) points with wire specifications (0.8 Blk 150, 3 Blk 150).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            default:
                return `
                    <div class="ai-content-default">
                        <p>${snippet}</p>
                        <div class="ai-content-default__actions">
                            <button class="ai-content-default__btn">View Full Content</button>
                        </div>
                    </div>
                `;
        }
    }

    addNewChatListener() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.ai-new-chat-fab')) {
                this.startNewChat();
            }
        });
    }

    startNewChat() {
        console.log('AI Assistant: Starting new chat');
        
        // Clear the conversation
        const conversation = document.getElementById('ai-conversation');
        if (conversation) {
            const welcomeTitle = window.t ? window.t('aiAssistant.welcomeTitle') : 'Welcome to AutoAssist';
            const welcomeText = window.t ? window.t('aiAssistant.welcomeText') : 'I\'m here to help with vehicle diagnostics, manual lookups, and troubleshooting. What can I assist you with today?';
            const basePath = window.__basePath || '';
            conversation.innerHTML = `
                <div class="ai-assistant__welcome">
                    <div class="ai-assistant__welcome-icon">
                        <img src="${basePath}assets/icons/ai-assistant-icon.svg" alt="AI Assistant" width="44" height="44" class="ai-icon ai-icon--large">
                    </div>
                    <h3 class="ai-assistant__welcome-title" data-i18n="aiAssistant.welcomeTitle">${welcomeTitle}</h3>
                    <p class="ai-assistant__welcome-text" data-i18n="aiAssistant.welcomeText">${welcomeText}</p>
                </div>
            `;
        }
        
        // Clear input field
        const inputField = document.getElementById('ai-input-field');
        if (inputField) {
            inputField.value = '';
            inputField.focus();
        }
        
        // Reset filter to web
        this.setFilterMode('web');
        
        // Scroll to top
        conversation.scrollTop = 0;
    }

    // Camera functionality
    addCameraListeners() {
        const cameraFab = document.getElementById('ai-camera-btn');
        const cameraOverlay = document.getElementById('camera-overlay');
        const cameraCloseBtn = document.getElementById('camera-close-btn');
        const cameraCaptureBtn = document.getElementById('camera-capture-btn');
        const cameraViewport = document.getElementById('camera-viewport');
        const cameraFocusRing = document.getElementById('camera-focus-ring');
        const cameraFlash = document.getElementById('camera-flash');

        if (!cameraFab || !cameraOverlay) {
            console.warn('AI Assistant: Camera elements not found');
            return;
        }

        // Open camera overlay
        cameraFab.addEventListener('click', () => {
            this.openCamera();
        });

        // Close camera overlay
        cameraCloseBtn.addEventListener('click', () => {
            this.closeCamera();
        });

        // Close on backdrop click
        const cameraBackdrop = cameraOverlay.querySelector('.camera-overlay__backdrop');
        if (cameraBackdrop) {
            cameraBackdrop.addEventListener('click', () => {
                this.closeCamera();
            });
        }

        // Capture photo
        cameraCaptureBtn.addEventListener('click', () => {
            this.capturePhoto();
        });

        // Focus ring on viewport click
        cameraViewport.addEventListener('click', (e) => {
            this.showFocusRing(e);
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && cameraOverlay.classList.contains('camera-overlay--active')) {
                this.closeCamera();
            }
        });
    }

    openCamera() {
        const cameraOverlay = document.getElementById('camera-overlay');
        if (!cameraOverlay) return;

        cameraOverlay.classList.add('camera-overlay--active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        console.log('AI Assistant: Camera opened');
    }

    closeCamera() {
        const cameraOverlay = document.getElementById('camera-overlay');
        if (!cameraOverlay) return;

        cameraOverlay.classList.remove('camera-overlay--active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // If a photo was captured, add it to the AI conversation
        if (this.capturedPhoto) {
            this.addPhotoToConversation(this.capturedPhoto);
            this.capturedPhoto = null; // Clear the captured photo
        }
        
        console.log('AI Assistant: Camera closed');
    }

    capturePhoto() {
        const cameraFlash = document.getElementById('camera-flash');
        const cameraCaptureBtn = document.getElementById('camera-capture-btn');
        
        if (!cameraFlash || !cameraCaptureBtn) return;

        // Add capture animation to button
        cameraCaptureBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            cameraCaptureBtn.style.transform = '';
        }, 150);

        // Trigger flash effect
        cameraFlash.classList.add('camera-flash--active');
        setTimeout(() => {
            cameraFlash.classList.remove('camera-flash--active');
        }, 300);

        // Simulate photo capture
        setTimeout(() => {
            console.log('AI Assistant: Photo captured');
            // Store the captured photo for AI conversation
            const basePath = window.__basePath || '';
            this.capturedPhoto = {
                src: basePath + 'assets/images/camera-feed.jpg',
                timestamp: new Date().toISOString()
            };
            this.showCaptureSuccess();
        }, 500);
    }

    showFocusRing(e) {
        const cameraFocusRing = document.getElementById('camera-focus-ring');
        const cameraViewport = document.getElementById('camera-viewport');
        
        if (!cameraFocusRing || !cameraViewport) return;

        const rect = cameraViewport.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Position focus ring
        cameraFocusRing.style.left = `${x - 40}px`;
        cameraFocusRing.style.top = `${y - 40}px`;

        // Show focus ring animation
        cameraFocusRing.classList.add('camera-focus-ring--active');
        
        // Hide after animation
        setTimeout(() => {
            cameraFocusRing.classList.remove('camera-focus-ring--active');
        }, 600);
    }

    showCaptureSuccess() {
        // Create a temporary success indicator
        const successIndicator = document.createElement('div');
        successIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: 'Work Sans', sans-serif;
            font-size: 16px;
            z-index: 3000;
            pointer-events: none;
        `;
        const photoCapturedText = window.t ? window.t('aiAssistant.photoCaptured') : 'Photo captured!';
        successIndicator.textContent = photoCapturedText;
        
        document.body.appendChild(successIndicator);
        
        // Remove after 2 seconds
        setTimeout(() => {
            if (successIndicator.parentNode) {
                successIndicator.parentNode.removeChild(successIndicator);
            }
        }, 2000);
    }

    addPhotoToConversation(photo) {
        const conversation = document.getElementById('ai-conversation');
        if (!conversation) return;

        // Add photo message without user avatar
        const photoMessage = document.createElement('div');
        photoMessage.className = 'ai-message';
        photoMessage.innerHTML = `
            <div class="ai-message__content">
                <div class="ai-message__photo">
                    <img src="${photo.src}" alt="Captured photo" class="ai-message__photo-thumbnail">
                    <div class="ai-message__photo-overlay">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 17.1153C13.1474 17.1153 14.1202 16.7163 14.9182 15.9182C15.7163 15.1202 16.1153 14.1474 16.1153 13C16.1153 11.8525 15.7163 10.8798 14.9182 10.0817C14.1202 9.28366 13.1474 8.88463 12 8.88463C10.8525 8.88463 9.87979 9.28366 9.08173 10.0817C8.28366 10.8798 7.88462 11.8525 7.88462 13C7.88462 14.1474 8.28366 15.1202 9.08173 15.9182C9.87979 16.7163 10.8525 17.1153 12 17.1153ZM12 15.6154C11.2615 15.6154 10.641 15.3641 10.1384 14.8615C9.63586 14.359 9.38458 13.7384 9.38458 13C9.38458 12.2615 9.63586 11.641 10.1384 11.1384C10.641 10.6359 11.2615 10.3846 12 10.3846C12.7384 10.3846 13.359 10.6359 13.8615 11.1384C14.3641 11.641 14.6154 12.2615 14.6154 13C14.6154 13.7384 14.3641 14.359 13.8615 14.8615C13.359 15.3641 12.7384 15.6154 12 15.6154ZM4.3077 20.5C3.80257 20.5 3.375 20.325 3.025 19.975C2.675 19.625 2.5 19.1974 2.5 18.6923V7.3077C2.5 6.80257 2.675 6.375 3.025 6.025C3.375 5.675 3.80257 5.5 4.3077 5.5H7.36153L9.21153 3.5H14.7884L16.6384 5.5H19.6923C20.1974 5.5 20.625 5.675 20.975 6.025C21.325 6.375 21.5 6.80257 21.5 7.3077V18.6923C21.5 19.1974 21.325 19.625 20.975 19.975C20.625 20.325 20.1974 20.5 19.6923 20.5H4.3077ZM4.3077 19H19.6923C19.782 19 19.8557 18.9711 19.9134 18.9134C19.9711 18.8557 20 18.782 20 18.6923V7.3077C20 7.21795 19.9711 7.14423 19.9134 7.08653C19.8557 7.02883 19.782 6.99998 19.6923 6.99998H15.9692L14.1346 4.99998H9.86535L8.03075 6.99998H4.3077C4.21795 6.99998 4.14423 7.02883 4.08653 7.08653C4.02883 7.14423 3.99998 7.21795 3.99998 7.3077V18.6923C3.99998 18.782 4.02883 18.8557 4.08653 18.9134C4.14423 18.9711 4.21795 19 4.3077 19Z" fill="currentColor"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        conversation.appendChild(photoMessage);
        conversation.scrollTop = conversation.scrollHeight;

        // Start AI processing after a short delay
        setTimeout(() => {
            this.startPhotoAnalysis();
        }, 1000);
    }

    startPhotoAnalysis() {
        // Add AI thinking message
        const processingMessage = this.addProcessingMessage();
        
        // Simulate AI processing time
        setTimeout(() => {
            this.updateProcessingState(processingMessage, 'answering');
        }, 2000);
        
        setTimeout(() => {
            this.updateProcessingState(processingMessage, 'finished');
        }, 4000);
        
        setTimeout(() => {
            this.addPhotoAnalysisResponse();
        }, 5000);
    }

    addPhotoAnalysisResponse() {
        const conversation = document.getElementById('ai-conversation');
        if (!conversation) return;

        // Create AI response message
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message ai-message--ai';
        
        const photoAnalysisText = window.t ? window.t('aiAssistant.photoAnalysis') : 'This is a photo of';
        const wouldYouLikeText = window.t ? window.t('aiAssistant.wouldYouLikeToSelect') : 'Would you like to select this vehicle for VCI connection?';
        const selectVehicleText = window.t ? window.t('aiAssistant.selectVehicle') : 'Select vehicle';
        const basePath = window.__basePath || '';
        aiMessage.innerHTML = `
            <div class="ai-message__avatar">
                <img src="${basePath}assets/icons/ai-assistant-icon.svg" alt="AI Assistant" width="24" height="24" class="ai-icon ai-icon--small">
            </div>
            <div class="ai-message__content">
                <p>${photoAnalysisText} Fiat 500 2025.</p>
                <p>${wouldYouLikeText}</p>
                <button class="ai-cta-button" id="select-vehicle-btn">
                    <img src="${basePath}assets/icons/nav-vehicle.svg" alt="Vehicle" width="16" height="16" class="svg">
                    ${selectVehicleText}
                </button>
            </div>
        `;

        conversation.appendChild(aiMessage);
        conversation.scrollTop = conversation.scrollHeight;

        // Add click listener for the CTA button
        const selectButton = document.getElementById('select-vehicle-btn');
        if (selectButton) {
            selectButton.addEventListener('click', () => {
                console.log('AI Assistant: Vehicle selected for VCI connection');
                
                // Parse vehicle info from the message (currently hardcoded, but can be extracted from AI response)
                // Format: "This is a photo of [Brand] [Model] [Year]"
                const vehicleInfo = this.parseVehicleFromPhotoAnalysis(aiMessage);
                
                if (vehicleInfo) {
                    this.selectVehicleFromAI(vehicleInfo.brand, vehicleInfo.model, vehicleInfo.year, vehicleInfo.logo);
                } else {
                    // Fallback to hardcoded Fiat 500 2025 for now
                    const basePath = window.__basePath || '';
                    this.selectVehicleFromAI('Fiat', '500', '2025', basePath + 'assets/brands/fiat.png');
                }
            });
        }
    }
}

// Initialize when DOM is ready
let aiAssistantInstance = null;
document.addEventListener('DOMContentLoaded', () => {
    aiAssistantInstance = new AIAssistant();
    // Make it globally accessible for banner link
    window.aiAssistant = aiAssistantInstance;
});
