export interface LocationService {
  get_current_url(): string
  get_current_pathname(): string
  get_current_hash(): string
  navigate(url: string): void
  refresh(): void
  get_domain(): string
}
