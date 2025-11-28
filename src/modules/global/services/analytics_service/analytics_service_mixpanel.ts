import type { AnalyticsService } from "./analytics_service"
import mixpanel from "mixpanel-browser"

export class AnalyticsServiceMixpanel implements AnalyticsService {
  private initialized = false

  init(): void {
    if (this.initialized) return
    if (!import.meta.env.VITE_MIXPANEL_TOKEN) return

    mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
      autocapture: false,
      record_sessions_percent: 0,
      api_host: "https://api.mixpanel.com",
    })

    this.initialized = true
  }

  identify(user_id: string): void {
    mixpanel.identify(user_id)
  }

  track(event: string, properties?: Record<string, string>): void {
    mixpanel.track(event, properties)
  }
}
