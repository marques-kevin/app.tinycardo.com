export interface LocationService {
  get_current_url(): string
  navigate(url: string): void
  refresh(): void
  get_domain(): string
}
