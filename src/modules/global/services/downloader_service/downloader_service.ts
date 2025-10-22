export interface DownloaderService {
  download_file(params: {
    filename: string
    content: string
    type: string
  }): Promise<void>
}
