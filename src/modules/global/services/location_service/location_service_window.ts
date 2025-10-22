import type { LocationService } from "@/modules/global/services/location_service/location_service"

export class LocationServiceWindow implements LocationService {
  get_current_url(): string {
    return window.location.href
  }

  navigate(url: string): void {
    if (url.startsWith("/")) {
      window.history.pushState({}, "", url)
      window.dispatchEvent(new PopStateEvent("popstate"))
    } else {
      window.open(url, "_self")
    }
  }

  open_new_tab(url: string): void {
    window.open(url, "_blank")
  }

  refresh(): void {
    window.location.reload()
  }

  get_domain(): string {
    return window.location.origin
  }
}
