import type { HttpService } from "@/modules/global/services/http_service/http_service"

export class HttpServiceInMemory implements HttpService {
  public responses: Record<string, { status: number; data: unknown }> = {}

  async get<T>(
    params: Parameters<HttpService["get"]>[0],
  ): Promise<{ status: number; data: T }> {
    if (!this.responses[params.url]) {
      return { status: 404, data: {} as T }
    }

    return {
      status: this.responses[params.url].status,
      data: this.responses[params.url].data as T,
    }
  }
}
