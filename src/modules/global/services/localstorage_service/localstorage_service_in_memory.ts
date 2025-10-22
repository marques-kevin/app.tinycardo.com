import type { LocalStorageService } from "@/modules/global/services/localstorage_service/localstorage_service"

export class LocalStorageServiceInMemory implements LocalStorageService {
  private storage: Record<string, string> = {}

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.storage[key] || null)
  }

  set(key: string, value: string): Promise<void> {
    this.storage[key] = value
    return Promise.resolve()
  }

  delete(key: string): Promise<void> {
    delete this.storage[key]
    return Promise.resolve()
  }
}
