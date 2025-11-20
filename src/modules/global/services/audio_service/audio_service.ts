export interface AudioService {
  play(params: { url: string }): Promise<{
    success: boolean
    error?: string
  }>
}
