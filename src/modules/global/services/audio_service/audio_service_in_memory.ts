import type { AudioService } from "@/modules/global/services/audio_service/audio_service"

export class AudioServiceInMemory implements AudioService {
  public _play_history: string[] = []
  public _text_to_speech_history: string[] = []
  public _preload_history: string[] = []

  async play(params: { url: string }): ReturnType<AudioService["play"]> {
    this._play_history.push(params.url)

    return {
      success: true,
    }
  }

  async preload(params: { url: string }): Promise<void> {
    this._preload_history.push(params.url)
  }

  text_to_speech(params: { text: string; language: string }): void {
    this._text_to_speech_history.push(params.text)
  }
}
