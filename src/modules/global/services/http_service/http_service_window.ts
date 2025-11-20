import type { HttpService } from "@/modules/global/services/http_service/http_service"

export class HttpServiceWindow implements HttpService {
  async get<T>(
    params: Parameters<HttpService["get"]>[0],
  ): Promise<{ status: number; data: T }> {
    try {
      const response = await fetch(params.url, {
        method: "GET",
        ...(params.headers || {}),
      })

      if (!response.ok) {
        return { status: response.status, data: {} as T }
      }

      return {
        status: response.status,
        data: response.json() as T,
      }
    } catch (error) {
      return { status: 404, data: {} as T }
    }
  }
}
