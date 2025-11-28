import type { AnalyticsService } from "./analytics_service"

export class AnalyticsServiceInMemory implements AnalyticsService {
  public events: { event: string; properties?: Record<string, string> }[] = []
  public user_id: string | null = null

  init(): void {}

  track(event: string, properties?: Record<string, string>): void {
    this.events.push({ event, properties })
  }

  identify(user_id: string): void {
    this.user_id = user_id
  }
}
