/**
 * VCI Auto-Detect Controller
 * Manages the relationship between VCI connection status and auto-detect button state
 */

class VCIAutoDetectController {
    constructor() {
        this.autoDetectBtn = document.getElementById('auto-detect-btn');
        this.vciIndicator = document.querySelector('.vci-indicator');
        this.currentStatus = 'no-vci';
        
        this.init();
    }

    init() {
        if (!this.autoDetectBtn || !this.vciIndicator) {
            console.warn('VCI Auto-Detect: Required elements not found');
            return;
        }

        // Set initial state
        this.updateButtonState();
        
        // Listen for VCI status changes
        this.observeVCIStatus();
        
        // Add click handler for auto-detect
        this.autoDetectBtn.addEventListener('click', this.handleAutoDetect.bind(this));
    }

    observeVCIStatus() {
        // Check VCI status by looking at the indicator's CSS classes
        const observer = new MutationObserver(() => {
            this.updateVCIStatus();
        });

        observer.observe(this.vciIndicator, {
            attributes: true,
            attributeFilter: ['class']
        });

        // Initial check
        this.updateVCIStatus();
    }

    updateVCIStatus() {
        const classes = this.vciIndicator.className;
        let newStatus = 'no-vci';

        if (classes.includes('vci-indicator--connecting')) {
            newStatus = 'connecting';
        } else if (classes.includes('vci-indicator--connected')) {
            newStatus = 'connected';
        } else if (classes.includes('vci-indicator--low-battery')) {
            newStatus = 'low-battery';
        } else if (classes.includes('vci-indicator--diagnostics')) {
            newStatus = 'diagnostics';
        } else if (classes.includes('vci-indicator--disconnected')) {
            newStatus = 'disconnected';
        }

        if (newStatus !== this.currentStatus) {
            this.currentStatus = newStatus;
            this.updateButtonState();
        }
    }

    updateButtonState() {
        const isConnected = this.currentStatus === 'connected' || this.currentStatus === 'diagnostics';
        
        if (isConnected) {
            // Enable auto-detect button
            this.autoDetectBtn.disabled = false;
            this.autoDetectBtn.classList.remove('button--disabled');
            this.autoDetectBtn.classList.add('button--filled');
        } else {
            // Disable auto-detect button
            this.autoDetectBtn.disabled = true;
            this.autoDetectBtn.classList.remove('button--filled');
            this.autoDetectBtn.classList.add('button--disabled');
        }
    }

    handleAutoDetect(event) {
        event.preventDefault();
        
        if (this.currentStatus !== 'connected' && this.currentStatus !== 'diagnostics') {
            console.warn('Auto-detect: VCI not connected');
            return;
        }

        console.log('Auto-detect: Starting vehicle detection...');
        
        // Simulate auto-detection process
        this.simulateAutoDetection();
    }

    simulateAutoDetection() {
        // Show loading state
        const originalText = this.autoDetectBtn.textContent;
        this.autoDetectBtn.textContent = 'Detecting...';
        this.autoDetectBtn.disabled = true;

        // Simulate detection delay
        setTimeout(() => {
            // Reset button
            this.autoDetectBtn.textContent = originalText;
            this.autoDetectBtn.disabled = false;
            
            // Show detection result (for demo purposes)
            this.showDetectionResult();
        }, 2000);
    }

    showDetectionResult() {
        // For prototype purposes, show a mock detection result
        const mockResults = [
            'BMW 3 Series (2019)',
            'Audi A4 (2020)',
            'Mercedes C-Class (2021)',
            'Volkswagen Golf (2018)',
            'Toyota Camry (2020)'
        ];
        
        const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
        
        // Create a temporary notification
        this.showNotification(`Vehicle detected: ${randomResult}`, 'success');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            padding: '12px 16px',
            backgroundColor: type === 'success' ? '#008448' : '#0093DD',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '1000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new VCIAutoDetectController();
});

// Export for potential external use
window.VCIAutoDetectController = VCIAutoDetectController;
