// GSAP Animations and Scroll Triggers
class AnimationController {
    constructor() {
        this.init();
    }
    
    init() {
        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Initialize animations
        this.setupLoadingAnimation();
        this.setupHeroAnimations();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupCounterAnimations();
        this.setupParallaxEffects();
    }
    
    setupLoadingAnimation() {
        // Hide loading screen with animation
        const tl = gsap.timeline();
        
        tl.to('#loading-screen', {
            opacity: 0,
            duration: 0.5,
            ease: "power2.out"
        })
        .set('#loading-screen', { display: 'none' });
    }
    
    setupHeroAnimations() {
        const tl = gsap.timeline({ delay: 0.5 });
        
        // Hero title animation
        tl.from('.hero-title .title-line', {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out"
        })
        .from('.hero-description', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        }, "-=0.5")
        .from('.hero-buttons .btn', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.3")
        .from('.hero-stats .stat-item', {
            y: 30,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.2");
    }
    
    setupScrollAnimations() {
        // Section headers
        gsap.utils.toArray('.section-header').forEach(header => {
            gsap.from(header, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Paper cards
        gsap.utils.toArray('.paper-card').forEach((card, index) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Feature items
        gsap.utils.toArray('.feature-item').forEach((item, index) => {
            gsap.from(item, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                delay: index * 0.1,
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                }
            });
        });
        
        // Upload form
        gsap.from('.upload-container', {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
                trigger: '.upload-container',
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });
    }
    
    setupHoverEffects() {
        // Button hover effects
        gsap.utils.toArray('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                gsap.to(btn, {
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // Paper card hover effects
        gsap.utils.toArray('.paper-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -10,
                    scale: 1.02,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
        
        // Feature item hover effects
        gsap.utils.toArray('.feature-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                gsap.to(item, {
                    y: -5,
                    scale: 1.05,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
            
            item.addEventListener('mouseleave', () => {
                gsap.to(item, {
                    y: 0,
                    scale: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });
        });
    }
    
    setupCounterAnimations() {
        // Counter animation for stats
        gsap.utils.toArray('.stat-number').forEach(counter => {
            const target = parseInt(counter.dataset.target);
            
            ScrollTrigger.create({
                trigger: counter,
                start: "top 80%",
                onEnter: () => {
                    gsap.to(counter, {
                        innerHTML: target,
                        duration: 2,
                        ease: "power2.out",
                        snap: { innerHTML: 1 },
                        onUpdate: function() {
                            counter.innerHTML = Math.ceil(counter.innerHTML);
                        }
                    });
                }
            });
        });
    }
    
    setupParallaxEffects() {
        // Parallax effect for hero section
        gsap.to('.hero-content', {
            yPercent: -50,
            ease: "none",
            scrollTrigger: {
                trigger: '.hero',
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
        
        // Parallax effect for floating elements
        gsap.utils.toArray('.feature-item').forEach((item, index) => {
            gsap.to(item, {
                y: -50 * (index % 2 === 0 ? 1 : -1),
                ease: "none",
                scrollTrigger: {
                    trigger: item,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    }
    
    // Animation for new elements
    animateIn(element, delay = 0) {
        gsap.from(element, {
            y: 50,
            opacity: 0,
            duration: 0.6,
            delay: delay,
            ease: "power2.out"
        });
    }
    
    // Animation for removing elements
    animateOut(element, callback) {
        gsap.to(element, {
            y: -50,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: callback
        });
    }
    
    // Shake animation for errors
    shakeElement(element) {
        gsap.to(element, {
            x: -10,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 5
        });
    }
    
    // Pulse animation for loading
    pulseElement(element) {
        gsap.to(element, {
            scale: 1.1,
            duration: 0.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    
    // Stop pulse animation
    stopPulse(element) {
        gsap.killTweensOf(element);
        gsap.to(element, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    }
    
    // Modal animations
    showModal(modal) {
        gsap.set(modal, { display: 'block' });
        gsap.from(modal, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out"
        });
        gsap.from(modal.querySelector('.modal-content'), {
            scale: 0.8,
            y: 50,
            duration: 0.4,
            ease: "back.out(1.7)"
        });
    }
    
    hideModal(modal) {
        gsap.to(modal, {
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                gsap.set(modal, { display: 'none' });
            }
        });
        gsap.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            y: 50,
            duration: 0.3,
            ease: "power2.in"
        });
    }
    
    // Upload area animations
    animateUploadArea(uploadArea, isDragOver) {
        if (isDragOver) {
            gsap.to(uploadArea, {
                scale: 1.05,
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            gsap.to(uploadArea, {
                scale: 1,
                backgroundColor: "var(--bg-secondary)",
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }
    
    // Search animation
    animateSearch() {
        const searchBox = document.querySelector('.search-box input');
        gsap.to(searchBox, {
            scale: 1.02,
            duration: 0.1,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
        });
    }
    
    // Success animation
    showSuccess(message) {
        const successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.textContent = message;
        successElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--accent-color);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            transform: translateX(100%);
        `;
        
        document.body.appendChild(successElement);
        
        gsap.to(successElement, {
            x: 0,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        setTimeout(() => {
            gsap.to(successElement, {
                x: '100%',
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    document.body.removeChild(successElement);
                }
            });
        }, 3000);
    }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Utility functions for global access
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        gsap.to(window, {
            duration: 1,
            scrollTo: {
                y: section,
                offsetY: 80
            },
            ease: "power2.inOut"
        });
    }
}

function animateElement(element, animationType = 'fadeIn') {
    if (window.animationController) {
        switch (animationType) {
            case 'fadeIn':
                window.animationController.animateIn(element);
                break;
            case 'shake':
                window.animationController.shakeElement(element);
                break;
            case 'pulse':
                window.animationController.pulseElement(element);
                break;
        }
    }
}
