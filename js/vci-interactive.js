/**
 * Interactive VCI Controller
 * Allows users to click the VCI indicator to trigger realistic state changes
 * Uses a simpler approach that works with the static Nunjucks template
 */

class VCIInteractiveController {
    constructor() {
        this.vciIndicator = document.querySelector('.vci-indicator');
        this.currentStatus = 'no-vci';
        this.isTransitioning = false;
        
        this.init();
    }

    init() {
        if (!this.vciIndicator) {
            console.warn('VCI Interactive: VCI indicator not found');
            return;
        }

        // Add click handler to VCI indicator
        this.vciIndicator.addEventListener('click', this.handleVCIClick.bind(this));
        
        // Add cursor pointer to indicate it's clickable
        this.vciIndicator.style.cursor = 'pointer';
        
        // Add tooltip
        this.addTooltip();
    }

    addTooltip() {
        const tooltip = document.createElement('div');
        tooltip.className = 'vci-tooltip';
        tooltip.textContent = 'Click to connect VCI';
        tooltip.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s ease;
            z-index: 1000;
        `;
        
        this.vciIndicator.style.position = 'relative';
        this.vciIndicator.appendChild(tooltip);
        
        // Show/hide tooltip on hover
        this.vciIndicator.addEventListener('mouseenter', () => {
            if (this.currentStatus === 'no-vci') {
                tooltip.style.opacity = '1';
            }
        });
        
        this.vciIndicator.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
        });
    }

    handleVCIClick(event) {
        event.preventDefault();
        
        if (this.isTransitioning) {
            return; // Prevent multiple clicks during transition
        }

        switch (this.currentStatus) {
            case 'no-vci':
                this.startConnection();
                break;
            case 'connected':
                this.startDiagnostics();
                break;
            case 'diagnostics':
                this.completeDiagnostics();
                break;
            case 'low-battery':
                this.reconnect();
                break;
            case 'disconnected':
                this.reconnect();
                break;
            default:
                console.log('VCI Interactive: Unknown status', this.currentStatus);
        }
    }

    startConnection() {
        console.log('VCI Interactive: Starting connection...');
        this.isTransitioning = true;
        
        // Show connecting state by updating the label and icon
        this.showConnectingState();
        
        // Simulate connection delay
        setTimeout(() => {
            // Random chance of connection failure (10%)
            if (Math.random() < 0.1) {
                this.connectionFailed();
            } else {
                this.connectionSuccessful();
            }
        }, 2500);
    }

    showConnectingState() {
        // Update the label text
        const label = this.vciIndicator.querySelector('.vci-indicator__label');
        if (label) {
            label.textContent = 'Connecting...';
        }

        // Update CSS class for animation
        this.updateVCIStatus('connecting');

        // Update tooltip
        this.updateTooltip('Connecting...');
    }


    connectionSuccessful() {
        console.log('VCI Interactive: Connection successful');
        this.currentStatus = 'connected';
        this.isTransitioning = false;

        // Update the label text
        const label = this.vciIndicator.querySelector('.vci-indicator__label');
        if (label) {
            label.textContent = 'Connected';
        }

        // Update CSS class for animation
        this.updateVCIStatus('connected');

        // Update tooltip
        this.updateTooltip('Click to run diagnostics');

        // Show success notification
        this.showNotification('VCI Connected Successfully', 'success');
    }


    connectionFailed() {
        console.log('VCI Interactive: Connection failed');
        this.currentStatus = 'disconnected';
        this.isTransitioning = false;

        // Update the label text
        const label = this.vciIndicator.querySelector('.vci-indicator__label');
        if (label) {
            label.textContent = 'Disconnected';
        }

        // Update CSS class for animation
        this.updateVCIStatus('disconnected');

        // Update tooltip
        this.updateTooltip('Click to reconnect');

        // Show error notification
        this.showNotification('VCI Connection Failed', 'error');
    }


    startDiagnostics() {
        console.log('VCI Interactive: Starting diagnostics...');
        this.isTransitioning = true;

        // Update the label text
        const label = this.vciIndicator.querySelector('.vci-indicator__label');
        if (label) {
            label.textContent = 'Running Diagnostics';
        }

        // Update CSS class for animation
        this.updateVCIStatus('diagnostics');

        // Update tooltip
        this.updateTooltip('Running diagnostics...');

        // Simulate diagnostics delay
        setTimeout(() => {
            // Random chance of low battery (15%)
            if (Math.random() < 0.15) {
                this.currentStatus = 'low-battery';
                if (label) {
                    label.textContent = 'Low Battery';
                }
                this.updateVCIStatus('low-battery');
                this.updateTooltip('Click to reconnect');
                this.showNotification('VCI Battery Low', 'warning');
            } else {
                this.completeDiagnostics();
            }
        }, 4000);
    }



    completeDiagnostics() {
        console.log('VCI Interactive: Diagnostics complete');
        this.currentStatus = 'connected';
        this.isTransitioning = false;
        
        // Update the label text
        const label = this.vciIndicator.querySelector('.vci-indicator__label');
        if (label) {
            label.textContent = 'Connected';
        }
        
        // Update CSS class for animation
        this.updateVCIStatus('connected');
        
        // Update tooltip
        this.updateTooltip('Click to run diagnostics');
        
        // Show completion notification
        this.showNotification('Vehicle Diagnostics Complete', 'success');
    }

    reconnect() {
        console.log('VCI Interactive: Reconnecting...');
        this.startConnection();
    }

    updateVCIStatus(newStatus) {
        // Remove all status classes
        this.vciIndicator.className = this.vciIndicator.className
            .replace(/vci-indicator--\w+/g, '')
            .trim();
        
        // Add new status class
        this.vciIndicator.classList.add(`vci-indicator--${newStatus}`);
        
        // Update current status
        this.currentStatus = newStatus;
    }

    updateTooltip(text) {
        const tooltip = this.vciIndicator.querySelector('.vci-tooltip');
        if (tooltip) {
            tooltip.textContent = text;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.textContent = message;
        
        // Style the notification
        const colors = {
            success: '#008448',
            error: '#D32F2F',
            warning: '#F57C00',
            info: '#0093DD'
        };
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '80px',
            right: '20px',
            padding: '12px 16px',
            backgroundColor: colors[type] || colors.info,
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
    new VCIInteractiveController();
});

// Export for potential external use
window.VCIInteractiveController = VCIInteractiveController;
