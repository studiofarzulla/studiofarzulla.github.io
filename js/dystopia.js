// DYSTOPIA.JS - Interactive features for the surveillance state

// Configuration constants
const DYSTOPIA_CONFIG = {
    EYE_MAX_DISTANCE: 10,        // Maximum eye movement distance
    EYE_DISTANCE_DIVISOR: 10,    // Eye distance calculation divisor
    GLITCH_THROTTLE: 150,        // Glitch scroll throttle in ms
    GLITCH_ANIMATION_TIME: 100,  // Glitch animation duration
    GLITCH_RESET_TIME: 300,      // Time to reset glitch state
    GLITCH_MIN_INTERVAL: 3000,   // Minimum glitch interval
    GLITCH_MAX_INTERVAL: 5000,   // Maximum glitch interval
    GLITCH_PROBABILITY: 0.7,     // Probability of glitch occurring
    GLITCH_CHAR_PROBABILITY: 0.9,// Probability of character being preserved
    AUDIO_FREQUENCY: 200,        // Click sound frequency
    AUDIO_GAIN: 0.3,             // Click sound volume
    AUDIO_DURATION: 0.1,         // Click sound duration
    STATIC_CHECK_INTERVAL: 2000, // Static flicker check interval
    STATIC_PROBABILITY: 0.95,    // Probability of no static flicker
    STATIC_OPACITY_HIGH: 0.1,    // High static opacity
    STATIC_OPACITY_LOW: 0.03,    // Low static opacity
    STATIC_FLICKER_TIME: 50      // Static flicker duration
};

// Cursor tracking eye
document.addEventListener('DOMContentLoaded', () => {
    const eye = document.querySelector('.eye-inner');
    if (eye) {
        document.addEventListener('mousemove', (e) => {
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const distance = Math.min(
                DYSTOPIA_CONFIG.EYE_MAX_DISTANCE, 
                Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / DYSTOPIA_CONFIG.EYE_DISTANCE_DIVISOR
            );
            
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            eye.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }

    // Throttle helper
    function throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function(...args) {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            }
        };
    }

    // Glitch effect on scroll with throttling
    const glitchElements = document.querySelectorAll('.glitch');
    let isGlitching = false;
    
    const handleGlitchScroll = throttle(() => {
        if (!isGlitching) {
            isGlitching = true;
            glitchElements.forEach(el => {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = '';
                }, DYSTOPIA_CONFIG.GLITCH_ANIMATION_TIME);
            });
            setTimeout(() => {
                isGlitching = false;
            }, DYSTOPIA_CONFIG.GLITCH_RESET_TIME);
        }
    }, DYSTOPIA_CONFIG.GLITCH_THROTTLE);
    
    window.addEventListener('scroll', handleGlitchScroll);

    // Random glitch text - Optimized for performance
    const titles = document.querySelectorAll('.massive-title, .section-title-brutal');
    titles.forEach(title => {
        const originalText = title.textContent;
        const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        let lastGlitch = 0;
        
        // Use requestIdleCallback for better performance
        const glitchText = () => {
            const now = Date.now();
            // Only glitch every 3-5 seconds instead of every second
            if (now - lastGlitch > DYSTOPIA_CONFIG.GLITCH_MIN_INTERVAL + Math.random() * (DYSTOPIA_CONFIG.GLITCH_MAX_INTERVAL - DYSTOPIA_CONFIG.GLITCH_MIN_INTERVAL)) {
                if (Math.random() > DYSTOPIA_CONFIG.GLITCH_PROBABILITY) {
                    let glitchedText = '';
                    
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() > DYSTOPIA_CONFIG.GLITCH_CHAR_PROBABILITY) {
                            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitchedText += originalText[i];
                        }
                    }
                    
                    title.textContent = glitchedText;
                    setTimeout(() => {
                        title.textContent = originalText;
                    }, DYSTOPIA_CONFIG.GLITCH_ANIMATION_TIME);
                    lastGlitch = now;
                }
            }
            
            if ('requestIdleCallback' in window) {
                requestIdleCallback(glitchText);
            } else {
                setTimeout(glitchText, 4000);
            }
        };
        
        // Start the glitch effect
        glitchText();
    });

    // Typewriter effect
    const typewriters = document.querySelectorAll('.typewriter');
    typewriters.forEach(tw => {
        const text = tw.textContent;
        tw.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                tw.textContent += text.charAt(i);
                i++;
                setTimeout(type, DYSTOPIA_CONFIG.GLITCH_ANIMATION_TIME);
            }
        };
        
        // Start typing when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    type();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(tw);
    });

    // Click sound effect
    const buttons = document.querySelectorAll('.btn-brutal');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            try {
                // Create audio context for click sound
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // Check if AudioContext is in suspended state and resume if needed
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
                
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = DYSTOPIA_CONFIG.AUDIO_FREQUENCY;
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(DYSTOPIA_CONFIG.AUDIO_GAIN, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + DYSTOPIA_CONFIG.AUDIO_DURATION);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + DYSTOPIA_CONFIG.AUDIO_DURATION);
                
                // Clean up after sound finishes
                oscillator.onended = () => {
                    audioContext.close();
                };
            } catch (error) {
                // Silently fail if audio is not supported or blocked
                console.debug('Audio playback failed:', error.message);
            }
        });
    });

    // Parallax scrolling for sections with throttling
    const sections = document.querySelectorAll('.section-brutal');
    const handleParallax = throttle(() => {
        const scrolled = window.pageYOffset;
        sections.forEach((section, index) => {
            const speed = index % 2 === 0 ? 0.5 : 0.3;
            section.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    }, 50); // Throttle to 50ms for smooth parallax
    
    window.addEventListener('scroll', handleParallax);

    // Random static flicker
    const staticOverlay = document.querySelector('.static-overlay');
    if (staticOverlay) {
        setInterval(() => {
            if (Math.random() > DYSTOPIA_CONFIG.STATIC_PROBABILITY) {
                staticOverlay.style.opacity = DYSTOPIA_CONFIG.STATIC_OPACITY_HIGH.toString();
                setTimeout(() => {
                    staticOverlay.style.opacity = DYSTOPIA_CONFIG.STATIC_OPACITY_LOW.toString();
                }, DYSTOPIA_CONFIG.STATIC_FLICKER_TIME);
            }
        }, DYSTOPIA_CONFIG.STATIC_CHECK_INTERVAL);
    }

    // Hover effect for poetry
    const poetryContainers = document.querySelectorAll('.poetry-container');
    poetryContainers.forEach(container => {
        container.addEventListener('mouseenter', () => {
            container.style.borderColor = '#FF0000';
            container.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.5)';
        });
        
        container.addEventListener('mouseleave', () => {
            container.style.borderColor = '';
            container.style.boxShadow = '';
        });
    });

    // Console warnings
    console.log('%cWARNING', 'color: red; font-size: 30px; font-weight: bold;');
    console.log('%cTHIS CONSOLE IS MONITORED', 'color: red; font-size: 20px;');
    console.log('%cTHOUGHT CRIME DETECTED', 'color: red; font-size: 15px;');
    console.log('%cYOUR IP HAS BEEN LOGGED', 'color: red; font-size: 15px;');
    console.log('%c...just kidding. Welcome to the void.', 'color: white; font-size: 12px;');

    // Mobile menu toggle
    const navLinks = document.querySelector('.nav-links');
    const brandMark = document.querySelector('.brand-mark');
    
    if (window.innerWidth <= 768) {
        brandMark.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'var(--void-black)';
            navLinks.style.flexDirection = 'column';
            navLinks.style.padding = '2rem';
            navLinks.style.borderBottom = '2px solid var(--blood-red)';
        });
    }
});

// Secret konami code easter egg
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.join(',') === konamiPattern.join(',')) {
        document.body.style.animation = 'glitch-1 0.5s infinite';
        setTimeout(() => {
            document.body.style.animation = '';
            alert('THE SYSTEM HAS BEEN BREACHED\n\nWELCOME TO THE RESISTANCE');
        }, 2000);
    }
});