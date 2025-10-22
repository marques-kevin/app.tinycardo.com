import type { LocalStorageService } from "@/modules/global/services/localstorage_service/localstorage_service"

export class LocalStorageServiceWindow implements LocalStorageService {
  get(key: string): Promise<string | null> {
    return Promise.resolve(window.localStorage.getItem(key) || null)
  }

  set(key: string, value: string): Promise<void> {
    window.localStorage.setItem(key, value)
    return Promise.resolve()
  }

  delete(key: string): Promise<void> {
    window.localStorage.removeItem(key)
    return Promise.resolve()
  }
}
