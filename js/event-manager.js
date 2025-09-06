// Centralized Event Listener Management System
;(function () {
    'use strict'

    // Event Manager - Centralized control for all event listeners
    class EventManager {
        constructor() {
            this.listeners = new Map()
            this.globalListeners = new Set()
            this.isDestroyed = false
        }

        // Add an event listener with automatic tracking
        addEventListener(element, event, handler, options = false) {
            if (this.isDestroyed) return

            if (!element || !event || !handler) {
                console.warn('EventManager: Invalid parameters')
                return
            }

            // Create unique key for this listener
            const key = this.generateKey(element, event, handler)

            // Store listener info
            this.listeners.set(key, {
                element,
                event,
                handler,
                options,
                active: true,
            })

            // Add the actual event listener
            element.addEventListener(event, handler, options)

            // Track global listeners for cleanup
            if (element === window || element === document || element === document.body) {
                this.globalListeners.add(key)
            }

            return key
        }

        // Remove a specific event listener
        removeEventListener(key) {
            const listener = this.listeners.get(key)
            if (listener && listener.active) {
                listener.element.removeEventListener(
                    listener.event,
                    listener.handler,
                    listener.options,
                )
                listener.active = false
                this.listeners.delete(key)
                this.globalListeners.delete(key)
            }
        }

        // Add multiple event listeners at once
        addMultipleListeners(configs) {
            const keys = []
            configs.forEach((config) => {
                const key = this.addEventListener(
                    config.element,
                    config.event,
                    config.handler,
                    config.options,
                )
                if (key) keys.push(key)
            })
            return keys
        }

        // Remove all listeners for a specific element
        removeElementListeners(element) {
            this.listeners.forEach((listener, key) => {
                if (listener.element === element && listener.active) {
                    this.removeEventListener(key)
                }
            })
        }

        // Remove all listeners of a specific type
        removeEventTypeListeners(eventType) {
            this.listeners.forEach((listener, key) => {
                if (listener.event === eventType && listener.active) {
                    this.removeEventListener(key)
                }
            })
        }

        // Pause/resume listeners
        pauseListener(key) {
            const listener = this.listeners.get(key)
            if (listener && listener.active) {
                listener.element.removeEventListener(
                    listener.event,
                    listener.handler,
                    listener.options,
                )
                listener.active = false
            }
        }

        resumeListener(key) {
            const listener = this.listeners.get(key)
            if (listener && !listener.active) {
                listener.element.addEventListener(
                    listener.event,
                    listener.handler,
                    listener.options,
                )
                listener.active = true
            }
        }

        // Clean up all event listeners
        destroy() {
            this.isDestroyed = true

            // Remove all active listeners
            this.listeners.forEach((listener, key) => {
                if (listener.active) {
                    try {
                        listener.element.removeEventListener(
                            listener.event,
                            listener.handler,
                            listener.options,
                        )
                    } catch (error) {
                        console.warn('Failed to remove listener:', error)
                    }
                }
            })

            // Clear all tracking
            this.listeners.clear()
            this.globalListeners.clear()
        }

        // Generate unique key for listener
        generateKey(element, event, handler) {
            const elementId = element.id || element.className || element.tagName || 'unknown'
            const handlerStr = handler.toString().substring(0, 50)
            return `${elementId}_${event}_${Date.now()}_${Math.random()}`
        }

        // Get statistics about registered listeners
        getStats() {
            const stats = {
                total: this.listeners.size,
                active: 0,
                paused: 0,
                global: this.globalListeners.size,
                byEvent: {},
                byElement: {},
            }

            this.listeners.forEach((listener) => {
                if (listener.active) stats.active++
                else stats.paused++

                // Count by event type
                stats.byEvent[listener.event] = (stats.byEvent[listener.event] || 0) + 1

                // Count by element type
                const elementType = listener.element.tagName || 'window/document'
                stats.byElement[elementType] = (stats.byElement[elementType] || 0) + 1
            })

            return stats
        }

        // Debug helper to list all active listeners
        listActiveListeners() {
            const active = []
            this.listeners.forEach((listener, key) => {
                if (listener.active) {
                    active.push({
                        key,
                        element: listener.element.tagName || listener.element.constructor.name,
                        event: listener.event,
                        options: listener.options,
                    })
                }
            })
            return active
        }
    }

    // Create global instance
    window.eventManager = new EventManager()

    // Auto-cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (window.eventManager) {
            window.eventManager.destroy()
        }
    })

    // Helper functions for common patterns
    window.eventManager.utils = {
        // Delegate event handling
        delegate(parentSelector, childSelector, eventType, handler) {
            const parent = document.querySelector(parentSelector)
            if (!parent) return null

            const delegatedHandler = (e) => {
                const target = e.target.closest(childSelector)
                if (target && parent.contains(target)) {
                    handler.call(target, e)
                }
            }

            return window.eventManager.addEventListener(parent, eventType, delegatedHandler, true)
        },

        // Once - remove after first trigger
        once(element, event, handler) {
            const onceHandler = (e) => {
                handler(e)
                window.eventManager.removeEventListener(key)
            }
            const key = window.eventManager.addEventListener(element, event, onceHandler)
            return key
        },

        // Debounced event listener
        debounced(element, event, handler, delay = 250) {
            let timeoutId
            const debouncedHandler = (...args) => {
                clearTimeout(timeoutId)
                timeoutId = setTimeout(() => handler(...args), delay)
            }
            return window.eventManager.addEventListener(element, event, debouncedHandler)
        },

        // Throttled event listener
        throttled(element, event, handler, delay = 100) {
            let lastTime = 0
            const throttledHandler = (...args) => {
                const now = Date.now()
                if (now - lastTime >= delay) {
                    handler(...args)
                    lastTime = now
                }
            }
            return window.eventManager.addEventListener(element, event, throttledHandler)
        },
    }
})()
