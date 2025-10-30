import type { PlausibleService } from "@/modules/global/services/plausible_service/plausible_service"

export class PlausibleServiceWindow implements PlausibleService {
  private initialized = false

  init(): void {
    if (this.initialized) return

    const domain = "app.tinycardo.com"
    const src =
      "https://plausible.tinycardo.com/js/script.outbound-links.pageview-props.tagged-events.js"

    try {
      // Preconnect to analytics host
      const preconnect = document.createElement("link")
      preconnect.setAttribute("rel", "preconnect")
      try {
        const origin = new URL(src).origin
        preconnect.setAttribute("href", origin)
      } catch {
        preconnect.setAttribute("href", src)
      }

      // Plausible script tag
      const script = document.createElement("script")
      script.setAttribute("async", "true")
      script.setAttribute("defer", "true")
      script.setAttribute("data-domain", domain)
      script.src = src

      const head = document.head || document.getElementsByTagName("head")[0]
      head.appendChild(preconnect)
      head.appendChild(script)

      this.initialized = true
    } catch {
      // Fail silently; analytics should never break the app
      this.initialized = true
    }
  }
}
