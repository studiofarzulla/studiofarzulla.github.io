// Lazy Loading for Images
(function() {
    'use strict';

    // Configuration
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01
    };

    // Check if native lazy loading is supported
    const supportsLazyLoading = 'loading' in HTMLImageElement.prototype;

    // Image lazy loading with Intersection Observer
    function initLazyLoading() {
        // Get all images with loading="lazy" attribute
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if (supportsLazyLoading) {
            // Browser supports native lazy loading
            images.forEach(img => {
                // Ensure src is set for native lazy loading
                if (img.dataset.src && !img.src) {
                    img.src = img.dataset.src;
                }
            });
        } else {
            // Use Intersection Observer for older browsers
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Add loading class
                        img.classList.add('loading');
                        
                        // Load image
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        // Handle srcset for responsive images
                        if (img.dataset.srcset) {
                            img.srcset = img.dataset.srcset;
                            img.removeAttribute('data-srcset');
                        }
                        
                        // Remove loading class when loaded
                        img.addEventListener('load', () => {
                            img.classList.remove('loading');
                            img.classList.add('loaded');
                        });
                        
                        // Stop observing this image
                        observer.unobserve(img);
                    }
                });
            }, config);

            images.forEach(img => {
                // Move src to data-src for lazy loading
                if (img.src && !img.dataset.src) {
                    img.dataset.src = img.src;
                    img.removeAttribute('src');
                }
                
                // Add placeholder
                if (!img.style.backgroundColor) {
                    img.style.backgroundColor = '#f3f4f6';
                    img.style.minHeight = '200px';
                }
                
                imageObserver.observe(img);
            });
        }
    }

    // WebP support detection and image optimization
    function checkWebPSupport() {
        return new Promise((resolve) => {
            const webP = new Image();
            webP.onload = webP.onerror = () => {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    // Convert image sources to WebP if supported
    async function optimizeImages() {
        const supportsWebP = await checkWebPSupport();
        
        if (supportsWebP) {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                const src = img.dataset.src || img.src;
                
                // Skip if already WebP or external URL
                if (src && !src.includes('.webp') && !src.startsWith('http')) {
                    // Check if WebP version exists (you would generate these)
                    const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                    
                    // For demonstration, we'll keep original format
                    // In production, you'd have WebP versions ready
                    console.debug('WebP supported. Consider converting:', src);
                }
            });
        }
    }

    // Progressive image loading with blur-up effect
    function initProgressiveImages() {
        const progressiveImages = document.querySelectorAll('.progressive-image');
        
        progressiveImages.forEach(container => {
            const small = container.querySelector('.img-small');
            const large = container.querySelector('.img-large');
            
            if (small && large) {
                // Load small image first
                const smallImg = new Image();
                smallImg.src = small.src;
                smallImg.onload = () => {
                    small.classList.add('loaded');
                };
                
                // Then load large image
                const largeImg = new Image();
                largeImg.src = large.dataset.src;
                largeImg.onload = () => {
                    large.src = largeImg.src;
                    large.classList.add('loaded');
                    // Fade out small image
                    setTimeout(() => {
                        small.style.opacity = '0';
                    }, 50);
                };
            }
        });
    }

    // Preload critical images
    function preloadCriticalImages() {
        // Preload hero images or other critical images
        const criticalImages = document.querySelectorAll('[data-critical]');
        criticalImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.dataset.src || img.src;
            document.head.appendChild(link);
        });
    }

    // Initialize everything
    document.addEventListener('DOMContentLoaded', function() {
        initLazyLoading();
        optimizeImages();
        initProgressiveImages();
        preloadCriticalImages();
    });

    // Reinitialize on dynamic content load
    window.reinitLazyLoading = function() {
        initLazyLoading();
    };

    // Add styles for loading states
    const style = document.createElement('style');
    style.textContent = `
        img.loading {
            filter: blur(5px);
            transition: filter 0.3s;
        }
        
        img.loaded {
            filter: blur(0);
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .progressive-image {
            position: relative;
            overflow: hidden;
        }
        
        .progressive-image .img-small {
            filter: blur(20px);
            transition: opacity 0.3s;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .progressive-image .img-large {
            transition: opacity 0.3s;
            opacity: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .progressive-image .img-large.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

})();