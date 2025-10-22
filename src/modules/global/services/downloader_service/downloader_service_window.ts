import type { DownloaderService } from "@/modules/global/services/downloader_service/downloader_service"

export class DownloaderServiceWindow implements DownloaderService {
  async download_file(params: {
    filename: string
    content: string
    type: string
  }): Promise<void> {
    const blob = new Blob([params.content], { type: params.type })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = params.filename
    a.click()
    URL.revokeObjectURL(url)
  }
}
