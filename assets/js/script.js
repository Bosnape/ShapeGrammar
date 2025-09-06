/**
 * Shape Grammar Tools Website
 * Simplified JavaScript for multi-page navigation
 */

class ShapeGrammarWebsite {
  constructor() {
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
    this.setActiveNavLink()
    this.setupCopyButtons()
  }

  setupEventListeners() {
    // Hero CTA button functionality
    const heroCTABtn = document.getElementById("hero-download-btn")
    if (heroCTABtn) {
      heroCTABtn.addEventListener("click", () => this.handleHeroCTA())
    }

    // Download buttons
    const downloadButtons = document.querySelectorAll(".download-btn")
    downloadButtons.forEach((button) => {
      button.addEventListener("click", (e) => this.handleDownload(e))
    })

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => this.handleSmoothScroll(e))
    })
  }

  setActiveNavLink() {
    // Set active nav link based on current page
    const currentPage = window.location.pathname.split("/").pop() || "index.html"
    const navLinks = document.querySelectorAll(".nav-link")

    navLinks.forEach((link) => {
      link.classList.remove("active")
      const linkHref = link.getAttribute("href")
      if (
        linkHref === currentPage ||
        (currentPage === "" && linkHref === "index.html") ||
        (currentPage === "index.html" && linkHref === "index.html")
      ) {
        link.classList.add("active")
      }
    })
  }

  handleSmoothScroll(e) {
    e.preventDefault()
    const target = e.currentTarget.getAttribute("href")
    const targetElement = document.querySelector(target)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  handleHeroCTA() {
    // Scroll to downloads section if on index page
    const downloadsSection = document.getElementById("downloads")
    if (downloadsSection) {
      downloadsSection.scrollIntoView({ behavior: "smooth" })
    } else {
      // Navigate to index page if not there
      window.location.href = "index.html#downloads"
    }
  }

  handleDownload(e) {
    const button = e.currentTarget
    const downloadUrl = button.getAttribute("href")
    const filename = downloadUrl.split("/").pop()

    this.trackDownload(filename.replace(".zip", ""))

    // No visual feedback animation - just track the download
    // Don't prevent default - let the download happen naturally
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
    const animatedElements = document.querySelectorAll(`
      .download-card, .feature-card, .stat-card, .hero-content,
      .intro-card, .reference-card, .parametric-card, .transformation-card,
      .rule-card, .step-card, .case-study, .tip-card, .concept-card,
      .selection-card, .config-card, .workflow-step, .capability-card
    `)

    animatedElements.forEach((element, index) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = `opacity 0.3s ease ${index * 0.01}s, transform 0.3s ease ${index * 0.01}s`
      observer.observe(element)
    })
  }

  trackDownload(filename) {
    // Update local stats
    if (this.downloadStats.hasOwnProperty(filename)) {
      this.downloadStats[filename]++
    }

    // Analytics tracking (can be integrated with Google Analytics, etc.)
    const gtag = window.gtag
    if (typeof gtag !== "undefined") {
      gtag("event", "download", {
        event_category: "file_download",
        event_label: filename,
        value: 1,
      })
    }

    // Console log for debugging
    console.log(`[ShapeGrammar] Download tracked: ${filename}`)
  }

  async checkFileAvailability() {
    const GITHUB_RAW_BASE = "https://github.com/Bosnape/ShapeGrammar/raw/main/"
    const files = [
      { name: "blender_addon.zip", selector: 'a[href*="blender_addon.zip"]' },
      { name: "examples.zip", selector: 'a[href*="examples.zip"]' },
      { name: "shape_grammar_gui.zip", selector: 'a[href*="shape_grammar_gui.zip"]' },
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
    // Load stats from localStorage
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

  setupCopyButtons() {
    // Add copy buttons to all code blocks
    const codeBlocks = document.querySelectorAll('.code-block, .mini-code')
    
    codeBlocks.forEach(block => {
      // Skip if already has a copy button
      if (block.querySelector('.copy-btn')) return
      
      const copyBtn = document.createElement('button')
      copyBtn.className = 'copy-btn'
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `
      copyBtn.title = 'Copiar código'
      
      copyBtn.addEventListener('click', () => this.copyCodeToClipboard(block, copyBtn))
      
      block.appendChild(copyBtn)
    })
  }

  async copyCodeToClipboard(codeBlock, button) {
    try {
      // Get the text content of the code block
      let textToCopy = codeBlock.textContent || codeBlock.innerText
      
      // Remove the copy button text if it got included
      textToCopy = textToCopy.replace(/Copiar código/g, '').trim()
      
      // Use the modern clipboard API if available
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy)
      } else {
        // Fallback for older browsers
        this.copyToClipboardFallback(textToCopy)
      }
      
      // Visual feedback
      const originalHTML = button.innerHTML
      button.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      `
      button.style.backgroundColor = 'var(--primary-green)'
      button.style.color = 'white'
      
      setTimeout(() => {
        button.innerHTML = originalHTML
        button.style.backgroundColor = ''
        button.style.color = ''
      }, 1500)
      
    } catch (err) {
      console.error('Error copying to clipboard:', err)
      
      // Error feedback
      button.style.backgroundColor = 'var(--red-500)'
      button.style.color = 'white'
      
      setTimeout(() => {
        button.style.backgroundColor = ''
        button.style.color = ''
      }, 1500)
    }
  }

  copyToClipboardFallback(text) {
    // Create a temporary textarea element
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    
    try {
      document.execCommand('copy')
    } catch (err) {
      console.error('Fallback copy failed:', err)
    }
    
    document.body.removeChild(textArea)
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

  // Handle hash links on page load
  const hash = window.location.hash.substring(1)
  if (hash) {
    setTimeout(() => {
      const targetElement = document.getElementById(hash)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  // Save stats before page unload
  window.addEventListener("beforeunload", () => {
    website.saveDownloadStats()
  })
})

// Export for potential external use
if (typeof module !== "undefined" && module.exports) {
  module.exports = { ShapeGrammarWebsite, utils }
}
