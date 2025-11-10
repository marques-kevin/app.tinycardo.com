import type { ToastService } from "@/modules/global/services/toast_service/toast_service"

export class ToastServiceInMemory implements ToastService {
  public history: {
    title: string
    description?: string
    type?: "success" | "error" | "warning" | "info" | "loading"
  }[] = []

  async toast(params: {
    title: string
    description?: string
    type?: "success" | "error" | "warning" | "info" | "loading"
  }): Promise<void> {
    this.history.push(params)
  }
}
