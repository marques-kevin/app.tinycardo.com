import type { PlausibleService } from "@/modules/global/services/plausible_service/plausible_service"

export class PlausibleServiceInMemory implements PlausibleService {
  private initialized = false

  init(): void {
    if (this.initialized) return
    this.initialized = true
    // No-op in tests or non-window environments
  }
}
