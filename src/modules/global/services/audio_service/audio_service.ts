export interface AudioService {
  play(params: { url: string }): Promise<{
    success: boolean
    error?: string
  }>
  text_to_speech(params: { text: string; language: string }): void
  preload(params: { url: string }): Promise<void>
}
