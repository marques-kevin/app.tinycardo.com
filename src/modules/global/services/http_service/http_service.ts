export interface HttpService {
  get<T>(params: {
    url: string
    headers?: Record<string, string>
  }): Promise<{ status: number; data: T }>
}
