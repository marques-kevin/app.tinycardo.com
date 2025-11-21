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

  async preload(params: { url: string }): Promise<void> {
    const audio = new Audio(params.url)
    audio.preload = "auto"
  }

  get_tts_voice(lang: string) {
    if (lang === "ko") {
      return "ko-KR"
    }
    if (lang === "fr") {
      return "fr-FR"
    }
    if (lang === "en") {
      return "en-US"
    }
    if (lang === "es") {
      return "es-ES"
    }
    if (lang === "de") {
      return "de-DE"
    }
    if (lang === "it") {
      return "it-IT"
    }
    if (lang === "pt") {
      return "pt-PT"
    }
    if (lang === "ru") {
      return "ru-RU"
    }
    if (lang === "ja") {
      return "ja-JP"
    }
    if (lang === "zh") {
      return "zh-CN"
    }
    if (lang === "ar") {
      return "ar-SA"
    }
    if (lang === "hi") {
      return "hi-IN"
    }
    if (lang === "bn") {
      return "bn-IN"
    }
    if (lang === "pa") {
      return "pa-IN"
    }
    if (lang === "mr") {
      return "mr-IN"
    }
    if (lang === "ta") {
      return "ta-IN"
    }
    if (lang === "te") {
      return "te-IN"
    }

    return lang
  }

  text_to_speech(params: { text: string; language: string }): void {
    const utterance = new SpeechSynthesisUtterance(params.text)
    const tts_voice = this.get_tts_voice(params.language)

    utterance.lang = tts_voice
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1
    utterance.voice =
      speechSynthesis
        .getVoices()
        .find((voice) => voice.lang.includes(tts_voice)) || null

    speechSynthesis.speak(utterance)
  }
}
