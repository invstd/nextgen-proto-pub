document.addEventListener('DOMContentLoaded', () => {
    console.log('Alphabetical Index: DOM loaded, initializing...');
    
    const alphabeticalIndex = document.querySelector('.alphabetical-index__container');
    const brandGrid = document.querySelector('.brand-grid__container');
    const scrollContainer = document.querySelector('.vehicle-selection__brands');
    const brandCards = document.querySelectorAll('.brand-card');

    console.log('Alphabetical Index: Elements found:', {
        alphabeticalIndex: !!alphabeticalIndex,
        brandGrid: !!brandGrid,
        scrollContainer: !!scrollContainer,
        brandCards: brandCards.length
    });

    if (!alphabeticalIndex || !brandGrid || !scrollContainer || brandCards.length === 0) {
        console.warn('Alphabetical index, brand grid, scroll container, or brand cards not found.');
        console.log('Available elements:', {
            alphabeticalIndex: document.querySelector('.alphabetical-index__container'),
            brandGrid: document.querySelector('.brand-grid__container'),
            scrollContainer: document.querySelector('.vehicle-selection__brands'),
            brandCards: document.querySelectorAll('.brand-card')
        });
        return;
    }

    // Map first letters to their corresponding brand card elements
    const firstLetterElements = {};
    brandCards.forEach(card => {
        const firstLetter = card.dataset.firstLetter.toLowerCase();
        if (!firstLetterElements[firstLetter]) {
            firstLetterElements[firstLetter] = card;
        }
    });
    
    console.log('Alphabetical Index: First letter mapping', firstLetterElements);
    console.log('Alphabetical Index: Available letters with brands:', Object.keys(firstLetterElements));
    console.log('Alphabetical Index: Event listener attached');

    // Test: Add direct click handlers to each letter button
    const letterButtons = document.querySelectorAll('.alphabetical-index__letter');
    console.log('Alphabetical Index: Found letter buttons', letterButtons.length);
    
    letterButtons.forEach((button, index) => {
        button.addEventListener('click', (e) => {
            console.log('Direct click on button', index, e.target.dataset.letter);
        });
    });

    alphabeticalIndex.addEventListener('click', (event) => {
        console.log('Alphabetical Index: Click detected', event.target);
        const targetButton = event.target.closest('.alphabetical-index__letter');
        console.log('Alphabetical Index: Target button', targetButton);
        
        if (targetButton) {
            const letter = targetButton.dataset.letter;
            console.log('Alphabetical Index: Letter clicked', letter);
            const targetBrand = firstLetterElements[letter];
            console.log('Alphabetical Index: Target brand found', !!targetBrand);

            if (targetBrand) {
                console.log('Alphabetical Index: Scrolling to brand', targetBrand);
                // Remove existing highlights
                brandCards.forEach(card => card.classList.remove('highlighted'));
                
                // Scroll to the target brand card with custom easing
                const targetPosition = targetBrand.offsetTop - scrollContainer.offsetTop;
                const startPosition = scrollContainer.scrollTop;
                const distance = targetPosition - startPosition;
                const duration = 600; // 600ms duration
                let startTime = null;

                console.log('Alphabetical Index: Scroll calculation', {
                    targetPosition,
                    startPosition,
                    distance,
                    scrollContainerScrollHeight: scrollContainer.scrollHeight,
                    scrollContainerClientHeight: scrollContainer.clientHeight
                });

                function easeInOutCubic(t) {
                    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                }

                function animateScroll(currentTime) {
                    if (startTime === null) startTime = currentTime;
                    const timeElapsed = currentTime - startTime;
                    const progress = Math.min(timeElapsed / duration, 1);
                    const easedProgress = easeInOutCubic(progress);
                    const newScrollTop = startPosition + (distance * easedProgress);
                    
                    scrollContainer.scrollTop = newScrollTop;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateScroll);
                    } else {
                        console.log('Alphabetical Index: Scroll animation completed', {
                            finalScrollTop: scrollContainer.scrollTop,
                            targetPosition
                        });
                    }
                }
                
                requestAnimationFrame(animateScroll);

                // Add highlight to the target brand card
                targetBrand.classList.add('highlighted');
                setTimeout(() => {
                    targetBrand.classList.remove('highlighted');
                }, 2000); // Remove highlight after animation
            } else {
                console.log('Alphabetical Index: No brand found for letter', letter);
                console.log('Alphabetical Index: Available letters are:', Object.keys(firstLetterElements));
            }
        }
    });

    // Optional: Highlight active letter in index based on scroll position
    let activeLetter = '';
    scrollContainer.addEventListener('scroll', () => {
        let currentActiveLetter = '';
        for (let i = 0; i < brandCards.length; i++) {
            const card = brandCards[i];
            const rect = card.getBoundingClientRect();
            // If the card is in the viewport (or slightly above/below for better UX)
            if (rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) / 2) {
                currentActiveLetter = card.dataset.firstLetter.toLowerCase();
                break;
            }
        }

        if (currentActiveLetter && currentActiveLetter !== activeLetter) {
            // Remove active class from previous letter
            const prevActiveButton = alphabeticalIndex.querySelector(`.alphabetical-index__letter.active`);
            if (prevActiveButton) {
                prevActiveButton.classList.remove('active');
            }

            // Add active class to current letter
            const currentActiveButton = alphabeticalIndex.querySelector(`.alphabetical-index__letter[data-letter="${currentActiveLetter}"]`);
            if (currentActiveButton) {
                currentActiveButton.classList.add('active');
            }
            activeLetter = currentActiveLetter;
        }
    });
});