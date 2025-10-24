import type { LocationService } from "@/modules/global/services/location_service/location_service"

export class LocationServiceInMemory implements LocationService {
  private current_url: string

  constructor() {
    this.current_url = this.get_domain()
  }

  get_current_url(): string {
    return this.current_url
  }

  get_current_hash(): string {
    return new URL(this.current_url).hash
  }

  open_new_tab(url: string): void {
    this.current_url = url
  }

  navigate(url: string): void {
    if (url.startsWith("/")) {
      this.current_url = this.get_domain() + url
    } else {
      this.current_url = url
    }
  }

  refresh(): void {}

  get_domain(): string {
    return "https://local.dev"
  }
}
