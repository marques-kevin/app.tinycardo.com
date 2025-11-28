import type { ThemeService } from "@/modules/global/services/theme_service/theme_service"

export class ThemeServiceWindow implements ThemeService {
  set_theme(theme: string): void {
    document.documentElement.setAttribute("data-theme", theme)

    const meta = document.querySelector(
      'meta[name="theme-color"]',
    ) as HTMLMetaElement

    const color = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim()

    meta.setAttribute("content", color)
  }
}
