import type { MessageI18nKeys } from "@/intl"

export interface ToastService {
  toast(params: {
    title: MessageI18nKeys
    description?: MessageI18nKeys
    type?: "success" | "error" | "warning" | "info" | "loading"
  }): Promise<void>
}
