import axios from "axios"
import { LOCAL_STORAGE_KEYS } from "@/modules/global/services/localstorage_service/localstorage_service"
import { LocalStorageServiceWindow } from "@/modules/global/services/localstorage_service/localstorage_service_window"

export class ApiService {
  private endpoint: string =
    import.meta.env.MODE === "production"
      ? "https://api.tinycardo.com"
      : "http://localhost:3001"

  async post<T>(url: string, data: unknown): Promise<T> {
    const localStorage = new LocalStorageServiceWindow()
    const jwt = await localStorage.get(LOCAL_STORAGE_KEYS.jwt)

    const headers = { Authorization: "Bearer " + jwt }

    const response = await axios.post<T>(`${this.endpoint}${url}`, data, {
      headers,
      validateStatus: () => true,
    })

    if (response.status > 299) throw new Error(response.statusText)

    return response.data
  }
}
