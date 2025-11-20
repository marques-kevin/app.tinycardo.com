import type { AudioService } from "@/modules/global/services/audio_service/audio_service"

export class AudioServiceInMemory implements AudioService {
  public history: string[] = []

  async play(params: { url: string }): ReturnType<AudioService["play"]> {
    this.history.push(params.url)

    return {
      success: true,
    }
  }
}
