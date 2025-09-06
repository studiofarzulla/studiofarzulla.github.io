// Studio Farzulla - Dark Theme JavaScript Engine
// Enhanced animations, interactions, and dark theme support

;(function () {
    'use strict'

    // Configuration constants
    const PARTICLE_CONFIG = {
        AREA_DIVISOR: 15000, // Controls particle density
        MAX_PARTICLES: 150, // Maximum particle count
        MIN_PARTICLES: 20, // Minimum particle count
        MOUSE_RADIUS: 150, // Mouse interaction radius
        MOUSE_FORCE: 0.03, // Mouse repulsion force
        SPEED_RANGE: 0.5, // Particle speed range
        SIZE_MAX: 2, // Maximum particle size
        OPACITY_MIN: 0.2, // Minimum particle opacity
        OPACITY_RANGE: 0.5, // Particle opacity range
    }

    // Dark Theme Particle System (Subtle background effect)
    class ParticleSystem {
        constructor() {
            this.canvas = null
            this.ctx = null
            this.particles = []
            this.mouse = { x: null, y: null, radius: PARTICLE_CONFIG.MOUSE_RADIUS }
            this.animationId = null
            this.resizeHandler = null
            this.mouseMoveHandler = null
            this.resizeTimeoutId = null
            this.isDestroyed = false
            this.init()
        }

        init() {
            if (this.isDestroyed) return

            try {
                // Create canvas for particles
                this.canvas = document.createElement('canvas')
                this.canvas.style.position = 'fixed'
                this.canvas.style.top = '0'
                this.canvas.style.left = '0'
                this.canvas.style.width = '100%'
                this.canvas.style.height = '100%'
                this.canvas.style.pointerEvents = 'none'
                this.canvas.style.zIndex = '1'
                this.canvas.style.opacity = '0.3'
                document.body.appendChild(this.canvas)

                this.ctx = this.canvas.getContext('2d')
                if (!this.ctx) {
                    throw new Error('Unable to get 2D context')
                }

                this.resize()
                this.createParticles()
                this.animate()
            } catch (error) {
                console.warn('Particle system initialization failed:', error.message)
                this.destroy()
                return
            }

            // Store event handlers for cleanup
            this.resizeHandler = () => {
                // Debounce resize to prevent particle recreation spam
                clearTimeout(this.resizeTimeoutId)
                this.resizeTimeoutId = setTimeout(() => {
                    this.resize()
                    this.adjustParticleCount()
                }, 250)
            }
            this.mouseMoveHandler = (e) => {
                this.mouse.x = e.x
                this.mouse.y = e.y
            }

            window.addEventListener('resize', this.resizeHandler)
            window.addEventListener('mousemove', this.mouseMoveHandler)
        }

        resize() {
            this.canvas.width = window.innerWidth
            this.canvas.height = window.innerHeight
        }

        createParticles() {
            const particleCount = Math.min(
                PARTICLE_CONFIG.MAX_PARTICLES,
                Math.max(
                    PARTICLE_CONFIG.MIN_PARTICLES,
                    Math.floor(
                        (window.innerWidth * window.innerHeight) / PARTICLE_CONFIG.AREA_DIVISOR,
                    ),
                ),
            )

            this.particles = [] // Clear existing particles
            for (let i = 0; i < particleCount; i++) {
                this.particles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * PARTICLE_CONFIG.SIZE_MAX,
                    speedX:
                        Math.random() * PARTICLE_CONFIG.SPEED_RANGE -
                        PARTICLE_CONFIG.SPEED_RANGE / 2,
                    speedY:
                        Math.random() * PARTICLE_CONFIG.SPEED_RANGE -
                        PARTICLE_CONFIG.SPEED_RANGE / 2,
                    opacity:
                        Math.random() * PARTICLE_CONFIG.OPACITY_RANGE + PARTICLE_CONFIG.OPACITY_MIN,
                })
            }
        }

        adjustParticleCount() {
            const targetCount = Math.min(
                PARTICLE_CONFIG.MAX_PARTICLES,
                Math.max(
                    PARTICLE_CONFIG.MIN_PARTICLES,
                    Math.floor(
                        (window.innerWidth * window.innerHeight) / PARTICLE_CONFIG.AREA_DIVISOR,
                    ),
                ),
            )

            const currentCount = this.particles.length
            if (Math.abs(targetCount - currentCount) > 10) {
                this.createParticles()
            }
        }

        animate() {
            if (this.isDestroyed) return

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

            this.particles.forEach((particle) => {
                // Update position
                particle.x += particle.speedX
                particle.y += particle.speedY

                // Wrap around edges
                if (particle.x > this.canvas.width) particle.x = 0
                if (particle.x < 0) particle.x = this.canvas.width
                if (particle.y > this.canvas.height) particle.y = 0
                if (particle.y < 0) particle.y = this.canvas.height

                // Mouse interaction
                const dx = this.mouse.x - particle.x
                const dy = this.mouse.y - particle.y
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < this.mouse.radius) {
                    const force = (this.mouse.radius - distance) / this.mouse.radius
                    particle.x -= dx * force * PARTICLE_CONFIG.MOUSE_FORCE
                    particle.y -= dy * force * PARTICLE_CONFIG.MOUSE_FORCE
                }

                // Draw particle
                this.ctx.fillStyle = `rgba(79, 158, 255, ${particle.opacity})`
                this.ctx.beginPath()
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
                this.ctx.fill()
            })

            this.animationId = requestAnimationFrame(() => this.animate())
        }

        destroy() {
            this.isDestroyed = true

            // Cancel animation
            if (this.animationId) {
                cancelAnimationFrame(this.animationId)
                this.animationId = null
            }

            // Clear resize timeout
            if (this.resizeTimeoutId) {
                clearTimeout(this.resizeTimeoutId)
                this.resizeTimeoutId = null
            }

            // Remove event listeners
            if (this.resizeHandler) {
                window.removeEventListener('resize', this.resizeHandler)
                this.resizeHandler = null
            }
            if (this.mouseMoveHandler) {
                window.removeEventListener('mousemove', this.mouseMoveHandler)
                this.mouseMoveHandler = null
            }

            // Remove canvas
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas)
                this.canvas = null
                this.ctx = null
            }

            // Clear particles array
            this.particles = []
        }
    }

    // Initialize particle system only on desktop
    let particleSystem = null
    if (window.innerWidth > 768) {
        particleSystem = new ParticleSystem()
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (particleSystem) {
            particleSystem.destroy()
        }
    })

    // Cache DOM Elements
    const domCache = {
        navToggle: null,
        navMenu: null,
        navLinks: null,
        sections: null,
        cards: null,
        navbar: null,
        heroTitle: null,
        heroContent: null,
        buttons: null,

        init() {
            this.navToggle = document.querySelector('.nav-toggle')
            this.navMenu = document.querySelector('.nav-menu')
            this.navLinks = document.querySelectorAll('.nav-link')
            this.sections = document.querySelectorAll('.section')
            this.cards = document.querySelectorAll('.card')
            this.navbar = document.querySelector('.navbar')
            this.heroTitle = document.querySelector('.hero-title')
            this.heroContent = document.querySelector('.hero-content')
            this.buttons = document.querySelectorAll('.btn')
        },
    }

    // Initialize DOM cache when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => domCache.init())
    } else {
        domCache.init()
    }

    // Use cached references
    const { navToggle, navMenu, navLinks, sections, cards, navbar } = domCache

    // Throttle function (moved up for reuse)
    function throttle(func, delay) {
        let timeoutId
        let lastExecTime = 0
        return function (...args) {
            const currentTime = Date.now()
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args)
                lastExecTime = currentTime
            }
        }
    }

    // Navbar scroll effect with throttling
    let lastScroll = 0
    const handleScroll = throttle(() => {
        const currentScroll = window.pageYOffset

        if (!navbar) return

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)'
            navbar.style.backdropFilter = 'blur(30px)'
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.8)'
            navbar.style.backdropFilter = 'blur(20px)'
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)'
        } else {
            navbar.style.transform = 'translateY(0)'
        }
        lastScroll = currentScroll
    }, 100) // Throttle to 100ms

    window.addEventListener('scroll', handleScroll)

    // Enhanced Mobile Navigation Toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active')
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : ''

            // Animate hamburger menu
            const spans = navToggle.querySelectorAll('span')
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(6px)'
                spans[1].style.opacity = '0'
                spans[2].style.transform = 'rotate(-45deg) translateY(-6px)'
            } else {
                spans[0].style.transform = 'none'
                spans[1].style.opacity = '1'
                spans[2].style.transform = 'none'
            }
        })

        // Close mobile menu when clicking a link
        navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active')
                document.body.style.overflow = ''
                const spans = navToggle.querySelectorAll('span')
                spans[0].style.transform = 'none'
                spans[1].style.opacity = '1'
                spans[2].style.transform = 'none'
            })
        })
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            if (target) {
                const offsetTop = target.offsetTop - 80
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                })
            }
        })
    })

    // Enhanced Card Hover Effects
    cards.forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top

            const centerX = rect.width / 2
            const centerY = rect.height / 2

            const rotateX = (y - centerY) / 20
            const rotateY = (centerX - x) / 20

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`
        })

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)'
        })
    })

    // Typing Effect for Hero Title
    const heroTitle = document.querySelector('.hero-title')
    if (heroTitle) {
        const text = heroTitle.textContent
        heroTitle.textContent = ''
        heroTitle.style.minHeight = '1.2em'

        let i = 0
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i)
                i++
                setTimeout(typeWriter, 100)
            }
        }

        setTimeout(typeWriter, 500)
    }

    // Intersection Observer for Advanced Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in')
                }, index * 100)
                observer.unobserve(entry.target)
            }
        })
    }, observerOptions)

    // Observe elements for animations
    sections.forEach((section) => {
        section.style.opacity = '0'
        observer.observe(section)
    })

    cards.forEach((card, index) => {
        card.style.opacity = '0'
        card.style.transform = 'translateY(30px)'
        setTimeout(() => {
            observer.observe(card)
        }, index * 50)
    })

    // Magnetic Button Effect
    document.querySelectorAll('.btn').forEach((button) => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect()
            const x = e.clientX - rect.left - rect.width / 2
            const y = e.clientY - rect.top - rect.height / 2

            button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
        })

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)'
        })
    })

    // Custom Cursor (Desktop only)
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div')
        cursor.className = 'custom-cursor'
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid rgba(79, 158, 255, 0.5);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
            transform: translate(-50%, -50%);
        `
        document.body.appendChild(cursor)

        const cursorDot = document.createElement('div')
        cursorDot.style.cssText = `
            width: 4px;
            height: 4px;
            background: rgba(79, 158, 255, 0.8);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
        `
        document.body.appendChild(cursorDot)

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px'
            cursor.style.top = e.clientY + 'px'
            cursorDot.style.left = e.clientX + 'px'
            cursorDot.style.top = e.clientY + 'px'
        })

        document.addEventListener('mousedown', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(0.8)'
        })

        document.addEventListener('mouseup', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)'
        })

        // Hide on hover over links and buttons
        document.querySelectorAll('a, button, .btn').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)'
                cursor.style.borderColor = 'rgba(79, 158, 255, 0.8)'
            })
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)'
                cursor.style.borderColor = 'rgba(79, 158, 255, 0.5)'
            })
        })
    }

    // Page Load Animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded')

        // Animate hero elements
        const heroContent = document.querySelector('.hero-content')
        if (heroContent) {
            heroContent.style.animation = 'fadeInUp 1s ease-out'
        }
    })

    // Performance optimization
    let ticking = false
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations)
            ticking = true
        }
    }

    function updateAnimations() {
        ticking = false
    }

    // Throttle function
    function throttle(func, delay) {
        let timeoutId
        let lastExecTime = 0
        return function (...args) {
            const currentTime = Date.now()
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args)
                lastExecTime = currentTime
            }
        }
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            }
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    // Handle resize events
    const handleResize = debounce(() => {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active')
            document.body.style.overflow = ''
        }
    }, 250)

    window.addEventListener('resize', handleResize)

    // Initialize
    document.body.classList.add('dark-theme')
})()
