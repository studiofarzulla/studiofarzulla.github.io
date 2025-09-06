// DYSTOPIA.JS - Interactive features for the surveillance state

// Cursor tracking eye
document.addEventListener('DOMContentLoaded', () => {
    const eye = document.querySelector('.eye-inner');
    if (eye) {
        document.addEventListener('mousemove', (e) => {
            const eyeRect = eye.getBoundingClientRect();
            const eyeCenterX = eyeRect.left + eyeRect.width / 2;
            const eyeCenterY = eyeRect.top + eyeRect.height / 2;
            
            const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
            const distance = Math.min(10, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10);
            
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            eye.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }

    // Glitch effect on scroll
    const glitchElements = document.querySelectorAll('.glitch');
    let isGlitching = false;
    
    window.addEventListener('scroll', () => {
        if (!isGlitching) {
            isGlitching = true;
            glitchElements.forEach(el => {
                el.style.animation = 'none';
                setTimeout(() => {
                    el.style.animation = '';
                }, 100);
            });
            setTimeout(() => {
                isGlitching = false;
            }, 300);
        }
    });

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
            if (now - lastGlitch > 3000 + Math.random() * 2000) {
                if (Math.random() > 0.7) {
                    let glitchedText = '';
                    
                    for (let i = 0; i < originalText.length; i++) {
                        if (Math.random() > 0.9) {
                            glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                        } else {
                            glitchedText += originalText[i];
                        }
                    }
                    
                    title.textContent = glitchedText;
                    setTimeout(() => {
                        title.textContent = originalText;
                    }, 100);
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
                setTimeout(type, 100);
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
                
                oscillator.frequency.value = 200;
                oscillator.type = 'square';
                gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.1);
                
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

    // Parallax scrolling for sections
    const sections = document.querySelectorAll('.section-brutal');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        sections.forEach((section, index) => {
            const speed = index % 2 === 0 ? 0.5 : 0.3;
            section.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
    });

    // Random static flicker
    const staticOverlay = document.querySelector('.static-overlay');
    if (staticOverlay) {
        setInterval(() => {
            if (Math.random() > 0.95) {
                staticOverlay.style.opacity = '0.1';
                setTimeout(() => {
                    staticOverlay.style.opacity = '0.03';
                }, 50);
            }
        }, 2000);
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