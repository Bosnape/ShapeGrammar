/**
 * Shape Grammar Tools Website
 * Professional JavaScript for enhanced user experience
 */

class ShapeGrammarWebsite {
  constructor() {
    this.currentTab = "downloads"
    this.downloadStats = {
      blender_addon: 0,
      examples: 0,
      shape_grammar_gui: 0,
    }

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.setupScrollAnimations()
    this.checkFileAvailability()
    this.loadDownloadStats()
    this.setupHeroVisibility()
  }

  setupEventListeners() {
    // Top navbar navigation
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => this.handleNavLinkClick(e))
    })

    // Tab navigation (if present)
    const navTabs = document.querySelectorAll(".nav-tab")
    navTabs.forEach((tab) => {
      tab.addEventListener("click", (e) => this.handleTabClick(e))
    })

    // Hero CTA button functionality
    const heroCTABtn = document.getElementById("hero-download-btn")
    if (heroCTABtn) {
      heroCTABtn.addEventListener("click", () => this.handleHeroCTA())
    }

    // Download buttons
    const downloadButtons = document.querySelectorAll("[data-download]")
    downloadButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleDownload(e))
    })

    // Large file download
    const largeDownloadBtn = document.getElementById("large-download-btn")
    if (largeDownloadBtn) {
      largeDownloadBtn.addEventListener("click", () => this.handleLargeDownload())
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => this.handleSmoothScroll(e))
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyboardNavigation(e))
  }

  handleNavLinkClick(e) {
    e.preventDefault()
    const tabName = e.currentTarget.dataset.tab

    // Update active state in navbar
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.classList.remove("active")
    })
    e.currentTarget.classList.add("active")

    // Show corresponding tab content
    this.showTab(tabName)

    // Control hero section visibility - only show for downloads tab
    this.toggleHeroSection(tabName === "downloads")

    if (tabName !== "downloads") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  setupHeroVisibility() {
    // Initially show hero only for downloads tab
    this.toggleHeroSection(this.currentTab === "downloads")
  }

  toggleHeroSection(show) {
    const heroSection = document.getElementById("hero-section")
    if (heroSection) {
      if (show) {
        heroSection.classList.remove("hidden")
        heroSection.style.display = "block"
      } else {
        heroSection.classList.add("hidden")
        heroSection.style.display = "none"
      }
    }
  }

  handleHeroCTA() {
    // Scroll to downloads section
    const downloadsSection = document.getElementById("downloads")
    if (downloadsSection) {
      downloadsSection.scrollIntoView({ behavior: "smooth" })
    }

    // Ensure downloads tab is active
    this.showTab("downloads")

    // Update navbar active state
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.classList.remove("active")
      if (link.dataset.tab === "downloads") {
        link.classList.add("active")
      }
    })
  }

  handleTabClick(e) {
    e.preventDefault()
    const tabName = e.currentTarget.dataset.tab
    this.showTab(tabName)
  }

  showTab(tabName) {
    // Hide all tabs
    const tabs = document.querySelectorAll(".tab-content")
    tabs.forEach((tab) => {
      tab.classList.remove("active")
      tab.setAttribute("aria-hidden", "true")
    })

    // Remove active from nav buttons
    const navTabs = document.querySelectorAll(".nav-tab")
    navTabs.forEach((nav) => {
      nav.classList.remove("active")
      nav.setAttribute("aria-selected", "false")
    })

    // Show selected tab
    const targetTab = document.getElementById(tabName)
    const targetNav = document.querySelector(`[data-tab="${tabName}"]`)

    if (targetTab && targetNav) {
      targetTab.classList.add("active")
      targetTab.setAttribute("aria-hidden", "false")
      targetNav.classList.add("active")
      targetNav.setAttribute("aria-selected", "true")

      this.currentTab = tabName

      // Control hero section visibility
      this.toggleHeroSection(tabName === "downloads")

      // Update URL without page reload
      if (history.pushState) {
        history.pushState(null, null, `#${tabName}`)
      }
    }
  }

  handleDownload(e) {
    const downloadType = e.currentTarget.dataset.download
    this.trackDownload(downloadType)

    // Add enhanced visual feedback
    const button = e.currentTarget
    const originalText = button.textContent

    button.classList.add("loading")
    button.textContent = "Descargando..."
    button.disabled = true

    setTimeout(() => {
      button.classList.remove("loading")
      button.textContent = "✓ Descargado"
      button.style.backgroundColor = "var(--primary-green-light)"

      setTimeout(() => {
        button.textContent = originalText
        button.style.backgroundColor = ""
        button.disabled = false
      }, 2000)
    }, 1200)
  }

  handleLargeDownload() {
    const downloadUrl = "https://github.com/Bosnape/ShapeGrammar/raw/main/shape_grammar_gui.zip"
    const btn = document.getElementById("large-download-btn")
    const originalText = btn.textContent

    // Show enhanced loading state
    btn.classList.add("loading")
    btn.textContent = "Preparando descarga..."
    btn.disabled = true

    // Show progress notification
    this.showDownloadNotification("Iniciando descarga...")

    // Create download link
    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = "shape_grammar_gui.zip"
    link.target = "_blank"
    link.style.display = "none"
    document.body.appendChild(link)

    // Trigger download
    setTimeout(() => {
      link.click()
      document.body.removeChild(link)

      // Update button state
      btn.textContent = "✓ Descarga iniciada"
      btn.style.backgroundColor = "var(--primary-green-light)"

      setTimeout(() => {
        btn.classList.remove("loading")
        btn.textContent = originalText
        btn.style.backgroundColor = ""
        btn.disabled = false
        this.trackDownload("shape_grammar_gui_large")
      }, 3000)
    }, 1000)
  }

  showDownloadNotification(message, type = "info") {
    const notification = document.createElement("div")
    notification.textContent = message

    const bgColor = type === "success" ? "#10b981" : type === "error" ? "#ef4444" : "#3b82f6"

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${bgColor};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
      z-index: 1000;
      max-width: 350px;
      font-size: 0.875rem;
      font-weight: 500;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `

    document.body.appendChild(notification)

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 4000)
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // Observe cards and hero content for animation
    const animatedElements = document.querySelectorAll(".download-card, .feature-card, .stat-card, .hero-content")
    animatedElements.forEach((element, index) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = `opacity 0.4s ease ${index * 0.05}s, transform 0.4s ease ${index * 0.05}s`
      observer.observe(element)
    })
  }

  trackDownload(filename) {
    // Update local stats
    if (this.downloadStats.hasOwnProperty(filename)) {
      this.downloadStats[filename]++
    }

    // Analytics tracking (can be integrated with Google Analytics, etc.)
    const gtag = window.gtag // Declare the variable before using it
    if (typeof gtag !== "undefined") {
      gtag("event", "download", {
        event_category: "file_download",
        event_label: filename,
        value: 1,
      })
    }

    // Console log for debugging
    console.log(`[v0] Download tracked: ${filename}`)
  }

  async checkFileAvailability() {
    const GITHUB_RAW_BASE = 'https://github.com/Bosnape/ShapeGrammar/raw/main/'
    const files = [
      { name: "blender_addon.zip", selector: 'a[href*="blender_addon.zip"]' },
      { name: "examples.zip", selector: 'a[href*="examples.zip"]' },
      { name: "shape_grammar_gui.zip", selector: "#large-download-btn" },
    ]

    for (const file of files) {
      try {
        const response = await fetch(`${GITHUB_RAW_BASE}${file.name}`, { method: "HEAD" })
        const button = document.querySelector(file.selector)

        if (!response.ok && button) {
          button.style.opacity = "0.6"
          button.title = "Archivo no disponible actualmente"

          if (button.tagName === "A") {
            button.addEventListener("click", (e) => {
              e.preventDefault()
              this.showFileNotAvailable(file.name)
            })
          }
        }
      } catch (error) {
        console.warn(`Could not verify availability of ${file.name}`)
      }
    }
  }

  showFileNotAvailable(filename) {
    const message = `El archivo ${filename} no está disponible actualmente.`
    this.showDownloadNotification(message, "error")
  }

  loadDownloadStats() {
    // Load stats from localStorage or API
    const savedStats = localStorage.getItem("shapeGrammarDownloadStats")
    if (savedStats) {
      this.downloadStats = { ...this.downloadStats, ...JSON.parse(savedStats) }
    }
  }

  saveDownloadStats() {
    localStorage.setItem("shapeGrammarDownloadStats", JSON.stringify(this.downloadStats))
  }

  // Public method to update stats display
  updateStatsDisplay() {
    const totalDownloads = Object.values(this.downloadStats).reduce((sum, count) => sum + count, 0)

    // Update any stats displays on the page
    const statsElements = document.querySelectorAll("[data-stat]")
    statsElements.forEach((element) => {
      const statType = element.dataset.stat
      if (statType === "downloads" && totalDownloads > 0) {
        element.textContent = totalDownloads.toLocaleString()
      }
    })
  }

  // Nueva función para descargas directas
  downloadFileDirect(filename, displayName) {
    const GITHUB_RAW_BASE = 'https://github.com/Bosnape/ShapeGrammar/raw/main/'
    const url = GITHUB_RAW_BASE + filename
    
    // Crear elemento de descarga temporal
    const link = document.createElement('a')
    link.href = url
    link.download = displayName || filename
    link.target = '_blank'
    
    // Forzar descarga
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    // Track download
    this.trackDownload(filename.replace('.zip', ''))
  }
}

// Utility functions
const utils = {
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  throttle(func, limit) {
    let inThrottle
    return function () {
      const args = arguments

      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  },

  formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  },
}

// Initialize the website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const website = new ShapeGrammarWebsite()

  // Handle initial hash in URL
  const hash = window.location.hash.substring(1)
  if (hash && document.getElementById(hash)) {
    website.showTab(hash)
  }

  // Handle browser back/forward buttons
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.substring(1)
    if (hash && document.getElementById(hash)) {
      website.showTab(hash)
    } else {
      website.showTab("downloads")
    }
  })

  // Save stats before page unload
  window.addEventListener("beforeunload", () => {
    website.saveDownloadStats()
  })
})

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ShapeGrammarWebsite, utils }
}
