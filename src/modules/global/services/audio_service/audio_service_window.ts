import type { AudioService } from "@/modules/global/services/audio_service/audio_service"

export class AudioServiceWindow implements AudioService {
  async play(params: { url: string }): ReturnType<AudioService["play"]> {
    try {
      const audio = new Audio(params.url)
      await audio.play()

      return {
        success: true,
      }
    } catch (error) {
      const error_message =
        error instanceof Error ? error.message : "Unknown error"

      return {
        success: false,
        error: error_message,
      }
    }
  }
}
