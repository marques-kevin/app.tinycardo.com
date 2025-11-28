export interface AnalyticsService {
  track(event: string, properties?: Record<string, string>): void
  identify(user_id: string): void
  init(): void
}
