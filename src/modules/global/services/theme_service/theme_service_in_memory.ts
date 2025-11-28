import type { ThemeService } from "@/modules/global/services/theme_service/theme_service"

export class ThemeServiceInMemory implements ThemeService {
  public theme: string = "light"

  set_theme(theme: string): void {
    this.theme = theme
  }
}
