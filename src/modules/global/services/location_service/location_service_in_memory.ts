import type { LocationService } from "@/modules/global/services/location_service/location_service"

export class LocationServiceInMemory implements LocationService {
  private current_url: string

  constructor() {
    this.current_url = "https://local.dev"
  }

  get_current_url(): string {
    return this.current_url
  }

  open_new_tab(url: string): void {
    this.current_url = url
  }

  navigate(url: string): void {
    this.current_url = url
  }

  refresh(): void {}

  get_domain(): string {
    return "https://local.dev"
  }
}
